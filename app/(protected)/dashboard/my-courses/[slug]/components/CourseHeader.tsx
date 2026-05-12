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
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#0B0F1A]/50 backdrop-blur-sm border border-slate-200/60 dark:border-white/[0.05]">
            <div className="flex flex-col md:flex-row items-stretch">
                {/* Minimal Thumbnail */}
                <div className="relative w-full md:w-64 aspect-video md:aspect-auto shrink-0 bg-slate-100 dark:bg-white/[0.02]">
                    <img
                        src={course.thumbnail_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400"}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent md:bg-linear-to-r md:from-transparent md:via-transparent md:to-black/10" />

                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center text-[9px] font-black text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full uppercase tracking-[0.1em] border border-white/10">
                            Batch {course.batch_no || 1}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-4 min-w-0">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                    Active
                                </span>
                            </div>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                            {course.title}
                        </h1>

                        {course.short_description && (
                            <p className="text-[12px] text-slate-500 dark:text-slate-400/80 line-clamp-2 leading-relaxed max-w-2xl font-medium">
                                {course.short_description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex-wrap">
                        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
                            <Layers className="w-3.5 h-3.5 opacity-50" />
                            {modulesCount} Modules
                        </span>
                        <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
                            <BookOpen className="w-3.5 h-3.5 opacity-50" />
                            {totalLessons} Lessons
                        </span>
                        <span className="flex items-center gap-2 text-emerald-500/80">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {completedTotal} Done
                        </span>
                        {course.duration_hours > 0 && (
                            <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-default">
                                <Clock className="w-3.5 h-3.5 opacity-50" />
                                {course.duration_hours}h
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress Section */}
                <div className="hidden md:flex items-center px-10 border-l border-slate-100 dark:border-white/[0.03] shrink-0 bg-slate-50/30 dark:bg-white/[0.01]">
                    <ProgressRing value={progressPct} size={72} strokeWidth={6} />
                </div>
            </div>
        </div>
    );
}

