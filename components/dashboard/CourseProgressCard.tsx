"use client";

import { motion } from "motion/react";
import { PlayCircle } from "lucide-react";
import Link from "next/link";

interface CourseProgressCardProps {
    slug: string;
    title: string;
    image: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
}

export function CourseProgressCard({ slug, title, image, progress, totalLessons, completedLessons }: CourseProgressCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative rounded-2xl overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all"
        >
            <div className="relative h-32 sm:h-40 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link href={`/courses/${slug}`} className="p-3 rounded-full bg-primary text-white hover:scale-110 transition-transform shadow-xl cursor-pointer">
                        <PlayCircle className="w-8 h-8 fill-current" />
                    </Link>
                </div>
                <div className="absolute top-2 right-2 px-2 py-1 text-[10px] font-bold bg-background/80 backdrop-blur-md rounded-md border border-white/10">
                    {progress}%
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <h4 className="font-bold text-base sm:text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{title}</h4>

                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{completedLessons}/{totalLessons} Lessons</span>
                </div>

                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="h-full bg-primary rounded-full relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
