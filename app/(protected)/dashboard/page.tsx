import { getUserAndRole } from '@/lib/auth/server';
import StudentPanel from '@/components/dashboard/panels/StudentPanel';
import TeacherPanel from '@/components/dashboard/panels/TeacherPanel';
import AdminPanel from '@/components/dashboard/panels/AdminPanel';
import ModeratorPanel from '@/components/dashboard/panels/ModeratorPanel';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const { user, role } = await getUserAndRole();

    if (!user) {
        redirect('/login');
    }

    return (
        <>
            {role === 'student' && <StudentPanel />}
            {role === 'teacher' && <TeacherPanel />}
            {role === 'moderator' && <ModeratorPanel />}
            {role === 'admin' && <AdminPanel />}
        </>
    );
}
