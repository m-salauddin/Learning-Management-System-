import { redirect, notFound } from "next/navigation";
import { getCoursePageData } from "@/lib/actions/course-page";
import CourseDashboardClient from "./CourseDashboardClient";


export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function MyCoursePage({ params }: PageProps) {
    const { slug } = await params;

    const result = await getCoursePageData(slug).catch((err) => {
        console.error(`[MyCoursePage] getCoursePageData threw for slug="${slug}":`, err);
        return { success: false, error: String(err) } as const;
    });

    if (!result.success || !('data' in result) || !result.data) {
        console.error(`[MyCoursePage] Course data fetch failed for slug="${slug}":`, 'error' in result ? result.error : 'unknown');
        notFound();
    }

    if (!result.data.isEnrolled) {
        redirect(`/courses/${slug}`);
    }

    return (
        <CourseDashboardClient data={result.data} />
    );
}
