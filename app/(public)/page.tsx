import { Metadata } from "next";
import {
  HeroSection,
  TechStackSection,
  FeaturesSection,
  CoursesSection,
  HowItWorks,
  TerminalSection,
  PricingSection,
  TestimonialsSection,
  CTASection,
} from "@/components/sections";

import { FloatingNav } from "@/components/FloatingNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MappedCourse } from "@/types/mapped-course";

export const metadata: Metadata = {
  title: "Best IT Training & Skill Development Platform",
  description: "Join Dokkhota IT to master Web Development, App Development, and AI. Rated #1 IT Training Center in Bangladesh with job placement support.",
};

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  // Fetch published courses with resolved relationships
  const { data: coursesData, error: coursesError } = await supabase
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
    .order('total_students', { ascending: false })
    .limit(6);

  if (coursesError) {
    console.error("Error fetching homepage courses:", coursesError);
  }

  const mappedCourses: MappedCourse[] = (coursesData || []).map((course: any) => {
    // Navigate through instructor_profiles to users
    const instructorProfile = Array.isArray(course.instructor) ? course.instructor[0] : course.instructor;
    const instructorData = Array.isArray(instructorProfile?.users) ? instructorProfile.users[0] : instructorProfile?.users;

    // Calculate discount
    let discountPrice: string | undefined = undefined;
    let discountExpiresAt: string | undefined = undefined;

    if (course.discounts && course.discounts.length > 0) {
      const now = new Date();
      // Find the first valid active discount
      const activeDiscount = course.discounts.find((d: any) =>
        d.is_active &&
        (!d.starts_at || new Date(d.starts_at) <= now) &&
        (!d.ends_at || new Date(d.ends_at) > now)
      );

      if (activeDiscount) {
        let finalPrice = course.price;
        if (activeDiscount.type === 'fixed') {
          finalPrice = Math.max(0, course.price - activeDiscount.value);
        } else if (activeDiscount.type === 'percentage') {
          finalPrice = Math.max(0, course.price * (1 - activeDiscount.value / 100));
        }

        discountPrice = `৳${Math.floor(finalPrice)}`;
        discountExpiresAt = activeDiscount.ends_at;
      }
    }

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description || "",
      image: course.thumbnail_url || "/placeholder-course.jpg",
      price: course.price > 0 ? `৳${course.price}` : "Free",
      discountPrice,
      discountExpiresAt,
      duration: course.duration_hours ? `${Math.floor(Number(course.duration_hours))}h` : "N/A",
      students: `${course.total_students || 0}+`,
      totalLessons: course.total_lessons || 0,
      batchNo: course.batch_no || undefined,
      rating: Number(course.rating) || 0,
      reviews: course.rating_count || 0,
      instructor: {
        name: instructorData?.name || "Unknown Instructor",
        title: "Instructor",
        avatar: instructorData?.avatar_url || "",
        bio: ""
      },
      tags: course.tags || [],
      level: course.level || "Beginner",
      language: course.language || "English",
      lastUpdated: new Date().toLocaleDateString(),
      whatYouLearn: [],
      curriculum: [],
      type: "Recorded",
      priceType: course.price > 0 ? "Paid" : "Free"
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dokkhota IT",
    "url": "https://dokkhotait.com",
    "logo": "https://dokkhotait.com/logo.png",
    "sameAs": [
      "https://facebook.com/dokkhotait",
      "https://twitter.com/dokkhotait",
      "https://linkedin.com/company/dokkhotait"
    ],
    "description": "Dokkhota IT is the premier IT training platform in Bangladesh offering courses in Web Development, App Development, and AI."
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FloatingNav />
      <HeroSection />
      <TechStackSection />
      <FeaturesSection />
      <CoursesSection courses={mappedCourses} />
      <HowItWorks />
      <TerminalSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  );
}
