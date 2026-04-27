"use client";
import { BookOpen, CheckCircle, Clock, Trophy, ChevronRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/ui/DashboardCard";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface StudentPanelProps {
    user: any;
    profile: any;
    stats: any;
    enrollments: any[];
}

export default function StudentPanel({ user, profile, stats, enrollments }: StudentPanelProps) {
    const fullName = profile?.fullName || user?.email || 'Student';
    const firstName = fullName.split(' ')[0];
    const inProgressCount = stats?.in_progress_courses || 0;
    const completedCount = stats?.completed_courses || 0;
    const hoursSpent = Math.round((stats?.total_learning_time || 0) / 3600);
    const avgScore = Math.round(stats?.avg_progress || 0);

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title={`Welcome back, ${firstName}! 👋`}
                description={`You have ${inProgressCount} courses in progress. Keep pushing forward!`}
                icon={GraduationCap}
                actions={
                    <Link 
                        href="/courses" 
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
                    >
                        Explore More
                    </Link>
                }
            />

            <DashboardGrid cols={4}>
                <StatsCard
                    title="In Progress"
                    value={inProgressCount}
                    icon={BookOpen}
                    description="Courses active"
                />
                <StatsCard
                    title="Completed"
                    value={completedCount}
                    icon={CheckCircle}
                    description="Successfully finished"
                />
                <StatsCard
                    title="Hours Spent"
                    value={`${hoursSpent}h`}
                    icon={Clock}
                    description="Learning time"
                />
                <StatsCard
                    title="Avg. Progress"
                    value={`${avgScore}%`}
                    icon={Trophy}
                    description="Course completion"
                />
            </DashboardGrid>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Continue Learning
                    </h3>
                    <Link href="/dashboard/my-courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                        View All <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {enrollments && enrollments.length > 0 ? (
                    <DashboardGrid cols={3}>
                        {enrollments.map((enrollment: any) => (
                            <DashboardCard 
                                key={enrollment.course.slug}
                                className="group"
                                contentClassName="p-0"
                            >
                                <div className="aspect-video bg-muted relative overflow-hidden">
                                    <img
                                        src={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop'}
                                        alt={enrollment.course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <Link 
                                            href={`/dashboard/my-courses/${enrollment.course.slug}`}
                                            className="w-full py-2 bg-primary text-primary-foreground text-center text-xs font-bold rounded-lg uppercase tracking-widest"
                                        >
                                            Resume Course
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{enrollment.course.title}</h4>
                                    <div className="mt-3 space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-500 uppercase tracking-widest">Progress</span>
                                            <span className="text-primary">{enrollment.progress_percentage || 0}%</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${enrollment.progress_percentage || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-4">
                                        {enrollment.completed_lessons || 0} / {enrollment.total_lessons || 0} lessons
                                    </p>
                                </div>
                            </DashboardCard>
                        ))}
                    </DashboardGrid>
                ) : (
                    <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/10">
                        <div className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-6">
                            <BookOpen className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">Start your journey today!</h4>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium">
                            Explore our world-class courses and start learning new skills from top instructors.
                        </p>
                        <Link href="/courses" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm">
                            Browse Catalog
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
