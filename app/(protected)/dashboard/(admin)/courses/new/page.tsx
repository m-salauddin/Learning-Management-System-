"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { createCourse, getCategories, getTeachers } from "@/lib/actions/courses";
import { CourseLevel, CreateCourseInput } from "@/types/lms";
import {
    courseStep1Schema,
    courseStep2Schema,
    courseStep3Schema,
    courseStep4Schema
} from "@/lib/validations/course";
import { ZodError } from "zod";

// Extracted Components
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

export default function CreateCoursePage() {
    const router = useRouter();
    const supabase = createClient();
    const toast = useToast();
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
        projects: [] as { title: string; description: string }[],
        faqs: [] as { question: string; answer: string }[],
        resources: [] as { title: string; type: string; url: string }[]
    });

    // Real-time validation (Watch Mode) - Debounced for performance
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

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catsRes, tchsRes] = await Promise.all([
                getCategories(),
                getTeachers()
            ]);

            if (catsRes.success && catsRes.data) {
                setCategories(catsRes.data);
            }
            if (tchsRes.success && tchsRes.data) {
                setTeachers(tchsRes.data);
            }
        } catch (error) {
            toast.error("Failed to fetch initial data");
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
                toast.error("Storage Bucket Missing", "The 'courses' bucket was not found. Please run the storage setup script in your Supabase SQL Editor.");
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
            const result = await createCourse(formData);
            if (result.success) {
                toast.success("Course created successfully!");
                router.push("/dashboard/courses");
            } else {
                toast.error(result.error || "Failed to create course");
            }
        } catch (errorDetail: any) {
            if (errorDetail instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                errorDetail.issues.forEach((issue) => {
                    if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                });
                setErrors(newErrors);
            } else {
                toast.error(errorDetail.message || "Failed to create course");
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

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Initialize New Course</h1>
                    <p className="text-muted-foreground mt-1 font-medium">Configure the core details, curriculum, and presentation for your new educational program.</p>
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
