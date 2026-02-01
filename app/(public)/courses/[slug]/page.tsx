import type { Metadata } from "next";
// import { notFound } from "next/navigation";
import CourseDetailClient from "./CourseDetailClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MappedCourse, CurriculumModule } from "@/types/mapped-course";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createSupabaseServerClient();

    // Simple fetch for title and description
    const { data: course } = await supabase
        .from('courses')
        .select('title, description')
        .eq('slug', decodedSlug)
        .maybeSingle();

    return {
        title: course?.title ? `${course.title} - Dokkhota IT` : "Course Details",
        description: course?.description || "Course details",
    };
}

export default async function CourseDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createSupabaseServerClient();

    // Fetch currentUser to see if we are anon or auth
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch Course Basic Info
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', decodedSlug)
        .maybeSingle();

    if (courseError || !course) {
        console.error("Course fetch error:", courseError);
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 text-gray-900">
                <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-red-200">
                    <h1 className="text-2xl font-bold text-red-600 mb-6">Course Not Found</h1>
                    <div className="space-y-4 text-sm font-mono bg-slate-100 p-4 rounded overflow-auto">
                        <p><strong>Slug:</strong> {decodedSlug}</p>
                        <p><strong>Error:</strong> {courseError ? JSON.stringify(courseError) : "None (Course is null)"}</p>
                        <p><strong>User:</strong> {user ? user.id : "Anon"}</p>
                    </div>
                </div>
            </div>
        );
    }

    const courseData = course;

    // 2. Fetch Instructor
    let instructorData = { name: "Unknown", avatar_url: "" };
    if (courseData.instructor_id) {
        const { data: instructor } = await supabase
            .from('users')
            .select('name, avatar_url')
            .eq('id', courseData.instructor_id)
            .maybeSingle();
        if (instructor) instructorData = instructor;
    }

    // 3. Fetch Modules
    const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseData.id)
        .order('position', { ascending: true });

    if (modulesError) {
        console.error("Modules fetch error:", modulesError);
    }

    // 4. Fetch Lessons
    let allLessons: any[] = [];
    if (modules && modules.length > 0) {
        const moduleIds = modules.map(m => m.id);
        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('*')
            .in('module_id', moduleIds)
            .order('position', { ascending: true });

        if (lessons) allLessons = lessons;
        if (lessonsError) console.error("Lessons fetch error:", lessonsError);
    }

    // 5. Construct Curriculum
    const curriculum: CurriculumModule[] = (modules || []).map((mod: any) => {
        const modLessons = allLessons
            .filter((l: any) => l.module_id === mod.id)
            .sort((a: any, b: any) => (a.position || 0) - (b.position || 0));

        const durationMinutes = modLessons.reduce((acc: number, l: any) => acc + (l.duration_minutes || 0), 0);
        const hours = Math.floor(durationMinutes / 60);
        const mins = durationMinutes % 60;
        const durationStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

        return {
            title: mod.title,
            duration: durationStr,
            lessons: modLessons.map((l: any) => ({
                title: l.title,
                isFreePreview: !!l.is_free_preview,
                duration: `${l.duration_minutes || 0} min`
            }))
        };
    });

    const mappedCourse: MappedCourse = {
        id: courseData.id,
        slug: courseData.slug,
        title: courseData.title,
        description: courseData.description || "",
        longDescription: (courseData.description || "") + (courseData.requirements ? ("\n\nRequirements:\n" + courseData.requirements.map((r: string) => `- ${r}`).join("\n")) : ""),
        image: courseData.thumbnail_url || "/placeholder-course.jpg",
        price: courseData.price > 0 ? `৳${courseData.price}` : "Free",
        duration: courseData.duration_hours ? `${courseData.duration_hours}h` : "Unknown",
        students: `${courseData.total_students || 0}+`,
        rating: courseData.rating || 0,
        reviews: courseData.rating_count || 0,
        instructor: {
            name: instructorData.name || "Unknown",
            title: "Instructor",
            avatar: instructorData.avatar_url || "",
            bio: ""
        },
        tags: courseData.tags || [],
        level: courseData.level || "Beginner",
        language: courseData.language || "English",
        lastUpdated: new Date(courseData.updated_at).toLocaleDateString(),
        whatYouLearn: courseData.learning_objectives || [],
        curriculum: curriculum,
        type: "Recorded",
        priceType: courseData.price > 0 ? "Paid" : "Free"
    };

    return (
        <CourseDetailClient course={mappedCourse} />
    )
}
