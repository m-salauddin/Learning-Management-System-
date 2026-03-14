"use server";



import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    Course, CourseWithInstructor, CourseWithModules, CourseStatus,
    CreateCourseInput, UpdateCourseInput, ApiResponse, PaginatedResponse
} from "@/types/lms";



export interface GetCoursesParams {
    page?: number;
    pageSize?: number;
    status?: CourseStatus | 'all';
    category?: string;
    instructor?: string;
    search?: string;
    level?: string;
    sort?: 'newest' | 'popular' | 'rating' | 'price_low' | 'price_high' | 'serial';
    onlyLatestBatch?: boolean;
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
        sort = 'newest',
        onlyLatestBatch = false
    } = params;

    const offset = (page - 1) * pageSize;


    let query = supabase
        .from('courses')
        .select(`
            *,
            instructor:instructor_profiles(
                user:users(id, name, email, avatar_url)
            ),
            category:categories(id, name, slug, color)
        `, { count: 'exact' });


    if (status !== 'all') {
        query = query.eq('status', status);
    }

    if (category && category !== 'all') {
        query = query.eq('category_id', category);
    }

    if (instructor && instructor !== 'all') {
        query = query.eq('instructor_id', instructor);
    }

    if (level && level !== 'all') {
        query = query.eq('level', level);
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }


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
        case 'serial':
            query = query.order('serial_number', { ascending: true });
            break;
        default:
            query = query.order('serial_number', { ascending: true })
                .order('created_at', { ascending: false });
    }

    // If onlyLatestBatch is requested, we need to fetch more data and filter in memory
    // (Alternative: custom RPC or window functions, but this is simpler for existing scale)
    if (onlyLatestBatch) {
        // Fetch a larger set to allow for filtering (limited to 1000 for safety)
        const { data, count } = await query.range(0, 999);

        if (!data) return { data: [], total: 0, page, pageSize, totalPages: 0 };

        // Group by title and find max batch
        const latestBatchesMap = new Map<string, any>();
        data.forEach(course => {
            const existing = latestBatchesMap.get(course.title);
            if (!existing || (course.batch_no || 0) > (existing.batch_no || 0)) {
                latestBatchesMap.set(course.title, course);
            }
        });

        const filteredData = Array.from(latestBatchesMap.values());
        const total = filteredData.length;
        const pagedData = filteredData.slice(offset, offset + pageSize);

        const transformedData = pagedData.map(course => ({
            ...course,
            instructor: course.instructor?.user || {
                id: course.instructor_id,
                name: 'Unknown Instructor',
                email: '',
                avatar_url: null
            }
        }));

        return {
            data: transformedData as CourseWithInstructor[],
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        };
    }


    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    // Map the instructor data to match CourseWithInstructor type
    const transformedData = (data as any[])?.map(course => ({
        ...course,
        instructor: course.instructor?.user || {
            id: course.instructor_id,
            name: 'Unknown Instructor',
            email: '',
            avatar_url: null
        }
    }));

    return {
        data: transformedData as CourseWithInstructor[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}



export async function getCourseBySlug(slug: string): Promise<ApiResponse<CourseWithModules>> {
    const supabase = await createClient();

    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            *,
            instructor:instructor_profiles(
                user:users(id, name, email, avatar_url)
            ),
            category:categories(id, name, slug, color),
            modules(
                *,
                lessons(
                    *,
                    lesson_assets(*)
                )
            ),
            course_instructors(
                instructor_id,
                role,
                instructor:users(id, name, email, avatar_url)
            ),
            course_projects(*),
            course_faq(*),
            course_resources(*),
            course_details(*)
        `)
        .eq('slug', slug)
        .order('position', { foreignTable: 'modules', ascending: true })
        .order('position', { foreignTable: 'modules.lessons', ascending: true })
        .order('order_index', { foreignTable: 'course_projects', ascending: true })
        .order('order_index', { foreignTable: 'course_faq', ascending: true })
        .order('order_index', { foreignTable: 'course_resources', ascending: true })
        .single();

    if (error || !course) {
        return { success: false, error: error?.message || "Course not found" };
    }


    const instructor_ids = (course as any).course_instructors
        ?.filter((ci: any) => ci.role === 'main')
        .map((ci: any) => ci.instructor_id) || [];
    
    const support_instructor_ids = (course as any).course_instructors
        ?.filter((ci: any) => ci.role === 'support')
        .map((ci: any) => ci.instructor_id) || [];


    const transformedCourse = {
        ...course,
        instructor_ids,
        support_instructor_ids,
        instructor: (course as any).instructor?.user || {
            id: (course as any).instructor_id,
            name: 'Unknown Instructor',
            email: '',
            avatar_url: null
        }
    };

    return { success: true, data: transformedCourse as CourseWithModules };
}

export async function getCourseById(id: string): Promise<ApiResponse<CourseWithModules>> {
    const supabase = await createClient();

    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            *,
            instructor:instructor_profiles(
                user:users(id, name, email, avatar_url)
            ),
            category:categories(id, name, slug),
            modules(
                *,
                lessons(
                    *,
                    lesson_assets(*)
                )
            ),
            course_instructors(
                instructor_id,
                role,
                instructor:users(id, name, email, avatar_url)
            ),
            course_projects(*),
            course_faq(*),
            course_resources(*),
            course_details(*)
        `)
        .eq('id', id)
        .order('position', { foreignTable: 'modules', ascending: true })
        .order('position', { foreignTable: 'modules.lessons', ascending: true })
        .order('order_index', { foreignTable: 'course_projects', ascending: true })
        .order('order_index', { foreignTable: 'course_faq', ascending: true })
        .order('order_index', { foreignTable: 'course_resources', ascending: true })
        .single();

    if (error) {
        return { success: false, error: error.message };
    }


    const instructor_ids = (course as any).course_instructors
        ?.filter((ci: any) => ci.role === 'main')
        .map((ci: any) => ci.instructor_id) || [];
    
    const support_instructor_ids = (course as any).course_instructors
        ?.filter((ci: any) => ci.role === 'support')
        .map((ci: any) => ci.instructor_id) || [];


    const transformedCourse = {
        ...course,
        instructor_ids,
        support_instructor_ids,
        instructor: (course as any).instructor?.user || {
            id: (course as any).instructor_id,
            name: 'Unknown Instructor',
            email: '',
            avatar_url: null
        }
    };

    return { success: true, data: transformedCourse as CourseWithModules };
}

