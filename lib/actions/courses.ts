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
        status = 'all',
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
            instructor:users!courses_instructor_id_fkey(id, name, email, avatar_url),
            category:categories(name)
        `, { count: 'exact' });

    // Apply filters
    if (status !== 'all') {
        query = query.eq('status', status);
    }

    if (category && category !== 'all') {
        query = query.eq('category_id', category);
    }

    if (instructor) {
        query = query.eq('instructor_id', instructor);
    }

    if (level && level !== 'all') {
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

// Bulk delete courses
export async function bulkDeleteCourses(courseIds: string[]) {
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
            return { success: false, error: 'Only admins can delete courses in bulk' };
        }

        const { error } = await supabase
            .from('courses')
            .delete()
            .in('id', courseIds);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/dashboard/courses');
        return {
            success: true,
            error: null,
            deletedCount: courseIds.length
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

// Bulk update status
export async function bulkUpdateCourseStatus(courseIds: string[], status: CourseStatus) {
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
            return { success: false, error: 'Only admins can update courses in bulk' };
        }

        const { error } = await supabase
            .from('courses')
            .update({ status: status, published: status === 'published' })
            .in('id', courseIds);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/dashboard/courses');
        return {
            success: true,
            error: null,
            updatedCount: courseIds.length
        };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}


// ============================================================================
// PUBLISH / UNPUBLISH COURSE
// ============================================================================

export async function publishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return updateCourse({ id: courseId, status: 'published', published: true });
}

export async function unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return updateCourse({ id: courseId, status: 'draft', published: false });
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

// ============================================================================
// EXPORT & STATS
// ============================================================================

export async function getCourseStats() {
    try {
        const supabase = await createClient();

        const { data: courses, error } = await supabase
            .from('courses')
            .select('status, created_at, price, total_students');

        if (error || !courses) {
            return { stats: null, error: error?.message || 'Failed to fetch stats' };
        }

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const newThisMonth = courses.filter(c => new Date(c.created_at) >= startOfMonth).length;
        const newLastMonth = courses.filter(c => {
            const created = new Date(c.created_at);
            return created >= startOfLastMonth && created <= endOfLastMonth;
        }).length;

        const growthPercentage = newLastMonth > 0
            ? ((newThisMonth - newLastMonth) / newLastMonth) * 100
            : 100;

        const totalRevenue = courses.reduce((sum, c) => sum + (c.price * (c.total_students || 0)), 0);

        const stats = {
            total: courses.length,
            published: courses.filter(c => c.status === 'published').length,
            draft: courses.filter(c => c.status === 'draft').length,
            archived: courses.filter(c => c.status === 'archived').length,
            totalStudents: courses.reduce((sum, c) => sum + (c.total_students || 0), 0),
            newThisMonth,
            growthPercentage: Math.round(growthPercentage),
            totalRevenue // This is an estimate
        };

        return { stats, error: null };

    } catch (error: unknown) {
        return { stats: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function exportCoursesToCSV(filters?: GetCoursesParams) {
    try {
        const result = await getCourses({ ...filters, pageSize: 10000 }); // Fetch all

        if (!result.data) {
            return { csv: null, error: 'Failed to export' };
        }

        const headers = ['Title', 'Category', 'Level', 'Status', 'Price', 'Students', 'Rating', 'Created At'];
        const rows = result.data.map((course: any) => [
            course.title || '',
            course.category?.name || 'Uncategorized',
            course.level || 'Beginner',
            course.status || 'draft',
            course.price,
            course.total_students || 0,
            course.rating || 0,
            new Date(course.created_at).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map((cell: any) => `"${cell}"`).join(','))
        ].join('\n');

        return { csv: csvContent, error: null };
    } catch (error: unknown) {
        return { csv: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function exportCoursesToJSON(filters?: GetCoursesParams) {
    try {
        const result = await getCourses({ ...filters, pageSize: 10000 }); // Fetch all

        if (!result.data) {
            return { json: null, error: 'Failed to export' };
        }

        return { json: JSON.stringify(result.data, null, 2), error: null };
    } catch (error: unknown) {
        return { json: null, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}
