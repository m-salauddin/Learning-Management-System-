"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft,
    Star,
    Clock,
    Users,
    BookOpen,
    Play,
    CheckCircle2,
    Award,
    Globe,
    Calendar,
    FileText,
    Download,
    MessageCircle,
    Lock,
    ChevronDown,
    ChevronRight,
    Layout,
    Share2,
    Gift,
    Target,
    ListChecks,
    FolderKanban,
    HelpCircle,
    ExternalLink,
    ThumbsUp,
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
    Infinity
} from "lucide-react";
import {
    SiHtml5, SiCss3, SiBootstrap, SiTailwindcss, SiGit, SiGithub, SiNetlify, SiJavascript,
    SiReact, SiNextdotjs, SiNodedotjs, SiTypescript, SiPostgresql, SiSupabase,
    SiPython, SiFigma, SiAdobephotoshop, SiAdobeillustrator, SiMongodb, SiExpress, SiPrisma, SiDrizzle, SiVercel, SiDocker, SiRedis
} from "react-icons/si";
import { FaDatabase, FaCode } from "react-icons/fa";
import { MappedCourse } from "@/types/mapped-course";
import { CoursePageData, CourseProject, CourseResource, CourseFAQ, ReviewWithUser, RatingBreakdown, InstructorInfo } from "@/types/course-page";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
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

