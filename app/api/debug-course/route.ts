import { NextRequest, NextResponse } from 'next/server';
import { getCoursePageData } from '@/lib/actions/course-page';
export async function GET(request: NextRequest) {
    const slug = request.nextUrl.searchParams.get('slug') || 'complete-web-development-bootcamp-2026';
    const result = await getCoursePageData(slug);
    if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 404 });
    }
    const { data } = result;
    return NextResponse.json({
        course: {
            id: data?.course.id,
            title: data?.course.title,
            slug: data?.course.slug,
        },
        details: data?.details ? {
            hasDetails: true,
            learning_outcomes: data.details.learning_outcomes,
            requirements: data.details.requirements,
            target_audience: data.details.target_audience,
        } : null,
        faqCount: data?.faq?.length || 0,
        faqItems: data?.faq || [],
        projectsCount: data?.projects?.length || 0,
        projectItems: data?.projects || [],
        resourcesCount: data?.resources?.length || 0,
        resourceItems: data?.resources || [],
        reviewsCount: data?.reviews?.length || 0,
        modulesCount: data?.modules?.length || 0,
    });
}
