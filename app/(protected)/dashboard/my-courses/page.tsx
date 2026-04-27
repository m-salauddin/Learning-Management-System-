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
                .in("status", ["active", "success"]);
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
        if (filterStatus === "ongoing") matchesStatus = progress > 0 && progress < 100;
        if (filterStatus === "upcoming") matchesStatus = progress === 0;
        if (filterStatus === "finished") matchesStatus = progress === 100;
        return matchesSearch && matchesStatus;
    });

    const counts = {
        all: enrolledCourses.length,
        ongoing: enrolledCourses.filter((e) => {
            const p = e.progress_percentage || 0;
            return p > 0 && p < 100;
        }).length,
        upcoming: enrolledCourses.filter((e) => (e.progress_percentage || 0) === 0).length,
        finished: enrolledCourses.filter((e) => (e.progress_percentage || 0) === 100).length,
    };

    const filterTabs: { id: FilterStatus; label: string; icon: React.ReactNode }[] = [
        { id: "all", label: "All Courses", icon: <BookOpen className="w-3 h-3" /> },
        { id: "ongoing", label: "In Progress", icon: <TrendingUp className="w-3 h-3" /> },
        { id: "upcoming", label: "Not Started", icon: <Clock className="w-3 h-3" /> },
        { id: "finished", label: "Completed", icon: <CheckCircle2 className="w-3 h-3" /> },
    ] as const;

    // Summary stats
    const totalProgress =
        enrolledCourses.length > 0
            ? Math.round(
                  enrolledCourses.reduce((acc, e) => acc + (e.progress_percentage || 0), 0) /
                      enrolledCourses.length
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
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-5 pb-20">
            {/* ── Page Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-[17px] font-semibold text-slate-900 dark:text-white tracking-tight">
                        My Courses
                    </h1>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    Browse More
                    <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            {/* ── Summary Stats ── */}
            {!loading && enrolledCourses.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                    {[
                        {
                            label: "Enrolled",
                            value: enrolledCourses.length,
                            suffix: "courses",
                            color: "text-slate-900 dark:text-white",
                        },
                        {
                            label: "Completed",
                            value: `${totalCompleted}/${totalLessons}`,
                            suffix: "lessons",
                            color: "text-emerald-600 dark:text-emerald-400",
                        },
                        {
                            label: "Avg. Progress",
                            value: `${totalProgress}%`,
                            suffix: "overall",
                            color: "text-primary",
                        },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/6 rounded-lg px-3.5 py-3"
                        >
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                                {stat.label}
                            </p>
                            <p className={cn("text-lg font-semibold tabular-nums mt-0.5", stat.color)}>
                                {stat.value}
                            </p>
                            <p className="text-[10px] text-slate-400">{stat.suffix}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search courses…"
                        className="w-full h-8 pl-8 pr-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/6 rounded-md text-[12px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                    />
                </div>

                {/* Filter pill tabs */}
                <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/6 rounded-md">
                    {filterTabs.map((tab) => {
                        const isActive = filterStatus === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilterStatus(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer",
                                    isActive
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="my-courses-tab-bg"
                                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200/60 dark:border-white/8"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5">
                                    {tab.icon}
                                    {tab.label}
                                    {counts[tab.id] > 0 && (
                                        <span
                                            className={cn(
                                                "text-[9px] tabular-nums px-1 py-px rounded-sm leading-none",
                                                isActive
                                                    ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                                    : "text-slate-400"
                                            )}
                                        >
                                            {counts[tab.id]}
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                        <p className="text-[11px] text-slate-400">Loading courses…</p>
                    </div>
                </div>
            ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((enrollment, i) => (
                            <motion.div
                                key={enrollment.course.slug}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.18, delay: i * 0.04 }}
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
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : searchQuery || filterStatus !== "all" ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-[13px] font-medium text-slate-600 dark:text-slate-300">
                            No courses match
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Try adjusting your search or filter
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            setFilterStatus("all");
                        }}
                        className="text-[11px] text-primary font-medium hover:underline cursor-pointer"
                    >
                        Clear filters
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 border border-dashed border-slate-200 dark:border-white/8 rounded-lg">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="text-center space-y-1">
                        <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                            No courses yet
                        </p>
                        <p className="text-[11px] text-slate-400">
                            Enroll in a course to start learning
                        </p>
                    </div>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground text-[11px] font-medium rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        Browse Courses
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            )}
        </div>
    );
}
