import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CoursePlayerClient } from "./ClientComponent";
interface PageProps {
    params: Promise<{ slug: string; lessonId: string }>;
}
export default async function LessonPage({ params }: PageProps) {
    const { slug, lessonId } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect(`/login?next=/courses/${slug}/learn/${lessonId}`);
    }
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
    const { data: currentLesson, error: lessonError } = await supabase
        .from('lessons')
        .select('id, title, is_free_preview, module_id')
        .eq('id', lessonId)
        .single();
    if (lessonError || !currentLesson) {
        return notFound();
    }
    const { data: asset } = await supabase
        .from('lesson_assets')
        .select('content_markdown, video_path')
        .eq('lesson_id', lessonId)
        .single();
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single();
    const { data: hasAccess } = await supabase.rpc('can_access_lesson_asset', { p_lesson_id: lessonId });
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
