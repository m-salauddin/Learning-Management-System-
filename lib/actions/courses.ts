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
    query = query.range(offset, offset + pageSize - 1);
    const { data, error, count } = await query;
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
            milestones(
                *,
                modules(
                    *,
                    lessons(
                        *,
                        lesson_assets(*)
                    )
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
            milestones(
                *,
                modules(
                    *,
                    lessons(
                        *,
                        lesson_assets(*)
                    )
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
        .order('position', { foreignTable: 'milestones', ascending: true })
        .order('position', { foreignTable: 'milestones.modules', ascending: true })
        .order('position', { foreignTable: 'milestones.modules.lessons', ascending: true })
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
        milestones,
        modules,
        target_audience,
        instructor_ids,
        support_instructor_ids,
        coupons,
        community_facebook_url,
        community_whatsapp_url,
        bkash_automatic_enabled,
        manual_payment_methods,
        ...mainCourseData
    } = input;
    const fallbackInstructorId = mainCourseData.instructor_id === "_default" || !mainCourseData.instructor_id ? user.id : mainCourseData.instructor_id;
    const finalInstructorId = instructor_ids?.[0] || fallbackInstructorId;
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
    let finalSlug = mainCourseData.slug;
    if (!finalSlug) {
        finalSlug = mainCourseData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
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
        published: true,
        community_facebook_url,
        community_whatsapp_url,
        bkash_automatic_enabled: bkash_automatic_enabled || false,
        manual_payment_methods: manual_payment_methods || {}
    };
    const { data: rpcResult, error: rpcError } = await supabase
        .rpc('create_course_at_top', { input_data: coursePayload });
    if (rpcError) {
        console.error('Error creating course (RPC):', rpcError);
        return { success: false, error: rpcError.message };
    }
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
            technologies: p.tech_stack ? p.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
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
    if (milestones?.length) {
        for (const [msIndex, msInput] of milestones.entries()) {
            const { data: milestone, error: msError } = await supabase
                .from('milestones')
                .insert({
                    course_id: course.id,
                    title: msInput.title,
                    description: msInput.description || "",
                    position: msIndex
                })
                .select()
                .single();

            if (milestone && !msError && msInput.modules?.length) {
                for (const [mIndex, mInput] of msInput.modules.entries()) {
                    const { data: module, error: mError } = await supabase
                        .from('modules')
                        .insert({
                            course_id: course.id,
                            milestone_id: milestone.id,
                            title: mInput.title,
                            position: mIndex,
                            is_published: true
                        })
                        .select()
                        .single();

                    if (module && !mError && mInput.items?.length) {
                        for (const [iIndex, iInput] of mInput.items.entries()) {
                            const { data: lesson, error: lError } = await supabase
                                .from('lessons')
                                .insert({
                                    module_id: module.id,
                                    title: iInput.title,
                                    description: iInput.description || "",
                                    lesson_type: iInput.type,
                                    position: iIndex,
                                    is_published: true
                                })
                                .select()
                                .single();

                            if (lesson && !lError && (iInput.video_url || iInput.content || iInput.options)) {
                                await supabase
                                    .from('lesson_assets')
                                    .insert({
                                        lesson_id: lesson.id,
                                        video_path: iInput.video_url || "",
                                        markdown_content: iInput.content || "",
                                        resources: iInput.options ? { quiz_data: { options: iInput.options, correct_answer: iInput.correct_answer } } : []
                                    });
                            }
                        }
                    }
                }
            }
        }
    } else if (modules?.length) {
        
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

    
    let totalLessonsCount = 0;
    if (milestones?.length) {
        milestones.forEach(ms => {
            ms.modules?.forEach(mod => {
                totalLessonsCount += mod.items?.length || 0;
            });
        });
    } else if (modules?.length) {
        modules.forEach(mod => {
            totalLessonsCount += (mod as any).lessons?.length || 0;
        });
    }

    if (totalLessonsCount > 0) {
        await supabase
            .from('courses')
            .update({ total_lessons: totalLessonsCount })
            .eq('id', course.id);
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
        milestones,
        modules,
        target_audience,
        instructor_ids,
        support_instructor_ids,
        coupons,
        community_facebook_url,
        community_whatsapp_url,
        bkash_automatic_enabled,
        manual_payment_methods,
        ...updateData
    } = input;
    const { instructor_id: _instId, ...safeUpdateData } = updateData as any;
    const finalInstructorId = instructor_ids?.[0] || course.instructor_id;
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
            community_facebook_url,
            community_whatsapp_url,
            bkash_automatic_enabled,
            manual_payment_methods
        })
        .eq('id', id)
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
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
    if (projects !== undefined) {
        await supabase.from('course_projects').delete().eq('course_id', id);
        if (projects && projects.length > 0) {
            const projectData = projects.map((p, index) => ({
                course_id: id,
                title: p.title,
                description: p.description,
                thumbnail_url: p.image_url || "",
                technologies: p.tech_stack ? p.tech_stack.split(',').map(s => s.trim()).filter(Boolean) : [],
                order_index: index,
                is_public: true
            }));
            await supabase.from('course_projects').insert(projectData);
        }
    }
    if (milestones !== undefined) {
        
        await supabase.from('milestones').delete().eq('course_id', id);
        
        await supabase.from('modules').delete().eq('course_id', id);

        if (milestones && milestones.length > 0) {
            for (const [msIndex, msInput] of milestones.entries()) {
                const { data: milestone } = await supabase
                    .from('milestones')
                    .insert({
                        course_id: id,
                        title: msInput.title,
                        description: msInput.description || "",
                        position: msIndex
                    })
                    .select()
                    .single();

                if (milestone && msInput.modules) {
                    for (const [mIndex, mInput] of msInput.modules.entries()) {
                        const { data: moduleRow } = await supabase
                            .from('modules')
                            .insert({
                                course_id: id,
                                milestone_id: milestone.id,
                                title: mInput.title,
                                position: mIndex,
                                is_published: true
                            })
                            .select()
                            .single();

                        if (moduleRow && mInput.items) {
                            for (const [iIndex, iInput] of mInput.items.entries()) {
                                const { data: lessonRow } = await supabase
                                    .from('lessons')
                                    .insert({
                                        module_id: moduleRow.id,
                                        title: iInput.title,
                                        description: iInput.description || "",
                                        lesson_type: iInput.type,
                                        position: iIndex,
                                        is_published: true
                                    })
                                    .select()
                                    .single();

                                if (lessonRow && (iInput.video_url || iInput.content || iInput.options)) {
                                    await supabase
                                        .from('lesson_assets')
                                        .insert({
                                            lesson_id: lessonRow.id,
                                            video_path: iInput.video_url || "",
                                            markdown_content: iInput.content || "",
                                            resources: iInput.options ? { quiz_data: { options: iInput.options, correct_answer: iInput.correct_answer } } : []
                                        });
                                }
                            }
                        }
                    }
                }
            }
        }
    } else if (modules !== undefined) {
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

    
    const { data: moduleList } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', id);

    if (moduleList && moduleList.length > 0) {
        const modIds = moduleList.map(m => m.id);
        const { count } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .in('module_id', modIds);

        if (count !== null) {
            await supabase
                .from('courses')
                .update({ total_lessons: count || 0 })
                .eq('id', id);
        }
    } else {
        
        await supabase
            .from('courses')
            .update({ total_lessons: 0 })
            .eq('id', id);
    }

    revalidatePath(`/courses/${updated.slug}`);
    revalidatePath('/dashboard/courses');
    return { success: true, data: updated };
}
export async function deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
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
export async function publishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return updateCourse({ id: courseId, status: 'published' });
}
export async function unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return updateCourse({ id: courseId, status: 'draft' });
}
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
    const { count: totalCourses, error: totalError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
    if (totalError) {
        return { success: false, error: totalError.message };
    }
    const { count: publishedCourses, error: publishedError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');
    if (publishedError) {
        return { success: false, error: publishedError.message };
    }
    const { data: studentsData, error: studentsError } = await supabase
        .from('courses')
        .select('total_students');
    if (studentsError) {
        return { success: false, error: studentsError.message };
    }
    const totalStudents = studentsData.reduce((sum, course) => sum + (course.total_students || 0), 0);
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
    const headers = ['ID', 'Title', 'Instructor', 'Category', 'Price', 'Status', 'Level', 'Students', 'Rating', 'Created At'];
    const rows = data.map((course: any) => [
        course.id,
        `"${course.title.replace(/"/g, '""')}"`,
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

export async function getAllCoursesList(): Promise<ApiResponse<{ id: string; title: string }[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');
    
    if (error) {
        return { success: false, error: error.message };
    }
    
    return { success: true, data };
}
