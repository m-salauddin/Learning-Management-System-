"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Star, ArrowRight, GraduationCap } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { COURSES, Course } from "@/data/courses";
import { Badge } from "@/components/ui/Badge";


const TAG_COLORS = [
    "!bg-emerald-500/10 !text-emerald-500 !border-emerald-500/20",
    "!bg-amber-500/10 !text-amber-500 !border-amber-500/20",
    "!bg-rose-500/10 !text-rose-500 !border-rose-500/20",
    "!bg-indigo-500/10 !text-indigo-500 !border-indigo-500/20",
    "!bg-pink-500/10 !text-pink-500 !border-pink-500/20",
    "!bg-orange-500/10 !text-orange-500 !border-orange-500/20",
    "!bg-cyan-500/10 !text-cyan-500 !border-cyan-500/20",
    "!bg-violet-500/10 !text-violet-500 !border-violet-500/20",
];

function getBadgeColor(text: string) {
    const index = text.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[index % TAG_COLORS.length];
}

const LEVEL_STYLES = {
    Beginner: "!bg-emerald-500/10 !text-emerald-500 !border-emerald-500/20",
    Intermediate: "!bg-violet-500/10 !text-violet-500 !border-violet-500/20",
    Advanced: "!bg-rose-500/10 !text-rose-500 !border-rose-500/20",
};

function getLevelStyle(level: string) {
    return LEVEL_STYLES[level as keyof typeof LEVEL_STYLES] || "!bg-gray-500/10 !text-gray-500 !border-gray-500/20";
}

function CourseCard({ course }: { course: Course }) {
    return (
        <motion.div
            variants={staggerItem}
            className="group relative h-full"
        >
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
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />

                        {/* Duration badge */}
                        <div className="absolute top-3 right-3">
                            <Badge className="backdrop-blur-md shadow-lg px-3 py-1 text-sm font-semibold bg-sky-500/20! text-sky-100! border-sky-500/30!">
                                {course.duration}
                            </Badge>
                        </div>

                        {/* Rating badge */}
                        <div className="absolute bottom-3 left-3">
                            <Badge className="backdrop-blur-md shadow-lg px-3 py-1 flex items-center gap-1 bg-amber-500/20! text-amber-100! border-amber-500/30!">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="font-bold">{course.rating}</span>
                                <span className="text-white/70 text-xs ml-1">
                                    ({course.students})
                                </span>
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-4 grow flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md h-auto font-bold ${getLevelStyle(course.level)}`}>
                            {course.level}
                        </Badge>
                        <Badge className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md h-auto font-bold bg-blue-500/10! text-blue-500! border-blue-500/20!">
                            {course.type}
                        </Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                        {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {course.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                        {course.tags.map((tag) => (
                            <Badge
                                key={tag}
                                className={`text-xs font-medium border ${getBadgeColor(tag)}`}
                            >
                                {tag}
                            </Badge>
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
        </motion.div>
    );
}

export function CoursesSection() {
    return (
        <section id="courses" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                >
                    <div>
                        <Badge icon={GraduationCap} className="mb-4">
                            Popular Courses
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Start your learning journey
                        </h2>
                    </div>
                    <Link
                        href="/courses"
                        className="mt-4 md:mt-0 flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                        View all courses
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {COURSES.slice(0, 6).map((course, index) => (
                        <CourseCard key={index} course={course} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
