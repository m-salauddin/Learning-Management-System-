"use client";
import { BookOpen, CheckCircle2, Layers, Clock } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { Course } from "@/types/lms";

interface Props {
    course: Course;
    modulesCount: number;
    totalLessons: number;
    completedTotal: number;
    progressPct: number;
}

export function CourseHeader({ course, modulesCount, totalLessons, completedTotal, progressPct }: Props) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/6">

            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary via-primary/60 to-transparent" />

            <div className="flex flex-col sm:flex-row items-stretch">

                <div className="relative w-full sm:w-56 aspect-video sm:aspect-auto shrink-0 bg-slate-100 dark:bg-slate-800/60">
                    <img
                        src={course.thumbnail_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent sm:bg-linear-to-t sm:from-black/30 sm:to-transparent" />


                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Batch {course.batch_no || 1}
                        </span>
                    </div>
                </div>

                <div className="flex-1 p-5 flex flex-col justify-between gap-3 min-w-0">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                            </span>
                        </div>
                        <h1 className="text-[17px] font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
                            {course.title}
                        </h1>
                        {course.short_description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed max-w-lg">
                                {course.short_description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-5 text-[11px] text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                        <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-primary/60" />
                            {modulesCount} Modules
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                            {totalLessons} Lessons
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
                            {completedTotal} Done
                        </span>
                        {course.duration_hours > 0 && (
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-primary/60" />
                                {course.duration_hours}h
                            </span>
                        )}
                    </div>
                </div>


                <div className="hidden sm:flex items-center px-6 border-l border-slate-100 dark:border-white/5 shrink-0">
                    <ProgressRing value={progressPct} size={64} strokeWidth={5} />
                </div>
            </div>
        </div>
    );
}
