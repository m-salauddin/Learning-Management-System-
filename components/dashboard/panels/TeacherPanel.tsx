"use client";
import { BookOpen, Users, DollarSign, TrendingUp, ChevronRight, PlusCircle, BarChart3, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/ui/DashboardCard";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface TeacherPanelProps {
    stats: any;
    myCourses: any[];
}

export default function TeacherPanel({ stats, myCourses }: TeacherPanelProps) {
    const totalCourses = stats?.total_courses || 0;
    const totalStudents = stats?.total_students || 0;
    const totalEarnings = stats?.total_revenue || 0;
    const avgRating = stats?.avg_rating ? Number(stats.avg_rating).toFixed(1) : '—';

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Instructor Dashboard"
                description="Manage your courses, track performance, and grow your audience."
                icon={GraduationCap}
                actions={
                    <Link 
                        href="/dashboard/courses/new" 
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Create Course
                    </Link>
                }
            />

            <DashboardGrid cols={4}>
                <StatsCard
                    title="Total Courses"
                    value={totalCourses}
                    icon={BookOpen}
                    description="Live and draft"
                    variant="blue"
                />
                <StatsCard
                    title="Total Students"
                    value={totalStudents}
                    icon={Users}
                    description="Enrolled learners"
                    variant="emerald"
                />
                <StatsCard
                    title="Total Earnings"
                    value={`৳${totalEarnings.toLocaleString()}`}
                    icon={DollarSign}
                    description="Life-time revenue"
                    variant="amber"
                />
                <StatsCard
                    title="Avg. Rating"
                    value={avgRating}
                    icon={TrendingUp}
                    description="Student feedback"
                    variant="violet"
                />
            </DashboardGrid>

            {}
            <DashboardGrid cols={2}>
                <DashboardCard 
                    title="Course Builder" 
                    description="Start building your next masterpiece"
                    className="hover:border-primary/30 transition-all group"
                >
                    <Link href="/dashboard/courses/new" className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Launch New Course</span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </Link>
                </DashboardCard>
                <DashboardCard 
                    title="Analytics Center" 
                    description="Deep dive into your performance"
                    className="hover:border-primary/30 transition-all group"
                >
                    <Link href="/dashboard/analytics" className="flex items-center justify-between">
                        <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">View Detailed Reports</span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    </Link>
                </DashboardCard>
            </DashboardGrid>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        My Courses
                    </h3>
                    <Link href="/dashboard/instructor-courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                        View All <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {!myCourses || myCourses.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/10">
                        <div className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-6">
                            <BookOpen className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">No courses yet</h4>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium">
                            Create your first course and start sharing your expertise with learners.
                        </p>
                        <Link href="/dashboard/courses/new" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm text-center">
                            Create Course
                        </Link>
                    </div>
                ) : (
                    <DashboardGrid cols={3}>
                        {myCourses.map((course) => (
                            <DashboardCard 
                                key={course.id}
                                className="group"
                                contentClassName="p-0"
                            >
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    {course.thumbnail_url ? (
                                        <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <BookOpen className="w-8 h-8 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border backdrop-blur-md ${course.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-primary transition-colors">{course.title || 'Untitled Course'}</h4>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{course.enrollments?.[0]?.count || 0} students</span>
                                        </div>
                                        <Link href={`/dashboard/courses/${course.id}`} className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            </DashboardCard>
                        ))}
                    </DashboardGrid>
                )}
            </div>
        </div>
    );
}
