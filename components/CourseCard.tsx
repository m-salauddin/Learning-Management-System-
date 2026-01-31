"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Clock, Users, ArrowRight, Flame, Zap, BookOpen, Hash } from "lucide-react";
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

    return (
        <div className="group relative h-full">
            {/* Ambient glow effect */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[26px] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700" />

            {/* Card container */}
            <div className="relative h-full flex flex-col bg-card/95 dark:bg-card/80 backdrop-blur-2xl border border-border/60 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-2xl group-hover:-translate-y-1.5">

                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-px rounded-3xl bg-card/95 dark:bg-card/80" />
                </div>

                {/* Shine sweep effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </div>

                {/* Course Image Section */}
                <div className="relative p-3 pb-0">
                    <div className="relative h-44 rounded-2xl overflow-hidden">
                        <Image
                            src={course.image || '/placeholder-course.jpg'}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Gradient overlays */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Top badges row */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-2">
                            {/* Discount countdown */}
                            {hasDiscount && (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-linear-to-r from-orange-500 to-red-500 text-white text-xs font-bold shadow-lg shadow-orange-500/40">
                                    <Flame className="w-3.5 h-3.5" />
                                    <span className="font-mono font-bold tracking-wide">
                                        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                                    </span>
                                </div>
                            )}

                            {/* Duration badge */}
                            <div className="ml-auto flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                                <Clock className="w-3 h-3 text-primary" />
                                <span>{course.duration}</span>
                            </div>
                        </div>

                        {/* Bottom overlay with rating & students */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                            {/* Rating */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-white text-xs font-bold">{course.rating.toFixed(1)}</span>
                                <span className="text-white/60 text-[10px]">({course.reviews})</span>
                            </div>

                            {/* Students */}
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10">
                                <Users className="w-3.5 h-3.5 text-primary" />
                                <span className="text-white text-xs font-semibold">{course.students}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative p-4 pt-3 flex flex-col grow">
                    {/* Level, Type & Batch badges */}
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-lg">
                            <Zap className="w-3 h-3" />
                            {course.level}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 border border-border/50 px-2 py-1 rounded-lg">
                            {course.type}
                        </span>
                        {course.batchNo && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded-lg ml-auto">
                                <Hash className="w-3 h-3" />
                                Batch {course.batchNo}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold leading-snug mb-2 transition-colors duration-300 group-hover:text-primary line-clamp-2">
                        {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
                        {course.description}
                    </p>

                    {/* Stats Bar: Students, Lessons, Duration */}
                    <div className="flex items-center justify-between py-2.5 px-3 mb-3 rounded-xl bg-muted/30 dark:bg-white/5 border border-border/30 dark:border-white/5">
                        {/* Students */}
                        <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-foreground">{course.students}</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-4 bg-border/50 dark:bg-white/10" />

                        {/* Lessons */}
                        <div className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-foreground">{course.totalLessons || 0} lessons</span>
                        </div>

                        {/* Divider */}
                        <div className="w-px h-4 bg-border/50 dark:bg-white/10" />

                        {/* Duration */}
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-foreground">{course.duration}</span>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="grow" />

                    {/* Price & CTA Section */}
                    <div className="flex items-end justify-between pt-3 border-t border-border/40 dark:border-white/5">
                        <div className="flex flex-col">
                            {hasDiscount ? (
                                <>
                                    {/* Discount badge */}
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 mb-1">
                                        <Flame className="w-3 h-3" />
                                        SALE
                                    </span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                            {course.discountPrice}
                                        </span>
                                        <span className="text-sm font-medium text-muted-foreground line-through decoration-red-500/60 decoration-2">
                                            {course.price}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                                        Price
                                    </span>
                                    <span className="text-2xl font-black bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                        {course.price}
                                    </span>
                                </>
                            )}
                        </div>

                        <Link
                            href={`/courses/${course.slug}`}
                            className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-linear-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group/btn overflow-hidden"
                        >
                            {/* Button shine */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
                            <span className="relative">Enroll</span>
                            <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
