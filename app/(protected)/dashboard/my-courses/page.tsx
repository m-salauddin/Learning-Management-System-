"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { SearchInput, StatsSkeleton, EmptyDataState, EmptyFilterState } from "@/components/dashboard/shared";
import { cn } from "@/lib/utils";

interface EnrolledCourse {
    course: {
        id: string;
        slug: string;
        title: string;
        thumbnail_url: string;
        total_lessons: number;
    };
    completed_lessons: number;
    progress_percentage: number;
    last_lesson_id: string | null;
}

export default function MyCoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "ongoing" | "upcoming" | "finished">("all");
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
                    completed_lessons,
                    progress_percentage,
                    last_lesson_id,
                    course:courses(
                        id,
                        slug,
                        title,
                        thumbnail_url,
                        total_lessons
                    )
                `)
                .eq('user_id', user.id)
                .in('status', ['active', 'success']);
            if (data) {
                setEnrolledCourses(data as unknown as EnrolledCourse[]);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const filteredCourses = enrolledCourses.filter(enrollment => {
        const matchesSearch = enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const progress = enrollment.progress_percentage || 0;
        
        let matchesStatus = true;
        if (filterStatus === "ongoing") matchesStatus = progress > 0 && progress < 100;
        if (filterStatus === "upcoming") matchesStatus = progress === 0;
        if (filterStatus === "finished") matchesStatus = progress === 100;

        return matchesSearch && matchesStatus;
    });

    const filterTabs = [
        { id: "all", label: "All Courses" },
        { id: "ongoing", label: "Ongoing" },
        { id: "upcoming", label: "Upcoming" },
        { id: "finished", label: "Finished" },
    ] as const;

    return (
        <div className="space-y-8 pb-32">
            <PageHeader
                title="My Courses"
                description="Manage and track your active learning progress"
                icon={GraduationCap}
                actions={
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search courses..."
                        className="w-full sm:w-64"
                    />
                }
            />

            {}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl w-fit">
                {filterTabs.map((tab) => {
                    const isActive = filterStatus === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={cn(
                                "relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 z-10",
                                isActive 
                                    ? "text-white dark:text-slate-950" 
                                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="my-courses-tab"
                                    className="absolute inset-0 bg-slate-950 dark:bg-white rounded-xl shadow-lg shadow-black/10"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <DashboardGrid cols={2}>
                    <StatsSkeleton count={4} />
                </DashboardGrid>
            ) : filteredCourses.length > 0 ? (
                <DashboardGrid cols={2} className="gap-x-12 gap-y-12">
                    {filteredCourses.map((enrollment) => (
                        <CourseProgressCard
                            key={enrollment.course.slug}
                            slug={enrollment.course.slug}
                            title={enrollment.course.title}
                            image={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop'}
                            progress={enrollment.progress_percentage || 0}
                            totalLessons={enrollment.course.total_lessons || 0}
                            completedLessons={enrollment.completed_lessons || 0}
                            lastLessonId={enrollment.last_lesson_id}
                        />
                    ))}
                </DashboardGrid>
            ) : (
                searchQuery || filterStatus !== "all" ? (
                    <EmptyFilterState 
                        searchTerm={searchQuery || filterStatus} 
                        onReset={() => {
                            setSearchQuery("");
                            setFilterStatus("all");
                        }}
                    />
                ) : (
                    <EmptyDataState
                        icon={BookOpen}
                        title="No active courses"
                        description="You haven't enrolled in any courses yet. Start your journey today!"
                        action={
                            <Link href="/courses" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                                Browse Catalog
                            </Link>
                        }
                    />
                )
            )}
        </div>
    );
}

