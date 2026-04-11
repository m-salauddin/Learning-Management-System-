"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, Users, ArrowRight, Library } from "lucide-react";
import { CourseLevelBadge } from "@/components/ui/CourseLevelBadge";
import { MappedCourse } from "@/types/mapped-course";
interface RelatedCoursesProps {
    relatedCourses: MappedCourse[];
}
export default function RelatedCourses({ relatedCourses }: RelatedCoursesProps) {
    if (!relatedCourses || relatedCourses.length === 0) return null;
    return (
        <div className="mt-24 sm:mt-32 space-y-12 pb-12 sm:pb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        <Library className="w-3.5 h-3.5" />
                        More Courses
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Continue Growing</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Ready for the next step? Explore these related courses.</p>
                </div>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors group"
                >
                    Browse All Courses
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedCourses.map((rCourse) => (
                        <Link
                            key={rCourse.id}
                            href={`/courses/${rCourse.slug}`}
                            className="group flex flex-col rounded-[2.5rem] bg-white dark:bg-slate-900/40 border border-slate-300 dark:border-white/10 hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-none"
                        >
                        <div className="aspect-video relative overflow-hidden p-2">
                            <div className="w-full h-full rounded-[1.75rem] overflow-hidden relative">
                                <Image
                                    src={rCourse.image || '/placeholder-course.jpg'}
                                    alt={rCourse.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized
                                />
                                <CourseLevelBadge level={rCourse.level} className="absolute top-3 right-3 shadow-lg" />
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{rCourse.title}</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                                        <span className="text-xs font-black text-slate-600 dark:text-slate-400 tabular-nums">{(Number(rCourse.rating) || 0).toFixed(1)}</span>
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                    <div className="flex items-center gap-1.5">
                                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                        <span className="text-xs font-black text-slate-600 dark:text-slate-400 tabular-nums">{rCourse.students}</span>
                                    </div>
                                </div>
                                <div className="text-sm font-black text-primary">{rCourse.discountPrice || rCourse.price}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
