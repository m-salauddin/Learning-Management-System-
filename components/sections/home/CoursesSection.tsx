"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";
import { CourseCard } from "@/components/CourseCard";
import { MappedCourse } from "@/types/mapped-course";

export function CoursesSection({ courses }: { courses: MappedCourse[] }) {
    const t = useTranslations("Courses");
    const tc = useTranslations("Common");

    return (
        <section id="courses" suppressHydrationWarning className="py-24">
            <div suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
                >
                    <div suppressHydrationWarning>
                        <Badge icon={GraduationCap} className="mb-4">
                            {t("badge")}
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            {t("title")}
                        </h2>
                    </div>
                    <Link
                        href="/courses"
                        className="group relative mt-4 md:mt-0 flex items-center justify-between gap-4 overflow-hidden rounded-full border border-border/80 bg-card pl-6 pr-1.5 py-1.5"
                    >
                        <div className="absolute inset-0 translate-x-[-100%] bg-linear-to-r from-primary/0 via-primary/10 to-primary/0 transition-transform duration-700 ease-in-out group-hover:translate-x-[100%]" />
                        <span className="relative z-10 text-sm font-bold tracking-wide text-foreground/80 transition-colors group-hover:text-foreground">
                            {tc("viewAll")}
                        </span>
                        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary transition-all duration-500 text-primary-foreground dark:text-[#020615] group-hover:-rotate-45">
                            <ArrowRight className="h-4 w-4" />
                        </div>
                    </Link>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {courses.length > 0 ? (
                        courses.slice(0, 6).map((course) => (
                            <motion.div key={course.id} variants={staggerItem} className="h-full">
                                <CourseCard course={course} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center border border-dashed border-border rounded-3xl bg-muted/10 flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary transition-transform hover:scale-110 duration-300">
                                <BookOpen className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">{t("noCourses")}</h3>
                            <p className="text-muted-foreground mt-2 max-w-md mx-auto px-4">
                                {t("noCoursesDesc")}
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
