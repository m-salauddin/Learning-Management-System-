import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CoursePlayerProvider } from "./CoursePlayerContext";
import { CoursePlayerShell } from "./CoursePlayerShell";

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}


export default async function CourseSlugLayout({ children, params }: LayoutProps) {
    const { slug } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/login?next=/dashboard/my-courses/${slug}`);
    }

    const { data: course } = await supabase
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

    if (!course) {
        return <>{children}</>;
    }


    const rawMilestones = course.milestones || [];
    const milestones = rawMilestones.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    milestones.forEach((ms: any) => {
        if (ms.modules) {
            ms.modules.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
            ms.modules.forEach((m: any) => {
                if (m.lessons) m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                if (m.quizzes) m.quizzes.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
                if (m.assignments) m.assignments.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
            });
        }
    });
    const modules = (course.modules || []).sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    modules.forEach((m: any) => {
        if (m.lessons) m.lessons.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        if (m.quizzes) m.quizzes.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        if (m.assignments) m.assignments.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
    });
    course.milestones = milestones;
    course.modules = modules;


    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .in('status', ['active', 'success'])
        .maybeSingle();

    const hasAccess = !!enrollment;

    return (
        <CoursePlayerProvider
            course={course}
            userId={user.id}
            enrollmentId={enrollment?.id}
            hasAccess={hasAccess}
        >
            <CoursePlayerShell>
                {children}
            </CoursePlayerShell>
        </CoursePlayerProvider>
    );
}
