import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCoursePageData } from "@/lib/actions/course-page";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
    title: "Checkout | Dokkhota IT",
    description: "Complete your enrollment to start learning.",
};

interface CheckoutPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
    const { slug } = await params;
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Required login for checkout
    if (!user) {
        redirect(`/login?next=/checkout/${slug}`);
    }

    const result = await getCoursePageData(slug);
    if (!result.success || !result.data) {
        notFound();
    }

    const courseData = result.data;

    // Check if user is already enrolled
    const { data: enrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseData.course.id)
        .maybeSingle();

    if (enrollment) {
        redirect(`/dashboard/courses/${courseData.course.slug}`);
    }

    return (
        <CheckoutClient 
            course={courseData.course} 
            user={user} 
            bkashEnabled={courseData.course.bkash_automatic_enabled || false}
            manualMethods={courseData.course.manual_payment_methods || {}}
        />
    );
}
