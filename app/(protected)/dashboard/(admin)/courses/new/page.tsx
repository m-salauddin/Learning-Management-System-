"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft, BookOpen, DollarSign, Layers, BarChart, Globe, Clock,
    Image as ImageIcon, Video, ListChecks, Target, Tags, Save, Loader2,
    Upload, X, Check, Sparkles
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { createCourse, getCategories, getTeachers } from "@/lib/actions/courses";
import { Select, SelectOption } from "@/components/ui/Select";
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

export default function CreateCoursePage() {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
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
        tags: [] as string[],
    });

    // Temporary input states for array fields
    const [requirementInput, setRequirementInput] = useState("");
    const [objectiveInput, setObjectiveInput] = useState("");
    const [tagInput, setTagInput] = useState("");

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
        setFormData(prev => ({ ...prev, slug }));
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

        setIsSubmitting(true);

        try {
            const result = await createCourse({
                title: formData.title,
                slug: formData.slug,
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
                tags: formData.tags,
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

    const addArrayItem = (field: 'requirements' | 'learning_objectives' | 'tags', value: string, setter: (v: string) => void) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter("");
        }
    };

    const removeArrayItem = (field: 'requirements' | 'learning_objectives' | 'tags', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="min-h-screen p-6 md:p-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/courses"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Courses
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
                <p className="text-muted-foreground mt-2">Fill in the details to create a new course</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="space-y-8">
                    {/* Basic Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-primary" />
                            Basic Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Course Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Complete Web Development Bootcamp"
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">URL Slug</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="auto-generated-from-title"
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-muted-foreground"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Short Description</label>
                                <input
                                    type="text"
                                    value={formData.short_description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                    placeholder="A brief one-line description"
                                    maxLength={200}
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Full Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Detailed course description..."
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Pricing & Category */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            Pricing & Category
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Price (৳) *</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                    min={0}
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Discount Price (৳)</label>
                                <input
                                    type="number"
                                    value={formData.discount_price || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value ? parseInt(e.target.value) : null }))}
                                    min={0}
                                    placeholder="Optional"
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <Select
                                    value={formData.category_id}
                                    onChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}
                                    icon={<Layers className="w-4 h-4" />}
                                    className="w-full"
                                >
                                    <SelectOption value="">Select Category</SelectOption>
                                    {categories.map(cat => (
                                        <SelectOption key={cat.id} value={cat.id}>{cat.name}</SelectOption>
                                    ))}
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <GraduationCap className="w-4 h-4 inline-block mr-1.5 text-primary" />
                                    Assign Instructor
                                </label>
                                <Select
                                    value={formData.instructor_id}
                                    onChange={(val) => setFormData(prev => ({ ...prev, instructor_id: val }))}
                                    icon={<GraduationCap className="w-4 h-4" />}
                                    className="w-full"
                                >
                                    <SelectOption value="">Default (Me)</SelectOption>
                                    {teachers.map(teacher => (
                                        <SelectOption key={teacher.id} value={teacher.id}>
                                            {teacher.name} ({teacher.email})
                                        </SelectOption>
                                    ))}
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1.5">
                                    Leave empty to assign yourself as the instructor
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Level</label>
                                <Select
                                    value={formData.level}
                                    onChange={(val) => setFormData(prev => ({ ...prev, level: val as CourseLevel }))}
                                    icon={<BarChart className="w-4 h-4" />}
                                    className="w-full"
                                >
                                    <SelectOption value="beginner">Beginner</SelectOption>
                                    <SelectOption value="intermediate">Intermediate</SelectOption>
                                    <SelectOption value="advanced">Advanced</SelectOption>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Language</label>
                                <Select
                                    value={formData.language}
                                    onChange={(val) => setFormData(prev => ({ ...prev, language: val }))}
                                    icon={<Globe className="w-4 h-4" />}
                                    className="w-full"
                                >
                                    <SelectOption value="বাংলা">বাংলা</SelectOption>
                                    <SelectOption value="English">English</SelectOption>
                                    <SelectOption value="Hindi">Hindi</SelectOption>
                                </Select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Media */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Media
                        </h2>

                        <div className="space-y-6">
                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Course Thumbnail</label>

                                <AnimatePresence mode="wait">
                                    {formData.thumbnail_url || thumbnailPreview ? (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="relative group"
                                        >
                                            <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-border/50 shadow-lg">
                                                <Image
                                                    src={thumbnailPreview || formData.thumbnail_url}
                                                    alt="Course thumbnail preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                {isUploadingThumbnail && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                        <div className="flex flex-col items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full border-3 border-white/30 border-t-white animate-spin" />
                                                            <span className="text-white text-sm font-medium">Uploading...</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Overlay actions */}
                                            {!isUploadingThumbnail && (
                                                <div className="absolute inset-0 max-w-md bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                                                    >
                                                        <Upload className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={removeThumbnail}
                                                        className="p-3 rounded-xl bg-red-500/80 backdrop-blur-sm text-white hover:bg-red-500 transition-colors"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            )}

                                            {/* Success badge */}
                                            {formData.thumbnail_url && !isUploadingThumbnail && (
                                                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium backdrop-blur-sm">
                                                    <Check className="w-3.5 h-3.5" />
                                                    Uploaded
                                                </div>
                                            )}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="dropzone"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "relative aspect-video w-full max-w-md rounded-xl border-2 border-dashed transition-all cursor-pointer group",
                                                isDragging
                                                    ? "border-primary bg-primary/10 scale-[1.02]"
                                                    : "border-border/50 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                                            )}
                                        >
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                                <div className={cn(
                                                    "p-4 rounded-2xl transition-all",
                                                    isDragging
                                                        ? "bg-primary/20 text-primary scale-110"
                                                        : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                                )}>
                                                    {isUploadingThumbnail ? (
                                                        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                                                    ) : (
                                                        <Upload className="w-8 h-8" />
                                                    )}
                                                </div>
                                                <div className="text-center px-4">
                                                    <p className={cn(
                                                        "font-medium transition-colors",
                                                        isDragging ? "text-primary" : "text-foreground"
                                                    )}>
                                                        {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        JPEG, PNG, WebP or GIF • Max 5MB
                                                    </p>
                                                </div>

                                                {/* Recommended dimensions */}
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    Recommended: 1280 × 720px (16:9)
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Preview Video URL */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    <Video className="w-4 h-4 inline-block mr-2 text-muted-foreground" />
                                    Preview Video URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.preview_video_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, preview_video_url: e.target.value }))}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                />
                                <p className="text-xs text-muted-foreground mt-1.5">Optional: Add a YouTube or Vimeo video link for course preview</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <ListChecks className="w-5 h-5 text-primary" />
                            Requirements
                        </h2>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={requirementInput}
                                    onChange={(e) => setRequirementInput(e.target.value)}
                                    placeholder="Add a requirement..."
                                    className="flex-1 px-4 py-2 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addArrayItem('requirements', requirementInput, setRequirementInput);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('requirements', requirementInput, setRequirementInput)}
                                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.requirements.map((req, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                                        {req}
                                        <button type="button" onClick={() => removeArrayItem('requirements', i)} className="text-muted-foreground hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Learning Objectives */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Learning Objectives
                        </h2>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={objectiveInput}
                                    onChange={(e) => setObjectiveInput(e.target.value)}
                                    placeholder="What will students learn?"
                                    className="flex-1 px-4 py-2 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addArrayItem('learning_objectives', objectiveInput, setObjectiveInput);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('learning_objectives', objectiveInput, setObjectiveInput)}
                                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.learning_objectives.map((obj, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                                        {obj}
                                        <button type="button" onClick={() => removeArrayItem('learning_objectives', i)} className="text-muted-foreground hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Tags */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                    >
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Tags className="w-5 h-5 text-primary" />
                            Tags
                        </h2>

                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add tags..."
                                    className="flex-1 px-4 py-2 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addArrayItem('tags', tagInput, setTagInput);
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('tags', tagInput, setTagInput)}
                                    className="px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, i) => (
                                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm">
                                        #{tag}
                                        <button type="button" onClick={() => removeArrayItem('tags', i)} className="hover:text-red-500">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex justify-end gap-4"
                    >
                        <Link
                            href="/dashboard/courses"
                            className="px-6 py-3 rounded-xl border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 transition-all",
                                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90 shadow-lg shadow-primary/20"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Create Course
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>
            </form>
        </div>
    );
}
