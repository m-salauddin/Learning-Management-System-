import { requireAuth, getUserAndRole } from "@/lib/auth/server";
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AdminPanel from "@/components/dashboard/panels/AdminPanel";
import StudentPanel from "@/components/dashboard/panels/StudentPanel";
import TeacherPanel from "@/components/dashboard/panels/TeacherPanel";
import ModeratorPanel from "@/components/dashboard/panels/ModeratorPanel";

export default async function DashboardPage() {
    const { user, role, profile } = await requireAuth();
    const supabase = await createSupabaseServerClient();

    if (role === 'admin') {
        return <AdminPanel />;
    }

    if (role === 'teacher') {
        const { data: stats } = await supabase.rpc('get_instructor_dashboard_stats');
        const { data: myCourses } = await supabase
            .from('courses')
            .select(`
                *,
                enrollments:enrollments(count)
            `)
            .eq('instructor_id', user?.id)
            .order('created_at', { ascending: false });

        return <TeacherPanel stats={stats} myCourses={myCourses || []} />;
    }

    if (role === 'student' || !role) {
        const { data: stats } = await supabase.rpc('get_student_dashboard_stats');
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select(`
                *,
                course:courses(*)
            `)
            .eq('user_id', user?.id)
            .eq('status', 'active')
            .order('last_accessed_at', { ascending: false })
            .limit(3);

        return (
            <StudentPanel 
                user={user} 
                profile={profile} 
                stats={stats} 
                enrollments={enrollments || []} 
            />
        );
    }

    if (role === 'moderator') {
        const { data: stats } = await supabase.rpc('get_moderator_dashboard_stats');
        return <ModeratorPanel stats={stats} />;
    }

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
    );
}
