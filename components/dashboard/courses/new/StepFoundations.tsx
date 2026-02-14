"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import {
    BookOpen, Layers, Users, BarChart, Globe, Info, PencilLine, FileText,
    Smartphone, Palette, TrendingUp, Briefcase, Database, Code, Shield, Cloud,
    GraduationCap, UserRound, Hash, AlertCircle,
    SignalLow, SignalMedium, SignalHigh, BookOpenText, Target,
    Video, Radio, MonitorPlay
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { inputClasses, labelClasses, selectTriggerClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";
import { getNextBatchNumber } from "@/lib/actions/courses";

interface StepFoundationsProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    categories: any[];
    teachers: any[];
    errors: Record<string, string>;
}

const iconMap: Record<string, any> = {
    'Globe': Globe,
    'Smartphone': Smartphone,
    'Palette': Palette,
    'TrendingUp': TrendingUp,
    'Briefcase': Briefcase,
    'Database': Database,
    'BarChart': BarChart,
    'Code': Code,
    'Layers': Layers,
    'book': BookOpen,
    'code': Code,
    'palette': Palette,
    'Shield': Shield,
    'Cloud': Cloud
};

export const StepFoundations = ({ formData, setFormData, categories, teachers, errors }: StepFoundationsProps) => {
    useEffect(() => {
        if (!formData.title.trim()) return;

        const timer = setTimeout(async () => {
            const result = await getNextBatchNumber(formData.title);
            if (result.success && result.data !== undefined) {
                setFormData(prev => ({ ...prev, batch_no: result.data }));
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [formData.title, setFormData]);

    return (
        <motion.div
            key="step1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
        >
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group overflow-hidden p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
                            Phase 01
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            The <span className="text-blue-500">Foundations</span>
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm max-w-lg font-medium leading-relaxed">
                            Establish the core architecture of your course. Excellence in foundations determines the success of its structure.
                        </p>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-blue-500/20 to-blue-500/5 border border-white/10 flex items-center justify-center text-blue-500 shadow-2xl backdrop-blur-md">
                        <Info className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                </div>
            </motion.div>
            <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course Title */}
                    <div className="md:col-span-2 space-y-2">
                        <label className={labelClasses}>
                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                            Course Title
                        </label>
                        <div className="space-y-1">
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Master Next.js 14 and Framer Motion"
                                className={cn(inputClasses, errors.title && "border-red-500/50 focus:border-red-500")}
                                required
                            />
                            {errors.title && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.title}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className={labelClasses}>
                            <PencilLine className="w-4 h-4 text-muted-foreground" />
                            Short Description
                        </label>
                        <div className="space-y-1">
                            <input
                                type="text"
                                value={formData.short_description}
                                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                placeholder="A punchy one-liner that summarizes the value"
                                className={cn(inputClasses, errors.short_description && "border-red-500/50 focus:border-red-500")}
                                required
                            />
                            {errors.short_description && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.short_description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Long Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className={labelClasses}>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Long Description
                        </label>
                        <div className="space-y-1">
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Dive deep into what makes this course special..."
                                className={cn(inputClasses, "resize-none h-32 py-3", errors.description && "border-red-500/50 focus:border-red-500")}
                            />
                            {errors.description && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            Category
                        </label>
                        <div className="space-y-1">
                            <Select value={formData.category_id} onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}>
                                <SelectTrigger className={cn(selectTriggerClasses, errors.category_id && "border-red-500/50 focus:border-red-500")}>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10">
                                    {categories.map(cat => {
                                        const Icon = iconMap[cat.icon] || Layers;
                                        return (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                                    <span>{cat.name}</span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.category_id}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Batch Number */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Hash className="w-4 h-4 text-muted-foreground" />
                            Batch Number
                        </label>
                        <div className="space-y-1">
                            <input
                                type="number"
                                value={formData.batch_no || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, batch_no: parseInt(e.target.value) || undefined }))}
                                placeholder="e.g. 1, 2, 3"
                                className={cn(inputClasses, errors.batch_no && "border-red-500/50 focus:border-red-500")}
                            />
                            {errors.batch_no && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.batch_no}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Instructor */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Assigned Instructor
                        </label>
                        <div className="space-y-1">
                            <Select value={formData.instructor_id} onValueChange={(val) => setFormData(prev => ({ ...prev, instructor_id: val }))}>
                                <SelectTrigger className={cn(selectTriggerClasses, errors.instructor_id && "border-red-500/50 focus:border-red-500")}>
                                    <SelectValue placeholder="Choose instructor" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10">
                                    {teachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                                <span>{teacher.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.instructor_id && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.instructor_id}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Course Level */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <BarChart className="w-4 h-4 text-muted-foreground" />
                            Difficulty Level
                        </label>
                        <div className="space-y-1">
                            <Select value={formData.level} onValueChange={(val) => setFormData(prev => ({ ...prev, level: val as any }))}>
                                <SelectTrigger className={cn(selectTriggerClasses, errors.level && "border-red-500/50 focus:border-red-500")}>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10">
                                    <SelectItem value="beginner">
                                        <div className="flex items-center gap-2">
                                            <BookOpenText className="w-4 h-4 text-muted-foreground" />
                                            <span>Beginner</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="intermediate">
                                        <div className="flex items-center gap-2">
                                            <Code className="w-4 h-4 text-muted-foreground" />
                                            <span>Intermediate</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="advanced">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-muted-foreground" />
                                            <span>Advanced</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.level && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.level}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Course Type */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Info className="w-4 h-4 text-muted-foreground" />
                            Course Type
                        </label>
                        <div className="space-y-1">
                            <Select value={formData.course_type} onValueChange={(val) => setFormData(prev => ({ ...prev, course_type: val as any }))}>
                                <SelectTrigger className={cn(selectTriggerClasses, errors.course_type && "border-red-500/50 focus:border-red-500")}>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10">
                                    <SelectItem value="recorded">
                                        <div className="flex items-center gap-2">
                                            <Video className="w-4 h-4 text-muted-foreground" />
                                            <span>Recorded</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="live">
                                        <div className="flex items-center gap-2">
                                            <Radio className="w-4 h-4 text-muted-foreground" />
                                            <span>Live</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="hybrid">
                                        <div className="flex items-center gap-2">
                                            <MonitorPlay className="w-4 h-4 text-muted-foreground" />
                                            <span>Live + Recorded</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.course_type && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.course_type}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            Course Language
                        </label>
                        <div className="space-y-1">
                            <Select value={formData.language} onValueChange={(val) => setFormData(prev => ({ ...prev, language: val }))}>
                                <SelectTrigger className={selectTriggerClasses}>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-950 border-white/10 max-h-[300px]">
                                    <SelectItem value="English">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>English</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Bengali">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Bengali</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Hindi">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Hindi</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Arabic">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Arabic</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Spanish">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>Spanish</span>
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="French">
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                                            <span>French</span>
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.language && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.language}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
