"use client";
import { Play, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

interface Props {
    nextLesson: { lesson: any; module: any } | null;
    courseSlug: string;
}

export function ContinueBanner({ nextLesson, courseSlug }: Props) {
    if (!nextLesson) return null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-[#0B0F1A]/30 backdrop-blur-sm border border-slate-200/60 dark:border-white/[0.05] p-4 sm:p-5"
        >
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-5">
                <div className="w-12 h-12 rounded-[14px] bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-inner shadow-white/10">
                    <Play className="w-5 h-5 text-primary fill-primary/20 translate-x-0.5" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
                            Next Up
                        </span>
                        <div className="h-px w-8 bg-primary/20" />
                    </div>
                    <p className="text-[14px] font-black text-slate-900 dark:text-white truncate mt-1">
                        {nextLesson.lesson.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 opacity-80 uppercase tracking-wider">
                        {nextLesson.module.title}
                    </p>
                </div>

                <Link
                    href={`/dashboard/my-courses/${courseSlug}/${nextLesson.lesson.id}`}
                    className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-[11px] font-black rounded-full hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300 cursor-pointer uppercase tracking-widest"
                >
                    Resume <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </motion.div>
    );
}

