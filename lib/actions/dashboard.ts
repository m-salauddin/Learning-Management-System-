"use server";

// ============================================================================
// TEACHER/INSTRUCTOR DASHBOARD SERVER ACTIONS
// ============================================================================
// Server-side actions for instructor-specific dashboard data
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types/lms";

// ============================================================================
// GET INSTRUCTOR DASHBOARD STATS (via RPC)
// ============================================================================

export interface InstructorDashboardStats {
    total_courses: number;
    published_courses: number;
    total_students: number;
    total_revenue: number;
    avg_rating: number;
    total_reviews: number;
}

export async function getInstructorDashboardStats(): Promise<ApiResponse<InstructorDashboardStats>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // Check if user is a teacher
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
        return { success: false, error: 'Teacher access required' };
    }
    
    // Call RPC function
    const { data, error } = await supabase.rpc('get_instructor_dashboard_stats');
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: data as InstructorDashboardStats };
}

// ============================================================================
// GET INSTRUCTOR REVENUE BREAKDOWN
// ============================================================================

export async function getInstructorRevenue(params: {
    startDate?: string;
    endDate?: string;
} = {}): Promise<ApiResponse<{
    total: number;
    byMonth: { month: string; amount: number }[];
    byCourse: { courseId: string; title: string; amount: number; enrollments: number }[];
}>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    const { startDate, endDate } = params;
    
    // Get instructor's courses
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .eq('instructor_id', user.id);
    
    if (!courses || courses.length === 0) {
        return {
            success: true,
            data: { total: 0, byMonth: [], byCourse: [] }
        };
    }
    
    const courseIds = courses.map(c => c.id);
    
    // Get transactions for these courses
    let query = supabase
        .from('transactions')
        .select('amount, paid_at, course_id')
        .eq('status', 'completed')
        .in('course_id', courseIds)
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
    
    // Calculate totals
    let total = 0;
    const courseRevenueMap = new Map<string, { title: string; amount: number; enrollments: number }>();
    const monthRevenueMap = new Map<string, number>();
    
    // Initialize course map
    courses.forEach(c => {
        courseRevenueMap.set(c.id, { title: c.title, amount: 0, enrollments: 0 });
    });
    
    transactions?.forEach((tx: any) => {
        total += tx.amount;
        
        // By course
        const courseData = courseRevenueMap.get(tx.course_id);
        if (courseData) {
            courseData.amount += tx.amount;
            courseData.enrollments += 1;
            courseRevenueMap.set(tx.course_id, courseData);
        }
        
        // By month
        const month = new Date(tx.paid_at).toISOString().substring(0, 7); // YYYY-MM
        monthRevenueMap.set(month, (monthRevenueMap.get(month) || 0) + tx.amount);
    });
    
    const byCourse = Array.from(courseRevenueMap.entries())
        .map(([courseId, data]) => ({ courseId, ...data }))
        .filter(c => c.amount > 0)
        .sort((a, b) => b.amount - a.amount);
    
    const byMonth = Array.from(monthRevenueMap.entries())
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => a.month.localeCompare(b.month));
    
    return {
        success: true,
        data: { total, byMonth, byCourse }
    };
}

// ============================================================================
// GET COURSE STUDENTS
// ============================================================================

export async function getCourseStudents(
    courseId: string,
    params: {
        page?: number;
        pageSize?: number;
        search?: string;
    } = {}
): Promise<{
    data: Array<{
        id: string;
        user: { id: string; name: string; email: string; avatar_url: string | null };
        enrolled_at: string;
        progress_percent: number;
        completed: boolean;
        completed_at: string | null;
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    
    // Verify course ownership
    const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();
    
    if (!course || course.instructor_id !== user.id) {
        // Check if admin
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        
        if (profile?.role !== 'admin') {
            return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
        }
    }
    
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    
    let query = supabase
        .from('enrollments')
        .select(`
            id,
            enrolled_at,
            progress_percent,
            completed,
            completed_at,
            user:users(id, name, email, avatar_url)
        `, { count: 'exact' })
        .eq('course_id', courseId);
    
    // Note: search on joined table requires different approach
    // For now, fetch all and filter client-side or use RPC
    
    query = query
        .order('enrolled_at', { ascending: false })
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

// ============================================================================
// GET COURSE REVIEWS
// ============================================================================

export async function getCourseReviews(
    courseId: string,
    params: {
        page?: number;
        pageSize?: number;
    } = {}
): Promise<{
    data: Array<{
        id: string;
        user: { id: string; name: string; avatar_url: string | null };
        rating: number;
        comment: string | null;
        created_at: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    averageRating: number;
}> {
    const supabase = await createClient();
    
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    
    const { data, error, count } = await supabase
        .from('course_reviews')
        .select(`
            id,
            rating,
            comment,
            created_at,
            user:users(id, name, avatar_url)
        `, { count: 'exact' })
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0, averageRating: 0 };
    }
    
    // Get average rating
    const { data: course } = await supabase
        .from('courses')
        .select('rating_avg')
        .eq('id', courseId)
        .single();
    
    return {
        data: data as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
        averageRating: course?.rating_avg || 0
    };
}

// ============================================================================
// SUBMIT COURSE REVIEW (Student)
// ============================================================================

export async function submitCourseReview(
    courseId: string,
    rating: number,
    comment?: string
): Promise<ApiResponse<void>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // Check if enrolled
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
    
    if (!enrollment) {
        return { success: false, error: 'You must be enrolled to review this course' };
    }
    
    // Check if already reviewed
    const { data: existingReview } = await supabase
        .from('course_reviews')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
    
    if (existingReview) {
        // Update existing review
        const { error } = await supabase
            .from('course_reviews')
            .update({ rating, comment })
            .eq('id', existingReview.id);
        
        if (error) {
            return { success: false, error: error.message };
        }
    } else {
        // Create new review
        const { error } = await supabase
            .from('course_reviews')
            .insert({
                user_id: user.id,
                course_id: courseId,
                rating,
                comment
            });
        
        if (error) {
            return { success: false, error: error.message };
        }
    }
    
    return { success: true };
}

// ============================================================================
// GET STUDENT DASHBOARD STATS (via RPC)
// ============================================================================

export interface StudentDashboardStats {
    enrolled_courses: number;
    completed_courses: number;
    in_progress_courses: number;
    certificates_earned: number;
    total_watch_time: number;
}

export async function getStudentDashboardStats(): Promise<ApiResponse<StudentDashboardStats>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // Call RPC function
    const { data, error } = await supabase.rpc('get_student_dashboard_stats');
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: data as StudentDashboardStats };
}
