"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    Enrollment, EnrollmentWithCourse, EnrollmentWithProgress,
    LessonProgress, ApiResponse, PaginatedResponse
} from "@/types/lms";
import { createNotification } from "./notifications";
export async function getMyEnrollments(params: {
    page?: number;
    pageSize?: number;
    status?: 'active' | 'completed' | 'all';
} = {}): Promise<PaginatedResponse<EnrollmentWithCourse>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10, status = 'all' } = params;
    const offset = (page - 1) * pageSize;
    let query = supabase
        .from('enrollments')
        .select(`
            *,
            course:courses(
                *,
                instructor:instructor_profiles(
                    user:users(id, name, email, avatar_url)
                )
            ),
            transaction:transactions(*)
        `, { count: 'exact' })
        .eq('user_id', user.id);
    if (status === 'active') {
        query = query.is('completed_at', null);
    } else if (status === 'completed') {
        query = query.not('completed_at', 'is', null);
    }
    query = query
        .order('last_accessed_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    const { data, error, count } = await query;
    if (error) {
        console.error('Error fetching enrollments:', error);
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    const transformedData = (data as any[])?.map(enrollment => ({
        ...enrollment,
        course: enrollment.course ? {
            ...enrollment.course,
            instructor: enrollment.course.instructor?.user || {
                id: enrollment.course.instructor_id,
                name: 'Unknown Instructor',
                email: '',
                avatar_url: null
            }
        } : null
    }));

    return {
        data: transformedData as EnrollmentWithCourse[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}
export async function getEnrollment(courseId: string): Promise<ApiResponse<EnrollmentWithProgress>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: enrollment, error } = await supabase
        .from('enrollments')
        .select(`
            *,
            course:courses(
                *,
                instructor:instructor_profiles(
                    user:users(id, name, email, avatar_url)
                )
            )
        `)
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
    if (error) {
        return { success: false, error: 'Not enrolled in this course' };
    }
    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('enrollment_id', enrollment.id);
    
    const transformedEnrollment = {
        ...enrollment,
        course: enrollment.course ? {
            ...enrollment.course,
            instructor: enrollment.course.instructor?.user || {
                id: enrollment.course.instructor_id,
                name: 'Unknown Instructor',
                email: '',
                avatar_url: null
            }
        } : null,
        lesson_progress: progress || []
    };

    return {
        success: true,
        data: transformedEnrollment as EnrollmentWithProgress
    };
}
export async function checkEnrollment(courseId: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .eq('status', 'active')
        .single();
    return !!data;
}
export async function updateLessonProgress(
    lessonId: string,
    watchedSeconds: number,
    isCompleted: boolean = false
): Promise<ApiResponse<{ completed_lessons: number; total_lessons: number; progress_percentage: number }>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data, error } = await supabase
        .rpc('update_lesson_progress', {
            p_lesson_id: lessonId,
            p_watched_seconds: watchedSeconds,
            p_is_completed: isCompleted
        });
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/my-courses');
    return { success: true, data };
}
export async function markLessonComplete(lessonId: string): Promise<ApiResponse<null>> {
    const result = await updateLessonProgress(lessonId, 0, true);
    return { success: result.success, error: result.error };
}
export async function getResumeLesson(courseId: string): Promise<ApiResponse<{
    lesson_id: string;
    lesson_title: string;
    module_title: string;
    watched_seconds: number;
}>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('last_lesson_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
    if (!enrollment?.last_lesson_id) {
        const { data: firstLesson } = await supabase
            .from('module_lessons')
            .select(`
                id, title,
                module:modules(title, course_id)
            `)
            .eq('module.course_id', courseId)
            .order('module.position', { foreignTable: 'modules', ascending: true })
            .order('position', { ascending: true })
            .limit(1)
            .single();
        if (!firstLesson) {
            return { success: false, error: 'No lessons in this course' };
        }
        return {
            success: true,
            data: {
                lesson_id: firstLesson.id,
                lesson_title: firstLesson.title,
                module_title: (firstLesson.module as any)?.title || '',
                watched_seconds: 0
            }
        };
    }
    const { data: lesson } = await supabase
        .from('module_lessons')
        .select(`
            id, title,
            module:modules(title)
        `)
        .eq('id', enrollment.last_lesson_id)
        .single();
    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('watched_seconds')
        .eq('lesson_id', enrollment.last_lesson_id)
        .eq('user_id', user.id)
        .single();
    if (!lesson) {
        return { success: false, error: 'Lesson not found' };
    }
    return {
        success: true,
        data: {
            lesson_id: lesson.id,
            lesson_title: lesson.title,
            module_title: (lesson.module as any)?.title || '',
            watched_seconds: progress?.watched_seconds || 0
        }
    };
}
export async function getCourseProgress(courseId: string): Promise<ApiResponse<{
    enrollment_id: string;
    course_id: string;
    progress_percentage: number;
    completed_lessons: number;
    total_lessons: number;
    completed_at: string | null;
    lessons: { lesson_id: string; is_completed: boolean; watched_seconds: number }[];
}>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, course_id, progress_percentage, completed_lessons, total_lessons, completed_at')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
    if (!enrollment) {
        return { success: false, error: 'Not enrolled' };
    }
    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, is_completed, watched_seconds')
        .eq('enrollment_id', enrollment.id);
    return {
        success: true,
        data: {
            enrollment_id: enrollment.id,
            course_id: enrollment.course_id,
            progress_percentage: enrollment.progress_percentage,
            completed_lessons: enrollment.completed_lessons,
            total_lessons: enrollment.total_lessons,
            completed_at: enrollment.completed_at,
            lessons: progress || []
        }
    };
}
export async function getAllEnrollments(params: {
    page?: number;
    pageSize?: number;
    courseId?: string;
    userId?: string;
    status?: string | 'all';
    paymentMethod?: string | 'all';
} = {}): Promise<PaginatedResponse<EnrollmentWithCourse & { user: { id: string; name: string; email: string } }>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10, courseId, userId, status = 'all', paymentMethod = 'all' } = params;
    const offset = (page - 1) * pageSize;
    let query = supabase
        .from('enrollments')
        .select(`
            *,
            course:courses(
                *,
                instructor:instructor_profiles(
                    user:users(id, name, email, avatar_url)
                )
            ),
            user:users(id, name, email, avatar_url),
            transaction:transactions(*)
        `, { count: 'exact' });
    if (courseId && courseId !== 'all') {
        query = query.eq('course_id', courseId);
    }
    if (userId && userId !== 'all') {
        query = query.eq('user_id', userId);
    }
    if (status && status !== 'all') {
        query = query.eq('status', status);
    }
    if (paymentMethod && paymentMethod !== 'all') {
        if (paymentMethod === 'system') {
            query = query.is('transaction_id', null);
        } else {
            
            
            query = supabase
                .from('enrollments')
                .select(`
                    *,
                    course:courses(
                        *,
                        instructor:instructor_profiles(
                            user:users(id, name, email, avatar_url)
                        )
                    ),
                    user:users(id, name, email, avatar_url),
                    transaction:transactions!inner(*)
                `, { count: 'exact' })
                .eq('transaction.payment_provider', paymentMethod);

            
            if (courseId && courseId !== 'all') query = query.eq('course_id', courseId);
            if (userId && userId !== 'all') query = query.eq('user_id', userId);
            if (status && status !== 'all') query = query.eq('status', status);
        }
    }

    query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    const { data, error, count } = await query;
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }

    const transformedData = (data as any[])?.map(enrollment => ({
        ...enrollment,
        course: enrollment.course ? {
            ...enrollment.course,
            instructor: enrollment.course.instructor?.user || {
                id: enrollment.course.instructor_id,
                name: 'Unknown Instructor',
                email: '',
                avatar_url: null
            }
        } : null
    }));

    return {
        data: transformedData as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}

