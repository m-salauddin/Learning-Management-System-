"use server";

// ============================================================================
// COURSE SERVER ACTIONS
// ============================================================================
// Server-side actions for course management (create, read, update, delete)
// All actions include proper authorization checks
// ============================================================================

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    Course, CourseWithInstructor, CourseWithModules, CourseStatus,
    CreateCourseInput, UpdateCourseInput, ApiResponse, PaginatedResponse
} from "@/types/lms";

// ============================================================================
// GET COURSES
// ============================================================================

export interface GetCoursesParams {
    page?: number;
    pageSize?: number;
    status?: CourseStatus | 'all';
    category?: string;
    instructor?: string;
    search?: string;
    level?: string;
    sort?: 'newest' | 'popular' | 'rating' | 'price_low' | 'price_high';
}

export async function getCourses(params: GetCoursesParams = {}): Promise<PaginatedResponse<CourseWithInstructor>> {
    const supabase = await createClient();
    
    const {
        page = 1,
        pageSize = 12,
        status = 'published',
        category,
        instructor,
        search,
        level,
        sort = 'newest'
    } = params;
    
    const offset = (page - 1) * pageSize;
    
    // Build query
    let query = supabase
        .from('courses')
        .select(`
            *,
            instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url)
        `, { count: 'exact' });
    
    // Apply filters
    if (status !== 'all') {
        query = query.eq('status', status);
    }
    
    if (category) {
        query = query.eq('category_id', category);
    }
    
    if (instructor) {
        query = query.eq('instructor_id', instructor);
    }
    
    if (level) {
        query = query.eq('level', level);
    }
    
    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    // Apply sorting
    switch (sort) {
        case 'popular':
            query = query.order('total_students', { ascending: false });
            break;
        case 'rating':
            query = query.order('rating', { ascending: false });
            break;
        case 'price_low':
            query = query.order('price', { ascending: true });
            break;
        case 'price_high':
            query = query.order('price', { ascending: false });
            break;
        default:
            query = query.order('created_at', { ascending: false });
    }
    
    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
        console.error('Error fetching courses:', error);
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    
    return {
        data: data as CourseWithInstructor[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}

// ============================================================================
// GET SINGLE COURSE
// ============================================================================

export async function getCourseBySlug(slug: string): Promise<ApiResponse<CourseWithModules>> {
    const supabase = await createClient();
    
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            *,
            instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url),
            category:categories(id, name, slug),
            modules(
                *,
                lessons(*)
            )
        `)
        .eq('slug', slug)
        .order('position', { foreignTable: 'modules', ascending: true })
        .order('position', { foreignTable: 'modules.lessons', ascending: true })
        .single();
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: course as CourseWithModules };
}

export async function getCourseById(id: string): Promise<ApiResponse<CourseWithModules>> {
    const supabase = await createClient();
    
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            *,
            instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url),
            category:categories(id, name, slug),
            modules(
                *,
                lessons(*)
            )
        `)
        .eq('id', id)
        .order('position', { foreignTable: 'modules', ascending: true })
        .order('position', { foreignTable: 'modules.lessons', ascending: true })
        .single();
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data: course as CourseWithModules };
}

// ============================================================================
// CREATE COURSE
// ============================================================================

export async function createCourse(input: CreateCourseInput): Promise<ApiResponse<Course>> {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // Check if user is teacher or admin
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (!profile || !['teacher', 'admin'].includes(profile.role)) {
        return { success: false, error: 'Only teachers can create courses' };
    }
    
    // Create course
    const { data: course, error } = await supabase
        .from('courses')
        .insert({
            ...input,
            instructor_id: user.id,
            status: 'draft',
            published: false
        })
        .select()
        .single();
    
    if (error) {
        console.error('Error creating course:', error);
        return { success: false, error: error.message };
    }
    
    revalidatePath('/dashboard/courses');
    return { success: true, data: course };
}

// ============================================================================
// UPDATE COURSE
// ============================================================================

export async function updateCourse(input: UpdateCourseInput): Promise<ApiResponse<Course>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // Check ownership or admin
    const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', input.id)
        .single();
    
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (!course || (course.instructor_id !== user.id && profile?.role !== 'admin')) {
        return { success: false, error: 'Unauthorized to update this course' };
    }
    
    const { id, ...updateData } = input;
    
    const { data: updated, error } = await supabase
        .from('courses')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    revalidatePath(`/courses/${updated.slug}`);
    revalidatePath('/dashboard/courses');
    return { success: true, data: updated };
}

// ============================================================================
// DELETE COURSE
// ============================================================================

export async function deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    // Check ownership or admin
    const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', courseId)
        .single();
    
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    
    if (!course || (course.instructor_id !== user.id && profile?.role !== 'admin')) {
        return { success: false, error: 'Unauthorized to delete this course' };
    }
    
    const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    revalidatePath('/dashboard/courses');
    return { success: true };
}

// ============================================================================
// PUBLISH / UNPUBLISH COURSE
// ============================================================================

export async function publishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return updateCourse({ id: courseId, status: 'published' });
}

export async function unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return updateCourse({ id: courseId, status: 'draft' });
}

// ============================================================================
// GET INSTRUCTOR COURSES
// ============================================================================

export async function getInstructorCourses(): Promise<ApiResponse<Course[]>> {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('instructor_id', user.id)
        .order('created_at', { ascending: false });
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data };
}

// ============================================================================
// GET CATEGORIES
// ============================================================================

export async function getCategories(): Promise<ApiResponse<{ id: string; name: string; slug: string }[]>> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name');
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data };
}
