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
            thumbnail_url,
            price,
            duration_hours,
            total_students,
            total_lessons,
            batch_no,
            rating,
            rating_count,
            tags,
            level,
            language,
            learning_objectives,
            requirements,
            status,
            instructor:instructor_profiles!courses_instructor_id_fkey(
                users:instructor_profiles_id_fkey(
                    name,
                    avatar_url
                )
            ),
            discounts:course_discounts(
                value,
                type,
                starts_at,
                ends_at,
                is_active
            )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching courses:", error);
    }

    const mappedCourses: MappedCourse[] = (courses || []).map((c: any) => {
        const instructorProfile = Array.isArray(c.instructor) ? c.instructor[0] : c.instructor;
        const instructorData = Array.isArray(instructorProfile?.users) ? instructorProfile.users[0] : instructorProfile?.users;

        // Calculate discount
        let discountPrice: string | undefined = undefined;
        let discountExpiresAt: string | undefined = undefined;

        if (c.discounts && c.discounts.length > 0) {
            const now = new Date();
            // Find the first valid active discount
            const activeDiscount = c.discounts.find((d: any) =>
                d.is_active &&
                (!d.starts_at || new Date(d.starts_at) <= now) &&
                (!d.ends_at || new Date(d.ends_at) > now)
            );

            if (activeDiscount) {
                let finalPrice = c.price;
                if (activeDiscount.type === 'fixed') {
                    finalPrice = Math.max(0, c.price - activeDiscount.value);
                } else if (activeDiscount.type === 'percentage') {
                    finalPrice = Math.max(0, c.price * (1 - activeDiscount.value / 100));
                }

                discountPrice = `৳${Math.floor(finalPrice)}`;
                discountExpiresAt = activeDiscount.ends_at;
            }
        }

        return {
            id: c.id,
            slug: c.slug,
            title: c.title,
            description: c.description || "",
            image: c.thumbnail_url || "/placeholder-course.jpg",
            price: c.price > 0 ? `৳${c.price}` : "Free",
            discountPrice,
            discountExpiresAt,
            duration: c.duration_hours ? `${Math.floor(Number(c.duration_hours))}h` : "N/A",
            students: `${c.total_students || 0}+`,
            totalLessons: c.total_lessons || 0,
            batchNo: c.batch_no || undefined,
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
            whatYouLearn: c.learning_objectives || [],
            curriculum: [],
            type: "Recorded",
            priceType: c.price > 0 ? "Paid" : "Free"
        };
    });

    return (
        <main>
            <CoursesClient initialCourses={mappedCourses} />
        </main>
    );
}
