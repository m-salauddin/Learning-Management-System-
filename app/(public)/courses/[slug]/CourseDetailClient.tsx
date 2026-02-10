"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Star,
    Clock,
    Users,
    BookOpen,
    Play,
    CheckCircle2,
    Award,
    FileText,
    Download,
    ChevronDown,
    ChevronRight,
    Layout,
    Share2,
    Target,
    HelpCircle,
    ExternalLink,

    Code,
    FileCode,
    File,
    Image as ImageIcon,
    Video,
    Plus,
    Minus,
    PlayCircle,
    Tag,
    Zap,
    Headphones,
    Wrench,
    Building,
    Infinity,
    Copy,
    CheckIcon,
    X,
    Layers,
    Rocket,
    Server,
    Activity,
    Hash,
    Lock as LockIcon,
    ListChecks,
    FolderKanban,
    Calendar,
    MessageCircle,
    Globe
} from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";
import { CoursePageData, CourseProject, CourseResource, CourseFAQ, ReviewWithUser, RatingBreakdown, InstructorInfo } from "@/types/course-page";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import {
    Dialog,
    DialogBody,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { submitCourseLead, submitCourseReview } from "@/lib/actions/course-page";
import TechBadge, { getTechBadgeData } from "@/components/ui/TechBadge";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";


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
    const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'projects' | 'instructor' | 'reviews' | 'faq'>('overview');
    const [showAllModules, setShowAllModules] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const supabase = createClient();
    const { success, error, info } = useToast();


    const {
        details,
        instructor: instructorInfo,
        modules,
        totalLessons,
        totalDuration,
        courseOutline,
        projects = [],
        resources = [],
        faq = [],
        reviews = [],
        ratingBreakdown = { average: course.rating, total: course.reviews, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } },
        relatedCourses = [],
        category,
        userProgress,
        isEnrolled,
        enrollmentId,
        batches = []
    } = pageData || {};

    const isLive = course.type?.toLowerCase().includes('live') || (pageData?.batches && pageData.batches.some(b => b.is_active));

    const levelConfig = useMemo(() => {
        const level = course.level?.toLowerCase() || '';
        if (level.includes('beginner')) {
            return { icon: Rocket, label: 'Beginner', color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" };
        }
        if (level.includes('intermediate')) {
            return { icon: Layers, label: 'Intermediate', color: "border-amber-500/40 bg-amber-500/10 text-amber-400" };
        }
        if (level.includes('advanced')) {
            return { icon: Award, label: 'Advanced', color: "border-rose-500/40 bg-rose-500/10 text-rose-400" };
        }
        return { icon: Target, label: course.level || 'All Levels', color: "border-primary/40 bg-primary/10 text-primary" };
    }, [course.level]);


    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    const [leadForm, setLeadForm] = useState({ name: '', email: '', message: '' });
    const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' });


    const [hoverRating, setHoverRating] = useState(0);


    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);


    const [showShareModal, setShowShareModal] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);


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
            icon: <X className="w-4 h-4" />,
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


    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-4 h-4 text-red-400" />;
            case 'code': return <FileCode className="w-4 h-4 text-emerald-400" />;
            case 'link': return <ExternalLink className="w-4 h-4 text-blue-400" />;
            case 'video': return <Video className="w-4 h-4 text-purple-400" />;
            case 'image': return <ImageIcon className="w-4 h-4 text-pink-400" />;
            default: return <File className="w-4 h-4 text-slate-400" />;
        }
    };


    const hasDiscount = course.discountPrice && course.discountPrice !== course.price;
    const formattedPrice = course.priceType === "Free" ? "Free" : (course.discountPrice || course.price);
    const originalPrice = hasDiscount ? course.price : course.originalPrice;


    const discountPercentage = hasDiscount && course.originalPrice
        ? Math.round((1 - parseFloat(course.discountPrice!.replace(/[^\d]/g, '')) / parseFloat(course.originalPrice.replace(/[^\d]/g, ''))) * 100)
        : null;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden pt-20">


            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/3 -translate-y-1/3 pointer-events-none animate-gentle-pulse" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />


            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 lg:pb-12 z-10">
                <div className="lg:hidden mb-6">
                    <Breadcrumbs
                        rootLabel="Home"
                        items={[
                            { label: 'Courses', href: '/courses', icon: BookOpen },
                            { label: course.title, icon: Layout }
                        ]}
                    />
                </div>
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-8">


                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >

                            <div className="flex flex-wrap items-center gap-3">
                                <Badge
                                    icon={isLive ? Activity : Video}
                                    className={cn(
                                        "px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border rounded-full",
                                        isLive
                                            ? "border-red-500/40 bg-red-500/10 text-red-500"
                                            : "border-blue-500/40 bg-blue-500/10 text-blue-400"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {isLive && (
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                            </span>
                                        )}
                                        {isLive ? 'Live Course' : 'Recorded'}
                                    </span>
                                </Badge>

                                <Badge
                                    icon={levelConfig.icon}
                                    className={cn("px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border rounded-full", levelConfig.color)}
                                >
                                    {levelConfig.label}
                                </Badge>

                                <Badge
                                    icon={Hash}
                                    className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 rounded-full"
                                >
                                    Batch {course.batchNo ? (course.batchNo < 10 ? `0${course.batchNo}` : course.batchNo) : '01'}
                                </Badge>
                            </div>


                            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.15] mt-4 sm:mt-5">
                                <span className="gradient-text">{course.title}</span>
                            </h1>


                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mt-4 sm:mt-5">
                                {course.description}
                            </p>


                            {pageData?.batches && pageData.batches.length > 0 && pageData.batches.some(b => b.is_active) && (
                                <div className="mt-6 flex flex-wrap gap-4">
                                    {pageData.batches.filter(b => b.is_active).map(batch => (
                                        <div key={batch.id} className="flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                            <div className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Next Batch</span>
                                                <span className="text-xs text-emerald-100 font-semibold">
                                                    Starts {new Date(batch.start_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            {batch.seats_remaining < 10 && (
                                                <div className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 ml-2">
                                                    {batch.seats_remaining} seats left
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}


                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6">

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-primary fill-primary" />
                                    </div>
                                    <span className="font-medium">{course.rating} ({course.reviews} ratings)</span>
                                </div>


                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="font-medium">{course.students} students</span>
                                </div>


                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="font-medium">{course.duration} Total</span>
                                </div>


                                {timeLeft && (
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-destructive/5 border border-destructive/20 backdrop-blur-sm group hover:border-destructive/40 transition-all duration-300">
                                        <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-destructive/10 text-destructive">
                                            <Zap className="w-4 h-4 fill-destructive/20" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-heavy text-destructive/80 tracking-widest leading-none mb-1">Enrollment ends in</span>
                                            <div className="flex items-center gap-2 font-black text-sm text-destructive tabular-nums">
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-base">{timeLeft.d}</span>
                                                    <span className="text-[9px] font-bold opacity-60 uppercase">d</span>
                                                </div>
                                                <span className="opacity-30 font-light">:</span>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-base">{timeLeft.h}</span>
                                                    <span className="text-[9px] font-bold opacity-60 uppercase">h</span>
                                                </div>
                                                <span className="opacity-30 font-light">:</span>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-base">{timeLeft.m}</span>
                                                    <span className="text-[9px] font-bold opacity-60 uppercase">m</span>
                                                </div>
                                                <span className="opacity-30 font-light">:</span>
                                                <div className="flex items-baseline gap-0.5">
                                                    <span className="text-base">{timeLeft.s}</span>
                                                    <span className="text-[9px] font-bold opacity-60 uppercase">s</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>


                            <div className="flex flex-wrap items-center gap-6 mt-8 sm:mt-12">
                                <SecondaryCTAButton
                                    onClick={() => {/* download logic */ }}
                                    className="h-10! sm:h-12!"
                                >
                                    <div className="flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        <span>Download Outline</span>
                                    </div>
                                </SecondaryCTAButton>

                                <PrimaryCTAButton
                                    onClick={handleEnroll}
                                    loading={loading}
                                    className="h-10! sm:h-12!"
                                >
                                    Enroll Now
                                </PrimaryCTAButton>
                            </div>
                        </motion.div>



                        <div className="sticky top-[112px] sm:top-[112px] backdrop-blur-xl z-30 pt-4 sm:pt-6 pb-3 sm:pb-4 -mx-4 px-4 mt-12 sm:mt-20 lg:mt-24">
                            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                                <div className="bg-muted/30 p-1.5 sm:p-1.5 rounded-xl sm:rounded-2xl inline-flex gap-2 sm:gap-1 border border-border/40 shadow-sm min-w-max">
                                    {[
                                        { id: 'overview' as const, label: 'Overview', icon: <Layout className="w-4 h-4" /> },
                                        { id: 'curriculum' as const, label: 'Curriculum', icon: <BookOpen className="w-4 h-4" /> },
                                        { id: 'projects' as const, label: 'Projects', icon: <Code className="w-4 h-4" /> },
                                        { id: 'instructor' as const, label: 'Instructor', icon: <Award className="w-4 h-4" /> },
                                        { id: 'reviews' as const, label: 'Reviews', icon: <Star className="w-4 h-4" /> },
                                        { id: 'faq' as const, label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "relative px-3.5 sm:px-5 py-2.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 sm:gap-2.5 whitespace-nowrap",
                                                activeTab === tab.id
                                                    ? "text-foreground"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTabBg"
                                                    className="absolute inset-0 bg-background rounded-lg sm:rounded-xl shadow-md border border-border/50"
                                                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                                />
                                            )}
                                            <span className={cn(
                                                "relative z-10 transition-colors",
                                                activeTab === tab.id ? "text-primary" : ""
                                            )}>
                                                {tab.icon}
                                            </span>
                                            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* OVERVIEW TAB */}
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-12 sm:mt-20 lg:mt-24"
                                >
                                    {/* This course includes - Modern Benefit Grid */}
                                    <div className="mb-12 sm:mb-16">
                                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                                            {[
                                                { icon: Layout, label: 'Access', value: 'Full Lifetime', color: 'primary' },
                                                { icon: BookOpen, label: 'Content', value: `${course.curriculum?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}+ Lessons`, color: 'blue-400' },
                                                { icon: Building, label: 'Placement', value: 'Job Support', color: 'emerald-400' },
                                                { icon: FolderKanban, label: 'Projects', value: 'Real-life', color: 'purple-400' },
                                                { icon: Award, label: 'Certificate', value: 'Verified', color: 'amber-400' }
                                            ].map((item, i) => (
                                                <div key={i} className="glass-card p-4 sm:p-5 flex flex-col items-center text-center gap-2 group hover:shadow-lg transition-all duration-300">
                                                    <div className={cn(
                                                        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-white/5",
                                                        item.color === 'primary' ? 'text-primary' : `text-${item.color}`
                                                    )}>
                                                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{item.label}</p>
                                                        <p className="text-xs sm:text-sm font-black text-white">{item.value}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* What you'll learn - Glass Card */}
                                    <div className="glass-card p-6 sm:p-10 hover:bg-glass/80 transition-all duration-500 shadow-xl shadow-black/10 group">
                                        <div className="space-y-4 mb-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Learning Outcomes
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                Master these <span className="text-emerald-500">core skills</span>
                                            </h2>
                                            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                By the end of this course, you will be proficient in these key areas of professional development and industry best practices.
                                            </p>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                            {course.whatYouLearn?.map((item, index) => (
                                                <div key={index} className="flex gap-3 items-start">
                                                    <div className="mt-1 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                                                    </div>
                                                    <span className="text-sm text-muted-foreground leading-relaxed font-medium">{item}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    {course.tags && course.tags.length > 0 && (
                                        <div className="mt-12 sm:mt-20 lg:mt-24">
                                            <div className="space-y-4 mb-10">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                                    <Code className="w-3.5 h-3.5" />
                                                    Tech Stack
                                                </div>
                                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                    Industry standard <span className="text-primary">technologies</span>
                                                </h2>
                                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                    Get hands-on experience with the tools used by world-class professional teams for building modern, scalable applications.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                                {course.tags.map((tag, i) => {
                                                    const { icon, brandColor } = getTechBadgeData(tag);
                                                    return (
                                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-border transition-all group cursor-default">
                                                            <div className="w-10 h-10 rounded-md flex items-center justify-center transition-all duration-300 shadow-sm" style={{ backgroundColor: `${brandColor}1A` }}>
                                                                <span style={{ color: brandColor }}>{icon}</span>
                                                            </div>
                                                            <span className="font-semibold text-sm text-foreground/80 group-hover:text-foreground transition-colors">{tag}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}


                                    <div className="mt-12 sm:mt-20 lg:mt-24">
                                        <div className="space-y-4 mb-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                                <FileText className="w-3.5 h-3.5" />
                                                About
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                Comprehensive course <span className="text-secondary">overview</span>
                                            </h2>
                                            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                Take a detailed look at what makes this training unique and how it will transform your career in the technology space.
                                            </p>
                                        </div>
                                        <div className="prose prose-invert prose-slate max-w-none">
                                            <p className="leading-7 text-muted-foreground whitespace-pre-wrap">{course.longDescription || course.description}</p>
                                        </div>
                                    </div>


                                    {course.requirements && course.requirements.length > 0 && (
                                        <div className="mt-12 sm:mt-20 lg:mt-24">
                                            <div className="space-y-4 mb-10 px-2">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-[10px] font-bold uppercase tracking-widest">
                                                    <ListChecks className="w-3.5 h-3.5" />
                                                    Prerequisites
                                                </div>
                                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                    What you <span className="text-warning">need to start</span>
                                                </h2>
                                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                    Review these essentials before beginning your journey to ensure you have the best possible learning experience.
                                                </p>
                                            </div>
                                            <div className="glass-card p-6 sm:p-10">
                                                <ul className="space-y-3">
                                                    {course.requirements.map((req, index) => (
                                                        <li key={index} className="flex gap-3 items-start">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                                                            <span className="text-sm text-muted-foreground leading-relaxed">{req}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}


                                    {course.targetAudience && course.targetAudience.length > 0 && (
                                        <div className="mt-12 sm:mt-20 lg:mt-24">
                                            <div className="space-y-4 mb-10 px-2">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                                    <Target className="w-3.5 h-3.5" />
                                                    Audience
                                                </div>
                                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                    Is this course <span className="text-secondary">right for you?</span>
                                                </h2>
                                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                    Whether you are a complete beginner or looking to level up your existing skills, this path is tailored for specific outcomes.
                                                </p>
                                            </div>
                                            <div className="glass-card p-6 sm:p-10">
                                                <ul className="space-y-3">
                                                    {course.targetAudience.map((item, index) => (
                                                        <li key={index} className="flex gap-3 items-start">
                                                            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                                                            <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}


                                    {resources && resources.length > 0 && (
                                        <div className="mt-12 sm:mt-20 lg:mt-24">
                                            <div className="space-y-4 mb-10 px-2">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                                                    <Download className="w-3.5 h-3.5" />
                                                    Library
                                                </div>
                                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                    Premium <span className="text-accent">learning assets</span>
                                                </h2>
                                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                    Download cheat sheets, templates, and high-quality source code to support your learning journey every step of the way.
                                                </p>
                                            </div>
                                            <div className="glass-card p-6 sm:p-10">
                                                <div className="grid sm:grid-cols-2 gap-3">
                                                    {resources.filter(r => r.is_public).slice(0, 6).map((resource) => (
                                                        <div key={resource.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                                                            {getResourceIcon(resource.resource_type)}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-foreground/80 truncate group-hover:text-foreground">{resource.title}</p>
                                                                <p className="text-xs text-muted-foreground">{resource.resource_type.toUpperCase()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                {resources.length > 6 && (
                                                    <p className="text-sm text-muted-foreground mt-4">+{resources.length - 6} more resources included</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}


                            {activeTab === 'curriculum' && (
                                <motion.div
                                    key="curriculum"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-12 sm:mt-20 lg:mt-24"
                                >

                                    <div className="mb-12 sm:mb-20">
                                        <div className="space-y-4 mb-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                Curriculum
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                Deep dive into the <span className="text-secondary">course modules</span>
                                            </h2>
                                            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                A carefully curated selection of topics covering everything from industry fundamentals to cutting-edge advanced concepts.
                                            </p>
                                        </div>


                                        <div className="flex gap-6 mb-6 border-b border-border/30">
                                            <button
                                                onClick={() => setCurriculumTab('live')}
                                                className={cn(
                                                    "pb-3 text-sm font-medium transition-colors relative",
                                                    curriculumTab === 'live'
                                                        ? "text-secondary"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Live Classes
                                                {curriculumTab === 'live' && (
                                                    <motion.div
                                                        layoutId="curriculumTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                                                    />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setCurriculumTab('recorded')}
                                                className={cn(
                                                    "pb-3 text-sm font-medium transition-colors relative",
                                                    curriculumTab === 'recorded'
                                                        ? "text-secondary"
                                                        : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Recorded Classes
                                                {curriculumTab === 'recorded' && (
                                                    <motion.div
                                                        layoutId="curriculumTab"
                                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
                                                    />
                                                )}
                                            </button>
                                        </div>




                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-medium">
                                            <span className="text-foreground">{totalSections}</span> sections
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-foreground">{totalLectures}</span> lectures
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-foreground">{course.duration}</span> total length
                                        </div>


                                        <div className="bg-muted/30 backdrop-blur-xl border border-border/40 overflow-hidden rounded-2xl shadow-xl">
                                            {displayedModules.map((module, index) => (
                                                <div key={index} className="border-b border-border/40 last:border-0 group/module">

                                                    <button
                                                        onClick={() => toggleModule(index)}
                                                        className="w-full flex items-center justify-between p-6 px-8 text-left hover:bg-white/1 transition-all group/btn relative overflow-hidden"
                                                    >
                                                        <div className="flex items-center gap-4 relative z-10">
                                                            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10 group-hover/module:border-secondary/30 group-hover/module:bg-secondary/5 transition-all duration-300 shrink-0">
                                                                <span className="text-[9px] font-black text-muted-foreground/40 uppercase leading-none mb-1 tracking-widest">Part</span>
                                                                <span className="text-sm font-black text-foreground leading-none">{String(index + 1).padStart(2, '0')}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h3 className={cn(
                                                                    "font-bold text-[15px] transition-colors",
                                                                    expandedModules.includes(index)
                                                                        ? "text-white"
                                                                        : "text-slate-400 group-hover/btn:text-white"
                                                                )}>
                                                                    {module.title}
                                                                </h3>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] text-muted-foreground/50 uppercase font-heavy tracking-wider">
                                                                        {module.lessons?.length || 0} Professional Lessons
                                                                    </span>
                                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                                    <span className="text-[10px] text-muted-foreground/50 uppercase font-heavy tracking-wider">
                                                                        {module.duration || '48m'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-5 relative z-10">
                                                            <div className="hidden sm:flex flex-col items-end">
                                                                <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest mb-0.5">Status</span>
                                                                <div className="flex items-center gap-1">
                                                                    <LockIcon className="w-2.5 h-2.5 text-muted-foreground/30" />
                                                                    <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">Locked</span>
                                                                </div>
                                                            </div>
                                                            <div className={cn(
                                                                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300",
                                                                expandedModules.includes(index)
                                                                    ? "bg-secondary/20 text-secondary rotate-180"
                                                                    : "bg-white/5 text-muted-foreground group-hover/btn:bg-white/10"
                                                            )}>
                                                                <ChevronDown className="w-5 h-5" />
                                                            </div>
                                                        </div>

                                                        <div className="absolute inset-0 bg-secondary/2 opacity-0 group-hover/module:opacity-100 transition-opacity" />
                                                    </button>


                                                    <AnimatePresence initial={false}>
                                                        {expandedModules.includes(index) && (
                                                            <motion.div
                                                                initial="collapsed"
                                                                animate="open"
                                                                exit="collapsed"
                                                                variants={{
                                                                    open: { height: "auto", opacity: 1 },
                                                                    collapsed: { height: 0, opacity: 0 }
                                                                }}
                                                                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-5 pb-5 space-y-2">
                                                                    <div className="h-px w-full bg-white/5 mb-4 mx-auto" />
                                                                    {module.lessons?.map((lesson, lIndex) => (
                                                                        <div
                                                                            key={lIndex}
                                                                            className="flex items-center justify-between py-4 px-6 rounded-xl bg-background/50 border border-white/3 text-sm hover:bg-background hover:border-white/10 transition-all group/lesson cursor-not-allowed group shadow-sm"
                                                                        >
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover/lesson:bg-white/10 transition-all border border-white/5">
                                                                                    {(() => {
                                                                                        switch (lesson.type) {
                                                                                            case 'video': return <PlayCircle className="w-5 h-5 text-slate-500" />;
                                                                                            case 'text': return <FileText className="w-5 h-5 text-slate-500" />;
                                                                                            case 'quiz': return <HelpCircle className="w-5 h-5 text-slate-500" />;
                                                                                            case 'assignment': return <ListChecks className="w-5 h-5 text-slate-500" />;
                                                                                            case 'live': return <Video className="w-5 h-5 text-slate-500" />;
                                                                                            default: return <PlayCircle className="w-5 h-5 text-slate-500" />;
                                                                                        }
                                                                                    })()}
                                                                                </div>
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-slate-300 font-bold group-hover/lesson:text-white transition-colors">
                                                                                        {lesson.title}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-2 mt-1">
                                                                                        <span className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">
                                                                                            Lesson {String(lIndex + 1).padStart(2, '0')}
                                                                                        </span>
                                                                                        <span className="w-0.5 h-0.5 rounded-full bg-white/5" />
                                                                                        <span className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">
                                                                                            {lesson.duration || '15:00'}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center gap-4">
                                                                                <div className="px-2.5 py-1 rounded-md bg-white/5 text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] border border-white/5 group-hover/lesson:text-muted-foreground/50 transition-colors">
                                                                                    Locked
                                                                                </div>
                                                                                <LockIcon className="w-3.5 h-3.5 text-muted-foreground/10 group-hover/lesson:text-muted-foreground/30 transition-colors" />
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>

                                        {filteredModules.length === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-6 flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl bg-linear-to-b from-muted/30 to-transparent border border-border/40"
                                            >
                                                <div className="relative mb-5 group">
                                                    <div className="w-16 h-16 rounded-2xl bg-background shadow-lg shadow-black/5 border border-border/50 flex items-center justify-center relative z-10">
                                                        {curriculumTab === 'live' ? (
                                                            <Calendar className="w-8 h-8 text-muted-foreground/70" />
                                                        ) : (
                                                            <Video className="w-8 h-8 text-muted-foreground/70" />
                                                        )}
                                                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-muted rounded-full flex items-center justify-center border-2 border-background">
                                                            <Minus className="w-3 h-3 text-muted-foreground" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 className="text-lg font-bold text-foreground mb-2">
                                                    {curriculumTab === 'live' ? 'No Live Classes Scheduled' : 'No Recorded Content Yet'}
                                                </h3>

                                                <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto leading-relaxed mb-6">
                                                    {curriculumTab === 'live'
                                                        ? "This course currently doesn't have any live sessions scheduled. It might be a fully self-paced course."
                                                        : "There are no recorded lessons available for this course right now."}
                                                </p>

                                                {curriculumTab === 'live' && outlineModules.some(m => m.lessons?.some(l => l.type !== 'live')) && (
                                                    <button
                                                        onClick={() => setCurriculumTab('recorded')}
                                                        className="px-5 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-all flex items-center gap-2 group"
                                                    >
                                                        View Recorded Lessons
                                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                                    </button>
                                                )}

                                                {curriculumTab === 'recorded' && outlineModules.some(m => m.lessons?.some(l => l.type === 'live')) && (
                                                    <button
                                                        onClick={() => setCurriculumTab('live')}
                                                        className="px-5 py-2.5 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary text-sm font-semibold transition-all flex items-center gap-2 group"
                                                    >
                                                        View Live Schedule
                                                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                                    </button>
                                                )}
                                            </motion.div>
                                        )}


                                        {filteredModules.length > 6 && (
                                            <div className="flex justify-center mt-6">
                                                <button
                                                    onClick={() => setShowAllModules(!showAllModules)}
                                                    className="px-8 py-3 rounded-lg bg-muted/50 hover:bg-muted/70 text-foreground font-medium text-sm transition-colors border border-border/30"
                                                >
                                                    {showAllModules ? 'Show less' : 'View more'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}


                            {activeTab === 'instructor' && (
                                <motion.div
                                    key="instructor"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-12 sm:mt-20 lg:mt-24"
                                >

                                    <div>
                                        <div className="space-y-4 mb-10">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                                                <Award className="w-3.5 h-3.5" />
                                                Your Mentor
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                Learn from <span className="text-accent">industry veterans</span>
                                            </h2>
                                            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                Our instructors bring years of real-world experience from top-tier technology companies and are committed to your success.
                                            </p>
                                        </div>
                                        <div className="glass-card p-6 sm:p-8 hover:bg-glass/80 transition-colors duration-300">
                                            <div className="flex flex-col sm:flex-row gap-8">
                                                <div className="shrink-0">
                                                    <div className="w-28 h-28 rounded-full border-4 border-primary/20 p-1 mx-auto sm:mx-0">
                                                        <div className="w-full h-full rounded-full bg-muted overflow-hidden relative">
                                                            {course.instructor.avatar ? (
                                                                <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-foreground">{course.instructor.name.charAt(0)}</div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Social links on mobile */}
                                                    {instructorInfo?.social_links && (
                                                        <div className="flex justify-center gap-3 mt-4 sm:hidden">
                                                            {instructorInfo.social_links.youtube && (
                                                                <a href={instructorInfo.social_links.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer">
                                                                    <Play className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                            {instructorInfo.social_links.github && (
                                                                <a href={instructorInfo.social_links.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 hover:text-foreground transition-colors cursor-pointer">
                                                                    <Code className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                            {instructorInfo.social_links.linkedin && (
                                                                <a href={instructorInfo.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-secondary/20 hover:text-secondary transition-colors cursor-pointer">
                                                                    <Users className="w-4 h-4" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-4 flex-1 text-center sm:text-left">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-primary hover:underline cursor-pointer decoration-primary/50 underline-offset-4">{course.instructor.name}</h3>
                                                        <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide mt-1">{course.instructor.title}</p>
                                                        {/* Expertise tags */}
                                                        {instructorInfo?.expertise && instructorInfo.expertise.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                                                {instructorInfo.expertise.slice(0, 5).map((skill, i) => (
                                                                    <span key={i} className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">{skill}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                                        {instructorInfo?.bio || course.instructor.bio || "Senior Instructor with 10+ years of experience in the industry. Passionate about teaching and helping students achieve their goals."}
                                                    </p>

                                                    <div className="flex gap-8 pt-5 border-t border-border justify-center sm:justify-start">
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                            <div className="text-foreground text-lg font-bold mb-1">{instructorInfo?.total_students || course.students}</div>
                                                            Students
                                                        </div>
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                            <div className="text-foreground text-lg font-bold mb-1 flex items-center gap-1">
                                                                {instructorInfo?.rating || course.rating} <Star className="w-3 h-3 fill-primary text-primary" />
                                                            </div>
                                                            Rating
                                                        </div>
                                                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                                            <div className="text-foreground text-lg font-bold mb-1">{instructorInfo?.total_courses || 6}</div>
                                                            Courses
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}


                            {activeTab === 'projects' && (
                                <motion.div
                                    key="resources"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-12 sm:mt-20 lg:mt-24"
                                >


                                    {projects.length > 0 ? (
                                        <div className="mt-8">
                                            <div className="space-y-4 mb-10">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                                    <FolderKanban className="w-3.5 h-3.5" />
                                                    Portfolio
                                                </div>
                                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                                    Build <span className="text-primary">real-world projects</span>
                                                </h2>
                                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                                    Apply your knowledge by constructing full-scale applications that you can proudly showcase to future employers.
                                                </p>
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {projects.filter(p => p.is_public).map((project) => (
                                                    <div key={project.id} className="glass-card overflow-hidden hover:bg-glass/80 transition-colors group">
                                                        <div className="aspect-video relative">
                                                            <Image src={project.thumbnail_url || '/placeholder-project.jpg'} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                                                            <div className="absolute bottom-3 left-3 right-3">
                                                                <h3 className="font-bold text-foreground text-sm">{project.title}</h3>
                                                            </div>
                                                        </div>
                                                        <div className="p-4">
                                                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                                                            <div className="flex flex-wrap gap-1">
                                                                {project.technologies.slice(0, 4).map((tech, i) => (
                                                                    <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-secondary/10 text-secondary border border-secondary/20">{tech}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {projects.filter(p => !p.is_public).length > 0 && (
                                                <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                                                    <LockIcon className="w-4 h-4" /> +{projects.filter(p => !p.is_public).length} more projects available after enrollment
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                                                <Code className="w-10 h-10 text-muted-foreground" />
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">No Projects Yet</h3>
                                            <p className="text-muted-foreground max-w-md">
                                                This course doesn't have any showcased projects at the moment.
                                            </p>
                                        </div>
                                    )}


                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                    <div className="lg:col-span-4 lg:mt-0 order-first lg:order-0 z-20 self-start">
                        <div className="lg:sticky lg:top-[100px] space-y-4 sm:space-y-6">
                            {/* Breadcrumbs on Right */}
                            <div className="hidden lg:flex justify-end mb-4">
                                <Breadcrumbs
                                    rootLabel="Home"
                                    items={[
                                        { label: 'Courses', href: '/courses', icon: BookOpen },
                                        { label: course.title, icon: Layout }
                                    ]}
                                />
                            </div>


                            <div className="glass-card p-2 shadow-2xl shadow-black/30 ring-1 ring-primary/10">

                                <div className="aspect-video relative group cursor-pointer bg-slate-950 overflow-hidden rounded-xl">
                                    <Image
                                        src={course.image || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                        unoptimized
                                    />


                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            {/* Outer Ring Animation */}
                                            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:bg-primary/40" />

                                            <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ring-1 ring-white/20 relative z-10">
                                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-orange-400 flex items-center justify-center shadow-xl shadow-primary/40">
                                                    <Play className="w-5 h-5 text-black fill-black ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-6 left-0 right-0 flex justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 shadow-2xl">
                                            Preview This Course
                                        </span>
                                    </div>
                                </div>


                                <div className="p-8 space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-white tracking-tighter">{formattedPrice}</span>
                                                {originalPrice && course.priceType !== "Free" && (
                                                    <span className="text-lg text-slate-500 line-through decoration-slate-500/50">{originalPrice}</span>
                                                )}
                                            </div>

                                            {hasDiscount && course.priceType !== "Free" && (
                                                <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                                                    {discountPercentage || 20}% OFF
                                                </div>
                                            )}
                                        </div>

                                        {hasDiscount && course.discountExpiresAt && (
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/3 border border-rose-500/10">
                                                <Clock className="w-4 h-4 text-rose-500" />
                                                <p className="text-xs font-bold text-rose-500/80 uppercase tracking-widest">
                                                    Flash Sale Ends Soon
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">

                                        {timeLeft && (
                                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 space-y-3">
                                                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                                                    <Zap className="w-4 h-4 animate-pulse" />
                                                    OFFER ENDS IN:
                                                </div>
                                                <div className="grid grid-cols-4 gap-2">
                                                    {[
                                                        { label: 'Days', value: timeLeft.d },
                                                        { label: 'Hours', value: timeLeft.h },
                                                        { label: 'Mins', value: timeLeft.m },
                                                        { label: 'Secs', value: timeLeft.s },
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="flex flex-col items-center">
                                                            <div className="bg-background/80 w-full rounded-lg py-2 border border-border flex flex-col items-center group-hover:border-primary/30 transition-colors">
                                                                <span className="text-xl font-bold text-foreground tabular-nums">
                                                                    {String(item.value).padStart(2, '0')}
                                                                </span>
                                                                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                                                                    {item.label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-3">
                                            <PrimaryCTAButton
                                                onClick={handleEnroll}
                                                loading={loading}
                                                className="w-full! h-11!"
                                            >
                                                <span>Enroll</span>
                                            </PrimaryCTAButton>

                                            <SecondaryCTAButton
                                                onClick={() => setShowShareModal(true)}
                                                className="w-full! h-11!"
                                            >
                                                <div className="flex items-center gap-2 ">
                                                    <Share2 className="w-4 h-4" />
                                                    <span>Share</span>
                                                </div>
                                            </SecondaryCTAButton>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="bg-card/50 dark:bg-slate-900/50 border border-border/50 rounded-2xl p-6 shadow-sm group">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2 px-1">
                                    <Tag className="w-3.5 h-3.5 text-primary" />
                                    Promo Code
                                </h4>
                                <form onSubmit={handleApplyCoupon} className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="w-full pl-4 pr-24 py-3.5 bg-muted/50 dark:bg-slate-950/50 border border-border/50 dark:border-white/5 rounded-2xl text-sm font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all uppercase placeholder:normal-case placeholder:text-muted-foreground tracking-wider"
                                    />
                                    <div className="absolute right-1.5 p-1">
                                        <button
                                            type="submit"
                                            disabled={!couponCode || isApplyingCoupon}
                                            className="px-5 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-primary/20 disabled:opacity-30"
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>



                    {activeTab === 'reviews' && (
                        <>

                            <div className="mt-12 sm:mt-20 lg:mt-24 lg:col-span-12 scroll-mt-32" id="reviews">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16 px-2">
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                            <MessageCircle className="w-3 h-3" />
                                            Testimonials
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                                            Trusted by <span className="text-emerald-500">thousands</span> of students
                                        </h2>
                                        <p className="text-slate-400 text-base sm:text-lg max-w-2xl leading-relaxed">
                                            Hear from our community about how this course helped them master new skills and advance their careers.
                                        </p>
                                    </div>

                                </div>

                                {reviews.length > 0 ? (
                                    <div className="space-y-12">

                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                                            <div className="lg:col-span-4 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group backdrop-blur-sm flex flex-col items-center justify-center text-center">

                                                <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />

                                                <div className="relative z-10">
                                                    <div className="flex items-baseline justify-center gap-2 mb-4">
                                                        <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">
                                                            {ratingBreakdown.average.toFixed(1)}
                                                        </span>
                                                        <span className="text-2xl font-bold text-slate-500">/ 5</span>
                                                    </div>

                                                    <div className="flex gap-1.5 justify-center mb-6">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} className={cn("w-6 h-6", i <= Math.round(ratingBreakdown.average) ? "fill-[#fcb900] text-[#fcb900]" : "fill-slate-800 text-slate-800")} />
                                                        ))}
                                                    </div>

                                                    <div className="space-y-1">
                                                        <p className="text-xl font-bold text-white tracking-tight">{ratingBreakdown.total} Student Reviews</p>
                                                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest leading-none">Global Feedback Rating</p>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="lg:col-span-8 bg-slate-900/50 border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group backdrop-blur-sm">

                                                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700" />

                                                <div className="relative z-10 space-y-4">
                                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">Rating Breakdown</h4>
                                                    <div className="space-y-4">
                                                        {[5, 4, 3, 2, 1].map((star) => {
                                                            const count = ratingBreakdown.distribution[star as keyof typeof ratingBreakdown.distribution];
                                                            const percentage = ratingBreakdown.total > 0 ? (count / ratingBreakdown.total) * 100 : 0;
                                                            return (
                                                                <div key={star} className="flex items-center gap-5 group/bar">
                                                                    <div className="flex items-center gap-2 w-10 shrink-0">
                                                                        <span className="text-base font-bold text-slate-400 group-hover/bar:text-white transition-colors">{star}</span>
                                                                        <Star className="w-3.5 h-3.5 text-slate-600 group-hover/bar:text-[#fcb900] transition-colors" />
                                                                    </div>

                                                                    <div className="flex-1 h-2.5 bg-slate-800/40 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
                                                                        <motion.div
                                                                            initial={{ width: 0 }}
                                                                            whileInView={{ width: `${percentage}%` }}
                                                                            viewport={{ once: true }}
                                                                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                                                                            className="h-full bg-linear-to-r from-primary to-amber-500 rounded-full shadow-[0_0_15px_rgba(252,185,0,0.2)]"
                                                                        />
                                                                    </div>

                                                                    <div className="w-10 text-right">
                                                                        <span className="text-sm font-bold text-slate-500 tabular-nums">{count}</span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {reviews.slice(0, showAllReviews ? undefined : 6).map((review, idx) => (
                                                <motion.div
                                                    key={review.id}
                                                    initial={{ opacity: 0, y: 30 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                                    className="bg-white/2 border border-white/5 rounded-3xl p-8 flex flex-col gap-6 hover:bg-white/4 hover:border-white/10 transition-all duration-500 group relative"
                                                >
                                                    <div className="absolute top-8 right-8 text-white/5 group-hover:text-primary/20 transition-colors duration-500">
                                                        <MessageCircle className="w-12 h-12" />
                                                    </div>


                                                    <div className="flex items-center gap-4 relative z-10">
                                                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0 ring-2 ring-white/5 group-hover:ring-primary/40 transition-all duration-500 -rotate-3 group-hover:rotate-0">
                                                            {review.user?.avatar_url ? (
                                                                <Image
                                                                    src={review.user.avatar_url}
                                                                    alt={review.user?.name || 'Student'}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-400 bg-linear-to-br from-slate-800 to-slate-900">
                                                                    {(review.user?.name || 'S').charAt(0)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{review.user?.name || 'Anonymous Student'}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Batch No {pageData?.course.batch_no || 12}</span>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="flex gap-1 relative z-10">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star key={i} className={cn("w-4 h-4", i <= review.rating ? "fill-[#fcb900] text-[#fcb900]" : "fill-slate-800 text-slate-800")} />
                                                        ))}
                                                    </div>


                                                    <div className="relative z-10">
                                                        <p className="text-slate-300 text-base leading-relaxed line-clamp-5 group-hover:text-white transition-colors italic">
                                                            "{review.review_text}"
                                                        </p>
                                                    </div>

                                                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-xs font-medium text-slate-500 tracking-wide">Posted {new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {reviews.length > 6 && (
                                            <div className="flex justify-center pt-8">
                                                <button
                                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                                    className="px-10 py-4 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 hover:border-primary/50 hover:text-primary transition-all flex items-center gap-3 group backdrop-blur-md shadow-xl"
                                                >
                                                    {showAllReviews ? 'Show fewer reviews' : `View all ${reviews.length} student reviews`}
                                                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-500", showAllReviews ? "rotate-180" : "group-hover:translate-y-1")} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-[#0B1120] border border-dashed border-white/10 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center group transition-all duration-500 hover:bg-white/1 hover:border-white/20">
                                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 border border-white/10">
                                            <MessageCircle className="w-12 h-12 text-slate-600 group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4">No student reviews yet</h3>
                                        <p className="text-slate-400 max-w-sm mb-10 text-lg leading-relaxed">
                                            Be the trailblazer! share your experience with this course and inspire other students.
                                        </p>
                                        {pageData?.isEnrolled && (
                                            <button
                                                onClick={() => setShowReviewModal(true)}
                                                className="px-10 py-4 text-sm font-bold bg-[#fcb900] text-black rounded-2xl hover:bg-[#fcb900]/90 transition-all shadow-[0_20px_40px_rgba(252,185,0,0.1)]"
                                            >
                                                Share Your Story
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>


                            <div className="mt-12 sm:mt-20 lg:mt-24 lg:col-span-12">
                                <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#020617] group">


                                    <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                                    <div className="absolute inset-0 bg-white/5 opacity-[0.02] mix-blend-overlay pointer-events-none" />

                                    <div className="relative z-10 p-8 md:p-12 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">


                                        <div className="perspective-1000 relative flex justify-center lg:justify-end order-2 lg:order-1">
                                            <div className="relative transform-gpu transition-all duration-700 ease-out group-hover:rotate-y-[-5deg] group-hover:rotate-x-[5deg] group-hover:scale-105">


                                                <div className="absolute inset-0 bg-primary/20 blur-2xl transform scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                <div className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5 bg-[#1e293b]">
                                                    <div className="relative w-full aspect-video md:aspect-4/3">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src="/certificate-mockup.png"
                                                            alt="Course Completion Certificate"
                                                            className="w-full h-full object-cover"
                                                        />

                                                        <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-shimmer pointer-events-none" />
                                                    </div>
                                                </div>


                                                <div className="absolute -right-6 -bottom-6 md:-right-8 md:-bottom-8 backdrop-blur-xl bg-white/5 border border-white/20 p-4 rounded-2xl shadow-2xl animate-float">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                                            <Award className="w-6 h-6 text-white" />
                                                        </div>
                                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/90">Verified</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="space-y-10 order-1 lg:order-2">
                                            <div className="space-y-6">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                                    <Star className="w-3 h-3 fill-primary" />
                                                    Official Certification
                                                </div>

                                                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                                    Prove Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-400">Mastery</span>
                                                </h2>

                                                <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                                                    Don't just learn it, prove it. Receive a verified certificate upon completion to showcase your expertise on LinkedIn and resume.
                                                </p>
                                            </div>

                                            <div className="grid gap-6">
                                                {[
                                                    {
                                                        title: "Shareable Credentials",
                                                        desc: "Add to your LinkedIn profile with one click.",
                                                        icon: Globe
                                                    },
                                                    {
                                                        title: "Unique Verification ID",
                                                        desc: "Tamper-proof serial number for employers.",
                                                        icon: LockIcon
                                                    },
                                                    {
                                                        title: "Print-Ready High Res",
                                                        desc: "Download high-quality PDF for your wall.",
                                                        icon: Download
                                                    }
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-start gap-4 group/item">
                                                        <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-primary/10 group-hover/item:border-primary/20 transition-colors">
                                                            <item.icon className="w-5 h-5 text-slate-400 group-hover/item:text-primary transition-colors" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-semibold text-base mb-1 group-hover/item:text-primary transition-colors">{item.title}</h4>
                                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>


                            {pageData?.relatedCourses && pageData.relatedCourses.length > 0 && (
                                <div className="mt-32 pt-16 border-t border-white/5 lg:col-span-12">
                                    <div className="space-y-4 mb-12">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                            <Layout className="w-3.5 h-3.5" />
                                            Recommendations
                                        </div>
                                        <h2 className="text-4xl font-black text-white tracking-tight">
                                            Keep <span className="text-primary">moving forward</span>
                                        </h2>
                                        <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                            Explore other high-impact courses and career paths that complement your current learning journey.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {pageData.relatedCourses.map((relatedCourse) => (
                                            <Link
                                                key={relatedCourse.id}
                                                href={`/courses/${relatedCourse.slug}`}
                                                className="group flex flex-col bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
                                            >

                                                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                                    {relatedCourse.thumbnail_url ? (
                                                        <Image
                                                            src={relatedCourse.thumbnail_url}
                                                            alt={relatedCourse.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/5">
                                                            <BookOpen className="w-10 h-10 opacity-30 mb-2" />
                                                        </div>
                                                    )}


                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                        <span className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shadow-primary/20">
                                                            View Details
                                                        </span>
                                                    </div>
                                                </div>


                                                <div className="p-5 flex flex-col flex-1 gap-3">
                                                    {/* Title */}
                                                    <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5em]">
                                                        {relatedCourse.title}
                                                    </h3>


                                                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                                                        <div className="flex items-center gap-1.5 text-sm">
                                                            <Star className="w-4 h-4 text-warning fill-warning" />
                                                            <span className="font-bold text-foreground">{relatedCourse.rating ? Number(relatedCourse.rating).toFixed(1) : "0.0"}</span>
                                                            <span className="text-muted-foreground text-xs">({relatedCourse.rating_count || 0})</span>
                                                        </div>

                                                        <div className="text-lg font-bold text-primary tracking-tight">
                                                            {relatedCourse.price > 0 ? `৳${relatedCourse.price.toLocaleString()}` : "Free"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}


                    {activeTab === 'faq' && (
                        <div className="mt-12 sm:mt-20 lg:mt-24 lg:col-span-12">
                            {faq.length > 0 ? (
                                <div className="max-w-4xl mx-auto">
                                    <div className="space-y-4 mb-10 text-center">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                            <HelpCircle className="w-3.5 h-3.5" />
                                            FAQ & Support
                                        </div>
                                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                            Frequently Asked <span className="text-primary">Questions</span>
                                        </h2>
                                        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                                            We've compiled answers to the most common questions to help you get started smoothly.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {faq.filter(f => f.is_published).map((item, index) => (
                                            <div key={item.id} className="glass-card hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                                                <button
                                                    onClick={() => toggleFaq(index)}
                                                    className="w-full flex items-center justify-between p-6 text-left"
                                                >
                                                    <span className={cn("text-lg font-bold transition-colors", expandedFaq === index ? "text-primary" : "text-white group-hover:text-primary/80")}>
                                                        {item.question}
                                                    </span>
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                                        expandedFaq === index ? "bg-primary text-primary-foreground rotate-180" : "bg-white/5 text-muted-foreground group-hover:bg-white/10"
                                                    )}>
                                                        <ChevronDown className="w-5 h-5" />
                                                    </div>
                                                </button>
                                                <AnimatePresence>
                                                    {expandedFaq === index && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <div className="px-6 pb-6 pt-0 text-slate-400 leading-relaxed border-t border-white/5 mt-2">
                                                                <div className="pt-4">
                                                                    {item.answer}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-12 text-center bg-muted/20 rounded-2xl p-8 border border-white/5">
                                        <h4 className="font-bold text-white mb-2">Still have questions?</h4>
                                        <p className="text-muted-foreground text-sm mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                                        <button
                                            onClick={() => setShowLeadModal(true)}
                                            className="px-6 py-2.5 bg-secondary text-secondary-foreground font-bold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/10"
                                        >
                                            Contact Support
                                        </button>
                                    </div>


                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="mt-16 p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 backdrop-blur-sm relative overflow-hidden group text-center"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-700" />

                                        <div className="relative z-10 max-w-xl mx-auto space-y-6">
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-white tracking-tight">Have questions?</h3>
                                                <p className="text-slate-400 text-base leading-relaxed">
                                                    Unsure if this course is right for you? Contact our team for guidance.
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => setShowLeadModal(true)}
                                                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 font-bold hover:bg-cyan-500/10 transition-all group/btn"
                                            >
                                                <MessageCircle className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                                                Ask a Question
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <HelpCircle className="w-16 h-16 text-muted-foreground/20 mb-4" />
                                    <h3 className="text-xl font-bold text-muted-foreground">No FAQs available</h3>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>


            <Dialog open={showLeadModal} onClose={() => setShowLeadModal(false)} size="md">
                <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and we'll get back to you as soon as possible.
                    </DialogDescription>
                    <DialogClose onClose={() => setShowLeadModal(false)} />
                </DialogHeader>
                <DialogBody>
                    <form id="lead-form" onSubmit={handleLeadSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <input
                                required
                                value={leadForm.name}
                                onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <input
                                required
                                type="email"
                                value={leadForm.email}
                                onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Message</label>
                            <textarea
                                required
                                rows={4}
                                value={leadForm.message}
                                onChange={e => setLeadForm(p => ({ ...p, message: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="What would you like to know?"
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => setShowLeadModal(false)}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="lead-form"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Sending..." : "Send Message"}
                    </button>
                </DialogFooter>
            </Dialog>


            <Dialog open={showReviewModal} onClose={() => setShowReviewModal(false)} size="md">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with this course. Your feedback helps others.
                    </DialogDescription>
                    <DialogClose onClose={() => setShowReviewModal(false)} />
                </DialogHeader>
                <DialogBody>
                    <form id="review-form" onSubmit={handleReviewSubmit} className="space-y-6">
                        <div className="space-y-2 flex flex-col items-center">
                            <label className="text-sm font-medium text-muted-foreground">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={cn(
                                                "w-8 h-8 transition-colors",
                                                star <= (hoverRating || reviewForm.rating)
                                                    ? "fill-primary text-primary"
                                                    : "fill-muted text-muted-foreground"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">
                                {reviewForm.rating === 5 ? "Excellent!" :
                                    reviewForm.rating === 4 ? "Very Good" :
                                        reviewForm.rating === 3 ? "Average" :
                                            reviewForm.rating === 2 ? "Poor" : "Terrible"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Review</label>
                            <textarea
                                required
                                rows={4}
                                value={reviewForm.review_text}
                                onChange={e => setReviewForm(p => ({ ...p, review_text: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Tell us what you liked or didn't like..."
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="review-form"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </DialogFooter>
            </Dialog>


            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            className="w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="flex items-center justify-between p-5 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Share this course</h3>
                                        <p className="text-xs text-muted-foreground">Spread the knowledge with others</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>


                            <div className="p-5 space-y-5">

                                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
                                        <Image
                                            src={course.image || '/placeholder-course.jpg'}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">{course.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">by {course.instructor?.name || 'Instructor'}</p>
                                    </div>
                                </div>


                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Share on social media</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {shareOptions.map((option) => (
                                            <button
                                                key={option.name}
                                                onClick={() => {
                                                    option.action();
                                                    setShowShareModal(false);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-3 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95",
                                                    option.color
                                                )}
                                            >
                                                {option.icon}
                                                <span className="text-[10px] font-medium">{option.name.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Or copy link</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-4 py-3 bg-muted/50 rounded-xl border border-border text-sm text-muted-foreground truncate">
                                            {shareUrl}
                                        </div>
                                        <button
                                            onClick={handleCopyLink}
                                            className={cn(
                                                "px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200",
                                                linkCopied
                                                    ? "bg-success text-success-foreground"
                                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                            )}
                                        >
                                            {linkCopied ? (
                                                <>
                                                    <CheckIcon className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}