// Helper for Tech Icons
const getTechIcon = (tag: string) => {
    const t = tag.toLowerCase().replace(/\s+/g, '');
    if (t.includes('html')) return { icon: <SiHtml5 className="w-5 h-5" />, color: "text-[#E34F26] bg-[#E34F26]/10" };
    if (t.includes('css')) return { icon: <SiCss3 className="w-5 h-5" />, color: "text-[#1572B6] bg-[#1572B6]/10" };
    if (t.includes('javascript') || t.includes('js')) return { icon: <SiJavascript className="w-5 h-5" />, color: "text-[#F7DF1E] bg-[#F7DF1E]/10" };
    if (t.includes('typescript') || t.includes('ts')) return { icon: <SiTypescript className="w-5 h-5" />, color: "text-[#3178C6] bg-[#3178C6]/10" };
    if (t.includes('react')) return { icon: <SiReact className="w-5 h-5" />, color: "text-[#61DAFB] bg-[#61DAFB]/10" };
    if (t.includes('next')) return { icon: <SiNextdotjs className="w-5 h-5" />, color: "text-foreground bg-foreground/5" };
    if (t.includes('node')) return { icon: <SiNodedotjs className="w-5 h-5" />, color: "text-[#339933] bg-[#339933]/10" };
    if (t.includes('tailwind')) return { icon: <SiTailwindcss className="w-5 h-5" />, color: "text-[#06B6D4] bg-[#06B6D4]/10" };
    if (t.includes('bootstrap')) return { icon: <SiBootstrap className="w-5 h-5" />, color: "text-[#7952B3] bg-[#7952B3]/10" };
    if (t.includes('git')) return { icon: <SiGit className="w-5 h-5" />, color: "text-[#F05032] bg-[#F05032]/10" };
    if (t.includes('github')) return { icon: <SiGithub className="w-5 h-5" />, color: "text-foreground bg-foreground/5" };
    if (t.includes('netlify')) return { icon: <SiNetlify className="w-5 h-5" />, color: "text-[#00C7B7] bg-[#00C7B7]/10" };
    if (t.includes('vercel')) return { icon: <SiVercel className="w-5 h-5" />, color: "text-foreground bg-foreground/5" };
    if (t.includes('supabase')) return { icon: <SiSupabase className="w-5 h-5" />, color: "text-[#3ECF8E] bg-[#3ECF8E]/10" };
    if (t.includes('postgres')) return { icon: <SiPostgresql className="w-5 h-5" />, color: "text-[#4169E1] bg-[#4169E1]/10" };
    if (t.includes('mongo')) return { icon: <SiMongodb className="w-5 h-5" />, color: "text-[#47A248] bg-[#47A248]/10" };
    if (t.includes('express')) return { icon: <SiExpress className="w-5 h-5" />, color: "text-foreground bg-foreground/5" };
    if (t.includes('prisma')) return { icon: <SiPrisma className="w-5 h-5" />, color: "text-[#2D3748] bg-[#2D3748]/10" };
    if (t.includes('drizzle')) return { icon: <SiDrizzle className="w-5 h-5" />, color: "text-[#C5F74F] bg-[#C5F74F]/10" };
    if (t.includes('docker')) return { icon: <SiDocker className="w-5 h-5" />, color: "text-[#2496ED] bg-[#2496ED]/10" };
    if (t.includes('redis')) return { icon: <SiRedis className="w-5 h-5" />, color: "text-[#DC382D] bg-[#DC382D]/10" };
    if (t.includes('python')) return { icon: <SiPython className="w-5 h-5" />, color: "text-[#3776AB] bg-[#3776AB]/10" };
    if (t.includes('figma')) return { icon: <SiFigma className="w-5 h-5" />, color: "text-[#F24E1E] bg-[#F24E1E]/10" };

    return { icon: <FaCode className="w-5 h-5" />, color: "text-primary bg-primary/10" };
};

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
    const supabase = createClient();
    const { success, error, info } = useToast();

    // Modal States
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [leadForm, setLeadForm] = useState({ name: '', email: '', message: '' });
    const [reviewForm, setReviewForm] = useState({ rating: 5, review_text: '' });

    // Review Hover State
    const [hoverRating, setHoverRating] = useState(0);

    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault();
        if (!couponCode) return;
        setIsApplyingCoupon(true);
        // Simulate API call
        setTimeout(() => {
            setIsApplyingCoupon(false);
            if (couponCode.toUpperCase() === 'WELCOME50') {
                success('Coupon applied successfully!');
            } else {
                error('Invalid coupon code');
            }
        }, 1500);
    };

    // Prepare curriculum data
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
                // Recorded shows everything except live
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

    // Extract additional data from pageData if available
    const projects = pageData?.projects || [];
    const resources = pageData?.resources || [];
    const faq = pageData?.faq || [];
    const reviews = pageData?.reviews || [];
    const ratingBreakdown = pageData?.ratingBreakdown || { average: course.rating, total: course.reviews, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const instructorInfo = pageData?.instructor;

    // Debug logging - check what data we received
    console.log('[CourseDetailClient] Data received:', {
        hasPageData: !!pageData,
        projectsCount: projects.length,
        resourcesCount: resources.length,
        faqCount: faq.length,
        reviewsCount: reviews.length,
        hasInstructorInfo: !!instructorInfo,
        courseDetails: pageData?.details ? 'present' : 'missing',
    });

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

    // Resource icon helper
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

    // Helper to format price
    const hasDiscount = course.discountPrice && course.discountPrice !== course.price;
    const formattedPrice = course.priceType === "Free" ? "Free" : (course.discountPrice || course.price);
    const originalPrice = hasDiscount ? course.price : course.originalPrice;

    // Calculate discount percentage
    const discountPercentage = hasDiscount && course.originalPrice
        ? Math.round((1 - parseFloat(course.discountPrice!.replace(/[^\d]/g, '')) / parseFloat(course.originalPrice.replace(/[^\d]/g, ''))) * 100)
        : null;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 relative overflow-hidden pt-32">

            {/* Ambient Background Glows - Premium Gradient Effect */}
            <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/3 -translate-y-1/3 pointer-events-none animate-gentle-pulse" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none" />
            <div className="fixed top-1/2 left-1/2 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            {/* Header / Breadcrumb Area */}
            <div className="relative z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer group border border-transparent hover:border-border/50"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back to Courses</span>
                    </Link>
                    <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
                        <Link
                            href="/courses"
                            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                        >
                            Courses
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/40" />
                        <span className="text-foreground font-semibold truncate max-w-[200px] lg:max-w-md">
                            {course.title}
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Layout */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Hero Info (Left Side) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-7"
                        >
                            {/* Tags Section */}
                            <div className="flex flex-wrap gap-2">
                                {course.tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/15 hover:border-secondary/30 transition-all cursor-default"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {course.level && (
                                    <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
                                        {course.level}
                                    </span>
                                )}
                                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-primary/15 text-primary border border-primary/30 flex items-center gap-1.5 shadow-[0_0_20px_rgba(252,185,0,0.15)]">
                                    <Star className="w-3 h-3 fill-primary" /> Best Seller
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.15]">
                                <span className="gradient-text">{course.title}</span>
                            </h1>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                                {course.description}
                            </p>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                {/* Rating */}
                                <div className="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg border border-primary/10">
                                    <span className="font-bold text-primary text-lg">{course.rating}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={cn("w-4 h-4", i <= Math.round(Number(course.rating)) ? "fill-primary text-primary" : "fill-muted text-muted")} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                        ({course.reviews} ratings)
                                    </span>
                                </div>

                                {/* Students */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-secondary" />
                                    </div>
                                    <span className="font-medium">{course.students} students</span>
                                </div>

                                {/* Duration */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="font-medium">{course.duration} Total</span>
                                </div>
                            </div>

                            {/* Instructor Section */}
                            <div className="pt-8 border-t border-border/30">
                                <p className="text-xs font-semibold text-muted-foreground mb-5 uppercase tracking-[0.2em]">Created by</p>
                                <div className="flex items-center gap-4 group cursor-pointer w-fit">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-muted border-2 border-border group-hover:border-primary transition-all overflow-hidden relative shadow-xl ring-4 ring-background">
                                            {course.instructor.avatar ? (
                                                <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-xl bg-linear-to-br from-primary/20 to-secondary/20 text-foreground">
                                                    {course.instructor.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-success rounded-full flex items-center justify-center ring-2 ring-background">
                                            <CheckCircle2 className="w-3 h-3 text-success-foreground fill-success-foreground" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{course.instructor.name}</p>
                                        <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* What you'll learn - Glass Card */}
                        <div className="glass-card p-6 sm:p-10 hover:bg-glass/80 transition-all duration-500 shadow-xl shadow-black/10 group">
                            <div className="space-y-4 mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Learning Outcomes
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight">
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

                        {/* Tools You'll Master */}
                        {course.tags && course.tags.length > 0 && (
                            <div className="mb-20 mt-20">
                                <div className="space-y-4 mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                        <Code className="w-3.5 h-3.5" />
                                        Tech Stack
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        Industry standard <span className="text-primary">technologies</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                        Get hands-on experience with the tools used by world-class professional teams for building modern, scalable applications.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {course.tags.map((tag, i) => {
                                        const { icon, color } = getTechIcon(tag);
                                        return (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/50 hover:bg-background hover:border-border transition-all group cursor-default">
                                                <div className={cn("w-10 h-10 rounded-md flex items-center justify-center transition-colors shadow-xs", color)}>
                                                    {icon}
                                                </div>
                                                <span className="font-semibold text-sm text-foreground/80 group-hover:text-foreground transition-colors">{tag}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}


                        {/* Course Curriculum */}
                        <div className="mb-20">
                            <div className="space-y-4 mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    Curriculum
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight">
                                    Deep dive into the <span className="text-secondary">course modules</span>
                                </h2>
                                <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                    A carefully curated selection of topics covering everything from industry fundamentals to cutting-edge advanced concepts.
                                </p>
                            </div>

                            {/* Tabs */}
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



                            {/* Curriculum Stats */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 font-medium">
                                <span className="text-foreground">{totalSections}</span> sections
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-foreground">{totalLectures}</span> lectures
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-foreground">{course.duration}</span> total length
                            </div>

                            {/* Modules Accordion */}
                            <div className="glass-card overflow-hidden rounded-xl">
                                {displayedModules.map((module, index) => (
                                    <div key={index} className="border-b border-border/40 last:border-0">
                                        {/* Module Header */}
                                        <button
                                            onClick={() => toggleModule(index)}
                                            className="w-full flex items-center justify-between p-5 px-6 hover:bg-muted/30 transition-colors text-left group"
                                        >
                                            <h3 className={cn(
                                                "font-semibold transition-colors",
                                                expandedModules.includes(index)
                                                    ? "text-foreground"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            )}>
                                                Module {index + 1}: {module.title}
                                            </h3>
                                            <div className={cn(
                                                "w-7 h-7 rounded-full border border-border/50 flex items-center justify-center transition-colors shrink-0 ml-4",
                                                expandedModules.includes(index)
                                                    ? "text-muted-foreground"
                                                    : "text-muted-foreground/60"
                                            )}>
                                                {expandedModules.includes(index) ? (
                                                    <Minus className="w-4 h-4" />
                                                ) : (
                                                    <Plus className="w-4 h-4" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Lessons */}
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
                                                    <div className="border-t border-border/30">
                                                        {module.lessons?.map((lesson, lIndex) => (
                                                            <div
                                                                key={lIndex}
                                                                className="flex items-center justify-between py-4 px-6 text-sm hover:bg-muted/20 transition-colors group cursor-default"
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-7 h-7 rounded-full border border-border/40 flex items-center justify-center shrink-0">
                                                                        {(() => {
                                                                            switch (lesson.type) {
                                                                                case 'video': return <PlayCircle className="w-4 h-4 text-muted-foreground" />;
                                                                                case 'text': return <FileText className="w-4 h-4 text-muted-foreground" />;
                                                                                case 'quiz': return <HelpCircle className="w-4 h-4 text-muted-foreground" />;
                                                                                case 'assignment': return <ListChecks className="w-4 h-4 text-muted-foreground" />;
                                                                                case 'live': return <Video className="w-4 h-4 text-muted-foreground" />;
                                                                                default: return <PlayCircle className="w-4 h-4 text-muted-foreground" />;
                                                                            }
                                                                        })()}
                                                                    </div>
                                                                    <span className="text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                                                                        Class - {String(lIndex + 1).padStart(2, '0')}: {lesson.title}
                                                                    </span>
                                                                </div>
                                                                <div className="shrink-0 ml-4">
                                                                    {lesson.isFreePreview ? (
                                                                        <span className="text-[10px] text-secondary font-bold uppercase tracking-wider border border-secondary/30 bg-secondary/10 px-2 py-1 rounded">
                                                                            Preview
                                                                        </span>
                                                                    ) : (
                                                                        <Lock className="w-4 h-4 text-muted-foreground/50" />
                                                                    )}
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
                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

                            {/* View More Button */}
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

                        {/* Description */}
                        <div className="mb-20">
                            <div className="space-y-4 mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                    <FileText className="w-3.5 h-3.5" />
                                    About
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight">
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

                        {/* Detailed Instructor Bio */}
                        <div className="mb-20">
                            <div className="space-y-4 mb-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                                    <Award className="w-3.5 h-3.5" />
                                    Your Mentor
                                </div>
                                <h2 className="text-3xl font-black text-white tracking-tight">
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

                        {/* Requirements Section */}
                        {course.requirements && course.requirements.length > 0 && (
                            <div className="mb-20">
                                <div className="space-y-4 mb-10 px-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-[10px] font-bold uppercase tracking-widest">
                                        <ListChecks className="w-3.5 h-3.5" />
                                        Prerequisites
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
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

                        {/* Target Audience Section */}
                        {course.targetAudience && course.targetAudience.length > 0 && (
                            <div className="mb-20">
                                <div className="space-y-4 mb-10 px-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest">
                                        <Target className="w-3.5 h-3.5" />
                                        Audience
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
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

                        {/* Projects Section */}
                        {projects.length > 0 && (
                            <div className="mb-20">
                                <div className="space-y-4 mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                        <FolderKanban className="w-3.5 h-3.5" />
                                        Portfolio
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
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
                                        <Lock className="w-4 h-4" /> +{projects.filter(p => !p.is_public).length} more projects available after enrollment
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Resources Section */}
                        {resources.length > 0 && (
                            <div className="mb-20">
                                <div className="space-y-4 mb-10 px-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-widest">
                                        <Download className="w-3.5 h-3.5" />
                                        Library
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
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

                        {/* FAQ Section */}
                        {faq.length > 0 && (
                            <div className="mb-20">
                                <div className="space-y-4 mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-warning text-[10px] font-bold uppercase tracking-widest">
                                        <HelpCircle className="w-3.5 h-3.5" />
                                        Support
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">
                                        Got <span className="text-warning">questions?</span>
                                    </h2>
                                    <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                                        Find quick answers to common inquiries about the course structure, schedule, certification, and learning tools.
                                    </p>
                                </div>
                                <div className="glass-card overflow-hidden">
                                    {faq.filter(f => f.is_published).map((item, index) => (
                                        <div key={item.id} className="border-b border-border last:border-0">
                                            <button
                                                onClick={() => toggleFaq(index)}
                                                className="w-full flex items-center justify-between p-4 px-6 hover:bg-muted/50 transition-colors text-left"
                                            >
                                                <span className={cn("font-medium transition-colors", expandedFaq === index ? "text-primary" : "text-foreground")}>{item.question}</span>
                                                <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", expandedFaq === index ? "rotate-180 text-primary" : "")} />
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {expandedFaq === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                                                            {item.answer}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28 space-y-6">
                            {/* Video/Preview Card */}
                            <div className="glass-card overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-primary/10">
                                {/* Video Thumbnail Area */}
                                <div className="aspect-video relative group cursor-pointer bg-background overflow-hidden">
                                    <Image
                                        src={course.image || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-primary/30">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 relative z-10">
                                                <Play className="w-5 h-5 text-primary-foreground fill-primary-foreground ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="text-foreground font-bold text-sm drop-shadow-md bg-background/80 px-3 py-1 rounded-full backdrop-blur-md">Preview this course</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    <div className="space-y-1">
                                        <div className="flex items-end gap-3">
                                            <span className="text-3xl font-bold text-foreground tracking-tight">{formattedPrice}</span>
                                            {originalPrice && course.priceType !== "Free" && (
                                                <span className="text-lg text-muted-foreground line-through mb-1">{originalPrice}</span>
                                            )}
                                        </div>
                                        {hasDiscount && course.priceType !== "Free" && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-destructive font-bold">{discountPercentage || 20}% off</span>
                                                {course.discountExpiresAt && (
                                                    <>
                                                        <span className="text-destructive">•</span>
                                                        <span className="text-destructive flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> Limited time!</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleEnroll}
                                            disabled={loading}
                                            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(252,185,0,0.3)] hover:shadow-[0_0_25px_rgba(252,185,0,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                        >
                                            <span className="relative z-10">{loading ? "Processing..." : course.priceType === "Free" ? "Enroll Now" : "Buy Now"}</span>
                                            <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </div>



                                    <div className="pt-5 border-t border-border space-y-4">
                                        <h4 className="font-bold text-foreground text-sm">This course includes:</h4>
                                        <ul className="space-y-4 text-sm text-foreground/80">
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Layout className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">Full lifetime access</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <BookOpen className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">{course.curriculum?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}+ lessons</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Download className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">15 Downloadable resources</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Globe className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">Access on mobile and TV</span>
                                            </li>
                                            <li className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Award className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-medium">Certificate of completion</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <button className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2 underline decoration-border underline-offset-4 transition-colors">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>

                                    </div>
                                </div>
                            </div>

                            {/* Coupon Code Section */}
                            <div className="glass-card p-6 hover:bg-glass/80 transition-colors">
                                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-primary" />
                                    Apply Coupon
                                </h4>
                                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase placeholder:normal-case"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!couponCode || isApplyingCoupon}
                                        className="px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary text-sm font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isApplyingCoupon ? '...' : 'Apply'}
                                    </button>
                                </form>
                            </div>

                            {/* Have Questions Card */}
                            <div className="glass-card p-6 hover:bg-glass/80 transition-colors">
                                <h4 className="font-bold text-foreground mb-2">Have questions?</h4>
                                <p className="text-sm text-muted-foreground mb-4">Unsure if this course is right for you? Contact our team for guidance.</p>
                                <button
                                    onClick={() => setShowLeadModal(true)}
                                    className="w-full py-3 rounded-lg border border-secondary/30 text-secondary font-semibold hover:bg-secondary/10 transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-4 h-4" /> Ask a Question
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-32 lg:col-span-12 scroll-mt-32" id="reviews">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                                    <MessageCircle className="w-3 h-3" />
                                    Testimonials
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    Trusted by <span className="text-emerald-500">thousands</span> of students
                                </h2>
                                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                                    Hear from our community about how this course helped them master new skills and advance their careers.
                                </p>
                            </div>
                            {pageData?.isEnrolled && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className="px-8 py-4 text-sm font-bold bg-[#fcb900] hover:bg-[#fcb900]/90 text-black rounded-2xl transition-all shadow-[0_20px_40px_rgba(252,185,0,0.15)] hover:shadow-[0_25px_50px_rgba(252,185,0,0.3)] active:scale-95 transform duration-300 flex items-center gap-2 group"
                                >
                                    Write a Review
                                    <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                                </button>
                            )}
                        </div>

                        {reviews.length > 0 ? (
                            <div className="space-y-12">
                                {/* Rating Breakdown Card - Ultra Premium */}
                                <div className="bg-[#0B1120] border border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
                                    {/* Ambient Glows */}
                                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-1000" />
                                    <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                                    <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
                                        {/* Cumulative Rating */}
                                        <div className="text-center lg:text-left shrink-0">
                                            <div className="relative inline-block mb-4">
                                                <div className="text-9xl font-black tracking-tighter text-white leading-none">
                                                    {ratingBreakdown.average.toFixed(1)}
                                                </div>
                                                <div className="absolute -top-2 -right-6 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold animate-pulse">
                                                    Top Rated
                                                </div>
                                            </div>
                                            <div className="flex gap-1.5 justify-center lg:justify-start mb-6">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={cn("w-7 h-7", i <= Math.round(ratingBreakdown.average) ? "fill-[#fcb900] text-[#fcb900]" : "fill-slate-800 text-slate-800")} />
                                                ))}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-white font-bold text-xl">{ratingBreakdown.total} Verified Ratings</p>
                                                <p className="text-slate-500 font-medium">From students worldwide</p>
                                            </div>
                                        </div>

                                        {/* Divider (Desktop Only) */}
                                        <div className="hidden lg:block w-px h-48 bg-linear-to-b from-transparent via-white/10 to-transparent" />

                                        {/* Detailed Distribution */}
                                        <div className="flex-1 w-full space-y-5">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = ratingBreakdown.distribution[star as keyof typeof ratingBreakdown.distribution];
                                                const percentage = ratingBreakdown.total > 0 ? (count / ratingBreakdown.total) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-6 group/bar">
                                                        <div className="flex items-center gap-3 w-12 justify-end">
                                                            <span className="text-lg font-bold text-slate-400 group-hover/bar:text-white transition-colors">{star}</span>
                                                            <Star className="w-4 h-4 text-slate-600 transition-colors group-hover/bar:text-[#fcb900]" />
                                                        </div>
                                                        <div className="flex-1 h-3.5 bg-slate-800/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/5 relative shadow-inner">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${percentage}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                                                className="h-full bg-linear-to-r from-[#fcb900] to-amber-400 rounded-full shadow-[0_0_15px_rgba(252,185,0,0.3)] relative"
                                                            >
                                                                <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent" />
                                                            </motion.div>
                                                        </div>
                                                        <div className="w-16 text-right">
                                                            <span className="text-sm font-black text-slate-300 tabular-nums">{count}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews Grid - Refined Card Design */}
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

                                            {/* User Profile */}
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 shrink-0 ring-2 ring-white/5 group-hover:ring-primary/40 transition-all duration-500 -rotate-3 group-hover:rotate-0">
                                                    {review.user.avatar_url ? (
                                                        <Image
                                                            src={review.user.avatar_url}
                                                            alt={review.user.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold text-xl text-slate-400 bg-linear-to-br from-slate-800 to-slate-900">
                                                            {review.user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg leading-tight group-hover:text-primary transition-colors">{review.user.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Verified Student</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating Stars */}
                                            <div className="flex gap-1 relative z-10">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={cn("w-4 h-4", i <= review.rating ? "fill-[#fcb900] text-[#fcb900]" : "fill-slate-800 text-slate-800")} />
                                                ))}
                                            </div>

                                            {/* Review Quote Text */}
                                            <div className="relative z-10">
                                                <p className="text-slate-300 text-base leading-relaxed line-clamp-5 group-hover:text-white transition-colors italic">
                                                    "{review.review_text}"
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs font-medium text-slate-500 tracking-wide">Posted {new Date().toLocaleDateString()}</span>
                                                <div className="flex gap-3">
                                                    <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-primary cursor-pointer transition-colors" />
                                                </div>
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

                    {/* Certificate Section - Premium Refinement */}
                    <div className="mt-24 lg:col-span-12">
                        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#020617] group">

                            {/* Ambient Background Effects */}
                            <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                            <div className="absolute inset-0 bg-white/5 opacity-[0.02] mix-blend-overlay pointer-events-none" />

                            <div className="relative z-10 p-8 md:p-12 lg:p-16 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                                {/* 3D Certificate Presentation */}
                                <div className="perspective-1000 relative flex justify-center lg:justify-end order-2 lg:order-1">
                                    <div className="relative transform-gpu transition-all duration-700 ease-out group-hover:rotate-y-[-5deg] group-hover:rotate-x-[5deg] group-hover:scale-105">

                                        {/* Glow behind certificate */}
                                        <div className="absolute inset-0 bg-primary/20 blur-2xl transform scale-95 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        <div className="relative rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 ring-1 ring-white/5 bg-[#1e293b]">
                                            <div className="relative w-full aspect-video md:aspect-4/3">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src="/certificate-mockup.png"
                                                    alt="Course Completion Certificate"
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Shimmer Effect */}
                                                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:animate-shimmer pointer-events-none" />
                                            </div>
                                        </div>

                                        {/* Premium Floating Badge */}
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

                                {/* Content Side */}
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
                                                icon: Lock
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

                    {/* Related Courses */}
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
                                        {/* Thumbnail */}
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

                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                                                <span className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shadow-primary/20">
                                                    View Details
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 flex flex-col flex-1 gap-3">
                                            {/* Title */}
                                            <h3 className="font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.5em]">
                                                {relatedCourse.title}
                                            </h3>

                                            {/* Meta */}
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

                </div>
            </div>

            {/* Lead Modal */}
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

            {/* Review Modal */}
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
        </div >
    );
}
