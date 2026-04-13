import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CoursePlayerClient } from "./ClientComponent";

interface PageProps {
    params: Promise<{ slug: string; lessonId: string }>;
}

export default async function MyCourseLessonPage({ params }: PageProps) {
    const { slug, lessonId } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=/dashboard/my-courses/${slug}/${lessonId}`);
    }

    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select(`
            id,
            title,
            slug,
            milestones (
                id,
                title,
                position,
                modules (
                    id,
                    title,
                    position,
                    lessons (
                        id,
                        title,
                        lesson_type,
                        is_free_preview,
                        duration_minutes,
                        position
                    )
                )
            ),
            modules (
                id,
                title,
                position,
                lessons (
                    id,
                    title,
                    lesson_type,
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
        .select('id, title, is_free_preview, module_id, lesson_type')
        .eq('id', lessonId)
        .single();

    if (lessonError || !currentLesson) {
        return notFound();
    }

    const { data: asset } = await supabase
        .from('lesson_assets')
        .select('content_markdown, video_path, resources, video_duration_seconds')
        .eq('lesson_id', lessonId)
        .single();

    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .in('status', ['active', 'success'])
        .maybeSingle();

    const hasAccess = !!enrollment || currentLesson.is_free_preview;
    const rawMilestones = course.milestones || [];
    const milestones = rawMilestones.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    
    milestones.forEach((ms: any) => {
        if (ms.modules) {
            ms.modules.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
            ms.modules.forEach((m: any) => {
                if (m.lessons) {
                    m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                }
            });
        }
    });

    const modules = (course.modules || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    modules.forEach((m: any) => {
        if (m.lessons) {
            m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        }
    });

    // Update course object with sorted data
    course.milestones = milestones;
    course.modules = modules;

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
