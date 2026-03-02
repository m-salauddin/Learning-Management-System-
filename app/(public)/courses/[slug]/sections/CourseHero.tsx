"use client";

import { motion } from "motion/react";
import { Star, Users, Clock, Zap, Download, Activity, Video, Hash, Rocket, Layers, Award, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";
import { MappedCourse } from "@/types/mapped-course";
import { CoursePageData } from "@/types/course-page";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface CourseHeroProps {
    course: MappedCourse;
    pageData?: CoursePageData;
    isLive: boolean;
    timeLeft: { d: number, h: number, m: number, s: number } | null;
    handleEnroll: () => void;
    loading: boolean;
}

export default function CourseHero({
    course,
    pageData,
    isLive,
    timeLeft,
    handleEnroll,
    loading
}: CourseHeroProps) {
    const levelConfig = useMemo(() => {
        const level = course.level?.toLowerCase() || '';
        if (level.includes('beginner')) {
            return { icon: Rocket, label: 'Beginner', color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" };
        }
        if (level.includes('intermediate')) {
            return { icon: Layers, label: 'Intermediate', color: "border-amber-500/40 bg-amber-500/10 text-amber-400" };
        }
        if (level.includes('advanced')) {
            return { icon: Award, label: 'Advanced', color: "border-rose-500/40 bg-rose-500/10 text-rose-400" };
        }
        return { icon: Target, label: course.level || 'All Levels', color: "border-primary/40 bg-primary/10 text-primary" };
    }, [course.level]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-wrap items-center gap-3">
                <Badge
                    icon={isLive ? Activity : Video}
                    className={cn(
                        "px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border rounded-full",
                        isLive
                            ? "border-red-500/40 bg-red-500/10 text-red-500"
                            : "border-blue-500/40 bg-blue-500/10 text-blue-400"
                    )}
                >
                    <span className="flex items-center gap-2">
                        {isLive && (
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                            </span>
                        )}
                        {isLive ? 'Live Course' : 'Recorded'}
                    </span>
                </Badge>

                <Badge
                    icon={levelConfig.icon}
                    className={cn("px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border rounded-full", levelConfig.color)}
                >
                    {levelConfig.label}
                </Badge>

                <Badge
                    icon={Hash}
                    className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 rounded-full"
                >
                    Batch {course.batchNo ? (course.batchNo < 10 ? `0${course.batchNo}` : course.batchNo) : '01'}
                </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.15] mt-4 sm:mt-5">
                <span className="gradient-text">{course.title}</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mt-4 sm:mt-5">
                {course.description}
            </p>

            {pageData?.batches && pageData.batches.length > 0 && pageData.batches.some(b => b.is_active) && (
                <div className="mt-6 flex flex-wrap gap-4">
                    {pageData.batches.filter(b => b.is_active).map(batch => (
                        <div key={batch.id} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Next Batch</span>
                                <span className="text-xs text-emerald-100 font-semibold">
                                    Starts {new Date(batch.start_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                            {batch.seats_remaining < 10 && (
                                <div className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 ml-2">
                                    {batch.seats_remaining} seats left
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <span className="font-medium">{course.rating} ({course.reviews} ratings)</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="font-medium">{course.students} students</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-accent" />
                    </div>
                    <span className="font-medium">{pageData?.totalLessons || 0} Lessons</span>
                </div>

                {timeLeft && (
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-sm group hover:border-amber-500/40 transition-all duration-300">
                        <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500">
                            <Zap className="w-4 h-4 fill-amber-500/20" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-heavy text-amber-500/80 tracking-widest leading-none mb-1">Enrollment ends in</span>
                            <div className="flex items-center gap-2 font-black text-sm text-amber-500 tabular-nums">
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-base">{timeLeft.d}</span>
                                    <span className="text-[9px] font-bold opacity-60 uppercase">d</span>
                                </div>
                                <span className="opacity-30 font-light">:</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-base">{timeLeft.h}</span>
                                    <span className="text-[9px] font-bold opacity-60 uppercase">h</span>
                                </div>
                                <span className="opacity-30 font-light">:</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-base">{timeLeft.m}</span>
                                    <span className="text-[9px] font-bold opacity-60 uppercase">m</span>
                                </div>
                                <span className="opacity-30 font-light">:</span>
                                <div className="flex items-baseline gap-0.5">
                                    <span className="text-base">{timeLeft.s}</span>
                                    <span className="text-[9px] font-bold opacity-60 uppercase">s</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8 sm:mt-12">
                <SecondaryCTAButton
                    onClick={() => {/* download logic */ }}
                    className="h-10! sm:h-12!"
                >
                    <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span>Download Outline</span>
                    </div>
                </SecondaryCTAButton>

                <PrimaryCTAButton
                    onClick={handleEnroll}
                    loading={loading}
                    className="h-10! sm:h-12!"
                >
                    Enroll Now
                </PrimaryCTAButton>
            </div>
        </motion.div>
    );
}
