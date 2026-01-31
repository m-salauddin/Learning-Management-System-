"use server";

// ============================================================================
// ENROLLMENT SERVER ACTIONS
// ============================================================================
// Server-side actions for managing enrollments and course progress
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    Enrollment, EnrollmentWithCourse, EnrollmentWithProgress,
    LessonProgress, ApiResponse, PaginatedResponse
} from "@/types/lms";

// ============================================================================
// GET USER ENROLLMENTS
// ============================================================================

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
                instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url)
            )
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

    return {
        data: data as EnrollmentWithCourse[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}

// ============================================================================
// GET SINGLE ENROLLMENT
// ============================================================================

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
                instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url)
            )
        `)
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

    if (error) {
        return { success: false, error: 'Not enrolled in this course' };
    }

    // Get lesson progress
    const { data: progress } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('enrollment_id', enrollment.id);

    return {
        success: true,
        data: {
            ...enrollment,
            lesson_progress: progress || []
        } as EnrollmentWithProgress
    };
}

// ============================================================================
// CHECK ENROLLMENT
// ============================================================================

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

// ============================================================================
// UPDATE PROGRESS
// ============================================================================

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

    // Call RPC function that handles all the logic
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

// ============================================================================
// MARK LESSON COMPLETE
// ============================================================================

export async function markLessonComplete(lessonId: string): Promise<ApiResponse<null>> {
    const result = await updateLessonProgress(lessonId, 0, true);
    return { success: result.success, error: result.error };
}

// ============================================================================
// GET RESUME LESSON
// ============================================================================

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

    // Get enrollment with last lesson
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('last_lesson_id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();

    if (!enrollment?.last_lesson_id) {
        // Get first lesson of course
        const { data: firstLesson } = await supabase
            .from('lessons')
            .select(`
                id, title,
                module:modules(title, course_id)
            `)
            .eq('module.course_id', courseId)
            .order('module.position', { ascending: true })
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

    // Get last lesson with progress
    const { data: lesson } = await supabase
        .from('lessons')
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

// ============================================================================
// GET COURSE PROGRESS
// ============================================================================

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

// ============================================================================
// ADMIN: GET ALL ENROLLMENTS
// ============================================================================

export async function getAllEnrollments(params: {
    page?: number;
    pageSize?: number;
    courseId?: string;
    userId?: string;
} = {}): Promise<PaginatedResponse<EnrollmentWithCourse & { user: { id: string; name: string; email: string } }>> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }

    // Check admin
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }

    const { page = 1, pageSize = 10, courseId, userId } = params;
    const offset = (page - 1) * pageSize;

    let query = supabase
        .from('enrollments')
        .select(`
            *,
            course:courses(
                *,
                instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url)
            ),
            user:users(id, name, email)
        `, { count: 'exact' });

    if (courseId) {
        query = query.eq('course_id', courseId);
    }

    if (userId) {
        query = query.eq('user_id', userId);
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
