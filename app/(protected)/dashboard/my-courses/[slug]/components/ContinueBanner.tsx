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
            className="group relative overflow-hidden rounded-2xl bg-linear-to-r from-primary/6 via-primary/3 to-transparent border border-primary/10 dark:border-primary/8 p-4"
        >
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 text-primary translate-x-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                        Continue Learning
                    </p>
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                        {nextLesson.lesson.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        from {nextLesson.module.title}
                    </p>
                </div>
                <Link
                    href={`/dashboard/my-courses/${courseSlug}/${nextLesson.lesson.id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-[11px] font-bold rounded-xl hover:brightness-110 transition-all shadow-sm shadow-primary/20 cursor-pointer"
                >
                    Resume <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </motion.div>
    );
}
