import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { CoursePlayerClient } from "./ClientComponent";

export const dynamic = 'force-dynamic';
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

    // Fetch course for lock enforcement + lesson matching
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

    // ── Resolve currentLesson based on lessonId format ──
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

    // Helper to get actual DB ID (strip prefixes)
    const dbId = currentLesson.id.replace(/^(assignment-|quiz-|assessments-)/, '');

    // Fetch lesson-specific data
    const { data: asset } = await supabase
        .from('lesson_assets')
        .select('*')
        .eq('lesson_id', dbId)
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
        if (currentLesson.lesson_type === 'quiz') {
            const matchingQuiz = quizzes?.find((q: any) => q.position === currentLesson.position);
            quizData = matchingQuiz || quizzes?.[0] || null;
        }
        if (currentLesson.lesson_type === 'assignment') {
            const matchingAssignment = assignments?.find((a: any) => a.position === currentLesson.position)
                || assignments?.find((a: any) => a.title?.toLowerCase().includes(currentLesson.title?.toLowerCase()?.split(':')?.[0]))
                || assignments?.[0] || null;
            assignmentData = matchingAssignment;
        }
    }

    // ── Server-side sequential lock enforcement ──
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .in('status', ['active', 'success'])
        .maybeSingle();

    if (enrollment && !currentLesson.is_free_preview) {
        // Sort for consistent ordering
        const rawMilestones = course.milestones || [];
        const milestones = rawMilestones.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        milestones.forEach((ms: any) => {
            if (ms.modules) {
                ms.modules.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                ms.modules.forEach((m: any) => {
                    if (m.lessons) m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                });
            }
        });
        const modules = (course.modules || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        modules.forEach((m: any) => { if (m.lessons) m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0)); });

        const structural = milestones.length > 0 ? milestones : [{ id: 'default', title: "Curriculum", modules }];
        const allLessonsFlat: { id: string; dbId: string }[] = [];
        
        structural.forEach((ms: any) => {
            (ms.modules || []).forEach((mod: any) => {
                // 1. Lessons
                const lessons = (mod.lessons || []).filter((l: any) => 
                    l.lesson_type !== 'quiz' && l.lesson_type !== 'assignment'
                );
                lessons.forEach((lesson: any) => allLessonsFlat.push({ id: lesson.id, dbId: lesson.id }));
                
                // 2. Quizzes (Assessment Center)
                if ((mod.quizzes || []).length > 0) {
                    allLessonsFlat.push({ id: `assessments-${mod.id}`, dbId: `assessments-${mod.id}` });
                }
                
                // 3. Assignments
                (mod.assignments || []).forEach((assignment: any) => {
                    allLessonsFlat.push({ id: `assignment-${assignment.id}`, dbId: assignment.id });
                });
            });
        });

        const currentIdx = allLessonsFlat.findIndex(l => l.id === lessonId);
        if (currentIdx > 0) {
            const previousLessons = allLessonsFlat.slice(0, currentIdx);
            const previousDbIds = previousLessons.map(l => l.dbId);
            
            // Check standard lesson progress
            const { data: completedProgress } = await supabase
                .from('lesson_progress')
                .select('lesson_id')
                .eq('user_id', user.id)
                .eq('enrollment_id', enrollment.id)
                .eq('is_completed', true)
                .in('lesson_id', previousDbIds);

            const completedSet = new Set((completedProgress || []).map((p: any) => p.lesson_id));
            
            // Check quiz submissions for assessment centers
            const quizDbIds = previousLessons.filter(l => l.id.startsWith('assessments-')).map(l => l.dbId);
            if (quizDbIds.length > 0) {
                // For assessment centers, we check if at least one quiz in that module was submitted
                // or we could check if all were. The current logic in PlayerSidebar uses `lesson_id` as the key.
                const { data: quizSubs } = await supabase
                    .from('quiz_submissions')
                    .select('lesson_id')
                    .eq('user_id', user.id)
                    .in('lesson_id', quizDbIds);
                quizSubs?.forEach(qs => completedSet.add(qs.lesson_id));
            }

            // Check assignment submissions
            const assignmentDbIds = previousLessons.filter(l => l.id.startsWith('assignment-')).map(l => l.dbId);
            if (assignmentDbIds.length > 0) {
                const { data: assignmentSubs } = await supabase
                    .from('assignment_submissions')
                    .select('lesson_id')
                    .eq('user_id', user.id)
                    .in('lesson_id', assignmentDbIds);
                assignmentSubs?.forEach(as => completedSet.add(as.lesson_id));
            }

            const allPrevDone = previousLessons.every(l => completedSet.has(l.dbId));

            if (!allPrevDone) {
                const firstIncomplete = previousLessons.find(l => !completedSet.has(l.dbId))?.id || allLessonsFlat[0].id;
                redirect(`/dashboard/my-courses/${slug}/${firstIncomplete}`);
            }
        }
    }

    return (
        <CoursePlayerClient
            currentLesson={currentLesson}
            asset={asset}
            quiz={quizData}
            assignment={assignmentData}
        />
    );
}
