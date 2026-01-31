"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, ArrowRight, Zap, BookOpen, Hash, Timer } from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";

export function CourseCard({ course }: { course: MappedCourse }) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!course.discountExpiresAt) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(course.discountExpiresAt!) - +new Date();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [course.discountExpiresAt]);

    const hasDiscount = course.discountPrice && timeLeft;

    // Format countdown string
    const formatCountdown = () => {
        if (!timeLeft) return "";
        const parts = [];
        if (timeLeft.days > 0) parts.push(`${timeLeft.days}d`);
        parts.push(`${String(timeLeft.hours).padStart(2, '0')}h`);
        parts.push(`${String(timeLeft.minutes).padStart(2, '0')}m`);
        parts.push(`${String(timeLeft.seconds).padStart(2, '0')}s`);
        return parts.join(" ");
    };

    return (
        <div className="group relative h-full">
            <div className="relative h-full flex flex-col bg-card/80 border border-border rounded-2xl overflow-hidden transition-all duration-500 group-hover:border-border group-hover:-translate-y-1">

                <div className="relative p-3">
                    <div className="relative h-48 rounded-xl overflow-hidden">
                        <Image
                            src={course.image || '/placeholder-course.jpg'}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/20" />

                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                            {/* Countdown badge */}
                            {hasDiscount && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-black/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm">
                                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-white text-xs font-bold font-mono tracking-wide">
                                        {formatCountdown()}
                                    </span>
                                </div>
                            )}

                            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 dark:bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/30 dark:border-white/10 shadow-sm">
                                <Clock className="w-3 h-3 text-sky-400" />
                                <span>{course.duration}</span>
                            </div>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 dark:bg-black/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-white text-xs font-bold">{course.rating.toFixed(1)}</span>
                                <span className="text-white/70 text-[10px]">({course.reviews})</span>
                            </div>

                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 dark:bg-black/60 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-sm">
                                <Users className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-white text-xs font-medium">{course.students}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative px-4 pb-5 flex flex-col grow">
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                            <Zap className="w-3 h-3" />
                            {course.level}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 border border-border/50 px-2.5 py-1 rounded-full">
                            {course.type}
                        </span>
                        {course.batchNo && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full ml-auto">
                                <Hash className="w-3 h-3" />
                                Batch {course.batchNo}
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg font-bold leading-snug mb-2 text-foreground transition-colors duration-300 group-hover:text-primary line-clamp-2">
                        {course.title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                        {course.description}
                    </p>

                    <div className="flex items-center gap-4 py-3 px-4 mb-4 rounded-xl bg-card/50 border border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/10">
                                <Users className="w-3.5 h-3.5 text-secondary" />
                            </div>
                            <span className="text-xs font-medium text-foreground">{course.students}</span>
                        </div>

                        <div className="w-px h-5 bg-border/50" />

                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-xs font-medium text-foreground">{course.totalLessons || 0} lessons</span>
                        </div>

                        <div className="w-px h-5 bg-border/50" />

                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                                <Clock className="w-3.5 h-3.5 text-warning" />
                            </div>
                            <span className="text-xs font-medium text-foreground">{course.duration}</span>
                        </div>
                    </div>

                    <div className="grow" />

                    <div className="flex items-end justify-between pt-4 border-t border-border/50">
                        <div className="flex flex-col">
                            {hasDiscount ? (
                                <>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 mb-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                        </svg>
                                        SALE
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black text-foreground">
                                            {course.discountPrice}
                                        </span>
                                        <span className="text-sm font-medium text-muted-foreground line-through">
                                            {course.price}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                                        Price
                                    </span>
                                    <span className="text-2xl font-black text-foreground">
                                        {course.price}
                                    </span>
                                </>
                            )}
                        </div>

                        <Link
                            href={`/courses/${course.slug}`}
                            className="group/btn flex items-center gap-2 pl-5 pr-1.5 py-1.5 bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 active:scale-95"
                        >
                            <span className="text-sm font-semibold text-primary-foreground">Enroll</span>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background transition-transform duration-300 -rotate-45 group-hover/btn:rotate-0">
                                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
