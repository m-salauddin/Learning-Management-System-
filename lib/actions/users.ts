"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { ExtendedUser, UserRole } from "@/types/user";
import { revalidatePath } from "next/cache";

// Helper to get Supabase Admin Client
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

// Create a new user (Admin only)
export async function createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}) {
    try {
        const supabase = await createClient();

        // 1. Check if current user is admin
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

        // 2. Create user using Admin Client
        const supabaseAdmin = getSupabaseAdmin();

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                name: userData.name,
                role: userData.role
            }
        });

        if (createError) {
            return { success: false, error: createError.message };
        }

        // 3. Ensure role is set in public.users
        if (newUser.user) {
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({
                    name: userData.name,
                    role: userData.role,
                    email: userData.email
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

// Get all users with optional filters
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

        // Apply filters
        if (filters?.search) {
            query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }

        if (filters?.role && filters.role !== 'all') {
            query = query.eq('role', filters.role);
        }

        // Pagination
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

// Get user by ID
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

// Update user
export async function updateUser(userId: string, updates: Partial<ExtendedUser>) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
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

// Update user role
export async function updateUserRole(userId: string, newRole: UserRole) {
    try {
        const supabase = await createClient();

        // Check if current user is admin
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

// Delete user
export async function deleteUser(userId: string) {
    try {
        const supabase = await createClient();

        // Check if current user is admin
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
            return { success: false, error: 'Only admins can delete users' };
        }

        // Prevent self-deletion
        if (userId === user.id) {
            return { success: false, error: 'You cannot delete your own account' };
        }

        const { error } = await supabase
            .from('users')
            .delete()
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

// Bulk delete users
export async function bulkDeleteUsers(userIds: string[]) {
    try {
        const supabase = await createClient();

        // Check if current user is admin
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
            return { success: false, error: 'Only admins can delete users' };
        }

        // Filter out current user ID to prevent self-deletion
        const filteredIds = userIds.filter(id => id !== user.id);

        if (filteredIds.length === 0) {
            return { success: false, error: 'No valid users to delete' };
        }

        const { error } = await supabase
            .from('users')
            .delete()
            .in('id', filteredIds);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/dashboard/users');
        return {
            success: true,
            error: null,
            deletedCount: filteredIds.length
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Bulk update user roles
export async function bulkUpdateRoles(userIds: string[], newRole: UserRole) {
    try {
        const supabase = await createClient();

        // Check if current user is admin
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

// Get user statistics
export async function getUserStats() {
    try {
        const supabase = await createClient();

        const { data: users, error } = await supabase
            .from('users')
            .select('role, created_at');

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
            active: users.length, // You can add actual status field later
            inactive: 0,
            suspended: 0,
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

// Export users to CSV
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

        // Generate CSV
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
