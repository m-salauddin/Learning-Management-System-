"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { motion } from "motion/react";
import { COURSES } from "@/data/courses";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
};

export default function MyCoursesPage() {
    const { user } = useAppSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState("");

    const enrolledCourseIds = user?.coursesEnrolled || [];

    // Filter enrolled courses
    const myCourses = COURSES.filter(c =>
        enrolledCourseIds.includes(c.slug)
    ).filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground text-sm">Manage and track your learning progress</p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none text-sm transition-all"
                    />
                </div>
            </div>

            {myCourses.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {myCourses.map((course) => (
                        <motion.div key={course.slug} variants={item}>
                            <CourseProgressCard
                                slug={course.slug}
                                title={course.title}
                                image={course.image}
                                progress={Math.floor(Math.random() * 80) + 10} // Mock random progress
                                totalLessons={24}
                                completedLessons={5}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center border rounded-2xl border-dashed border-border/50 bg-card/30">
                    <div className="p-4 bg-muted/50 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold">
                        {searchQuery ? "No matching courses found" : "No courses enrolled yet"}
                    </h3>
                    <p className="text-muted-foreground max-w-sm mb-6 mt-1 text-sm">
                        {searchQuery ? "Try searching for a different keyword." : "Start your learning journey by exploring our premium course catalog."}
                    </p>
                    {!searchQuery && (
                        <Link href="/courses" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
                            Explore Catalog
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
