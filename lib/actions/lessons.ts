"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    Module, Lesson, LessonAsset, LessonWithAsset,
    CreateModuleInput, CreateLessonInput, UpdateLessonAssetInput,
    ApiResponse
} from "@/types/lms";
export async function createModule(input: CreateModuleInput): Promise<ApiResponse<Module>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: course } = await supabase
        .from('courses')
        .select('instructor_id')
        .eq('id', input.course_id)
        .single();
    if (!course || course.instructor_id !== user.id) {
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (profile?.role !== 'admin') {
            return { success: false, error: 'Unauthorized' };
        }
    }
    const { data: maxPos } = await supabase
        .from('modules')
        .select('position')
        .eq('course_id', input.course_id)
        .order('position', { ascending: false })
        .limit(1)
        .single();
    const position = input.position ?? (maxPos?.position ?? -1) + 1;
    const { data, error } = await supabase
        .from('modules')
        .insert({
            ...input,
            position
        })
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/courses');
    return { success: true, data };
}
export async function updateModule(
    moduleId: string,
    updates: Partial<Pick<Module, 'title' | 'description' | 'position' | 'is_published'>>
): Promise<ApiResponse<Module>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data, error } = await supabase
        .from('modules')
        .update(updates)
        .eq('id', moduleId)
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/courses');
    return { success: true, data };
}
export async function deleteModule(moduleId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', moduleId);
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/courses');
    return { success: true };
}
export async function reorderModules(
    courseId: string,
    moduleOrders: { id: string; position: number }[]
): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    for (const { id, position } of moduleOrders) {
        const { error } = await supabase
            .from('modules')
            .update({ position })
            .eq('id', id)
            .eq('course_id', courseId);
        if (error) {
            return { success: false, error: error.message };
        }
    }
    revalidatePath('/dashboard/courses');
    return { success: true };
}
export async function createLesson(input: CreateLessonInput): Promise<ApiResponse<Lesson>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: maxPos } = await supabase
        .from('module_lessons')
        .select('position')
        .eq('module_id', input.module_id)
        .order('position', { ascending: false })
        .limit(1)
        .single();
    const position = input.position ?? (maxPos?.position ?? -1) + 1;
    const { data, error } = await supabase
        .from('module_lessons')
        .insert({
            ...input,
            position
        })
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    await supabase
        .from('lesson_assets')
        .insert({ lesson_id: data.id });
    revalidatePath('/dashboard/courses');
    return { success: true, data };
}
export async function updateLesson(
    lessonId: string,
    updates: Partial<Pick<Lesson, 'title' | 'description' | 'lesson_type' | 'position' | 'duration_minutes' | 'is_free_preview' | 'is_published'>>
): Promise<ApiResponse<Lesson>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('module_lessons')
        .update(updates)
        .eq('id', lessonId)
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/courses');
    return { success: true, data };
}
export async function deleteLesson(lessonId: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase
        .from('module_lessons')
        .delete()
        .eq('id', lessonId);
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/courses');
    return { success: true };
}
export async function reorderLessons(
    moduleId: string,
    lessonOrders: { id: string; position: number }[]
): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    for (const { id, position } of lessonOrders) {
        const { error } = await supabase
            .from('module_lessons')
            .update({ position })
            .eq('id', id)
            .eq('module_id', moduleId);
        if (error) {
            return { success: false, error: error.message };
        }
    }
    revalidatePath('/dashboard/courses');
    return { success: true };
}
export async function updateLessonAsset(input: UpdateLessonAssetInput): Promise<ApiResponse<LessonAsset>> {
    const supabase = await createClient();
    const { lesson_id, ...updates } = input;
    const { data, error } = await supabase
        .from('lesson_assets')
        .upsert({
            lesson_id,
            ...updates
        })
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    revalidatePath('/dashboard/courses');
    return { success: true, data };
}
export async function getLessonWithAsset(lessonId: string): Promise<ApiResponse<LessonWithAsset>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: lesson, error: lessonError } = await supabase
        .from('module_lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
    if (lessonError) {
        return { success: false, error: lessonError.message };
    }
    const { data: asset, error: assetError } = await supabase
        .from('lesson_assets')
        .select('*')
        .eq('lesson_id', lessonId)
        .single();
    if (assetError && assetError.code !== 'PGRST116') {
        return { success: false, error: 'You do not have access to this lesson content' };
    }
    return {
        success: true,
        data: { ...lesson, asset: asset || undefined }
    };
}
export async function getSignedVideoUrl(lessonId: string): Promise<ApiResponse<string>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: canAccess } = await supabase
        .rpc('can_access_lesson', { p_lesson_id: lessonId });
    if (!canAccess) {
        return { success: false, error: 'You do not have access to this video' };
    }
    const { data: asset, error: assetError } = await supabase
        .from('lesson_assets')
        .select('video_path')
        .eq('lesson_id', lessonId)
        .single();
    if (assetError || !asset?.video_path) {
        return { success: false, error: 'Video not found' };
    }
    const { data: signedUrl, error: urlError } = await supabase
        .storage
        .from('course-videos')
        .createSignedUrl(asset.video_path, 3600);
    if (urlError) {
        return { success: false, error: 'Failed to generate video URL' };
    }
    return { success: true, data: signedUrl.signedUrl };
}
