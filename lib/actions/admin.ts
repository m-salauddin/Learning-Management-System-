"use server";

// ============================================================================
// ADMIN DASHBOARD SERVER ACTIONS
// ============================================================================
// Server-side actions for admin dashboard, analytics, user management
// ALL ACTIONS ARE ADMIN-ONLY (server-guarded)
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    AdminDashboardStats, AuditLogEntry, UserManagement,
    ApiResponse, PaginatedResponse
} from "@/types/lms";

// ============================================================================
// HELPER: Check Admin Access
// ============================================================================

async function checkAdminAccess(): Promise<{ isAdmin: boolean; userId: string | null }> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { isAdmin: false, userId: null };
    }
    
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    return {
        isAdmin: profile?.role === 'admin',
        userId: user.id
    };
}

// ============================================================================
// GET ADMIN DASHBOARD STATS
// ============================================================================

export async function getAdminDashboardStats(): Promise<ApiResponse<AdminDashboardStats>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    
    // Call RPC function
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: data as AdminDashboardStats };
}

// ============================================================================
// GET REVENUE METRICS
// ============================================================================

export async function getRevenueMetrics(params: {
    startDate?: string;
    endDate?: string;
    groupBy?: 'day' | 'week' | 'month';
} = {}): Promise<ApiResponse<{
    total: number;
    byPeriod: { period: string; amount: number }[];
    byCourse: { courseId: string; title: string; amount: number }[];
}>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    const { startDate, endDate } = params;
    
    // Get total revenue
    const { data: totalData } = await supabase.rpc('get_total_revenue');
    
    // Get transactions for breakdown
    let query = supabase
        .from('transactions')
        .select(`
            amount,
            paid_at,
            course_id,
            course:courses(title)
        `)
        .eq('status', 'completed')
        .not('paid_at', 'is', null);
    
    if (startDate) {
        query = query.gte('paid_at', startDate);
    }
    
    if (endDate) {
        query = query.lte('paid_at', endDate);
    }
    
    const { data: transactions, error } = await query;
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    // Group by course
    const courseRevenue = new Map<string, { title: string; amount: number }>();
    
    transactions?.forEach((tx: any) => {
        const existing = courseRevenue.get(tx.course_id) || { title: tx.course?.title, amount: 0 };
        courseRevenue.set(tx.course_id, {
            title: existing.title,
            amount: existing.amount + tx.amount
        });
    });
    
    const byCourse = Array.from(courseRevenue.entries())
        .map(([courseId, data]) => ({ courseId, ...data }))
        .sort((a, b) => b.amount - a.amount);
    
    return {
        success: true,
        data: {
            total: totalData || 0,
            byPeriod: [],
            byCourse
        }
    };
}

// ============================================================================
// GET DAILY ACTIVE USERS
// ============================================================================

export async function getDailyActiveUsers(days: number = 7): Promise<ApiResponse<number>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_daily_active_users', { p_days: days });
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: data || 0 };
}

// ============================================================================
// GET POPULAR COURSES
// ============================================================================

