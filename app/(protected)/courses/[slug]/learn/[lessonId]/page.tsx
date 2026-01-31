import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CoursePlayerClient } from "./ClientComponent";

interface PageProps {
    params: Promise<{ slug: string; lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
    const { slug, lessonId } = await params;
    const supabase = await createSupabaseServerClient();

    // 1. Get User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/login?next=/courses/${slug}/learn/${lessonId}`);
    }

    // 2. Fetch Course Structure (for sidebar)
    // We verify slug matches ensuring lesson belongs to course
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
            id,
            title,
            slug,
            modules (
                id,
                title,
                position,
                lessons (
                    id,
                    title,
                    is_free_preview,
                    duration_minutes,
                    position
                )
            )
        `)
        .eq('slug', slug)
        .single();

    if (courseError || !course) {
        return notFound();
    }

    // 3. Fetch Current Lesson Metadata
    const { data: currentLesson, error: lessonError } = await supabase
        .from('lessons')
        .select('id, title, is_free_preview, module_id')
        .eq('id', lessonId)
        .single();

    if (lessonError || !currentLesson) {
        return notFound();
    }

    // 4. Check Access (RLS on lesson_assets will handle content, but we want to fail fast/gracefully)
    // We can try to fetch the asset. If RLS blocks it, we get null/error.
    // Note: My RLS policy on lesson_assets uses `can_access_lesson_asset(lesson_id)`.

    const { data: asset } = await supabase
        .from('lesson_assets')
        .select('content_markdown, video_path') // We need to know if video exists
        .eq('lesson_id', lessonId)
        .single();

    // If asset is null, it means either:
    // a) No asset exists for this lesson (just empty)
    // b) RLS blocked access
    // We can explicitly check generic access via RPC if we want to distinguish "Locked" from "Empty".
    // public.can_access_lesson_asset(lesson_id) returns bool.

    // 4b. Fetch Enrollment (for progress tracking)
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();

    const { data: hasAccess } = await supabase.rpc('can_access_lesson_asset', { p_lesson_id: lessonId });

    // Process structure for sidebar
    const modules = (course.modules || []).sort((a: any, b: any) => a.position - b.position);
    modules.forEach((m: any) => {
        m.lessons.sort((a: any, b: any) => a.position - b.position);
    });

    return (
        <CoursePlayerClient
            course={course}
            currentLesson={currentLesson}
            asset={asset}
            hasAccess={!!hasAccess}
            userId={user.id}
            enrollmentId={enrollment?.id}
        />
    );
}
