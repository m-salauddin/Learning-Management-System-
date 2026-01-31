import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function TeacherPanel() {
    const supabase = await createSupabaseServerClient();

    // Fetch Instructor Stats via RPC
    const { data: stats } = await supabase.rpc('get_instructor_dashboard_stats');

    // Fetch Instructor Courses
    const { data: courses } = await supabase
        .from('courses')
        .select(`
            *,
            enrollments:enrollments(count)
        `)
        .order('created_at', { ascending: false });
    // RPC get_instructor_dashboard_stats already checks for teacher role/uid on server side for stats.
    // For courses query, RLS will filter to only show own courses if configured correctly, 
    // OR we should filter by instructor_id manually if RLS isn't implicit for SELECT on 'courses'. 
    // The policy "Public can read published courses" allows reading published ones.
    // The policy "Instructors can read own courses" allows reading drafts too?
    // Let's rely on standard query. We might want to filter if needed, but RLS usually handles it.
    // Wait, 'courses' table allows public read of published. So we might get ALL published courses if we don't filter.
    // So we strictly need to filter by instructor_id. BUT we don't have the user ID easily here without calling getUser.
    // Let's get getUser.

    const { data: { user } } = await supabase.auth.getUser();

    // Re-fetch courses with instructor filter
    const { data: myCourses } = await supabase
        .from('courses')
        .select(`
            *,
            enrollments:enrollments(count)
        `)
        .eq('instructor_id', user?.id)
        .order('created_at', { ascending: false });

    const totalCourses = stats?.total_courses || 0;
    const totalStudents = stats?.total_students || 0;
    const totalEarnings = stats?.total_revenue || 0;
    const avgRating = stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : '—';

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Instructor Dashboard 🎓
                </h1>
                <p className="text-muted-foreground">
                    Manage your courses, track performance, and grow your audience.
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
                            <p className="text-sm text-muted-foreground">Total Courses</p>
                            <p className="text-2xl font-bold">{totalCourses}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Students</p>
                            <p className="text-2xl font-bold">{totalStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                            <p className="text-2xl font-bold">৳{totalEarnings.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Rating</p>
                            <p className="text-2xl font-bold">{avgRating}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/dashboard/courses/new" className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
                        <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">Create New Course</h4>
                        <p className="text-sm text-muted-foreground">Start building your next course and share your knowledge.</p>
                    </Link>
                    <div className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer group">
                        <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">View Analytics</h4>
                        <p className="text-sm text-muted-foreground">Track your course performance and student engagement.</p>
                    </div>
                </div>
            </div>

            {/* My Courses */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">My Courses</h3>
                {!myCourses || myCourses.length === 0 ? (
                    <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-card/30">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <h4 className="text-lg font-semibold">No courses yet</h4>
                        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                            Create your first course and start sharing your expertise with learners.
                        </p>
                        <Link href="/dashboard/courses/new" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Create Course
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myCourses.map((course) => (
                            <Link href={`/dashboard/courses/${course.id}`} key={course.id} className="p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group block">
                                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">{course.title || 'Untitled Course'}</h4>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${course.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {course.status}
                                    </span>
                                    <p className="text-sm text-muted-foreground">{course.enrollments?.[0]?.count || 0} students</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
