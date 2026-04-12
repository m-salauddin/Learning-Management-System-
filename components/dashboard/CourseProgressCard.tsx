import { ArrowRight, BookOpen, Layers, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    lastLessonId
}: CourseProgressCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const playUrl = lastLessonId 
        ? `/dashboard/my-courses/${slug}/${lastLessonId}` 
        : `/dashboard/my-courses/${slug}`;

    
    const courseProgress = Math.round(progress);
    const lessonRatio = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const currentUnit = completedLessons + 1 > totalLessons ? totalLessons : completedLessons + 1;
        
    return (
        <div 
            className="relative group pb-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={playUrl}>
                <div className="flex items-center gap-4 p-2 bg-card dark:bg-slate-900/50 border border-slate-300 dark:border-white/10 rounded-2xl transition-all duration-300 group-hover:border-primary/40 group-hover:bg-slate-50 dark:group-hover:bg-white/5 shadow-sm">
                    {}
                    <div className="relative w-44 aspect-video rounded-xl overflow-hidden shrink-0 border border-slate-300 dark:border-white/5">
                        <Image 
                             src={image} 
                            alt={title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            unoptimized
                        />
                    </div>

                    {}
                    <div className="flex-1 flex flex-col gap-2.5 py-2 pr-4">
                        <h3 className="font-black text-[13px] text-slate-900 dark:text-slate-100 leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase tracking-tight">
                            {title}
                        </h3>
                        
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="w-3 h-3" />
                                <span>{progress === 100 ? 'Completed' : 'Ongoing'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                <span>{completedLessons}/{totalLessons} Units</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {}
            <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-10 mt-2 z-50 w-[380px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 shadow-2xl p-6 rounded-2xl shadow-primary/5"
                    >
                        {}
                        <div className="absolute -top-1.5 left-10 w-3 h-3 bg-white dark:bg-slate-900 border-t border-l border-slate-300 dark:border-white/10 rotate-45" />

                        <div className="flex gap-4 mb-6">
                            {}
                            <div className="grid grid-cols-2 gap-3 w-full">
                                <CircularProgress value={courseProgress} label="Curriculum" color="text-rose-500" />
                                <CircularProgress value={lessonRatio} label="Completion" color="text-emerald-500" />
                            </div>

                            {}
                            <div className="flex flex-col justify-between items-start shrink-0 min-w-[120px]">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-muted-foreground dark:text-slate-400 block uppercase">Current Unit:</span>
                                    <h4 className="text-lg font-black text-foreground dark:text-slate-100">Unit {currentUnit}</h4>
                                </div>
                                <Link 
                                    href={playUrl}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-950 dark:bg-slate-800 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-slate-900 dark:hover:bg-slate-700 transition-all group/btn"
                                >
                                    {progress === 100 ? 'Review Course' : 'Continue'}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {}
                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-300 dark:border-white/10">
                            <LinearStat label="Progress Scale" value={courseProgress} color="bg-emerald-500/80" />
                            <LinearStat label="Unit Velocity" value={lessonRatio} color="bg-blue-500/80" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CircularProgress({ value, label, color }: { value: number; label: string; color: string }) {
    const circumference = 125.6; 
    
    return (
        <div className="flex flex-col items-center gap-3 p-4 rounded-xl border border-slate-300 dark:border-white/5 bg-slate-50 dark:bg-slate-800/50">
            <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/10 dark:text-white/5" />
                    <motion.circle 
                        cx="32" 
                        cy="32" 
                        r="20" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="transparent" 
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className={color} 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black dark:text-slate-100">{value}%</span>
                </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-slate-400">{label}</span>
        </div>
    );
}

function LinearStat({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground dark:text-slate-400">
                <span>{label}</span>
            </div>
            <div className="h-1 w-full bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                    className={cn_local("h-full rounded-full", color)} 
                />
            </div>
        </div>
    );
}

function cn_local(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}


