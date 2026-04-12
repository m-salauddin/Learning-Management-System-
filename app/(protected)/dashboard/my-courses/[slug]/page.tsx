import { redirect } from "next/navigation";
import { getCoursePageData } from "@/lib/actions/course-page";
import CourseDashboardClient from "./CourseDashboardClient";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function MyCoursePage({ params }: PageProps) {
    const { slug } = await params;
    
    const result = await getCoursePageData(slug);

    if (!result.success || !result.data || !result.data.isEnrolled) {
        // If not found or not enrolled, redirect back to public course page
        redirect(`/courses/${slug}`);
    }

    return (
        <CourseDashboardClient data={result.data} />
    );
}