export async function getNextBatchNumber(title: string): Promise<ApiResponse<number>> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('courses')
        .select('batch_no')
        .eq('title', title)
        .order('batch_no', { ascending: false })
        .limit(1);

    if (error) {
        return { success: false, error: error.message };
    }

    const nextBatch = data && data.length > 0 ? (data[0].batch_no || 0) + 1 : 1;
    return { success: true, data: nextBatch };
}



export async function createCourse(input: CreateCourseInput): Promise<ApiResponse<Course>> {
    const supabase = await createClient();


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


    const {
        faqs,
        projects,
        resources,
        modules,
        target_audience,
        instructor_ids,
        support_instructor_ids,
        ...mainCourseData
    } = input;

    const fallbackInstructorId = mainCourseData.instructor_id === "_default" || !mainCourseData.instructor_id ? user.id : mainCourseData.instructor_id;
    // Resolve the actual instructor_id that will be used for the course insert
    const finalInstructorId = instructor_ids?.[0] || fallbackInstructorId;

    // 0. Ensure instructor profile exists for the FINAL instructor (FK requirement)
    const { data: existingProfile } = await supabase
        .from('instructor_profiles')
        .select('id')
        .eq('id', finalInstructorId)
        .single();

    if (!existingProfile) {
        const { error: profileError } = await supabase
            .from('instructor_profiles')
            .insert({
                id: finalInstructorId,
                bio: "Instructor at Dokkhota IT",
                expertise: [],
                social_links: {}
            });

        if (profileError) {
            console.error('Error creating instructor profile:', profileError);
            return { success: false, error: 'Failed to create instructor profile. Please ensure the selected instructor exists.' };
        }
    }

    // Also ensure profiles exist for all additional instructors
    const allInstructorIds = [...new Set([
        ...(instructor_ids || []),
        ...(support_instructor_ids || [])
    ])].filter(id => id !== finalInstructorId);

    for (const instId of allInstructorIds) {
        const { data: profile } = await supabase
            .from('instructor_profiles')
            .select('id')
            .eq('id', instId)
            .single();

        if (!profile) {
            await supabase.from('instructor_profiles').insert({
                id: instId,
                bio: "Instructor at Dokkhota IT",
                expertise: [],
                social_links: {}
            });
        }
    }

    // Generate slug if not provided
    let finalSlug = mainCourseData.slug;
    if (!finalSlug) {
        finalSlug = mainCourseData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove non-word chars (except spaces and hyphens)
            .replace(/\s+/g, '-')      // Replace spaces with hyphens
            .replace(/--+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim();                   // Trim leading/trailing whitespace

        // Add a random suffix if needed to ensure uniqueness (since it's a 'u' constraint)
        // For now, let's keep it simple, but we could add a short ID here.
    }


    if (input.batch_no) {
        const { data: existingBatches } = await supabase
            .from('courses')
            .select('batch_no')
            .eq('title', mainCourseData.title)
            .order('batch_no', { ascending: false });

        if (existingBatches && existingBatches.length > 0) {
            const maxBatch = existingBatches[0].batch_no || 0;
            if (input.batch_no <= maxBatch) {
                return {
                    success: false,
                    error: `A course with this title already exists up to batch ${maxBatch}. Please enter a higher batch number.`
                };
            }
        }
    }


    const coursePayload = {
        ...mainCourseData,
        batch_no: input.batch_no || 1,
        course_type: input.course_type || 'recorded',
        slug: finalSlug,
        instructor_id: finalInstructorId,
        status: 'published',
        published: true
    };

    const { data: rpcResult, error: rpcError } = await supabase
        .rpc('create_course_at_top', { input_data: coursePayload });

    if (rpcError) {
        console.error('Error creating course (RPC):', rpcError);
        return { success: false, error: rpcError.message };
    }

    // Since RPC returns just { id, serial_number }, fetch the full inserted row
    const { data: course, error } = await supabase
        .from('courses')
        .select()
        .eq('id', rpcResult.id)
        .single();

    if (error) {
        console.error('Error creating course:', error);
        return { success: false, error: error.message };
    }


    const instructorAssignments = [
        ...(input.instructor_ids || []).map(id => ({
            course_id: course.id,
            instructor_id: id,
            role: 'main' as const
        })),
        ...(input.support_instructor_ids || []).map(id => ({
            course_id: course.id,
            instructor_id: id,
            role: 'support' as const
        }))
    ];

    if (instructorAssignments.length > 0) {
        const { error: instError } = await supabase
            .from('course_instructors')
            .insert(instructorAssignments);

        if (instError) {
            console.error('Error assigning instructors:', instError);
        }
    }


    if (target_audience?.length || mainCourseData.description) {
        await supabase.from('course_details').insert({
            course_id: course.id,
            target_audience: target_audience || [],
            description_long: mainCourseData.description || "",
            requirements: mainCourseData.requirements || [],
            language: mainCourseData.language || "বাংলা",
        });
    }


    if (faqs?.length) {
        const faqData = faqs.map((faq, index) => ({
            course_id: course.id,
            question: faq.question,
            answer: faq.answer,
            order_index: index,
            is_published: true
        }));
        await supabase.from('course_faq').insert(faqData);
    }


    if (projects?.length) {
        const projectData = projects.map((p, index) => ({
            course_id: course.id,
            title: p.title,
            description: p.description,
            thumbnail_url: p.image_url || "",
            order_index: index,
            is_public: true
        }));
        const { error: projectError } = await supabase.from('course_projects').insert(projectData);
        if (projectError) console.error('Error inserting projects:', projectError);
    }


    if (resources?.length) {
        const resourceData = resources.map((r, index) => ({
            course_id: course.id,
            title: r.title,
            resource_type: r.type,
            external_url: r.url,
            order_index: index,
            is_public: true
        }));
        await supabase.from('course_resources').insert(resourceData);
    }


    if (modules?.length) {
        for (const [mIndex, moduleInput] of modules.entries()) {
            const { data: module, error: moduleError } = await supabase
                .from('modules')
                .insert({
                    course_id: course.id,
                    title: moduleInput.title,
                    description: "",
                    position: mIndex,
                    is_published: true
                })
                .select()
                .single();

            if (module && !moduleError && moduleInput.lessons?.length) {
                for (const [lIndex, lessonInput] of moduleInput.lessons.entries()) {
                    const { data: lesson, error: lessonError } = await supabase
                        .from('lessons')
                        .insert({
                            module_id: module.id,
                            title: lessonInput.title,
                            lesson_type: 'video',
                            position: lIndex,
                            is_published: true
                        })
                        .select()
                        .single();

                    if (lesson && !lessonError) {
                        await supabase
                            .from('lesson_assets')
                            .insert({
                                lesson_id: lesson.id,
                                video_path: lessonInput.video_url,
                            });
                    }
                }
            }
        }
    }

    revalidatePath('/dashboard/courses');
    return { success: true, data: course };
}



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

    const {
        id,
        faqs,
        projects,
        resources,
        modules,
        target_audience,
        instructor_ids,
        support_instructor_ids,
        ...updateData
    } = input;

    // Remove fields that don't exist in courses table
    const { instructor_id: _instId, ...safeUpdateData } = updateData as any;

    // Resolve the instructor_id for the main courses table
    const finalInstructorId = instructor_ids?.[0] || course.instructor_id;

    // Ensure instructor profile exists
    const { data: existingProfile } = await supabase
        .from('instructor_profiles')
        .select('id')
        .eq('id', finalInstructorId)
        .single();

    if (!existingProfile) {
        await supabase.from('instructor_profiles').insert({
            id: finalInstructorId,
            bio: "Instructor at Dokkhota IT",
            expertise: [],
            social_links: {}
        });
    }

    const { data: updated, error } = await supabase
        .from('courses')
        .update({
            ...safeUpdateData,
            instructor_id: finalInstructorId,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    // Update course_instructors (delete + reinsert)
    if (instructor_ids || support_instructor_ids) {
        await supabase.from('course_instructors').delete().eq('course_id', id);

        const instructorAssignments = [
            ...(instructor_ids || []).map(instId => ({
                course_id: id,
                instructor_id: instId,
                role: 'main' as const
            })),
            ...(support_instructor_ids || []).map(instId => ({
                course_id: id,
                instructor_id: instId,
                role: 'support' as const
            }))
        ];

        // Ensure profiles exist for all instructors
        for (const assignment of instructorAssignments) {
            const { data: p } = await supabase
                .from('instructor_profiles')
                .select('id')
                .eq('id', assignment.instructor_id)
                .single();
            if (!p) {
                await supabase.from('instructor_profiles').insert({
                    id: assignment.instructor_id,
                    bio: "Instructor at Dokkhota IT",
                    expertise: [],
                    social_links: {}
                });
            }
        }

        if (instructorAssignments.length > 0) {
            await supabase.from('course_instructors').insert(instructorAssignments);
        }
    }

    // Update course_details
    if (target_audience || updateData.description) {
        await supabase.from('course_details').upsert({
            course_id: id,
            target_audience: target_audience || [],
            description_long: updateData.description || "",
            requirements: (updateData as any).requirements || [],
            language: (updateData as any).language || "বাংলা",
            updated_at: new Date().toISOString()
        }, { onConflict: 'course_id' });
    }

    // Update FAQs (delete + reinsert)
    if (faqs !== undefined) {
        await supabase.from('course_faq').delete().eq('course_id', id);
        if (faqs && faqs.length > 0) {
            const faqData = faqs.map((f, index) => ({
                course_id: id,
                question: f.question,
                answer: f.answer,
                order_index: index,
                is_published: true
            }));
            await supabase.from('course_faq').insert(faqData);
        }
    }

    // Update Projects (delete + reinsert)
    if (projects !== undefined) {
        await supabase.from('course_projects').delete().eq('course_id', id);
        if (projects && projects.length > 0) {
            const projectData = projects.map((p, index) => ({
                course_id: id,
                title: p.title,
                description: p.description,
                thumbnail_url: p.image_url || "",
                order_index: index,
                is_public: true
            }));
            await supabase.from('course_projects').insert(projectData);
        }
    }

    // Update Curriculum Modules and Lessons (delete + reinsert)
    if (modules !== undefined) {
        // Delete existing modules (will cascade delete lessons if FK is set to cascade)
        // If not cascade, we'd need to fetch module IDs and delete lessons first.
        // Let's assume cascade or handle lessons explicitly if needed.
        // Based on the schema overview, there's a cascade if defined, but let's be safe.
        const { data: existingModules } = await supabase.from('modules').select('id').eq('course_id', id);
        if (existingModules?.length) {
            const mIds = existingModules.map(m => m.id);
            await supabase.from('lessons').delete().in('module_id', mIds);
            await supabase.from('modules').delete().eq('course_id', id);
        }

        if (modules && modules.length > 0) {
            for (const [mIndex, moduleInput] of modules.entries()) {
                const { data: moduleRow, error: moduleError } = await supabase
                    .from('modules')
                    .insert({
                        course_id: id,
                        title: moduleInput.title,
                        description: "",
                        position: mIndex,
                        is_published: true
                    })
                    .select()
                    .single();

                if (moduleRow && !moduleError && moduleInput.lessons?.length) {
                    for (const [lIndex, lessonInput] of moduleInput.lessons.entries()) {
                        const { data: lessonRow, error: lessonError } = await supabase
                            .from('lessons')
                            .insert({
                                module_id: moduleRow.id,
                                title: lessonInput.title,
                                lesson_type: 'video',
                                position: lIndex,
                                is_published: true
                            })
                            .select()
                            .single();

                        if (lessonRow && !lessonError) {
                            await supabase
                                .from('lesson_assets')
                                .insert({
                                    lesson_id: lessonRow.id,
                                    video_path: lessonInput.video_url,
                                });
                        }
                    }
                }
            }
        }
    }

    // Update Resources (delete + reinsert)
    if (resources !== undefined) {
        await supabase.from('course_resources').delete().eq('course_id', id);
        if (resources && resources.length > 0) {
            const resourceData = resources.map((r, index) => ({
                course_id: id,
                title: r.title,
                resource_type: r.type,
                external_url: r.url,
                order_index: index,
                is_public: true
            }));
            await supabase.from('course_resources').insert(resourceData);
        }
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
        .select('id, name, slug, icon')
        .order('name');

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

// ============================================================================
// GET TEACHERS
// ============================================================================

export async function getTeachers(): Promise<ApiResponse<{ id: string; name: string; email: string; avatar_url: string | null; course_count?: number }[]>> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('users')
        .select(`
            id, 
            name, 
            email, 
            avatar_url,
            instructor_profiles (
                courses (count)
            )
        `)
        .eq('role', 'teacher')
        .order('name');

    if (error) {
        return { success: false, error: error.message };
    }

    const teachers = (data || []).map((user: any) => {
        const instructorProfile = Array.isArray(user.instructor_profiles)
            ? user.instructor_profiles[0]
            : user.instructor_profiles;

        const courseCount = instructorProfile?.courses?.[0]?.count || 0;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar_url: user.avatar_url,
            course_count: courseCount
        };
    });

    return { success: true, data: teachers };
}
export async function getCourseStats(): Promise<{ success: boolean; stats?: { total: number; published: number; totalStudents: number; totalRevenue: number }; error?: string }> {
    const supabase = await createClient();

    // Get total courses
    const { count: totalCourses, error: totalError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

    if (totalError) {
        return { success: false, error: totalError.message };
    }

    // Get published courses
    const { count: publishedCourses, error: publishedError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

    if (publishedError) {
        return { success: false, error: publishedError.message };
    }

    // Get total students (sum of total_students column)
    const { data: studentsData, error: studentsError } = await supabase
        .from('courses')
        .select('total_students');

    if (studentsError) {
        return { success: false, error: studentsError.message };
    }

    const totalStudents = studentsData.reduce((sum, course) => sum + (course.total_students || 0), 0);

    // Get revenue (approximate from transactions if possible, or mocked for now as strict revenue calculation can be complex)
    // Here we'll just sum course price * students as a rough estimate if no transaction table access here, 
    // but better to use real transactions. Let's try to query 'transactions' table if it exists or return 0 for now.
    // Based on types, there is a Transaction type, so table likely exists.

    const { data: revenueData, error: revenueError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed');

    let totalRevenue = 0;
    if (!revenueError && revenueData) {
        totalRevenue = revenueData.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    }

    return {
        success: true,
        stats: {
            total: totalCourses || 0,
            published: publishedCourses || 0,
            totalStudents: totalStudents,
            totalRevenue: totalRevenue
        }
    };
}

export async function bulkDeleteCourses(courseIds: string[]): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
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

    if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Only admins can perform bulk operations' };
    }

    const { error, data } = await supabase
        .from('courses')
        .delete()
        .in('id', courseIds)
        .select('id');

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/courses');
    return { success: true, deletedCount: data?.length || 0 };
}

export async function bulkUpdateCourseStatus(courseIds: string[], status: CourseStatus): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
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

    if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Only admins can perform bulk operations' };
    }

    const { error, data } = await supabase
        .from('courses')
        .update({ status: status })
        .in('id', courseIds)
        .select('id');

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/courses');
    return { success: true, updatedCount: data?.length || 0 };
}

export async function exportCoursesToCSV(filters: any = {}): Promise<{ csv?: string; error?: string }> {
    const supabase = await createClient();

    let query = supabase
        .from('courses')
        .select(`
            *,
            category:categories(name),
            instructor:instructor_profiles(
                user:users(name)
            )
        `);

    if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
    }
    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
        return { error: error.message };
    }

    if (!data || data.length === 0) {
        return { csv: '' };
    }

    // Convert to CSV
    const headers = ['ID', 'Title', 'Instructor', 'Category', 'Price', 'Status', 'Level', 'Students', 'Rating', 'Created At'];

    const rows = data.map((course: any) => [
        course.id,
        `"${course.title.replace(/"/g, '""')}"`, // Escape quotes
        `"${course.instructor?.user?.name || 'Unknown'}"`,
        `"${course.category?.name || 'Uncategorized'}"`,
        course.price,
        course.status,
        course.level,
        course.total_students,
        course.rating,
        course.created_at
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map((row: any[]) => row.join(','))
    ].join('\n');

    return { csv: csvContent };
}

export async function exportCoursesToJSON(filters: any = {}): Promise<{ json?: string; error?: string }> {
    const supabase = await createClient();

    let query = supabase
        .from('courses')
        .select(`
            *,
            category:categories(name),
            instructor:instructor_profiles(
                user:users(name, email)
            )
        `);

    if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters.category && filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
    }
    if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
        return { error: error.message };
    }

    return { json: JSON.stringify(data, null, 2) };
}

export async function updateCourseOrder(updates: { id: string; serial_number: number }[]): Promise<ApiResponse<null>> {
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

    if (!profile || profile.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase.rpc('update_courses_order_bulk', {
        updates: updates
    });

    if (error) {
        console.error('Error updating course order:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/courses');
    return { success: true };
}

