"use client";
import { CheckCircle2, Clock, Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

    const statusConfig = isComplete
        ? { label: "Completed", icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" }
        : isNotStarted
        ? { label: "Not Started", icon: Clock, color: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" }
        : { label: "In Progress", icon: Clock, color: "text-primary", bg: "bg-primary/10" };

    const StatusIcon = statusConfig.icon;

    return (
        <Link href={playUrl} className="block group cursor-pointer">
            <div className="relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/[0.06] rounded-lg overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-white/[0.12] hover:shadow-md dark:hover:shadow-black/20">
                {/* Top progress bar */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-slate-100 dark:bg-white/[0.04] z-10">
                    <div
                        className={cn(
                            "h-full transition-all duration-500 rounded-r-full",
                            isComplete ? "bg-emerald-500" : "bg-primary"
                        )}
                        style={{ width: `${pct}%` }}
                    />
                </div>

                <div className="flex items-stretch">
                    {/* Thumbnail */}
                    <div className="relative w-[130px] shrink-0 bg-slate-100 dark:bg-slate-800">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                            unoptimized
                        />
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-200 shadow-sm">
                                {isComplete ? (
                                    <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
                                ) : (
                                    <Play className="w-3.5 h-3.5 text-slate-700 translate-x-px" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3.5 flex flex-col justify-between min-w-0">
                        <div className="space-y-1.5">
                            {/* Status badge */}
                            <span className={cn(
                                "inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded",
                                statusConfig.bg, statusConfig.color
                            )}>
                                <StatusIcon className="w-2.5 h-2.5" />
                                {statusConfig.label}
                            </span>

                            {/* Title */}
                            <h3 className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-150">
                                {title}
                            </h3>
                        </div>

                        {/* Bottom row */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {/* Mini progress bar */}
                                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[90px]">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            isComplete ? "bg-emerald-500" : "bg-primary"
                                        )}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                                    {pct}%
                                </span>
                            </div>

                            <span className="text-[10px] text-slate-400 tabular-nums shrink-0 font-medium">
                                {completedLessons}/{totalLessons}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
