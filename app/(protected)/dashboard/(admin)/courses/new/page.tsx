"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { createCourse, getCategories, getTeachers } from "@/lib/actions/courses";
import { CourseLevel, CreateCourseInput } from "@/types/lms";

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

    // Form state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState<CreateCourseInput>({
        title: "",
        short_description: "",
        description: "",
        price: 0,
        discount_price: null,
        category_id: "",
        instructor_id: "",
        level: "beginner" as CourseLevel,
        language: "Bengali",
        thumbnail_url: "",
        preview_video_url: "",
        requirements: [] as string[],
        learning_objectives: [] as string[],
        target_audience: [] as string[],
        tags: [] as string[],
        projects: [] as { title: string; description: string }[],
        faqs: [] as { question: string; answer: string }[],
        resources: [] as { title: string; type: string; url: string }[]
    });

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

            toast.success("Identity asset uploaded");
        } catch (error: any) {
            toast.error(error.message || "Upload failed");
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
        setIsSubmitting(true);

        try {
            await createCourse(formData);
            toast.success("Course Initialized Successfully!");
            router.push("/dashboard/courses");
        } catch (error: any) {
            toast.error(error.message || "Initialization Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Navigation ---
    const nextStep = () => {
        if (currentStep === 1 && !formData.title) return toast.error("Title is mandatory");
        if (currentStep === 1 && !formData.category_id) return toast.error("Select a category");
        setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">
            <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/60">Creative Studio</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                            Launch Your <span className="text-primary italic">Expertise</span>
                        </h1>
                        <p className="text-white/40 text-base md:text-lg max-w-2xl font-medium leading-relaxed">
                            Follow our streamlined process to create a world-class learning experience for your students.
                        </p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-5 bg-white/2 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-2xl"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <GraduationCap className="w-7 h-7" />
                        </div>
                        <div className="pr-4">
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Global Status</p>
                            <p className="text-lg font-black text-white">Draft Mode</p>
                        </div>
                    </motion.div>
                </div>

                <StepIndicator currentStep={currentStep} setCurrentStep={setCurrentStep} />

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
                    <div className="xl:col-span-8 space-y-8 min-h-[600px] md:min-h-[700px]">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <StepFoundations
                                    formData={formData}
                                    setFormData={setFormData}
                                    categories={categories}
                                    teachers={teachers}
                                />
                            )}
                            {currentStep === 2 && (
                                <StepNarratives
                                    formData={formData}
                                    setFormData={setFormData}
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
                                />
                            )}
                            {currentStep === 4 && (
                                <StepFinalization
                                    formData={formData}
                                    setFormData={setFormData}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="xl:col-span-4 hidden xl:block sticky top-8">
                        <CoursePreview formData={formData} thumbnailPreview={thumbnailPreview} />
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
