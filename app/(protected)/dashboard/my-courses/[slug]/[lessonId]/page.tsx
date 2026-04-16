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
            *,
            milestones (
                *,
                modules (
                    *,
                    lessons:module_lessons(*),
                    quizzes:module_quizzes(*),
                    assignments:module_assignments(*)
                )
            ),
            modules (
                *,
                lessons:module_lessons(*),
                quizzes:module_quizzes(*),
                assignments:module_assignments(*)
            )
        `)
        .eq('slug', slug)
        .single();

    if (courseError || !course) {
        return notFound();
    }

    let currentLesson: any = null;
    let lessonError: any = null;

    if (lessonId.startsWith('assessments-')) {
        const moduleId = lessonId.replace('assessments-', '');
        const { data: moduleData, error: modError } = await supabase
            .from('modules')
            .select('*')
            .eq('id', moduleId)
            .single();
        
        if (modError || !moduleData) return notFound();

        currentLesson = {
            id: lessonId,
            module_id: moduleId,
            title: "Mission Assessment Protocol",
            lesson_type: 'assessment_center',
            is_free_preview: false,
            is_published: true
        };
    } else if (lessonId.startsWith('quiz-')) {
        const quizId = lessonId.replace('quiz-', '');
        const { data: quizData, error: qError } = await supabase
            .from('module_quizzes')
            .select('*')
            .eq('id', quizId)
            .single();
        
        if (qError || !quizData) return notFound();

        currentLesson = {
            id: lessonId,
            module_id: quizData.module_id,
            title: quizData.title,
            lesson_type: 'quiz',
            is_free_preview: false,
            is_published: true
        };
    } else if (lessonId.startsWith('assignment-')) {
        const assignmentId = lessonId.replace('assignment-', '');
        const { data: assignmentData, error: aError } = await supabase
            .from('module_assignments')
            .select('*')
            .eq('id', assignmentId)
            .single();
        
        if (aError || !assignmentData) return notFound();

        currentLesson = {
            id: lessonId,
            module_id: assignmentData.module_id,
            title: assignmentData.title,
            lesson_type: 'assignment',
            is_free_preview: false,
            is_published: true
        };
    } else {
        const { data: lesson, error: err } = await supabase
            .from('module_lessons')
            .select('*')
            .eq('id', lessonId)
            .single();
        currentLesson = lesson;
        lessonError = err;
    }

    if (lessonError || !currentLesson) {
        return notFound();
    }

    const { data: asset } = await supabase
        .from('lesson_assets')
        .select('*')
        .eq('lesson_id', currentLesson.id)
        .single();

    const { data: quizzes } = await supabase
        .from('module_quizzes')
        .select('*')
        .eq('module_id', currentLesson.module_id)
        .order('position', { ascending: true });

    const { data: assignments } = await supabase
        .from('module_assignments')
        .select('*')
        .eq('module_id', currentLesson.module_id)
        .order('position', { ascending: true });

    let quizData = null;
    let assignmentData = null;

    if (lessonId.startsWith('quiz-')) {
        quizData = await supabase.from('module_quizzes').select('*').eq('id', lessonId.replace('quiz-', '')).single().then(r => r.data);
    } else if (lessonId.startsWith('assignment-')) {
        assignmentData = await supabase.from('module_assignments').select('*').eq('id', lessonId.replace('assignment-', '')).single().then(r => r.data);
    } else if (!lessonId.startsWith('assessments-')) {
        const { data: siblingLessons } = await supabase
            .from('module_lessons')
            .select('id')
            .eq('module_id', currentLesson.module_id)
            .eq('lesson_type', currentLesson.lesson_type)
            .order('position', { ascending: true });
        
        const lessonIndex = siblingLessons?.findIndex(l => l.id === lessonId) ?? 0;
        quizData = quizzes?.[lessonIndex] || null;
        assignmentData = assignments?.[lessonIndex] || null;
    }

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
                if (m.quizzes) {
                    m.quizzes.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                }
                if (m.assignments) {
                    m.assignments.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                }
            });
        }
    });

    const modules = (course.modules || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    modules.forEach((m: any) => {
        if (m.lessons) {
            m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        }
        if (m.quizzes) {
            m.quizzes.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        }
        if (m.assignments) {
            m.assignments.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        }
    });

    course.milestones = milestones;
    course.modules = modules;

    return (
        <CoursePlayerClient
            course={course}
            currentLesson={currentLesson}
            asset={asset}
            quiz={quizData}
            assignment={assignmentData}
            hasAccess={!!hasAccess}
            userId={user.id}
            enrollmentId={enrollment?.id}
        />
    );
}
