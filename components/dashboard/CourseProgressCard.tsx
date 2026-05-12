"use client";
import { BookOpen, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface CourseProgressCardProps {
    slug: string;
    title: string;
    image: string;
    progress: number;
    totalLessons: number;
    completed_lessons?: number;
    completedLessons: number;
    lastLessonId?: string | null;
}

export function CourseProgressCard({
    slug,
    title,
    image,
    progress,
    totalLessons,
    completedLessons,
    lastLessonId,
}: CourseProgressCardProps) {
    const playUrl = lastLessonId
        ? `/dashboard/my-courses/${slug}/${lastLessonId}`
        : `/dashboard/my-courses/${slug}`;
    const pct = Math.round(progress);
    const isComplete = pct >= 100;
    const isNotStarted = pct === 0;

    return (
        <Link href={playUrl} className="block group">
            <div
                className="relative flex items-center gap-4 sm:gap-5 p-3 bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] rounded-2xl transition-all duration-200 hover:border-slate-200 dark:hover:border-white/[0.08] hover:shadow-sm"
            >
                {/* Thumbnail */}
                <div className="relative w-24 sm:w-40 aspect-video shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/[0.03]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        unoptimized
                    />
                    {isComplete && (
                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-0.5 space-y-2.5">
                    {/* Title */}
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-primary transition-colors duration-200">
                        {title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {totalLessons} lessons
                        </span>
                        <span className="w-px h-2.5 bg-slate-200 dark:bg-white/[0.06]" />
                        <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                            {completedLessons}/{totalLessons}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-[3px] bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1, ease: "circOut" }}
                                className={cn(
                                    "h-full rounded-full",
                                    isComplete
                                        ? "bg-emerald-500"
                                        : isNotStarted
                                            ? "bg-slate-300 dark:bg-slate-600"
                                            : "bg-primary"
                                )}
                            />
                        </div>
                        <span className={cn(
                            "text-[10px] font-bold tabular-nums shrink-0",
                            isComplete
                                ? "text-emerald-500"
                                : "text-slate-400 dark:text-slate-500"
                        )}>
                            {pct}%
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
