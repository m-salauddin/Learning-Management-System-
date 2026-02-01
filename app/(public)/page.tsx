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

  // Fetch popular courses for Home page
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

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description || "",
      image: course.thumbnail_url || "/placeholder-course.jpg",
      price: course.price > 0 ? `৳${course.price}` : "Free",
      duration: course.duration_hours ? `${Math.floor(Number(course.duration_hours))}h` : "N/A",
      students: `${course.total_students || 0}+`,
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
