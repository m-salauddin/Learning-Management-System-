import { getTranslations } from "next-intl/server";
import {
  HeroSection,
  TechStackSection,
  FeaturesSection,
  CoursesSection,
  HowItWorks,
  TerminalSection,
  TestimonialsSection,
  CTASection,
  FAQSection,
} from "@/components/sections";
import { FloatingNav } from "@/components/FloatingNav";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MappedCourse } from "@/types/mapped-course";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("home.title"),
    description: t("home.description"),
  };
}
export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const { data: coursesData, error: coursesError } = await supabase
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
      status,
      batch_no,
      instructor:instructor_profiles!courses_instructor_id_fkey(
        users:instructor_profiles_id_fkey(
          name,
          avatar_url
        )
      )
    `)
    .eq('status', 'published')
    .order('serial_number', { ascending: true })
    .limit(6);
  if (coursesError) {
    console.error("Error fetching homepage courses:", coursesError);
  }
  const mappedCourses: MappedCourse[] = (coursesData || []).map((course: any) => {
    const instructorProfile = Array.isArray(course.instructor) ? course.instructor[0] : course.instructor;
    const instructorData = Array.isArray(instructorProfile?.users) ? instructorProfile.users[0] : instructorProfile?.users;
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description || "",
      shortDescription: course.short_description || course.description || "",
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
      lastUpdated: "2024-05-05", // Standardized date for hydration consistency
      whatYouLearn: [],
      curriculum: [],
      type: "Recorded",
      priceType: course.price > 0 ? "Paid" : "Free",
      batchNo: course.batch_no
    };
  });
  const tMetadata = await getTranslations("Metadata");
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
    "description": tMetadata("home.description")
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
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
