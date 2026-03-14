"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { updateCourse, getCategories, getTeachers, getCourseById } from "@/lib/actions/courses";
import { CourseLevel, CreateCourseInput } from "@/types/lms";
import {
    courseStep1Schema,
    courseStep2Schema,
    courseStep3Schema,
    courseStep4Schema
} from "@/lib/validations/course";
import { ZodError } from "zod";
import Link from "next/link";

// Reuse extracted components from create page
import { StepIndicator } from "@/components/dashboard/courses/new/StepIndicator";
import { CoursePreview } from "@/components/dashboard/courses/new/CoursePreview";
import { StepFoundations } from "@/components/dashboard/courses/new/StepFoundations";
import { StepNarratives } from "@/components/dashboard/courses/new/StepNarratives";
import { StepPresentation } from "@/components/dashboard/courses/new/StepPresentation";
import { StepFinalization } from "@/components/dashboard/courses/new/StepFinalization";
import { FormFooter } from "@/components/dashboard/courses/new/FormFooter";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon?: string;
}

interface Teacher {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: courseId } = use(params);
    const router = useRouter();
    const supabase = createClient();
    const toast = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submittedSteps, setSubmittedSteps] = useState<Set<number>>(new Set());

    // Form state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState<CreateCourseInput>({
        title: "",
        short_description: "",
        description: "",
        price: 0,
        discount_price: null,
        discount_expires_at: undefined,
        category_id: "",
        instructor_ids: [] as string[],
        support_instructor_ids: [] as string[],
        level: "beginner" as CourseLevel,
        language: "Bengali",
        thumbnail_url: "",
        preview_video_url: "",
        requirements: [] as string[],
        target_audience: [] as string[],
        tags: [] as string[],
        batch_no: undefined,
        course_type: "recorded" as "recorded" | "live" | "hybrid",
        projects: [] as { title: string; description: string }[],
        faqs: [] as { question: string; answer: string }[],
        resources: [] as { title: string; type: string; url: string }[]
    });

    // Real-time validation (Watch Mode)
    useEffect(() => {
        if (submittedSteps.has(currentStep)) {
            const timer = setTimeout(() => {
                let schema;
                if (currentStep === 1) schema = courseStep1Schema;
                else if (currentStep === 2) schema = courseStep2Schema;
                else if (currentStep === 3) schema = courseStep3Schema;
                else if (currentStep === 4) schema = courseStep4Schema;

                if (schema) {
                    const result = schema.safeParse(formData);
                    if (!result.success) {
                        const newErrors: Record<string, string> = {};
                        result.error.issues.forEach((issue) => {
                            if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                        });
                        setErrors(newErrors);
                    } else {
                        setErrors({});
                    }
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [formData, currentStep, submittedSteps]);

    // Media states
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch course data + categories + teachers
    useEffect(() => {
        fetchData();
    }, [courseId]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [courseRes, catsRes, tchsRes] = await Promise.all([
                getCourseById(courseId),
                getCategories(),
                getTeachers()
            ]);

            if (catsRes.success && catsRes.data) {
                setCategories(catsRes.data);
            }
            if (tchsRes.success && tchsRes.data) {
                setTeachers(tchsRes.data);
            }

            if (courseRes.success && courseRes.data) {
                const course = courseRes.data as any;

                const details = course.course_details?.[0] || {};
                const projects = course.course_projects || [];
                const faqs = course.course_faq || [];
                const resources = course.course_resources || [];
                const instructors = course.course_instructors || [];

                const mainInstructorIds = instructors
                    .filter((i: any) => i.role === 'main')
                    .map((i: any) => i.instructor_id);
                const supportInstructorIds = instructors
                    .filter((i: any) => i.role === 'support')
                    .map((i: any) => i.instructor_id);

                setFormData({
                    title: course.title || "",
                    short_description: course.short_description || "",
                    description: course.description || details?.description_long || "",
                    price: course.price || 0,
                    discount_price: course.discount_price || null,
                    discount_expires_at: course.discount_expires_at ? new Date(course.discount_expires_at).toISOString().slice(0, 16) : undefined,
                    category_id: course.category_id || "",
                    instructor_ids: mainInstructorIds.length > 0 ? mainInstructorIds : (course.instructor_id ? [course.instructor_id] : []),
                    support_instructor_ids: supportInstructorIds,
                    level: course.level || "beginner",
                    language: course.language || details?.language || "Bengali",
                    thumbnail_url: course.thumbnail_url || "",
                    preview_video_url: course.preview_video_url || "",
                    requirements: course.requirements || details?.requirements || [],
                    target_audience: details?.target_audience || [],
                    tags: course.tags || [],
                    batch_no: course.batch_no || undefined,
                    course_type: course.course_type || "recorded",
                    projects: projects.map((p: any) => ({
                        title: p.title || "",
                        description: p.description || "",
                        image_url: p.thumbnail_url || ""
                    })),
                    faqs: faqs.map((f: any) => ({
                        question: f.question || "",
                        answer: f.answer || ""
                    })),
                    resources: resources.map((r: any) => ({
                        title: r.title || "",
                        type: r.resource_type || "",
                        url: r.external_url || ""
                    })),
                    modules: course.modules?.map((m: any) => ({
                        title: m.title || "",
                        lessons: (m.lessons || []).map((l: any) => ({
                            title: l.title || "",
                            video_url: l.lesson_assets?.[0]?.video_path || ""
                        }))
                    })) || []
                });

                // Set thumbnail preview from existing URL
                if (course.thumbnail_url) {
                    setThumbnailPreview(course.thumbnail_url);
                }
            } else {
                toast.error("Course not found");
                router.push("/dashboard/courses");
            }
        } catch (error) {
            console.error("Failed to fetch course data:", error);
            toast.error("Failed to load course data");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Media Handlers ---
    const handleThumbnailUpload = async (file: File) => {
        setIsUploadingThumbnail(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `course-thumbnails/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('courses')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('courses')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));

            const reader = new FileReader();
            reader.onloadend = () => setThumbnailPreview(reader.result as string);
            reader.readAsDataURL(file);

            toast.success("Thumbnail uploaded successfully");
        } catch (error: any) {
            console.error("Thumbnail upload error:", error);
            if (error.message?.includes("bucket") || error.message?.includes("Bucket not found")) {
                toast.error("Storage Bucket Missing", "The 'courses' bucket was not found. Please run the storage setup script.");
            } else {
                toast.error(error.message || "Upload failed");
            }
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleThumbnailUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleThumbnailUpload(file);
    };

    const removeThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail_url: "" }));
        setThumbnailPreview(null);
    };

    // --- Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmittedSteps(prev => new Set(prev).add(4));
        setErrors({});

        try {
            courseStep4Schema.parse(formData);
            setIsSubmitting(true);
            const result = await updateCourse({
                id: courseId,
                ...formData
            });
            if (result.success) {
                toast.success("Course updated successfully!");
                router.push("/dashboard/courses");
            } else {
                toast.error(result.error || "Failed to update course");
            }
        } catch (errorDetail: any) {
            if (errorDetail instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                errorDetail.issues.forEach((issue) => {
                    if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(newErrors);
            } else {
                toast.error(errorDetail.message || "Failed to update course");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Navigation ---
    const nextStep = () => {
        setSubmittedSteps(prev => new Set(prev).add(currentStep));
        setErrors({});
        try {
            if (currentStep === 1) courseStep1Schema.parse(formData);
            if (currentStep === 2) courseStep2Schema.parse(formData);
            if (currentStep === 3) courseStep3Schema.parse(formData);

            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (errorDetail: any) {
            if (errorDetail instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                errorDetail.issues.forEach((issue) => {
                    if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(newErrors);
            }
        }
    };

    const prevStep = () => {
        setErrors({});
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground font-medium text-lg">Loading course data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Link
                            href="/dashboard/courses"
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Edit Course</h1>
                            <p className="text-muted-foreground mt-1 font-medium">
                                Update the details, curriculum, and presentation for <span className="text-primary font-bold">{formData.title}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <StepIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                    <div className="xl:col-span-8 space-y-8 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <StepFoundations
                                    formData={formData}
                                    setFormData={setFormData}
                                    categories={categories}
                                    teachers={teachers}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 2 && (
                                <StepNarratives
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 3 && (
                                <StepPresentation
                                    formData={formData}
                                    setFormData={setFormData}
                                    thumbnailPreview={thumbnailPreview}
                                    isDragging={isDragging}
                                    isUploadingThumbnail={isUploadingThumbnail}
                                    fileInputRef={fileInputRef}
                                    handleDragOver={handleDragOver}
                                    handleDragLeave={handleDragLeave}
                                    handleDrop={handleDrop}
                                    handleFileChange={handleFileChange}
                                    removeThumbnail={removeThumbnail}
                                    errors={errors}
                                />
                            )}
                            {currentStep === 4 && (
                                <StepFinalization
                                    formData={formData}
                                    setFormData={setFormData}
                                    errors={errors}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Live Preview Sidebar */}
                    <div className="xl:col-span-4 h-full">
                        <CoursePreview
                            formData={formData}
                            thumbnailPreview={thumbnailPreview}
                        />
                    </div>
                </div>

                <FormFooter
                    currentStep={currentStep}
                    totalSteps={totalSteps}
                    prevStep={prevStep}
                    nextStep={nextStep}
                    isSubmitting={isSubmitting}
                />
            </form>
        </div>
    );
}
