import { getUserAndRole } from '@/lib/auth/server';
import { BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function StudentPanel() {
    const { user, profile } = await getUserAndRole();
    const supabase = await createClient();

    // Fetch Student Stats via RPC
    const { data: stats } = await supabase.rpc('get_student_dashboard_stats');

    // Fetch Enrolled Courses with progress, explicitly invoking joins
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

    const fullName = profile?.fullName || user?.email || 'Student';
    const firstName = fullName.split(' ')[0];

    const inProgressCount = stats?.in_progress_courses || 0;
    const completedCount = stats?.completed_courses || 0;
    const hoursSpent = Math.round((stats?.total_learning_time || 0) / 3600); // Convert seconds to hours
    const avgScore = Math.round(stats?.avg_progress || 0);

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome back, {firstName}! 👋
                </h1>
                <p className="text-muted-foreground">
                    You have {inProgressCount} courses in progress. Keep pushing forward!
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">In Progress</p>
                            <p className="text-2xl font-bold">{inProgressCount}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-2xl font-bold">{completedCount}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Hours Spent</p>
                            <p className="text-2xl font-bold">{hoursSpent}h</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Score</p>
                            <p className="text-2xl font-bold">{avgScore}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Learning */}
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Continue Learning</h3>
                    <Link href="/dashboard/courses" className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors">
                        View All Courses
                    </Link>
                </div>

                {enrollments && enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {enrollments.map((enrollment: any) => (
                            <div key={enrollment.course.slug} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                                <div className="aspect-video bg-muted relative">
                                    <img
                                        src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop'}
                                        alt={enrollment.course.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold line-clamp-1">{enrollment.course.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {enrollment.completed_lessons || 0} of {enrollment.total_lessons || 0} lessons
                                    </p>
                                    <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${enrollment.progress_percentage || 0}%` }}
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <Link href={`/courses/${enrollment.course.slug}/learn`} className="text-xs font-medium text-primary hover:underline">
                                            Continue Learning
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-card/30">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <h4 className="text-lg font-semibold">No active courses</h4>
                        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                            You haven't enrolled in any courses yet. Browse our catalog to find your next skill.
                        </p>
                        <Link href="/courses" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
                            Explore Catalog
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
