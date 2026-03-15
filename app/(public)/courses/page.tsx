import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MappedCourse } from "@/types/mapped-course";

export const metadata: Metadata = {
    title: "Browse Courses - Dokkhota IT",
    description: "Explore our wide range of IT courses including Web Development, App Development, Cyber Security, and more. Start your learning journey today.",
};

export default async function CoursesPage() {
    const supabase = await createSupabaseServerClient();

    // Fetch published courses with resolved relationships
    const { data: courses, error } = await supabase
        .from('courses')
        .select(`
            id,
            slug,
            title,
            description,
            short_description,
            thumbnail_url,
            price,
            duration_hours,
            total_students,
            rating,
            rating_count,
            tags,
            level,
            language,
            requirements,
            status,
            course_type,
            batch_no,
            instructor:instructor_profiles!courses_instructor_id_fkey(
                users:instructor_profiles_id_fkey(
                    name,
                    avatar_url
                )
            )
        `)
        .eq('status', 'published')
        .order('serial_number', { ascending: true });

    if (error) {
        console.error("Error fetching courses:", error);
    }

    const mappedCourses: MappedCourse[] = (courses || []).map((c: any) => {
        const instructorProfile = Array.isArray(c.instructor) ? c.instructor[0] : c.instructor;
        const instructorData = Array.isArray(instructorProfile?.users) ? instructorProfile.users[0] : instructorProfile?.users;

        return {
            id: c.id,
            slug: c.slug,
            title: c.title,
            description: c.description || "",
            shortDescription: c.short_description || c.description || "",
            image: c.thumbnail_url || "/placeholder-course.jpg",
            price: c.price > 0 ? `৳${c.price}` : "Free",
            duration: c.duration_hours ? `${Math.floor(Number(c.duration_hours))}h` : "N/A",
            students: `${c.total_students || 0}+`,
            rating: Number(c.rating) || 0,
            reviews: c.rating_count || 0,
            instructor: {
                name: instructorData?.name || "Unknown Instructor",
                title: "Instructor",
                avatar: instructorData?.avatar_url || "",
                bio: ""
            },
            tags: c.tags || [],
            level: c.level || "Beginner",
            language: c.language || "English",
            lastUpdated: new Date().toLocaleDateString(),
            whatYouLearn: [],
            curriculum: [],
            type: c.course_type === 'hybrid' ? 'Live + Recorded' : (c.course_type === 'live' ? 'Live' : 'Recorded'),
            priceType: c.price > 0 ? "Paid" : "Free",
            batchNo: c.batch_no
        };
    });

    return (
        <main>
            <CoursesClient initialCourses={mappedCourses} />
        </main>
    );
}
