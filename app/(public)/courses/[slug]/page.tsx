import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MappedCourse, CurriculumModule } from "@/types/mapped-course";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createSupabaseServerClient();

    // Simple fetch for title and description
    const { data: course } = await supabase
        .from('courses')
        .select('title, description')
        .eq('slug', slug)
        .single();

    return {
        title: course?.title ? `${course.title} - Dokkhota IT` : "Course Details",
        description: course?.description || "Course details",
    };
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createSupabaseServerClient();

    // Fetch detailed course info + modules + lessons
    const { data: course, error } = await supabase
        .from('courses')
        .select(`
            id,
            slug,
            title,
            description,
            thumbnail_url,
            price,
            duration_hours,
            total_students,
            rating,
            rating_count,
            tags,
            level,
            language,
            learning_objectives,
            requirements,
            status,
            updated_at,
            instructor:users(
                name,
                avatar_url
            ),
            modules (
                id,
                title,
                sort_order,
                lessons (
                    id,
                    title,
                    duration_minutes,
                    sort_order,
                    is_free_preview
                )
            )
        `)
        .eq('slug', slug)
        .single();

    if (error || !course) {
        return notFound();
    }

    const sortedModules = (course.modules || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

    const curriculum: CurriculumModule[] = sortedModules.map((mod: any) => {
        const sortedLessons = (mod.lessons || []).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));
        const durationMinutes = sortedLessons.reduce((acc: number, l: any) => acc + (l.duration_minutes || 0), 0);

        const hours = Math.floor(durationMinutes / 60);
        const mins = durationMinutes % 60;
        const durationStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

        return {
            title: mod.title,
            duration: durationStr,
            lessons: sortedLessons.map((l: any) => ({
                title: l.title,
                isFreePreview: !!l.is_free_preview,
                duration: `${l.duration_minutes || 0} min`
            }))
        };
    });

    const instructorData = Array.isArray(course.instructor) ? course.instructor[0] : course.instructor;

    const mappedCourse: MappedCourse = {
        id: course.id,
        slug: course.slug,
        title: course.title,
        description: course.description || "",
        longDescription: (course.description || "") + (course.requirements ? ("\n\nRequirements:\n" + course.requirements.map((r: string) => `- ${r}`).join("\n")) : ""),
        image: course.thumbnail_url || "/placeholder-course.jpg",
        price: course.price > 0 ? `৳${course.price}` : "Free",
        duration: course.duration_hours ? `${course.duration_hours}h` : "Unknown",
        students: `${course.total_students || 0}+`,
        rating: course.rating || 0,
        reviews: course.rating_count || 0,
        instructor: {
            name: instructorData?.name || "Unknown",
            title: "Instructor",
            avatar: instructorData?.avatar_url || "",
            bio: ""
        },
        tags: course.tags || [],
        level: course.level || "Beginner",
        language: course.language || "English",
        lastUpdated: new Date(course.updated_at).toLocaleDateString(),
        whatYouLearn: course.learning_objectives || [],
        curriculum: curriculum,
        type: "Recorded",
        priceType: course.price > 0 ? "Paid" : "Free"
    };

    return (
        <CourseDetailClient course={mappedCourse} />
    );
}