export async function getPopularCourses(limit: number = 5): Promise<ApiResponse<Array<{
    course_id: string;
    title: string;
    enrollment_count: number;
    avg_rating: number;
}>>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_popular_courses', { p_limit: limit });
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: data || [] };
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function getAllUsers(params: {
    page?: number;
    pageSize?: number;
    role?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
} = {}): Promise<PaginatedResponse<UserManagement>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    
    const supabase = await createClient();
    const { page = 1, pageSize = 10, role, search, sortBy = 'created_at', sortOrder = 'desc' } = params;
    const offset = (page - 1) * pageSize;
    
    let query = supabase
        .from('users')
        .select('*', { count: 'exact' });
    
    if (role) {
        query = query.eq('role', role);
    }
    
    if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    query = query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + pageSize - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    
    return {
        data: data as UserManagement[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}

export async function updateUserRole(
    userId: string,
    newRole: 'admin' | 'moderator' | 'teacher' | 'student'
): Promise<ApiResponse<void>> {
    const { isAdmin, userId: adminId } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    // Prevent self-demotion
    if (userId === adminId && newRole !== 'admin') {
        return { success: false, error: 'Cannot change your own admin role' };
    }
    
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    // Log action
    await supabase.from('audit_log').insert({
        admin_id: adminId,
        action: 'update_user_role',
        target_type: 'user',
        target_id: userId,
        details: { new_role: newRole }
    });
    
    revalidatePath('/dashboard');
    
    return { success: true };
}

export async function suspendUser(
    userId: string,
    reason: string
): Promise<ApiResponse<void>> {
    const { isAdmin, userId: adminId } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    // Prevent self-suspension
    if (userId === adminId) {
        return { success: false, error: 'Cannot suspend yourself' };
    }
    
    const supabase = await createClient();
    
    // Update user status (assuming we add a status field or use metadata)
    const { error } = await supabase
        .from('users')
        .update({ 
            updated_at: new Date().toISOString()
            // status: 'suspended' - add this field if needed
        })
        .eq('id', userId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    // Log action
    await supabase.from('audit_log').insert({
        admin_id: adminId,
        action: 'suspend_user',
        target_type: 'user',
        target_id: userId,
        details: { reason }
    });
    
    revalidatePath('/dashboard');
    
    return { success: true };
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export async function getAuditLog(params: {
    page?: number;
    pageSize?: number;
    action?: string;
    adminId?: string;
    targetType?: string;
    startDate?: string;
    endDate?: string;
} = {}): Promise<PaginatedResponse<AuditLogEntry>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { data: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
    }
    
    const supabase = await createClient();
    const { page = 1, pageSize = 20, action, adminId, targetType, startDate, endDate } = params;
    const offset = (page - 1) * pageSize;
    
    let query = supabase
        .from('audit_log')
        .select(`
            *,
            admin:users!audit_log_admin_id_fkey(id, name, email, avatar_url)
        `, { count: 'exact' });
    
    if (action) {
        query = query.eq('action', action);
    }
    
    if (adminId) {
        query = query.eq('admin_id', adminId);
    }
    
    if (targetType) {
        query = query.eq('target_type', targetType);
    }
    
    if (startDate) {
        query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
        query = query.lte('created_at', endDate);
    }
    
    query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    
    return {
        data: data as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}

export async function createAuditLog(
    action: string,
    targetType: string,
    targetId?: string,
    details?: Record<string, any>
): Promise<void> {
    const { isAdmin, userId } = await checkAdminAccess();
    if (!isAdmin || !userId) return;
    
    const supabase = await createClient();
    
    await supabase.from('audit_log').insert({
        admin_id: userId,
        action,
        target_type: targetType,
        target_id: targetId,
        details
    });
}

// ============================================================================
// COURSE MODERATION
// ============================================================================

export async function approveCourse(courseId: string): Promise<ApiResponse<void>> {
    const { isAdmin, userId } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    await supabase.from('audit_log').insert({
        admin_id: userId,
        action: 'approve_course',
        target_type: 'course',
        target_id: courseId
    });
    
    revalidatePath('/courses');
    revalidatePath('/dashboard');
    
    return { success: true };
}

export async function rejectCourse(
    courseId: string,
    reason: string
): Promise<ApiResponse<void>> {
    const { isAdmin, userId } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    
    // Set to draft with rejection note
    const { error } = await supabase
        .from('courses')
        .update({ 
            status: 'draft',
            // Could add a rejection_reason field
        })
        .eq('id', courseId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    await supabase.from('audit_log').insert({
        admin_id: userId,
        action: 'reject_course',
        target_type: 'course',
        target_id: courseId,
        details: { reason }
    });
    
    revalidatePath('/dashboard');
    
    return { success: true };
}

// ============================================================================
// PLATFORM METRICS
// ============================================================================

export async function getPlatformMetrics(): Promise<ApiResponse<{
    totalUsers: number;
    activeUsers: number;
    totalCourses: number;
    publishedCourses: number;
    totalEnrollments: number;
    completedEnrollments: number;
    totalRevenue: number;
    averageRating: number;
}>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    
    // Get various counts
    const [
        { count: totalUsers },
        { count: totalCourses },
        { count: publishedCourses },
        { count: totalEnrollments },
        { count: completedEnrollments },
        { data: revenueData },
        { data: ratingData }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('completed', true),
        supabase.rpc('get_total_revenue'),
        supabase.from('courses').select('rating_avg').not('rating_avg', 'is', null)
    ]);
    
    const activeUsers = await supabase.rpc('get_daily_active_users', { p_days: 30 });
    
    // Calculate average rating
    const avgRating = ratingData && ratingData.length > 0
        ? ratingData.reduce((sum: number, c: any) => sum + (c.rating_avg || 0), 0) / ratingData.length
        : 0;
    
    return {
        success: true,
        data: {
            totalUsers: totalUsers || 0,
            activeUsers: activeUsers.data || 0,
            totalCourses: totalCourses || 0,
            publishedCourses: publishedCourses || 0,
            totalEnrollments: totalEnrollments || 0,
            completedEnrollments: completedEnrollments || 0,
            totalRevenue: revenueData || 0,
            averageRating: avgRating
        }
    };
}

// ============================================================================
// ENROLLMENT TRENDS
// ============================================================================

export async function getEnrollmentTrends(days: number = 30): Promise<ApiResponse<{
    date: string;
    count: number;
}[]>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) {
        return { success: false, error: 'Admin access required' };
    }
    
    const supabase = await createClient();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabase
        .from('enrollments')
        .select('enrolled_at')
        .gte('enrolled_at', startDate.toISOString())
        .order('enrolled_at', { ascending: true });
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    // Group by date
    const countByDate = new Map<string, number>();
    
    data?.forEach((enrollment: any) => {
        const date = new Date(enrollment.enrolled_at).toISOString().split('T')[0];
        countByDate.set(date, (countByDate.get(date) || 0) + 1);
    });
    
    const trends = Array.from(countByDate.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
    
    return { success: true, data: trends };
}
