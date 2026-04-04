"use server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { ExtendedUser, UserRole } from "@/types/user";
import { revalidatePath } from "next/cache";
const AVATAR_COLORS = [
    'bg-blue-500/15 text-blue-500 border-blue-500/20',
    'bg-emerald-500/15 text-emerald-500 border-emerald-500/20',
    'bg-rose-500/15 text-rose-500 border-rose-500/20',
    'bg-amber-500/15 text-amber-600 border-amber-500/20',
    'bg-violet-500/15 text-violet-500 border-violet-500/20',
    'bg-indigo-500/15 text-indigo-500 border-indigo-500/20',
    'bg-cyan-500/15 text-cyan-600 border-cyan-500/20',
    'bg-pink-500/15 text-pink-500 border-pink-500/20',
    'bg-orange-500/15 text-orange-600 border-orange-500/20',
    'bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/20',
];
const generateAvatarColor = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};
const getSupabaseAdmin = () => {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined");
    }
    return createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
};
export async function createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    avatar_color?: string;
}) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can create users' };
        }
        const supabaseAdmin = getSupabaseAdmin();
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: {
                name: userData.name,
                role: userData.role
            }
        });
        if (createError) {
            return { success: false, error: createError.message };
        }
        if (newUser.user) {
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({
                    name: userData.name,
                    role: userData.role,
                    email: userData.email,
                    avatar_color: userData.avatar_color || generateAvatarColor(newUser.user.id),
                    status: 'active'
                })
                .eq('id', newUser.user.id);
            if (updateError) {
                console.error('Error updating public user profile:', updateError);
            }
        }
        revalidatePath('/dashboard/users');
        return { success: true, error: null, user: newUser.user };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function getUsers(filters?: {
    search?: string;
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
}) {
    try {
        const supabase = await createClient();
        let query = supabase
            .from('users')
            .select('*', { count: 'exact' });
        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters?.role && filters.role !== 'all') {
            query = query.eq('role', filters.role);
        }
        if (filters?.status && filters.status !== 'all') {
            query = query.eq('status', filters.status);
        }
        const page = filters?.page || 1;
        const pageSize = filters?.pageSize || 10;
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to).order('created_at', { ascending: false });
        const { data, error, count } = await query;
        if (error) {
            console.error('Error fetching users:', error);
            return { users: [], total: 0, error: error.message };
        }
        return {
            users: data as ExtendedUser[],
            total: count || 0,
            error: null
        };
    } catch (error: unknown) {
        console.error('Error in getUsers:', error);
        return { users: [], total: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function getUserById(userId: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            return { user: null, error: error.message };
        }
        return { user: data as ExtendedUser, error: null };
    } catch (error: unknown) {
        return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function updateUser(userId: string, updates: Partial<ExtendedUser>) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { user: null, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { user: null, error: 'Only admins can update users' };
        }
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('users')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();
        if (error) {
            return { user: null, error: error.message };
        }
        revalidatePath('/dashboard/users');
        return { user: data as ExtendedUser, error: null };
    } catch (error: unknown) {
        return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function changeUserPassword(userId: string, newPassword: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can change passwords' };
        }
        const supabaseAdmin = getSupabaseAdmin();
        const { error } = await supabaseAdmin.auth.admin.updateUserById(
            userId,
            { password: newPassword }
        );
        if (error) {
            return { success: false, error: error.message };
        }
        return { success: true, error: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function updateProfile(updates: Partial<ExtendedUser>) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { user: null, error: 'Unauthorized' };
        }
        const allowedUpdates = {
            name: updates.name,
            avatar_url: updates.avatar_url,
            avatar_color: updates.avatar_color,
            bio: updates.bio,
            phone: updates.phone,
            location: updates.location,
            website: updates.website,
            social_links: updates.social_links,
            updated_at: new Date().toISOString()
        };
        const { data, error } = await supabase
            .from('users')
            .update(allowedUpdates)
            .eq('id', user.id)
            .select()
            .single();
        if (error) {
            return { user: null, error: error.message };
        }
        revalidatePath('/dashboard/profile');
        return { user: data as ExtendedUser, error: null };
    } catch (error: unknown) {
        return { user: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function updateUserRole(userId: string, newRole: UserRole) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can change user roles' };
        }
        const { error } = await supabase
            .from('users')
            .update({ role: newRole, updated_at: new Date().toISOString() })
            .eq('id', userId);
        if (error) {
            return { success: false, error: error.message };
        }
        revalidatePath('/dashboard/users');
        return { success: true, error: null };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function deleteUser(userId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role, is_deleted, is_banned')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can delete users' };
        }
        if (currentUser?.is_deleted || currentUser?.is_banned) {
            return { success: false, error: 'Your account is not active' };
        }
        if (userId === user.id) {
            return { success: false, error: 'You cannot delete your own account' };
        }
        const { data, error } = await supabase.rpc('admin_soft_delete_user', {
            p_user_id: userId
        });
        if (error) {
            console.error('Soft delete RPC error:', error);
            return { success: false, error: `Delete failed: ${error.message}` };
        }
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
            course_count?: number;
        };
        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to delete user',
                courseCount: result.course_count
            };
        }
        revalidatePath('/dashboard/users');
        return { success: true, error: null, message: result.message };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function bulkDeleteUsers(userIds: string[]) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role, is_deleted, is_banned')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can delete users' };
        }
        if (currentUser?.is_deleted || currentUser?.is_banned) {
            return { success: false, error: 'Your account is not active' };
        }
        const filteredIds = userIds.filter(id => id !== user.id);
        if (filteredIds.length === 0) {
            return { success: false, error: 'No valid users to delete' };
        }
        const results = await Promise.all(filteredIds.map(async (id) => {
            const { data, error } = await supabase.rpc('admin_soft_delete_user', {
                p_user_id: id
            });
            const result = data as { success: boolean; error?: string; course_count?: number } | null;
            return {
                id,
                error: error || (result && !result.success ? new Error(result.error || 'Failed') : null),
                courseCount: result?.course_count
            };
        }));
        const failed = results.filter(r => r.error);
        const succeeded = results.filter(r => !r.error);
        revalidatePath('/dashboard/users');
        if (failed.length > 0 && succeeded.length === 0) {
            const firstError = failed[0].error;
            return {
                success: false,
                error: firstError instanceof Error ? firstError.message : 'Failed to delete users'
            };
        }
        return {
            success: true,
            error: failed.length > 0 ? `${failed.length} user(s) could not be deleted (may own courses)` : null,
            deletedCount: succeeded.length,
            failedCount: failed.length
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function bulkUpdateRoles(userIds: string[], newRole: UserRole) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can change user roles' };
        }
        const { error } = await supabase
            .from('users')
            .update({ role: newRole, updated_at: new Date().toISOString() })
            .in('id', userIds);
        if (error) {
            return { success: false, error: error.message };
        }
        revalidatePath('/dashboard/users');
        return {
            success: true,
            error: null,
            updatedCount: userIds.length
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function getUserStats() {
    try {
        const supabase = await createClient();
        const { data: users, error } = await supabase
            .from('users')
            .select('role, created_at, status');
        if (error || !users) {
            return { stats: null, error: error?.message || 'Failed to fetch stats' };
        }
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const newThisMonth = users.filter(u => new Date(u.created_at) >= startOfMonth).length;
        const newLastMonth = users.filter(u => {
            const created = new Date(u.created_at);
            return created >= startOfLastMonth && created <= endOfLastMonth;
        }).length;
        const growthPercentage = newLastMonth > 0
            ? ((newThisMonth - newLastMonth) / newLastMonth) * 100
            : 100;
        const stats = {
            total: users.length,
            active: users.filter(u => u.status === 'active').length,
            inactive: users.filter(u => u.status === 'inactive').length,
            suspended: users.filter(u => u.status === 'suspended').length,
            students: users.filter(u => !u.role || u.role === 'student').length,
            teachers: users.filter(u => u.role === 'teacher').length,
            moderators: users.filter(u => u.role === 'moderator').length,
            admins: users.filter(u => u.role === 'admin').length,
            newThisMonth,
            growthPercentage: Math.round(growthPercentage)
        };
        return { stats, error: null };
    } catch (error: unknown) {
        return { stats: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function exportUsersToCSV(filters?: {
    search?: string;
    role?: string;
}) {
    try {
        const supabase = await createClient();
        let query = supabase
            .from('users')
            .select('*');
        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters?.role && filters.role !== 'all') {
            query = query.eq('role', filters.role);
        }
        const { data, error } = await query;
        if (error || !data) {
            return { csv: null, error: error?.message || 'Failed to export' };
        }
        const headers = ['Name', 'Email', 'Role', 'Created At'];
        const rows = data.map(user => [
            user.name || '',
            user.email || '',
            user.role || 'student',
            new Date(user.created_at).toLocaleDateString()
        ]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        return { csv: csvContent, error: null };
    } catch (error: unknown) {
        return { csv: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function exportUsersToJSON(filters?: {
    search?: string;
    role?: string;
}) {
    try {
        const supabase = await createClient();
        let query = supabase
            .from('users')
            .select('*');
        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }
        if (filters?.role && filters.role !== 'all') {
            query = query.eq('role', filters.role);
        }
        const { data, error } = await query;
        if (error || !data) {
            return { json: null, error: error?.message || 'Failed to export' };
        }
        return { json: JSON.stringify(data, null, 2), error: null };
    } catch (error: unknown) {
        return { json: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function restoreUser(userId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role, is_deleted, is_banned')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can restore users' };
        }
        if (currentUser?.is_deleted || currentUser?.is_banned) {
            return { success: false, error: 'Your account is not active' };
        }
        const { data, error } = await supabase.rpc('admin_restore_user', {
            p_user_id: userId
        });
        if (error) {
            console.error('Restore user RPC error:', error);
            return { success: false, error: `Restore failed: ${error.message}` };
        }
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
        };
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to restore user' };
        }
        revalidatePath('/dashboard/users');
        return { success: true, error: null, message: result.message };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function assignUserRole(
    userId: string,
    newRole: UserRole,
    reassignTo?: string
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role, is_deleted, is_banned')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can assign roles' };
        }
        if (currentUser?.is_deleted || currentUser?.is_banned) {
            return { success: false, error: 'Your account is not active' };
        }
        const { data, error } = await supabase.rpc('admin_assign_role', {
            p_user_id: userId,
            p_new_role: newRole,
            p_reassign_to: reassignTo || null
        });
        if (error) {
            console.error('Assign role RPC error:', error);
            return { success: false, error: `Role assignment failed: ${error.message}` };
        }
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
            course_count?: number;
            requires_reassignment?: boolean;
            old_role?: string;
            new_role?: string;
        };
        if (!result.success) {
            return {
                success: false,
                error: result.error || 'Failed to assign role',
                courseCount: result.course_count,
                requiresReassignment: result.requires_reassignment
            };
        }
        revalidatePath('/dashboard/users');
        return {
            success: true,
            error: null,
            message: result.message,
            oldRole: result.old_role,
            newRole: result.new_role
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function reassignInstructor(
    fromUserId: string,
    toUserId: string
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Unauthorized' };
        }
        const { data: currentUser } = await supabase
            .from('users')
            .select('role, is_deleted, is_banned')
            .eq('id', user.id)
            .single();
        if (currentUser?.role !== 'admin') {
            return { success: false, error: 'Only admins can reassign instructors' };
        }
        if (currentUser?.is_deleted || currentUser?.is_banned) {
            return { success: false, error: 'Your account is not active' };
        }
        if (fromUserId === toUserId) {
            return { success: false, error: 'Source and target instructor cannot be the same' };
        }
        const { data, error } = await supabase.rpc('admin_reassign_instructor', {
            p_from_user: fromUserId,
            p_to_user: toUserId
        });
        if (error) {
            console.error('Reassign instructor RPC error:', error);
            return { success: false, error: `Reassignment failed: ${error.message}` };
        }
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
            reassigned_count?: number;
        };
        if (!result.success) {
            return { success: false, error: result.error || 'Failed to reassign instructor' };
        }
        revalidatePath('/dashboard/users');
        revalidatePath('/dashboard/courses');
        return {
            success: true,
            error: null,
            message: result.message,
            reassignedCount: result.reassigned_count || 0
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
export async function getUserCourseCount(userId: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { count: 0, error: 'Unauthorized' };
        }
        const { data, error } = await supabase.rpc('get_user_course_count', {
            p_user_id: userId
        });
        if (error) {
            console.error('Get course count RPC error:', error);
            return { count: 0, error: error.message };
        }
        return { count: data as number, error: null };
    } catch (error: unknown) {
        return { count: 0, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
