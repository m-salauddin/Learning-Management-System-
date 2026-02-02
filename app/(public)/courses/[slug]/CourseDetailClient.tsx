"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
    File
} from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";
import { CoursePageData, CourseProject, CourseResource, CourseFAQ, ReviewWithUser, RatingBreakdown, InstructorInfo } from "@/types/course-page";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface CourseDetailClientProps {
    course: MappedCourse;
    pageData?: CoursePageData;
}

export default function CourseDetailClient({ course, pageData }: CourseDetailClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expandedModules, setExpandedModules] = useState<number[]>([0]);
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const supabase = createClient();
    const { success, error, info } = useToast();

    // Extract additional data from pageData if available
    const projects = pageData?.projects || [];
    const resources = pageData?.resources || [];
    const faq = pageData?.faq || [];
    const reviews = pageData?.reviews || [];
    const ratingBreakdown = pageData?.ratingBreakdown || { average: course.rating, total: course.reviews, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const instructorInfo = pageData?.instructor;

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
        <div className="min-h-screen bg-[#0f1117] text-slate-200 selection:bg-emerald-500/30 relative overflow-hidden">

            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Header / Breadcrumb Area */}
            <div className="bg-[#0f1117]/80 border-b border-white/5 backdrop-blur-md sticky top-0 z-40 supports-backdrop-filter:bg-[#0f1117]/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline">Back to Courses</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-400 truncate max-w-[200px] sm:max-w-md">
                        <span className="text-slate-500">Courses</span> / <span className="text-emerald-400">{course.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Hero Info (Left Side) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-6"
                        >
                            <div className="flex flex-wrap gap-3">
                                {course.tags?.map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                        {tag}
                                    </span>
                                ))}
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                                    <Star className="w-3 h-3 fill-amber-400" /> Best Seller
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                                {course.title}
                            </h1>

                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-amber-400 text-base">{course.rating}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={cn("w-3.5 h-3.5", i <= Math.round(Number(course.rating)) ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700")} />
                                        ))}
                                    </div>
                                    <span className="underline decoration-slate-600 underline-offset-4 hover:text-white transition-colors cursor-pointer">({course.reviews} ratings)</span>
                                </div>
                                <span className="hidden sm:inline text-slate-600">•</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span>{course.students} students</span>
                                </div>
                                <span className="hidden sm:inline text-slate-600">•</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span>{course.duration} Total</span>
                                </div>
                            </div>

                            {/* Mentors Section */}
                            <div className="pt-6 border-t border-white/5">
                                <p className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider text-[11px]">Created by</p>
                                <div className="flex items-center gap-4 group cursor-pointer w-fit">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 group-hover:border-emerald-500 transition-colors overflow-hidden relative shadow-lg">
                                        {course.instructor.avatar ? (
                                            <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">{course.instructor.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{course.instructor.name}</p>
                                        <p className="text-xs text-slate-400 font-medium">{course.instructor.title}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* What you'll learn */}
                        <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-[#1e293b]/60 transition-colors duration-300 shadow-xl shadow-black/20">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                What you'll learn
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                                {course.whatYouLearn?.map((item, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-sm text-slate-300 leading-relaxed font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content / Curriculum */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4 font-medium">
                                <span className="text-white">{course.curriculum?.length || 0}</span> sections
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span className="text-white">{course.curriculum?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}</span> lectures
                                <span className="w-1 h-1 rounded-full bg-slate-600" />
                                <span className="text-white">{course.duration}</span> total length
                            </div>

                            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#1e293b]/20">
                                {course.curriculum?.map((module, index) => (
                                    <div key={index} className="border-b border-white/5 last:border-0">
                                        <button
                                            onClick={() => toggleModule(index)}
                                            className="w-full flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors text-left bg-[#1e293b]/40 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("transition-transform duration-300", expandedModules.includes(index) ? "rotate-180 text-emerald-400" : "text-slate-400")}>
                                                    <ChevronDown className="w-5 h-5" />
                                                </div>
                                                <h3 className={cn("font-semibold transition-colors", expandedModules.includes(index) ? "text-white" : "text-slate-200 group-hover:text-white")}>
                                                    {module.title}
                                                </h3>
                                            </div>
                                            <span className="text-sm text-slate-500 font-medium hidden sm:block">{module.lessons?.length || 0} lectures • {module.duration}</span>
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
                                                >
                                                    <div className="bg-[#0f1117]/50 border-t border-white/5 pb-2">
                                                        {module.lessons?.map((lesson, lIndex) => (
                                                            <div key={lIndex} className="flex items-center justify-between py-3 px-6 pl-16 text-sm hover:bg-white/5 transition-colors group cursor-default">
                                                                <div className="flex items-center gap-3">
                                                                    {lesson.isFreePreview ? (
                                                                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                                                            <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                                                                        </div>
                                                                    ) : (
                                                                        <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                                                            <Lock className="w-3 h-3 text-slate-500" />
                                                                        </div>
                                                                    )}
                                                                    <span className={cn("transition-colors font-medium", lesson.isFreePreview ? "text-emerald-400 group-hover:underline" : "text-slate-400 group-hover:text-slate-300")}>
                                                                        {lesson.title}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    {lesson.isFreePreview && <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider hidden sm:inline-block border border-emerald-500/20 px-1.5 py-0.5 rounded">Preview</span>}
                                                                    <span className="text-xs text-slate-500 font-mono">{lesson.duration}</span>
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
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Description</h2>
                            <div className="prose prose-invert prose-slate max-w-none">
                                <p className="leading-7 text-slate-300 whitespace-pre-wrap">{course.longDescription || course.description}</p>
                            </div>
                        </div>

                        {/* Detailed Instructor Bio */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Instructor</h2>
                            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8 hover:bg-[#1e293b]/60 transition-colors duration-300">
                                <div className="flex flex-col sm:flex-row gap-8">
                                    <div className="shrink-0">
                                        <div className="w-28 h-28 rounded-full border-4 border-emerald-500/20 p-1 mx-auto sm:mx-0">
                                            <div className="w-full h-full rounded-full bg-slate-700 overflow-hidden relative">
                                                {course.instructor.avatar ? (
                                                    <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-slate-300">{course.instructor.name.charAt(0)}</div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Social links on mobile */}
                                        {instructorInfo?.social_links && (
                                            <div className="flex justify-center gap-3 mt-4 sm:hidden">
                                                {instructorInfo.social_links.youtube && (
                                                    <a href={instructorInfo.social_links.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-colors cursor-pointer">
                                                        <Play className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {instructorInfo.social_links.github && (
                                                    <a href={instructorInfo.social_links.github} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-500/20 hover:text-white transition-colors cursor-pointer">
                                                        <Code className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {instructorInfo.social_links.linkedin && (
                                                    <a href={instructorInfo.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500/20 hover:text-blue-400 transition-colors cursor-pointer">
                                                        <Users className="w-4 h-4" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4 flex-1 text-center sm:text-left">
                                        <div>
                                            <h3 className="text-xl font-bold text-emerald-400 hover:underline cursor-pointer decoration-emerald-500/50 underline-offset-4">{course.instructor.name}</h3>
                                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mt-1">{course.instructor.title}</p>
                                            {/* Expertise tags */}
                                            {instructorInfo?.expertise && instructorInfo.expertise.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                                    {instructorInfo.expertise.slice(0, 5).map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 text-xs rounded bg-slate-800 text-slate-300">{skill}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-300 leading-relaxed text-sm">
                                            {instructorInfo?.bio || course.instructor.bio || "Senior Instructor with 10+ years of experience in the industry. Passionate about teaching and helping students achieve their goals."}
                                        </p>

                                        <div className="flex gap-8 pt-5 border-t border-white/5 justify-center sm:justify-start">
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                                <div className="text-white text-lg font-bold mb-1">{instructorInfo?.total_students || course.students}</div>
                                                Students
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                                <div className="text-white text-lg font-bold mb-1 flex items-center gap-1">
                                                    {instructorInfo?.rating || course.rating} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                </div>
                                                Rating
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                                <div className="text-white text-lg font-bold mb-1">{instructorInfo?.total_courses || 6}</div>
                                                Courses
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Requirements Section */}
                        {course.requirements && course.requirements.length > 0 && (
                            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <ListChecks className="w-5 h-5 text-emerald-500" /> Requirements
                                </h2>
                                <ul className="space-y-3">
                                    {course.requirements.map((req, index) => (
                                        <li key={index} className="flex gap-3 items-start">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                                            <span className="text-sm text-slate-300 leading-relaxed">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Target Audience Section */}
                        {course.targetAudience && course.targetAudience.length > 0 && (
                            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Target className="w-5 h-5 text-emerald-500" /> Who This Course Is For
                                </h2>
                                <ul className="space-y-3">
                                    {course.targetAudience.map((item, index) => (
                                        <li key={index} className="flex gap-3 items-start">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                            <span className="text-sm text-slate-300 leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Projects Section */}
                        {projects.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <FolderKanban className="w-6 h-6 text-emerald-500" /> Projects You'll Build
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {projects.filter(p => p.is_public).map((project) => (
                                        <div key={project.id} className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden hover:bg-[#1e293b]/60 transition-colors group">
                                            <div className="aspect-video relative">
                                                <Image src={project.thumbnail_url || '/placeholder-project.jpg'} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <h3 className="font-bold text-white text-sm">{project.title}</h3>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{project.description}</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {project.technologies.slice(0, 4).map((tech, i) => (
                                                        <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {projects.filter(p => !p.is_public).length > 0 && (
                                    <p className="text-sm text-slate-500 mt-4 flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> +{projects.filter(p => !p.is_public).length} more projects available after enrollment
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Resources Section */}
                        {resources.length > 0 && (
                            <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8">
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Download className="w-5 h-5 text-emerald-500" /> Downloadable Resources
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {resources.filter(r => r.is_public).slice(0, 6).map((resource) => (
                                        <div key={resource.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
                                            {getResourceIcon(resource.resource_type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white">{resource.title}</p>
                                                <p className="text-xs text-slate-500">{resource.resource_type.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {resources.length > 6 && (
                                    <p className="text-sm text-slate-500 mt-4">+{resources.length - 6} more resources included</p>
                                )}
                            </div>
                        )}

                        {/* FAQ Section */}
                        {faq.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <HelpCircle className="w-6 h-6 text-emerald-500" /> Frequently Asked Questions
                                </h2>
                                <div className="border border-white/10 rounded-xl overflow-hidden bg-[#1e293b]/20">
                                    {faq.filter(f => f.is_published).map((item, index) => (
                                        <div key={item.id} className="border-b border-white/5 last:border-0">
                                            <button
                                                onClick={() => toggleFaq(index)}
                                                className="w-full flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors text-left"
                                            >
                                                <span className={cn("font-medium transition-colors", expandedFaq === index ? "text-emerald-400" : "text-slate-200")}>{item.question}</span>
                                                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", expandedFaq === index ? "rotate-180 text-emerald-400" : "")} />
                                            </button>
                                            <AnimatePresence initial={false}>
                                                {expandedFaq === index && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-6 pb-4 text-sm text-slate-400 leading-relaxed">
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

                        {/* Reviews Section */}
                        {reviews.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <MessageCircle className="w-6 h-6 text-emerald-500" /> Student Reviews
                                </h2>

                                {/* Rating Breakdown */}
                                <div className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 mb-6">
                                    <div className="flex flex-col sm:flex-row gap-8 items-center">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-white">{ratingBreakdown.average.toFixed(1)}</div>
                                            <div className="flex gap-0.5 justify-center mt-2">
                                                {[1, 2, 3, 4, 5].map(i => (
                                                    <Star key={i} className={cn("w-4 h-4", i <= Math.round(ratingBreakdown.average) ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700")} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-slate-400 mt-1">{ratingBreakdown.total} reviews</p>
                                        </div>
                                        <div className="flex-1 space-y-2 w-full">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = ratingBreakdown.distribution[star as keyof typeof ratingBreakdown.distribution];
                                                const percentage = ratingBreakdown.total > 0 ? (count / ratingBreakdown.total) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <span className="text-sm text-slate-400 w-12">{star} stars</span>
                                                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percentage}%` }} />
                                                        </div>
                                                        <span className="text-xs text-slate-500 w-8">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Cards */}
                                <div className="space-y-4">
                                    {reviews.slice(0, 5).map((review) => (
                                        <div key={review.id} className="bg-[#1e293b]/40 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:bg-[#1e293b]/60 transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden relative shrink-0">
                                                    {review.user.avatar_url ? (
                                                        <Image src={review.user.avatar_url} alt={review.user.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">{review.user.name.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1">
                                                        <span className="font-semibold text-white">{review.user.name}</span>
                                                        <span className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(i => (
                                                                <Star key={i} className={cn("w-3 h-3", i <= review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700")} />
                                                            ))}
                                                        </div>
                                                        {review.is_verified && <span className="text-[10px] text-emerald-500 font-bold uppercase">Verified</span>}
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-relaxed">{review.review_text}</p>
                                                    {review.helpful_count > 0 && (
                                                        <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                                                            <ThumbsUp className="w-3 h-3" /> {review.helpful_count} found this helpful
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {reviews.length > 5 && (
                                    <button className="w-full mt-4 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-sm">
                                        Show all {reviews.length} reviews
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            {/* Video/Preview Card */}
                            <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/5">
                                {/* Video Thumbnail Area */}
                                <div className="aspect-video relative group cursor-pointer bg-black overflow-hidden">
                                    <Image
                                        src={course.image || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/20">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg relative z-10">
                                                <Play className="w-5 h-5 text-black fill-black ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <span className="text-white font-bold text-sm drop-shadow-md bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">Preview this course</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    <div className="space-y-1">
                                        <div className="flex items-end gap-3">
                                            <span className="text-3xl font-bold text-white tracking-tight">{formattedPrice}</span>
                                            {originalPrice && course.priceType !== "Free" && (
                                                <span className="text-lg text-slate-500 line-through mb-1">{originalPrice}</span>
                                            )}
                                        </div>
                                        {hasDiscount && course.priceType !== "Free" && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-rose-400 font-bold">{discountPercentage || 20}% off</span>
                                                {course.discountExpiresAt && (
                                                    <>
                                                        <span className="text-rose-400">•</span>
                                                        <span className="text-rose-400 flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" /> Limited time!</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleEnroll}
                                            disabled={loading}
                                            className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                        >
                                            <span className="relative z-10">{loading ? "Processing..." : course.priceType === "Free" ? "Enroll Now" : "Buy Now"}</span>
                                            <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                        <button className="w-full py-4 rounded-xl border border-slate-600 text-white font-bold hover:bg-slate-800 transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>

                                    <p className="text-xs text-center text-slate-400">30-Day Money-Back Guarantee</p>

                                    <div className="pt-5 border-t border-white/10 space-y-4">
                                        <h4 className="font-bold text-white text-sm">This course includes:</h4>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            <li className="flex items-center gap-3"><Layout className="w-4 h-4 text-emerald-500" /> Full lifetime access</li>
                                            <li className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-emerald-500" /> {course.curriculum?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0}+ lessons</li>
                                            <li className="flex items-center gap-3"><Download className="w-4 h-4 text-emerald-500" /> 15 Downloadable resources</li>
                                            <li className="flex items-center gap-3"><Globe className="w-4 h-4 text-emerald-500" /> Access on mobile and TV</li>
                                            <li className="flex items-center gap-3"><Award className="w-4 h-4 text-emerald-500" /> Certificate of completion</li>
                                        </ul>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <button className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 underline decoration-slate-600 underline-offset-4 transition-colors">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                        <button className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 underline decoration-slate-600 underline-offset-4 transition-colors">
                                            <Gift className="w-4 h-4" /> Gift this course
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Training for Team (Optional / Upsell) */}
                            <div className="border border-white/10 rounded-2xl p-6 bg-[#1e293b]/20 hover:bg-[#1e293b]/30 transition-colors">
                                <h4 className="font-bold text-white mb-2">Training 5 or more people?</h4>
                                <p className="text-sm text-slate-400 mb-4">Get your team access to 8,000+ top courses anytime, anywhere.</p>
                                <button className="w-full py-3 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-800 transition-colors text-sm">
                                    Try Business
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
