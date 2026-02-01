"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";

// Adapted to use MappedCourse
export function CourseCard({ course }: { course: MappedCourse }) {
    return (
        <div className="group relative h-full">
            {/* Card container with glass effect */}
            <div className="relative h-full flex flex-col bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:-translate-y-2">
                {/* Shine effect overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>

                {/* Course Image */}
                <div className="p-4 pb-0">
                    <div className="relative h-48 rounded-2xl overflow-hidden w-full">
                        <Image
                            src={course.image || '/placeholder-course.jpg'} // Fallback
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />

                        {/* Duration badge */}
                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/70 dark:bg-black/50 backdrop-blur-md text-sm font-semibold border border-white/20 shadow-lg">
                            <span className="text-primary">
                                {course.duration}
                            </span>
                        </div>

                        {/* Rating badge */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 dark:bg-black/50 backdrop-blur-md border border-white/20 shadow-lg">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-foreground">{course.rating}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                                ({course.students})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 grow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-md">
                            {course.level}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5 rounded-md">
                            {course.type}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                        {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {course.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {course.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-full text-xs font-medium bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50 dark:border-white/5">
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Price</span>
                            <span className="text-2xl font-black text-primary">
                                {course.price}
                            </span>
                        </div>
                        <Link
                            href={`/courses/${course.slug}`}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group/btn"
                        >
                            <span>Course</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
