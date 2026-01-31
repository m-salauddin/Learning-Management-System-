"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { motion } from "motion/react";
import { Search, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

interface EnrolledCourse {
    course: {
        id: string;
        slug: string;
        title: string;
        thumbnail_url: string;
        total_lessons: number;
    };
    completed_lessons: number;
    progress_percentage: number;
}

export default function MyCoursesPage() {
    const { user } = useAppSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from('enrollments')
                .select(`
                    completed_lessons,
                    progress_percentage,
                    course:courses(
                        id,
                        slug,
                        title,
                        thumbnail_url,
                        total_lessons
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'active');

            if (data) {
                setEnrolledCourses(data as unknown as EnrolledCourse[]);
            }
            setLoading(false);
        };

        fetchCourses();
    }, []);

    const filteredCourses = enrolledCourses.filter(enrollment =>
        enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase())
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

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[280px] rounded-2xl bg-muted/20 animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    {filteredCourses.map((enrollment) => (
                        <motion.div key={enrollment.course.slug} variants={item}>
                            <CourseProgressCard
                                slug={enrollment.course.slug}
                                title={enrollment.course.title}
                                image={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop'}
                                progress={enrollment.progress_percentage || 0}
                                totalLessons={enrollment.course.total_lessons || 0}
                                completedLessons={enrollment.completed_lessons || 0}
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
