"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import {
    BookOpen,
    Loader2,
    Search,
    GraduationCap,
    ChevronRight,
    TrendingUp,
    CheckCircle2,
    Clock,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
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
    status: string;
}

type FilterStatus = "all" | "ongoing" | "upcoming" | "finished";

export default function MyCoursesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            const { data } = await supabase
                .from("enrollments")
                .select(
                    `
                    status,
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
                `
                )
                .eq("user_id", user.id)
                .in("status", ["active", "success", "pending"]);
            if (data) {
                setEnrolledCourses(data as unknown as EnrolledCourse[]);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const filteredCourses = enrolledCourses.filter((enrollment) => {
        const matchesSearch = enrollment.course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const progress = enrollment.progress_percentage || 0;
        let matchesStatus = true;
        if (filterStatus === "ongoing") {
            matchesStatus = enrollment.status !== "pending" && progress > 0 && progress < 100;
        }
        if (filterStatus === "upcoming") {
            matchesStatus = enrollment.status === "pending" || progress === 0;
        }
        if (filterStatus === "finished") {
            matchesStatus = enrollment.status !== "pending" && progress === 100;
        }
        return matchesSearch && matchesStatus;
    });

    const counts = {
        all: enrolledCourses.length,
        ongoing: enrolledCourses.filter((e) => {
            const p = e.progress_percentage || 0;
            return e.status !== "pending" && p > 0 && p < 100;
        }).length,
        upcoming: enrolledCourses.filter((e) => e.status === "pending" || (e.progress_percentage || 0) === 0).length,
        finished: enrolledCourses.filter((e) => e.status !== "pending" && (e.progress_percentage || 0) === 100).length,
    };

    const filterTabs: { id: FilterStatus; label: string; icon: React.ReactNode }[] = [
        { id: "all", label: "All Courses", icon: <BookOpen className="w-3 h-3" /> },
        { id: "ongoing", label: "In Progress", icon: <TrendingUp className="w-3 h-3" /> },
        { id: "upcoming", label: "Not Started", icon: <Clock className="w-3 h-3" /> },
        { id: "finished", label: "Completed", icon: <CheckCircle2 className="w-3 h-3" /> },
    ] as const;

    // Summary stats (exclude pending from average progress to keep metrics accurate)
    const activeCourses = enrolledCourses.filter(e => e.status !== "pending");
    const totalProgress =
        activeCourses.length > 0
            ? Math.round(
                activeCourses.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) /
                activeCourses.length
            )
            : 0;
    const totalCompleted = enrolledCourses.reduce(
        (acc, e) => acc + (e.completed_lessons || 0),
        0
    );
    const totalLessons = enrolledCourses.reduce(
        (acc, e) => acc + (e.course.total_lessons || 0),
        0
    );

    return (
        <div className="relative max-w-5xl mx-auto px-4 py-8 space-y-10 pb-24">
            {/* ── Page Header ── */}
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        My Courses
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Manage your learning progress and upcoming lessons
                    </p>
                </div>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                >
                    Explore More
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </motion.div>

            {/* ── Summary Stats ── */}
            {!loading && enrolledCourses.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        {
                            label: "Enrolled",
                            value: enrolledCourses.length,
                            icon: BookOpen,
                        },
                        {
                            label: "Lessons Done",
                            value: totalCompleted,
                            icon: CheckCircle2,
                        },
                        {
                            label: "Total Lessons",
                            value: totalLessons,
                            icon: GraduationCap,
                        },
                        {
                            label: "Avg. Progress",
                            value: `${totalProgress}%`,
                            icon: TrendingUp,
                        },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 rounded-2xl p-4"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400">
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                                    {stat.label}
                                </span>
                            </div>
                            <p className="text-xl font-black text-slate-900 dark:text-white tabular-nums">
                                {stat.value}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses..."
                        className="w-full h-10 pl-10 pr-4 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl overflow-x-auto no-scrollbar">
                    {filterTabs.map((tab) => {
                        const isActive = filterStatus === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={cn(
                                    "relative px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                                    isActive
                                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((enrollment, i) => (
                            <motion.div
                                key={enrollment.course.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2, delay: i * 0.03 }}
                                layout
                            >
                                <CourseProgressCard
                                    slug={enrollment.course.slug}
                                    title={enrollment.course.title}
                                    image={
                                        enrollment.course.thumbnail_url ||
                                        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop"
                                    }
                                    progress={enrollment.progress_percentage || 0}
                                    totalLessons={enrollment.course.total_lessons || 0}
                                    completedLessons={enrollment.completed_lessons || 0}
                                    lastLessonId={enrollment.last_lesson_id}
                                    isPending={enrollment.status === "pending"}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No courses found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    );
}
