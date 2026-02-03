import type { Metadata } from "next";
import CourseDetailClient from "./CourseDetailClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCoursePageData } from "@/lib/actions/course-page";
import { MappedCourse, CurriculumModule } from "@/types/mapped-course";
import { CoursePageData } from "@/types/course-page";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// ============================================================================
// METADATA GENERATION
// ============================================================================

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createSupabaseServerClient();

    // Simple fetch for id, title and description
    const { data: course } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('slug', decodedSlug)
        .maybeSingle();

    // Check for SEO overrides in course_details (only if course exists)
    let seoTitle: string | null = null;
    let seoDescription: string | null = null;

    if (course?.id) {
        const { data: details } = await supabase
            .from('course_details')
            .select('seo_title, seo_description')
            .eq('course_id', course.id)
            .maybeSingle();
        seoTitle = details?.seo_title || null;
        seoDescription = details?.seo_description || null;
    }

    return {
        title: seoTitle || (course?.title ? `${course.title} - Dokkhota IT` : "Course Details"),
        description: seoDescription || course?.description || "Course details",
    };
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export default async function CourseDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createSupabaseServerClient();

    // Fetch currentUser
    const { data: { user } } = await supabase.auth.getUser();

    // Use the comprehensive course page data fetcher
    const result = await getCoursePageData(decodedSlug);

    if (!result.success || !result.data) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 text-gray-900">
                <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-lg border border-red-200">
                    <h1 className="text-2xl font-bold text-red-600 mb-6">Course Not Found</h1>
                    <div className="space-y-4 text-sm font-mono bg-slate-100 p-4 rounded overflow-auto">
                        <p><strong>Slug:</strong> {decodedSlug}</p>
                        <p><strong>Error:</strong> {result.error || "Course not found"}</p>
                        <p><strong>User:</strong> {user ? user.id : "Anon"}</p>
                    </div>
                </div>
            </div>
        );
    }

    const pageData = result.data;

    // Debug logging
    console.log('[CourseDetailPage] Data fetched:', {
        courseId: pageData.course.id,
        courseTitle: pageData.course.title,
        detailsPresent: !!pageData.details,
        faqCount: pageData.faq?.length || 0,
        projectsCount: pageData.projects?.length || 0,
        resourcesCount: pageData.resources?.length || 0,
        reviewsCount: pageData.reviews?.length || 0,
        modulesCount: pageData.modules?.length || 0,
    });

    // Transform to MappedCourse format for backward compatibility
    const mappedCourse = transformToMappedCourse(pageData);
    return (
        <CourseDetailClient course={mappedCourse} pageData={pageData} />
    );
}

// ============================================================================
// HELPER: Transform CoursePageData to MappedCourse
// ============================================================================

function transformToMappedCourse(pageData: CoursePageData): MappedCourse {
    const { course, details, instructor, modules, totalLessons, totalDuration } = pageData;

    // Build curriculum from modules
    const curriculum: CurriculumModule[] = modules.map((mod) => {
        const durationMinutes = mod.total_duration_minutes;
        const hours = Math.floor(durationMinutes / 60);
        const mins = durationMinutes % 60;
        const durationStr = hours > 0 ? `${hours} hr ${mins} min` : `${mins} min`;

        return {
            title: mod.title,
            duration: durationStr,
            lessons: mod.lessons.map((l) => ({
                title: l.title,
                isFreePreview: l.is_free_preview,
                duration: `${l.duration_minutes || 0} min`,
                type: l.lesson_type
            }))
        };
    });

    // Calculate total duration string
    const totalHours = Math.floor(totalDuration / 60);
    const totalMins = totalDuration % 60;
    const durationString = totalHours > 0
        ? `${totalHours}h ${totalMins}m`
        : `${totalMins}m`;

    return {
        id: course.id,
        slug: course.slug || '',
        title: course.title,
        description: course.description || "",
        longDescription: details?.description_long || course.description || "",
        image: course.thumbnail_url || "/placeholder-course.jpg",
        // Handle price - include discount support
        price: course.price > 0 ? `৳${course.price.toLocaleString()}` : "Free",
        originalPrice: course.price > 0 ? `৳${course.price.toLocaleString()}` : undefined,
        discountPrice: course.discount_price && course.discount_price > 0
            ? `৳${course.discount_price.toLocaleString()}`
            : undefined,
        duration: durationString,
        students: `${course.total_students || 0}+`,
        rating: course.rating || 0,
        reviews: pageData.ratingBreakdown.total,
        instructor: {
            name: instructor.name,
            title: "Instructor",
            avatar: instructor.avatar_url || "",
            bio: instructor.bio || ""
        },
        tags: course.tags || [],
        level: course.level || "Beginner",
        language: details?.language || "English",
        lastUpdated: new Date(course.updated_at).toLocaleDateString(),
        whatYouLearn: details?.learning_outcomes || course.learning_objectives || [],
        requirements: details?.requirements || course.requirements || [],
        curriculum: curriculum,
        type: "Recorded",
        priceType: course.price > 0 ? "Paid" : "Free",
        // Extended fields from new data
        targetAudience: details?.target_audience || [],
        curriculumOverview: details?.curriculum_overview || "",
    };
}
