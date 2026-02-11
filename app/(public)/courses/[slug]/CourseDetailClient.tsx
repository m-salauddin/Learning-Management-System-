"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import {
    X as XIcon,
} from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";
import { CoursePageData } from "@/types/course-page";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { submitCourseLead, submitCourseReview } from "@/lib/actions/course-page";

// Section Components
import CourseHero from "./sections/CourseHero";
import CourseFeatures from "./sections/CourseFeatures";
import CourseTechStack from "./sections/CourseTechStack";
import CoursePrerequisites from "./sections/CoursePrerequisites";
import CourseCurriculum from "./sections/CourseCurriculum";
import CourseInstructor from "./sections/CourseInstructor";
import CourseProjects from "./sections/CourseProjects";
import CourseReviews from "./sections/CourseReviews";
import CourseCertification from "./sections/CourseCertification";
import CourseFAQSection from "./sections/CourseFAQ";
import RelatedCourses from "./sections/RelatedCourses";
import CourseSidebar from "./sections/CourseSidebar";
import CourseModals from "./sections/CourseModals";

interface CourseDetailClientProps {
    course: MappedCourse;
    pageData?: CoursePageData;
}

export default function CourseDetailClient({ course, pageData }: CourseDetailClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expandedModules, setExpandedModules] = useState<number[]>([]);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [curriculumTab, setCurriculumTab] = useState<'live' | 'recorded'>('recorded');

    const [showAllModules, setShowAllModules] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [leadForm, setLeadForm] = useState({ name: '', email: '', message: '' });
    const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' });
    const [hoverRating, setHoverRating] = useState(0);
    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

    const supabase = createClient();
    const { success, error, info } = useToast();

    const {
        instructor: instructorInfo,
        projects = [],
        faq = [],
        reviews = [],
        ratingBreakdown = { average: course.rating, total: course.reviews, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        relatedCourses = [] as any[]
    } = pageData || {};

    const mappedRelatedCourses = useMemo(() => {
        return (relatedCourses || []).map((c: any) => ({
            id: c.id,
            slug: c.slug || '',
            title: c.title || '',
            description: c.description || '',
            image: c.thumbnail_url || '/placeholder-course.jpg',
            price: c.price > 0 ? `৳${c.price.toLocaleString()}` : "Free",
            originalPrice: c.price > 0 ? `৳${c.price.toLocaleString()}` : undefined,
            discountPrice: c.discount_price && c.discount_price > 0
                ? `৳${c.discount_price.toLocaleString()}`
                : undefined,
            duration: `${c.duration_hours || 0}h`,
            students: `${c.total_students || 0}+`,
            rating: c.rating || 0,
            reviews: c.rating_count || 0,
            instructor: {
                name: '',
                title: '',
                avatar: '',
                bio: ''
            },
            tags: c.tags || [],
            level: c.level || "Beginner",
            language: c.language || "English",
            lastUpdated: new Date(c.updated_at || Date.now()).toLocaleDateString(),
            whatYouLearn: [],
            curriculum: [],
            type: "Recorded",
            priceType: c.price > 0 ? "Paid" : "Free"
        })) as MappedCourse[];
    }, [relatedCourses]);

    const isLive = !!(course.type?.toLowerCase().includes('live') || pageData?.batches?.some(b => b.is_active));

    useEffect(() => {
        if (!course.discountExpiresAt) {
            setTimeLeft(null);
            return;
        }

        const targetDate = new Date(course.discountExpiresAt);
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft(null);
            } else {
                setTimeLeft({
                    d: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [course.discountExpiresAt]);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = `Check out this course: ${course.title}`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setLinkCopied(true);
            success('Link copied to clipboard!');
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            error('Failed to copy link');
        }
    };

    const shareOptions = [
        {
            name: 'Twitter / X',
            icon: <XIcon className="w-4 h-4" />,
            color: 'bg-black hover:bg-zinc-800',
            action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
        },
        {
            name: 'Facebook',
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
            color: 'bg-[#1877F2] hover:bg-[#166FE5]',
            action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
        },
        {
            name: 'LinkedIn',
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
            color: 'bg-[#0A66C2] hover:bg-[#004182]',
            action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
        },
        {
            name: 'WhatsApp',
            icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>,
            color: 'bg-[#25D366] hover:bg-[#128C7E]',
            action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
        },
    ];

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode) return;
        setIsApplyingCoupon(true);

        setTimeout(() => {
            setIsApplyingCoupon(false);
            if (couponCode.toUpperCase() === 'WELCOME50') {
                success('Coupon applied successfully!');
            } else {
                error('Invalid coupon code');
            }
        }, 1500);
    };

    const outlineModules = useMemo(() => {
        if (pageData?.courseOutline && pageData.courseOutline.length > 0) {
            return pageData.courseOutline.map(m => ({
                title: m.title,
                duration: `${m.estimated_duration_minutes} min`,
                lessons: m.topics.map(t => ({
                    title: t.title,
                    isFreePreview: t.is_free_preview,
                    duration: `${t.duration_minutes} min`,
                    type: t.topic_type
                }))
            }));
        }
        return course.curriculum || [];
    }, [pageData?.courseOutline, course.curriculum]);

    const filteredModules = useMemo(() => {
        return outlineModules.map(mod => ({
            ...mod,
            lessons: mod.lessons?.filter(l => {
                if (curriculumTab === 'live') {
                    return l.type === 'live';
                }
                return l.type !== 'live';
            }) || []
        })).filter(mod => mod.lessons && mod.lessons.length > 0);
    }, [outlineModules, curriculumTab]);

    const displayedModules = showAllModules ? filteredModules : filteredModules.slice(0, 6);
    const totalLectures = filteredModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
    const totalSections = filteredModules.length;

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await submitCourseLead({
            course_id: course.id,
            ...leadForm,
            source: 'course_detail_page'
        });
        setSubmitting(false);
        if (res.success) {
            success("Message sent successfully!");
            setShowLeadModal(false);
            setLeadForm({ name: '', email: '', message: '' });
        } else {
            error(res.error || "Failed to send message");
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await submitCourseReview({
            course_id: course.id,
            rating: reviewForm.rating,
            review_text: reviewForm.review_text
        });
        setSubmitting(false);
        if (res.success) {
            success("Review submitted successfully!");
            setShowReviewModal(false);
            router.refresh();
        } else {
            error(res.error || "Failed to submit review");
        }
    };

    const handleEnroll = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            error("Please login to enroll");
            router.push(`/login?next=/courses/${course.slug}`);
            setLoading(false);
            return;
        }

        if (course.priceType === "Free") {
            try {
                const res = await fetch('/api/enroll', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ courseId: course.id })
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Enrollment failed");
                }

                success("Enrolled successfully!");
                router.refresh();
                router.push(`/dashboard`);
            } catch (err: any) {
                error(err.message);
            }
        } else {
            info("Payment integration coming soon. This is a demo.");
        }
        setLoading(false);
    };

    const toggleModule = (index: number) => {
        setExpandedModules(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const toggleFaq = (index: number) => {
        setExpandedFaq(prev => prev === index ? null : index);
    };

    const hasDiscount = course.discountPrice && course.discountPrice !== course.price;
    const formattedPrice = course.priceType === "Free" ? "Free" : (course.discountPrice || course.price);
    const originalPrice = hasDiscount ? course.price : course.originalPrice;

    const discountPercentage = hasDiscount && course.originalPrice
        ? Math.round((1 - parseFloat(course.discountPrice!.replace(/[^\d]/g, '')) / parseFloat(course.originalPrice.replace(/[^\d]/g, ''))) * 100)
        : null;

    return (
        <div className="min-h-screen bg-background text-foreground relative pt-20">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-0 -right-[10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[100px] opacity-30" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pb-12 z-10">
                <div className="grid lg:grid-cols-12 gap-8 xl:gap-14">
                    {/* Left Column (Content) */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <CourseHero
                            course={course}
                            pageData={pageData}
                            isLive={isLive}
                            timeLeft={timeLeft}
                            handleEnroll={handleEnroll}
                            loading={loading}
                        />

                        {/* All Sections - Sequential View */}
                        <div className="mt-12 sm:mt-16 space-y-20">
                            <CourseFeatures totalLectures={totalLectures} />

                            <CourseTechStack tags={course.tags || []} />

                            <CoursePrerequisites
                                requirements={course.requirements || []}
                                targetAudience={course.targetAudience || []}
                            />

                            <CourseCurriculum
                                course={course}
                                pageData={pageData}
                                curriculumTab={curriculumTab}
                                setCurriculumTab={setCurriculumTab}
                                showAllModules={showAllModules}
                                setShowAllModules={setShowAllModules}
                                expandedModules={expandedModules}
                                toggleModule={toggleModule}
                                filteredModules={filteredModules}
                                displayedModules={displayedModules}
                                totalSections={totalSections}
                                totalLectures={totalLectures}
                            />

                            <CourseInstructor
                                course={course}
                                instructorInfo={instructorInfo}
                            />

                            <CourseProjects projects={projects} />

                            <CourseReviews
                                reviews={reviews}
                                ratingBreakdown={ratingBreakdown}
                                showAllReviews={showAllReviews}
                                setShowAllReviews={setShowAllReviews}
                                setShowReviewModal={setShowReviewModal}
                            />

                            <CourseCertification course={course} />

                            <CourseFAQSection
                                faq={faq}
                                expandedFaq={expandedFaq}
                                toggleFaq={toggleFaq}
                                setShowLeadModal={setShowLeadModal}
                            />

                            <RelatedCourses relatedCourses={mappedRelatedCourses} />
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <CourseSidebar
                        course={course}
                        timeLeft={timeLeft}
                        formattedPrice={formattedPrice}
                        hasDiscount={hasDiscount || false}
                        originalPrice={originalPrice}
                        discountPercentage={discountPercentage}
                        showCouponInput={showCouponInput}
                        setShowCouponInput={setShowCouponInput}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        isApplyingCoupon={isApplyingCoupon}
                        handleApplyCoupon={handleApplyCoupon}
                        handleEnroll={handleEnroll}
                        loading={loading}
                        setShowShareModal={setShowShareModal}
                    />
                </div>
            </div>

            <CourseModals
                course={course}
                showLeadModal={showLeadModal}
                setShowLeadModal={setShowLeadModal}
                leadForm={leadForm}
                setLeadForm={setLeadForm}
                submitting={submitting}
                handleLeadSubmit={handleLeadSubmit}
                showReviewModal={showReviewModal}
                setShowReviewModal={setShowReviewModal}
                reviewForm={reviewForm}
                setReviewForm={setReviewForm}
                hoverRating={hoverRating}
                setHoverRating={setHoverRating}
                handleReviewSubmit={handleReviewSubmit}
                showShareModal={showShareModal}
                setShowShareModal={setShowShareModal}
                shareOptions={shareOptions}
                handleCopyLink={handleCopyLink}
                linkCopied={linkCopied}
                shareUrl={shareUrl}
            />
        </div>
    );
}