"use client";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { Search, BookOpen, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { SearchInput, StatsSkeleton, EmptyDataState, EmptyFilterState } from "@/components/dashboard/shared";

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
        <div className="space-y-8 pb-10">
            <PageHeader
                title="My Courses"
                description="Manage and track your active learning protocols"
                icon={GraduationCap}
                actions={
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search courses..."
                        className="w-full sm:w-64"
                    />
                }
            />

            {loading ? (
                <DashboardGrid cols={3}>
                    <StatsSkeleton count={3} />
                </DashboardGrid>
            ) : filteredCourses.length > 0 ? (
                <DashboardGrid cols={3}>
                    {filteredCourses.map((enrollment) => (
                        <CourseProgressCard
                            key={enrollment.course.slug}
                            slug={enrollment.course.slug}
                            title={enrollment.course.title}
                            image={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop'}
                            progress={enrollment.progress_percentage || 0}
                            totalLessons={enrollment.course.total_lessons || 0}
                            completedLessons={enrollment.completed_lessons || 0}
                        />
                    ))}
                </DashboardGrid>
            ) : (
                searchQuery ? (
                    <EmptyFilterState 
                        searchTerm={searchQuery} 
                        onReset={() => setSearchQuery("")}
                    />
                ) : (
                    <EmptyDataState
                        icon={BookOpen}
                        title="No active courses"
                        description="You haven't enrolled in any courses yet. Start your journey today!"
                        action={
                            <Link href="/courses" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-xs">
                                Browse Catalog
                            </Link>
                        }
                    />
                )
            )}
        </div>
    );
}
