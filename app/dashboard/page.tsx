"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { motion } from "motion/react";
import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";
import { COURSES } from "@/data/courses";
import Link from "next/link";

// Stagger variants
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
    const { user } = useAppSelector((state) => state.auth);

    // Mock Data Logic
    const enrolledCourseIds = user?.coursesEnrolled || [];

    // Filter enrolled courses
    const myCourses = COURSES.filter(c =>
        enrolledCourseIds.includes(c.slug)
    );

    // Mock Stats
    const inProgressCount = myCourses.length;
    const completedCount = 0;
    const hoursSpent = 12;
    const avgScore = 85;

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl sm:text-3xl font-bold tracking-tight"
                >
                    Welcome back, {user?.fullName?.split(" ")[0] || "Student"}! 👋
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    You have {inProgressCount} courses in progress. Keep pushing forward!
                </motion.p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="In Progress"
                    value={inProgressCount}
                    icon={BookOpen}
                    trend="Active"
                    trendUp={true}
                    delay={0.1}
                />
                <StatsCard
                    title="Completed"
                    value={completedCount}
                    icon={CheckCircle}
                    delay={0.2}
                />
                <StatsCard
                    title="Hours Spent"
                    value={`${hoursSpent}h`}
                    icon={Clock}
                    trend="12% increase"
                    trendUp={true}
                    delay={0.3}
                />
                <StatsCard
                    title="Avg. Score"
                    value={`${avgScore}%`}
                    icon={Trophy}
                    delay={0.4}
                />
            </div>

            {/* Recent Courses */}
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Continue Learning</h3>
                    <Link href="/dashboard/courses" className="text-sm text-primary hover:underline hover:text-primary/80 transition-colors">
                        View All Courses
                    </Link>
                </div>

                {myCourses.length > 0 ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {myCourses.slice(0, 3).map((course) => (
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
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-card/30"
                    >
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <h4 className="text-lg font-semibold">No active courses</h4>
                        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                            You haven't enrolled in any courses yet. Browse our catalog to find your next skill.
                        </p>
                        <Link href="/courses" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30">
                            Explore Catalog
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
