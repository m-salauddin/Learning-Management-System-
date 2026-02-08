"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft, BookOpen, DollarSign, Layers, BarChart, Globe, Clock,
    Image as ImageIcon, Video, ListChecks, Target, Tags, Save, Loader2,
    Upload, X, Check, Sparkles, ChevronRight, ChevronLeft, HelpCircle,
    FileText, FolderKanban, Info, PencilLine, AlertCircle, Users
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { createCourse, getCategories, getTeachers } from "@/lib/actions/courses";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CourseLevel } from "@/types/lms";
import { GraduationCap } from "lucide-react";

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

import { Breadcrumbs } from "@/components/dashboard/shared/Breadcrumbs";

export default function CreateCoursePage() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const breadcrumbItems = [
        { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
        { label: "Create Course", active: true, icon: Sparkles }
    ];
    // Shared styling constants based on dashboard design system
    const inputClasses = "w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground text-sm placeholder:text-input-dark-text focus:shadow-[0_0_0_3px_var(--input-dark-glow)] focus:border-input-dark-border outline-none transition-all duration-200";
    const selectTriggerClasses = "w-full h-11 rounded-xl bg-input-dark border border-input-dark-border text-foreground transition-all duration-200 focus:shadow-[0_0_0_3px_var(--input-dark-glow)] focus:border-input-dark-border outline-none";
    const labelClasses = "flex items-center gap-1.5 text-sm font-semibold mb-2 text-foreground/80";


    // Form state
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const [formData, setFormData] = useState({
        title: "",
        short_description: "",
        description: "",
        price: 0,
        discount_price: null as number | null,
        category_id: "",
        instructor_id: "", // Assigned teacher
        level: "beginner" as CourseLevel,
        language: "বাংলা",
        thumbnail_url: "",
        preview_video_url: "",
        requirements: [] as string[],
        learning_objectives: [] as string[],
        target_audience: [] as string[], // New
        tags: [] as string[],
        faqs: [] as { question: string, answer: string }[], // New
        projects: [] as { title: string, description: string }[], // New
        resources: [] as { title: string, type: string, url: string }[], // New
    });

    // Temporary input states for array fields
    const [requirementInput, setRequirementInput] = useState("");
    const [objectiveInput, setObjectiveInput] = useState("");
    const [targetInput, setTargetInput] = useState("");
    const [tagInput, setTagInput] = useState("");

    // States for FAQ, Projects, Resources
    const [faqInput, setFaqInput] = useState({ question: "", answer: "" });
    const [projectInput, setProjectInput] = useState({ title: "", description: "" });
    const [resourceInput, setResourceInput] = useState({ title: "", type: "link", url: "" });

    // Thumbnail upload state
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    // Handle thumbnail file upload
    const handleThumbnailUpload = async (file: File) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast.error("Invalid file type", "Please upload a JPEG, PNG, WebP, or GIF image");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large", "Image must be less than 5MB");
            return;
        }

        try {
            setIsUploadingThumbnail(true);

            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `course-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('course-thumbnails')
                .upload(fileName, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('course-thumbnails')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
            toast.success("Thumbnail uploaded", "Course thumbnail has been uploaded successfully");

        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error("Upload failed", error.message || "Could not upload thumbnail");
            setThumbnailPreview(null);
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleThumbnailUpload(file);
        }
    };

    // Handle drag events
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
        if (file) {
            handleThumbnailUpload(file);
        }
    };

    // Remove thumbnail
    const removeThumbnail = async () => {
        if (formData.thumbnail_url) {
            try {
                // Extract filename from URL
                const urlParts = formData.thumbnail_url.split('/course-thumbnails/');
                if (urlParts.length > 1) {
                    const fileName = urlParts[1];
                    await supabase.storage.from('course-thumbnails').remove([fileName]);
                }
            } catch (error) {
                console.error('Error removing old thumbnail:', error);
            }
        }
        setThumbnailPreview(null);
        setFormData(prev => ({ ...prev, thumbnail_url: "" }));
    };

    // Fetch categories and teachers on mount
    useEffect(() => {
        const fetchData = async () => {
            const [categoriesResult, teachersResult] = await Promise.all([
                getCategories(),
                getTeachers()
            ]);

            if (categoriesResult.success && categoriesResult.data) {
                setCategories(categoriesResult.data);
            }

            if (teachersResult.success && teachersResult.data) {
                setTeachers(teachersResult.data);
            }
        };
        fetchData();
    }, []);

    // Auto-generate slug from title
    useEffect(() => {
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
        setFormData(prev => ({ ...prev, slug: slug }));
    }, [formData.title]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Course title is required");
            return;
        }

        if (formData.price < 0) {
            toast.error("Price cannot be negative");
            return;
        }

        if (isUploadingThumbnail) {
            toast.error("Please wait for the thumbnail to finish uploading");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await createCourse({
                title: formData.title,
                short_description: formData.short_description,
                description: formData.description,
                price: formData.price,
                discount_price: formData.discount_price,
                category_id: formData.category_id || undefined,
                instructor_id: formData.instructor_id || undefined,
                level: formData.level,
                language: formData.language,
                thumbnail_url: formData.thumbnail_url,
                preview_video_url: formData.preview_video_url,
                requirements: formData.requirements,
                learning_objectives: formData.learning_objectives,
                target_audience: formData.target_audience,
                tags: formData.tags,
                faqs: formData.faqs,
                projects: formData.projects,
                resources: formData.resources,
            });

            if (result.success) {
                toast.success("Course created successfully!");
                router.push("/dashboard/courses");
            } else {
                toast.error(result.error || "Failed to create course");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addArrayItem = (field: 'requirements' | 'learning_objectives' | 'target_audience' | 'tags', value: string, setter: (v: string) => void) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...(prev[field] as string[]), value.trim()]
            }));
            setter("");
        }
    };

    const removeArrayItem = (field: 'requirements' | 'learning_objectives' | 'target_audience' | 'tags', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
    };

    const addFaq = () => {
        if (faqInput.question.trim() && faqInput.answer.trim()) {
            setFormData(prev => ({ ...prev, faqs: [...prev.faqs, faqInput] }));
            setFaqInput({ question: "", answer: "" });
        }
    };

    const removeFaq = (index: number) => {
        setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
    };

    const addProject = () => {
        if (projectInput.title.trim()) {
            setFormData(prev => ({ ...prev, projects: [...prev.projects, projectInput] }));
            setProjectInput({ title: "", description: "" });
        }
    };

    const removeProject = (index: number) => {
        setFormData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
    };

    const addResource = () => {
        if (resourceInput.title.trim() && resourceInput.url.trim()) {
            setFormData(prev => ({ ...prev, resources: [...prev.resources, resourceInput] }));
            setResourceInput({ title: "", type: "link", url: "" });
        }
    };

    const removeResource = (index: number) => {
        setFormData(prev => ({ ...prev, resources: prev.resources.filter((_, i) => i !== index) }));
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.title.trim()) {
                toast.error("Course title is required");
                return;
            }
            if (!formData.category_id) {
                toast.error("Category is required");
                return;
            }
            if (!formData.level) {
                toast.error("Difficulty level is required");
                return;
            }
        }

        if (currentStep === 2) {
            if (!formData.short_description.trim()) {
                toast.error("Short description is required");
                return;
            }
            if (formData.learning_objectives.length === 0) {
                toast.error("Please add at least one learning objective");
                return;
            }
        }

        if (currentStep === 3) {
            if (formData.price < 0) {
                toast.error("Price cannot be negative");
                return;
            }
            // Optional: thumbnail check?
        }

        if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const StepIndicator = () => (
        <div className="flex items-center gap-2 mb-10 w-full max-w-4xl overflow-x-auto pb-4 no-scrollbar">
            {[
                { n: 1, label: "Basic Info", icon: Info },
                { n: 2, label: "Content", icon: PencilLine },
                { n: 3, label: "Pricing & Media", icon: DollarSign },
                { n: 4, label: "Setup & Extras", icon: Sparkles }
            ].map((step, i) => (
                <div key={step.n} className="flex items-center shrink-0">
                    <div className={cn(
                        "flex items-center gap-2 transition-all duration-500 py-2 px-4 rounded-xl border",
                        currentStep === step.n
                            ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                            : currentStep > step.n
                                ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-500"
                                : "bg-muted/30 border-border/40 text-muted-foreground"
                    )}>
                        <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                            currentStep === step.n ? "bg-primary text-primary-foreground" : "bg-muted/50"
                        )}>
                            {currentStep > step.n ? <Check className="w-3.5 h-3.5" /> : step.n}
                        </div>
                        <span className="text-xs font-semibold whitespace-nowrap">{step.label}</span>
                    </div>
                    {i < 3 && (
                        <div className={cn(
                            "w-8 h-px mx-2",
                            currentStep > step.n ? "bg-emerald-500/30" : "bg-border/30"
                        )} />
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen p-6 md:p-8">
            {/* Breadcrumbs */}
            <Breadcrumbs items={breadcrumbItems} showHomeIcon={true} />

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create New Course</h1>
                <p className="text-muted-foreground mt-1.5">Design a premium learning experience for your students</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <StepIndicator />

                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-primary" />
                                        Basic Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className={labelClasses}>
                                                Course Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="e.g., Complete Web Development Bootcamp"
                                                className={inputClasses}
                                                required
                                            />
                                        </div>


                                        <div>
                                            <label className={labelClasses}>
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={formData.category_id}
                                                onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
                                            >
                                                <SelectTrigger className={selectTriggerClasses}>
                                                    <div className="flex items-center gap-2">
                                                        <Layers className="w-4 h-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Select Category" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className={labelClasses}>Instructor</label>
                                            <Select
                                                value={formData.instructor_id}
                                                onValueChange={(val) => setFormData(prev => ({ ...prev, instructor_id: val }))}
                                            >
                                                <SelectTrigger className={selectTriggerClasses}>
                                                    <div className="flex items-center gap-2">
                                                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Default (Me)" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="_default">Default (Me)</SelectItem>
                                                    {teachers.map(teacher => (
                                                        <SelectItem key={teacher.id} value={teacher.id}>
                                                            {teacher.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                Difficulty Level <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={formData.level}
                                                onValueChange={(val) => setFormData(prev => ({ ...prev, level: val as CourseLevel }))}
                                            >
                                                <SelectTrigger className={selectTriggerClasses}>
                                                    <div className="flex items-center gap-2">
                                                        <BarChart className="w-4 h-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Select Level" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="beginner">Beginner</SelectItem>
                                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className={labelClasses}>
                                                Language <span className="text-red-500">*</span>
                                            </label>
                                            <Select
                                                value={formData.language}
                                                onValueChange={(val) => setFormData(prev => ({ ...prev, language: val }))}
                                            >
                                                <SelectTrigger className={selectTriggerClasses}>
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Select Language" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="বাংলা">বাংলা</SelectItem>
                                                    <SelectItem value="English">English</SelectItem>
                                                    <SelectItem value="Hindi">Hindi</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Detailed Content */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl">
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <PencilLine className="w-5 h-5 text-primary" />
                                        Course Narratives
                                    </h2>

                                    <div className="space-y-6 mb-8">
                                        <div>
                                            <label className={labelClasses}>Short Description</label>
                                            <input
                                                type="text"
                                                value={formData.short_description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                                placeholder="A brief one-line hook for the course"
                                                maxLength={200}
                                                className={inputClasses}
                                            />
                                            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 pl-1">
                                                <AlertCircle className="w-3 h-3 text-primary/70" />
                                                Visible on course cards. Keep it catchy and concise.
                                            </p>
                                        </div>

                                        <div>
                                            <label className={labelClasses}>Full Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Detailed course description..."
                                                rows={5}
                                                className={cn(inputClasses, "resize-none leading-relaxed")}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Learning Objectives */}
                                        <div className="space-y-3">
                                            <label className={labelClasses}>
                                                <Target className="w-4 h-4 text-emerald-500" />
                                                What you will learn
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={objectiveInput}
                                                    onChange={(e) => setObjectiveInput(e.target.value)}
                                                    placeholder="Add a learning goal..."
                                                    className={cn(inputClasses, "py-2 px-3")}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('learning_objectives', objectiveInput, setObjectiveInput))}
                                                />
                                                <button type="button" onClick={() => addArrayItem('learning_objectives', objectiveInput, setObjectiveInput)} className="p-2 aspect-square flex items-center justify-center bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all font-bold">+</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.learning_objectives.map((obj, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-surface/50 border border-border/30 text-xs flex items-center gap-2 group hover:border-emerald-500/30 transition-colors">
                                                        {obj}
                                                        <X className="w-3 h-3 cursor-pointer text-muted-foreground group-hover:text-red-500 transition-colors" onClick={() => removeArrayItem('learning_objectives', i)} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Requirements */}
                                        <div className="space-y-3">
                                            <label className={labelClasses}>
                                                <ListChecks className="w-4 h-4 text-blue-500" />
                                                Requirements
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={requirementInput}
                                                    onChange={(e) => setRequirementInput(e.target.value)}
                                                    placeholder="e.g., Basic JavaScript knowledge"
                                                    className={cn(inputClasses, "py-2 px-3")}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('requirements', requirementInput, setRequirementInput))}
                                                />
                                                <button type="button" onClick={() => addArrayItem('requirements', requirementInput, setRequirementInput)} className="p-2 aspect-square flex items-center justify-center bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all font-bold">+</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.requirements.map((req, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-surface/50 border border-border/30 text-xs flex items-center gap-2 group hover:border-blue-500/30 transition-colors">
                                                        {req}
                                                        <X className="w-3 h-3 cursor-pointer text-muted-foreground group-hover:text-red-500 transition-colors" onClick={() => removeArrayItem('requirements', i)} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Target Audience */}
                                        <div className="space-y-3">
                                            <label className={labelClasses}>
                                                <Users className="w-4 h-4 text-purple-500" />
                                                Target Audience
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={targetInput}
                                                    onChange={(e) => setTargetInput(e.target.value)}
                                                    placeholder="e.g., Aspiring Web Developers"
                                                    className={cn(inputClasses, "py-2 px-3")}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('target_audience', targetInput, setTargetInput))}
                                                />
                                                <button type="button" onClick={() => addArrayItem('target_audience', targetInput, setTargetInput)} className="p-2 aspect-square flex items-center justify-center bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all font-bold">+</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.target_audience.map((item, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-surface/50 border border-border/30 text-xs flex items-center gap-2 group hover:border-purple-500/30 transition-colors">
                                                        {item}
                                                        <X className="w-3 h-3 cursor-pointer text-muted-foreground group-hover:text-red-500 transition-colors" onClick={() => removeArrayItem('target_audience', i)} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="space-y-3">
                                            <label className={labelClasses}>
                                                <Tags className="w-4 h-4 text-primary" />
                                                Search Tags
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    placeholder="coding, react, nextjs"
                                                    className={cn(inputClasses, "py-2 px-3")}
                                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', tagInput, setTagInput))}
                                                />
                                                <button type="button" onClick={() => addArrayItem('tags', tagInput, setTagInput)} className="p-2 aspect-square flex items-center justify-center bg-primary/10 text-primary rounded-xl border border-primary/20 hover:bg-primary/20 transition-all font-bold">+</button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tags.map((tag, i) => (
                                                    <span key={i} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs flex items-center gap-2 group hover:border-primary transition-colors">
                                                        #{tag}
                                                        <X className="w-3 h-3 cursor-pointer group-hover:scale-110" onClick={() => removeArrayItem('tags', i)} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Pricing & Media */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl h-fit">
                                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                            Pricing
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className={labelClasses}>
                                                    Standard Price (৳) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                                    min={0}
                                                    className={inputClasses}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Discount Price (৳)</label>
                                                <input
                                                    type="number"
                                                    value={formData.discount_price || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value ? parseInt(e.target.value) : null }))}
                                                    min={0}
                                                    placeholder="Promotion Price"
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl">
                                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <ImageIcon className="w-5 h-5 text-primary" />
                                            Thumbnail
                                        </h2>
                                        <AnimatePresence mode="wait">
                                            {formData.thumbnail_url || thumbnailPreview ? (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative group rounded-2xl overflow-hidden border border-input-dark-border aspect-video shadow-2xl">
                                                    <Image src={thumbnailPreview || formData.thumbnail_url} alt="Preview" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/20 transition-all transform hover:scale-110"><Upload className="w-5 h-5" /></button>
                                                        <button type="button" onClick={removeThumbnail} className="p-3 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-xl text-white border border-red-500/20 transition-all transform hover:scale-110"><X className="w-5 h-5" /></button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                    className={cn(
                                                        "border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
                                                        isDragging
                                                            ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                                                            : "border-input-dark-border bg-input-dark hover:bg-input-dark-hover hover:border-primary/40 group/dropzone"
                                                    )}
                                                >
                                                    <div className="p-4 rounded-full bg-primary/10 mb-4 transition-transform group-hover/dropzone:scale-110 duration-300">
                                                        <Upload className="w-8 h-8 text-primary shadow-primary/20 shadow-lg" />
                                                    </div>
                                                    <span className="text-sm font-semibold text-foreground/70 group-hover/dropzone:text-primary transition-colors">Upload thumbnail (1280x720)</span>
                                                    <p className="text-[10px] text-muted-foreground mt-2">Drag and drop or click to browse</p>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <Video className="w-5 h-5 text-primary" />
                                        Preview Media
                                    </h2>
                                    <label className={labelClasses}>Video Introduction URL</label>
                                    <input
                                        type="url"
                                        value={formData.preview_video_url}
                                        onChange={(e) => setFormData(prev => ({ ...prev, preview_video_url: e.target.value }))}
                                        placeholder="https://youtube.com/watch?v=..."
                                        className={inputClasses}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Setup & Extras */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* FAQs */}
                                <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl transition-all hover:border-primary/20">
                                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-primary" />
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-4 mb-6">
                                        <input
                                            type="text"
                                            value={faqInput.question}
                                            onChange={(e) => setFaqInput(prev => ({ ...prev, question: e.target.value }))}
                                            placeholder="Question"
                                            className={inputClasses}
                                        />
                                        <textarea
                                            value={faqInput.answer}
                                            onChange={(e) => setFaqInput(prev => ({ ...prev, answer: e.target.value }))}
                                            placeholder="Answer"
                                            rows={2}
                                            className={cn(inputClasses, "resize-none")}
                                        />
                                        <button type="button" onClick={addFaq} className="w-full py-3 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20 hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
                                            <Sparkles className="w-4 h-4 opacity-70" />
                                            Add FAQ Entry
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.faqs.map((faq, i) => (
                                            <div key={i} className="p-4 rounded-xl border border-input-dark-border bg-input-dark group relative transition-all hover:bg-input-dark-hover">
                                                <p className="font-bold text-sm mb-1 text-foreground/90">{faq.question}</p>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                                                <button onClick={() => removeFaq(i)} className="absolute top-2 right-2 p-1.5 rounded-lg text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"><X className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Projects */}
                                    {/* Projects */}
                                    <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl transition-all hover:border-primary/20">
                                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                            <FolderKanban className="w-5 h-5 text-primary" />
                                            Key Projects
                                        </h2>
                                        <div className="space-y-3 mb-6">
                                            <input
                                                type="text"
                                                value={projectInput.title}
                                                onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Project Title"
                                                className={cn(inputClasses, "py-2 px-3")}
                                            />
                                            <textarea
                                                value={projectInput.description}
                                                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Project Overview"
                                                rows={2}
                                                className={cn(inputClasses, "py-2 px-3 resize-none")}
                                            />
                                            <button type="button" onClick={addProject} className="w-full py-2.5 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20 hover:bg-primary/20 transition-all">Add Project</button>
                                        </div>
                                        <div className="space-y-3">
                                            {formData.projects.map((p, i) => (
                                                <div key={i} className="p-3.5 rounded-xl border border-input-dark-border bg-input-dark flex justify-between items-start group">
                                                    <div>
                                                        <p className="font-bold text-sm text-foreground/90">{p.title}</p>
                                                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>
                                                    </div>
                                                    <button onClick={() => removeProject(i)} className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"><X className="w-4 h-4" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resources */}
                                    <div className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl transition-all hover:border-primary/20">
                                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            Extra Resources
                                        </h2>
                                        <div className="space-y-3 mb-6">
                                            <input
                                                type="text"
                                                value={resourceInput.title}
                                                onChange={(e) => setResourceInput(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="Resource Title (e.g., UI Kit)"
                                                className={cn(inputClasses, "py-2 px-3")}
                                            />
                                            <div className="flex gap-2">
                                                <Select value={resourceInput.type} onValueChange={(val) => setResourceInput(prev => ({ ...prev, type: val }))}>
                                                    <SelectTrigger className={cn(selectTriggerClasses, "w-1/3 h-10")}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="link">Link</SelectItem>
                                                        <SelectItem value="pdf">PDF</SelectItem>
                                                        <SelectItem value="code">Code</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <input
                                                    type="text"
                                                    value={resourceInput.url}
                                                    onChange={(e) => setResourceInput(prev => ({ ...prev, url: e.target.value }))}
                                                    placeholder="URL or Source"
                                                    className={cn(inputClasses, "py-2 px-3 flex-1")}
                                                />
                                            </div>
                                            <button type="button" onClick={addResource} className="w-full py-2.5 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20 hover:bg-primary/20 transition-all">Add Resource</button>
                                        </div>
                                        <div className="space-y-2">
                                            {formData.resources.map((r, i) => (
                                                <div key={i} className="p-3.5 rounded-xl border border-input-dark-border bg-input-dark flex justify-between items-center group">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="p-1.5 rounded-lg bg-surface border border-border/30">
                                                            <Globe className="w-3.5 h-3.5 text-primary/70" />
                                                        </div>
                                                        <span className="font-bold text-xs text-foreground/90">{r.title} <span className="font-normal text-muted-foreground ml-1">({r.type})</span></span>
                                                    </div>
                                                    <button onClick={() => removeResource(i)} className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"><X className="w-4 h-4" /></button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Submit / Navigation */}
                <div className="flex justify-between items-center mt-12 bg-card/30 backdrop-blur-2xl border border-border/40 p-6 rounded-3xl shadow-xl shadow-black/5">
                    <div className="flex items-center gap-2">
                        {currentStep > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-3 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-surface/50 transition-all font-bold flex items-center gap-2 group"
                            >
                                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Previous Step
                            </button>
                        ) : (
                            <Link
                                href="/dashboard/courses"
                                className="px-6 py-3 rounded-xl border border-border/50 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all font-bold"
                            >
                                Cancel
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-10 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:bg-primary/90 shadow-[0_10px_20px_-10px_rgba(var(--primary-rgb),0.5)] transition-all active:scale-95 group"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={cn(
                                    "px-12 py-3.5 rounded-xl text-white font-extrabold flex items-center gap-2 transition-all active:scale-95",
                                    isSubmitting
                                        ? "bg-slate-700 opacity-70 cursor-not-allowed"
                                        : "bg-emerald-500 hover:bg-emerald-600 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.6)]"
                                )}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Launching...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        Publish Course
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