export async function approveEnrollment(enrollmentId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
        return { success: false, error: 'Unauthorized: Admin or Moderator access required' };
    }

    
    const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .select('user_id, course_id')
        .eq('id', enrollmentId)
        .single();

    if (enrollError || !enrollment) {
        return { success: false, error: 'Enrollment record not found' };
    }

    
    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select('id, payment_intent_id, payment_method')
        .eq('user_id', enrollment.user_id)
        .eq('course_id', enrollment.course_id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!transaction) {
        
        
        const { error: updateError } = await supabase
            .from('enrollments')
            .update({ status: 'success', updated_at: new Date().toISOString() })
            .eq('id', enrollmentId);

        if (updateError) return { success: false, error: updateError.message };
        
        // Notify Student about approval
        const { data: course } = await supabase.from('courses').select('title').eq('id', enrollment.course_id).single();
        await createNotification(
            enrollment.user_id,
            'Enrollment Approved!',
            `Your enrollment in "${course?.title || 'the course'}" has been approved by an administrator.`,
            'success',
            `/dashboard/my-courses`
        );

        revalidatePath('/dashboard/enrollments');
        revalidatePath('/dashboard/my-courses');
        return { success: true };
    }

    
    
    const { confirmPayment } = await import('./payments');
    const result = await confirmPayment(
        transaction.id, 
        transaction.payment_intent_id || 'manual-admin-approved',
        transaction.payment_method || 'manual'
    );

    if (result.success) {
        revalidatePath('/dashboard/enrollments');
        return { success: true };
    } else {
        return { success: false, error: result.error };
    }
}

export async function cancelEnrollment(enrollmentId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
        return { success: false, error: 'Unauthorized: Admin or Moderator access required' };
    }

    const { data: enrollment, error: enrollError } = await supabase
        .from('enrollments')
        .select('user_id, course_id, transaction_id')
        .eq('id', enrollmentId)
        .single();

    if (enrollError || !enrollment) {
        return { success: false, error: 'Enrollment record not found' };
    }

    
    const { error: updateError } = await supabase
        .from('enrollments')
        .update({ 
            status: 'cancelled', 
            updated_at: new Date().toISOString() 
        })
        .eq('id', enrollmentId);

    if (updateError) return { success: false, error: updateError.message };

    
    if (enrollment.transaction_id) {
        await supabase
            .from('transactions')
            .update({ status: 'failed', updated_at: new Date().toISOString() })
            .eq('id', enrollment.transaction_id)
            .eq('status', 'pending');
    }

    revalidatePath('/dashboard/enrollments');
    revalidatePath('/dashboard/my-courses');

    return { success: true };
}

export async function deleteEnrollment(enrollmentId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { success: false, error: 'Unauthorized: Admin access required' };
    }

    const { error: deleteError } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', enrollmentId);

    if (deleteError) {
        console.error('Delete Enrollment Error:', deleteError);
        return { success: false, error: deleteError.message };
    }

    revalidatePath('/dashboard/enrollments');
    return { success: true };
}
