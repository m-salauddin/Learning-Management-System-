"use client";
import { BookOpen, CheckCircle2, Lock, Clock } from "lucide-react";
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
    isPending?: boolean;
}

export function CourseProgressCard({
    slug,
    title,
    image,
    progress,
    totalLessons,
    completedLessons,
    lastLessonId,
    isPending = false,
}: CourseProgressCardProps) {
    const playUrl = lastLessonId
        ? `/dashboard/my-courses/${slug}/${lastLessonId}`
        : `/dashboard/my-courses/${slug}`;
    const pct = Math.round(progress);
    const isComplete = pct >= 100;
    const isNotStarted = pct === 0;

    if (isPending) {
        return (
            <div
                className="relative flex items-center gap-4 sm:gap-5 p-3 bg-white dark:bg-white/5 border border-amber-500/20 dark:border-amber-500/10 rounded-2xl select-none opacity-90 shadow-sm overflow-hidden"
            >
                {/* Visual Glass Lock Overlay Frame */}
                <div className="absolute inset-x-0 bottom-0 top-0 bg-linear-to-r from-amber-500/5 to-transparent pointer-events-none" />

                {/* Thumbnail */}
                <div className="relative w-24 sm:w-40 aspect-video shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover brightness-[0.4]"
                        unoptimized
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                            <Lock className="w-4 h-4 text-amber-500 animate-pulse" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            Pending
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-0.5 space-y-2">
                    {/* Title */}
                    <h3 className="text-sm sm:text-[15px] font-bold text-slate-400 dark:text-slate-400 leading-snug line-clamp-1">
                        {title}
                    </h3>

                    {/* Meta Status */}
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500/80 dark:text-amber-400/80">
                        <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                        <span className="uppercase tracking-widest text-[9px] font-bold">Verifying Payment...</span>
                    </div>

                    {/* Progress Bar (Mocked to lock state) */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-[3px] bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-650">
                            LOCKED
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link href={playUrl} className="block group">
            <div
                className="relative flex items-center gap-4 sm:gap-5 p-3 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl transition-all duration-200 hover:border-slate-200 dark:hover:border-white/10 hover:shadow-sm"
            >
                {/* Thumbnail */}
                <div className="relative w-24 sm:w-40 aspect-video shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-white/5">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                        <span className="w-px h-2.5 bg-slate-200 dark:bg-white/10" />
                        <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500/50" />
                            {completedLessons}/{totalLessons}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-2.5">
                        <div className="flex-1 h-[3px] bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
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
