"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, GraduationCap } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { COURSES } from "@/data/courses";
import { Badge } from "@/components/ui/Badge";
import { CourseCard } from "@/components/CourseCard";

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
                        <motion.div key={index} variants={staggerItem} className="h-full">
                            <CourseCard course={course} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
