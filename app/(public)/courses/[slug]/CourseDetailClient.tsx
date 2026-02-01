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
    Gift
} from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function CourseDetailClient({ course }: { course: MappedCourse }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [expandedModules, setExpandedModules] = useState<number[]>([0]);
    const supabase = createClient();
    const { success, error, info } = useToast();

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

    // Helper to format price
    const formattedPrice = course.priceType === "Free" ? "Free" : course.price;

    return (
        <div className="min-h-screen bg-[#0f1117] text-slate-200 selection:bg-emerald-500/30">
            {/* Header / Breadcrumb Area */}
            <div className="bg-[#1e293b]/50 border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Courses</span>
                    </Link>
                    <div className="text-sm font-medium text-slate-400">
                        <span className="text-slate-500">Courses</span> / <span className="text-emerald-400">{course.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column (Content) */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* Hero Info (Left Side) */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {course.tags?.map((tag) => (
                                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {tag}
                                    </span>
                                ))}
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-400" /> Best Seller
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                                {course.title}
                            </h1>

                            <p className="text-lg text-slate-400 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-amber-400 text-base">{course.rating}</span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} className={cn("w-4 h-4", i <= Math.round(Number(course.rating)) ? "fill-amber-400 text-amber-400" : "fill-slate-700 text-slate-700")} />
                                        ))}
                                    </div>
                                    <span className="underline decoration-slate-600 underline-offset-4">({course.reviews} ratings)</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4" />
                                    <span>{course.students} students</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{course.duration} Total</span>
                                </div>
                            </div>

                            {/* Mentors Section */}
                            <div className="pt-4 border-t border-white/5">
                                <p className="text-sm font-medium text-slate-400 mb-3">Created by</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 overflow-hidden relative">
                                        {course.instructor.avatar ? (
                                            <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">{course.instructor.name.charAt(0)}</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer">{course.instructor.name}</p>
                                        <p className="text-xs text-slate-500">{course.instructor.title}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="bg-[#1e293b]/30 border border-white/5 rounded-2xl p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-white mb-6">What you'll learn</h2>
                            <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                                {course.whatYouLearn?.map((item, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="text-sm text-slate-300 leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content / Curriculum */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>

                            <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                                <span>{course.curriculum?.length || 0} sections</span>
                                <span>•</span>
                                <span>{course.curriculum?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0} lectures</span>
                                <span>•</span>
                                <span>{course.duration} total length</span>
                            </div>

                            <div className="border border-white/10 rounded-xl overflow-hidden bg-[#1e293b]/20">
                                {course.curriculum?.map((module, index) => (
                                    <div key={index} className="border-b border-white/5 last:border-0">
                                        <button
                                            onClick={() => toggleModule(index)}
                                            className="w-full flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors text-left bg-[#1e293b]/40"
                                        >
                                            <div className="flex items-center gap-4">
                                                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-200", expandedModules.includes(index) && "rotate-180")} />
                                                <h3 className="font-semibold text-slate-200">{module.title}</h3>
                                            </div>
                                            <span className="text-sm text-slate-500 hidden sm:block">{module.lessons?.length || 0} lectures • {module.duration}</span>
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
                                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                                >
                                                    <div className="bg-[#0f1117]/50">
                                                        {module.lessons?.map((lesson, lIndex) => (
                                                            <div key={lIndex} className="flex items-center justify-between py-3 px-6 pl-14 text-sm hover:bg-white/5 transition-colors group cursor-default">
                                                                <div className="flex items-center gap-3">
                                                                    {lesson.isFreePreview ? (
                                                                        <Play className="w-4 h-4 text-emerald-500 shrink-0 fill-emerald-500/20" />
                                                                    ) : (
                                                                        <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                                                                    )}
                                                                    <span className={cn("transition-colors", lesson.isFreePreview ? "text-emerald-400 font-medium group-hover:underline" : "text-slate-400")}>
                                                                        {lesson.title}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    {lesson.isFreePreview && <span className="text-xs text-emerald-500 font-bold uppercase hidden sm:inline-block">Preview</span>}
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
                            <div className="bg-[#1e293b]/30 border border-white/5 rounded-2xl p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <div className="shrink-0">
                                        <div className="w-24 h-24 rounded-full border-2 border-emerald-500/20 p-1">
                                            <div className="w-full h-full rounded-full bg-slate-700 overflow-hidden relative">
                                                {course.instructor.avatar ? (
                                                    <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-slate-300">{course.instructor.name.charAt(0)}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-emerald-400">{course.instructor.name}</h3>
                                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{course.instructor.title}</p>
                                        </div>
                                        <p className="text-slate-300 leading-relaxed text-sm">
                                            {course.instructor.bio || "Senior Instructor with 10+ years of experience in the industry. Passionate about teaching and helping students achieve their goals."}
                                        </p>

                                        <div className="flex gap-6 pt-4 border-t border-white/5">
                                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                                <div className="text-white text-lg font-bold mb-1">{course.students}</div>
                                                Students
                                            </div>
                                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                                <div className="text-white text-lg font-bold mb-1">{course.reviews}</div>
                                                Reviews
                                            </div>
                                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                                <div className="text-white text-lg font-bold mb-1">12</div>
                                                Courses
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            {/* Video/Preview Card */}
                            <div className="bg-[#1e293b] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                                {/* Video Thumbnail Area */}
                                <div className="aspect-video relative group cursor-pointer bg-black">
                                    <Image
                                        src={course.image || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
                                                <Play className="w-5 h-5 text-black fill-black ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                        <span className="text-white font-bold text-sm drop-shadow-md">Preview this course</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    <div className="space-y-1">
                                        <div className="flex items-end gap-3">
                                            <span className="text-3xl font-bold text-white tracking-tight">{formattedPrice}</span>
                                            {course.priceType !== "Free" && (
                                                <span className="text-lg text-slate-500 line-through mb-1">৳12,000</span>
                                            )}
                                        </div>
                                        {course.priceType !== "Free" && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-red-400 font-medium">86% off</span>
                                                <span className="text-red-400">•</span>
                                                <span className="text-red-400 flex items-center gap-1"><Clock className="w-3 h-3" /> 2 days left at this price!</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            onClick={handleEnroll}
                                            disabled={loading}
                                            className="w-full py-3.5 rounded-lg bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {loading ? "Processing..." : course.priceType === "Free" ? "Enroll Now" : "Buy Now"}
                                        </button>
                                        <button className="w-full py-3.5 rounded-lg border border-slate-600 text-white font-bold hover:bg-slate-800 transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>

                                    <p className="text-xs text-center text-slate-400">30-Day Money-Back Guarantee</p>

                                    <div className="pt-4 border-t border-white/10 space-y-4">
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
                                        <button className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 underline decoration-slate-600 underline-offset-4">
                                            <Share2 className="w-4 h-4" /> Share
                                        </button>
                                        <button className="text-sm font-medium text-slate-400 hover:text-white flex items-center gap-2 underline decoration-slate-600 underline-offset-4">
                                            <Gift className="w-4 h-4" /> Gift this course
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Training for Team (Optional / Upsell) */}
                            <div className="border border-white/10 rounded-xl p-5 bg-[#1e293b]/20">
                                <h4 className="font-bold text-white mb-2">Training 5 or more people?</h4>
                                <p className="text-sm text-slate-400 mb-4">Get your team access to 8,000+ top courses anytime, anywhere.</p>
                                <button className="w-full py-2.5 rounded-lg border border-slate-600 text-white font-semibold hover:bg-slate-800 transition-colors text-sm">
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
