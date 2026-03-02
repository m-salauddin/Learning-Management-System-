"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    BookOpen, Layers, Users, BarChart, Globe, Info, PencilLine, FileText,
    Smartphone, Palette, TrendingUp, Briefcase, Database, Code, Shield, Cloud,
    GraduationCap, UserRound, Hash, AlertCircle,
    SignalLow, SignalMedium, SignalHigh, BookOpenText, Target,
    Video, Radio, MonitorPlay, X, Search, Clock
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

interface InstructorSelectProps {
    label: string;
    icon: any;
    placeholder: string;
    searchPlaceholder: string;
    selectedIds: string[];
    opponentIds: string[];
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    onClearAll: () => void;
    teachers: any[];
    error?: string;
    type: 'main' | 'support';
}

const InstructorSelect = ({
    label,
    icon: Icon,
    placeholder,
    searchPlaceholder,
    selectedIds,
    opponentIds,
    onSelect,
    onRemove,
    onClearAll,
    teachers,
    error,
    type
}: InstructorSelectProps) => {
    const [search, setSearch] = useState("");
    const isMain = type === 'main';
    const RoleIcon = isMain ? GraduationCap : UserRound;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className={labelClasses}>
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    {label}
                </label>
                {selectedIds && selectedIds.length > 0 && (
                    <button
                        type="button"
                        onClick={onClearAll}
                        className="text-[10px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-500/10 hover:border-red-500/20"
                    >
                        <X className="w-3 h-3" />
                        Clear All
                    </button>
                )}
            </div>
            <div className="space-y-3">
                <Select
                    value=""
                    onValueChange={(val) => {
                        if (val) {
                            onSelect(val);
                            setSearch("");
                        }
                    }}
                >
                    <SelectTrigger className={cn(selectTriggerClasses, error && "border-red-500/50 focus:border-red-500")}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-950/98 backdrop-blur-2xl border-white/10 p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="sticky top-0 z-10 p-3 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
                            <div className="relative group">
                                <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 transition-colors",
                                    isMain ? "group-focus-within:text-blue-500" : "group-focus-within:text-amber-500")} />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className={cn("w-full bg-white/3 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[12px] focus:outline-hidden focus:bg-white/5 focus:ring-4 transition-all placeholder:text-white/20",
                                        isMain ? "focus:border-blue-500/50 focus:ring-blue-500/10" : "focus:border-amber-500/50 focus:ring-amber-500/10")}
                                />
                            </div>
                        </div>
                        <div className="p-1.5 max-h-[320px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
                            {teachers
                                .filter(t => !selectedIds.includes(t.id) && !opponentIds.includes(t.id))
                                .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
                                .map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.id} className={cn("rounded-xl px-2 py-2.5 focus:text-white group/item cursor-pointer",
                                        isMain ? "focus:bg-blue-500/10 focus:text-blue-400" : "focus:bg-amber-500/10 focus:text-amber-400")}>
                                        <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                                                    isMain ? "bg-blue-500/5 border-blue-500/10 group-focus:border-blue-500/30" : "bg-amber-500/5 border-amber-500/10 group-focus:border-amber-500/30")}>
                                                    <RoleIcon className={cn("w-4 h-4 transition-colors",
                                                        isMain ? "text-blue-500/60 group-focus:text-blue-400" : "text-amber-500/60 group-focus:text-amber-400")} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-semibold tracking-tight">{teacher.name}</span>
                                                    <span className="text-[10px] text-white/30 font-medium">{isMain ? "Professional Instructor" : "Support Faculty"}</span>
                                                </div>
                                            </div>
                                            {typeof teacher.course_count === 'number' && (
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 transition-all",
                                                        isMain ? "group-focus:bg-blue-500/20 group-focus:text-blue-400 group-focus:border-blue-500/30" : "group-focus:bg-amber-500/20 group-focus:text-amber-400 group-focus:border-amber-500/30")}>
                                                        {teacher.course_count} {teacher.course_count === 1 ? 'Course' : 'Courses'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            {teachers.filter(t => !selectedIds.includes(t.id) && !opponentIds.includes(t.id)).filter(t => t.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                                <div className="py-12 px-4 flex flex-col items-center justify-center gap-2 opacity-50">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                        <Search className="w-5 h-5 text-white/20" />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground italic font-medium">No results found for "{search}"</p>
                                </div>
                            )}
                        </div>
                    </SelectContent>
                </Select>

                {/* Selected Badges */}
                <div className="flex flex-wrap gap-2">
                    {selectedIds.map(id => {
                        const teacher = teachers.find(t => t.id === id);
                        return (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={id}
                                className={cn("inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all",
                                    isMain ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400")}
                            >
                                <RoleIcon className="w-3 h-3" />
                                {teacher?.name}
                                <button
                                    type="button"
                                    onClick={() => onRemove(id)}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {error && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
};

export const StepFoundations = ({ formData, setFormData, categories, teachers, errors }: StepFoundationsProps) => {
    const [categorySearch, setCategorySearch] = useState("");

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
                                <SelectContent className="bg-slate-950/98 backdrop-blur-2xl border-white/10 p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                    <div className="sticky top-0 z-10 p-3 bg-slate-950/90 backdrop-blur-md border-b border-white/5">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within:text-indigo-500 transition-colors" />
                                            <input
                                                type="text"
                                                placeholder="Search categories..."
                                                value={categorySearch}
                                                onChange={(e) => setCategorySearch(e.target.value)}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                className="w-full bg-white/3 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-[12px] focus:outline-hidden focus:border-indigo-500/50 focus:bg-white/5 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/20"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-1.5 max-h-[280px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.1)_transparent]">
                                        {categories
                                            .filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
                                            .map(cat => {
                                                const Icon = iconMap[cat.icon] || Layers;
                                                return (
                                                    <SelectItem key={cat.id} value={cat.id} className="rounded-xl px-2 py-2.5 focus:bg-indigo-500/10 focus:text-indigo-400 group/item cursor-pointer">
                                                        <div className="flex items-center gap-3 w-full">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/5 flex items-center justify-center border border-indigo-500/10 group-focus:border-indigo-500/30 transition-all">
                                                                <Icon className="w-4 h-4 text-indigo-500/60 group-focus:text-indigo-400" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[13px] font-semibold tracking-tight">{cat.name}</span>
                                                                <span className="text-[10px] text-white/30 font-medium">Domain Category</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        {categories.filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                                            <div className="py-12 px-4 flex flex-col items-center justify-center gap-2 opacity-50">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                                                    <Search className="w-5 h-5 text-white/20" />
                                                </div>
                                                <p className="text-[11px] text-muted-foreground italic font-medium">No categories found for "{categorySearch}"</p>
                                            </div>
                                        )}
                                    </div>
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

                    {/* Enrollment Ends In */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            Enrollment Ends In
                        </label>
                        <div className="space-y-1">
                            <input
                                type="datetime-local"
                                value={formData.discount_expires_at || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, discount_expires_at: e.target.value || undefined }))}
                                className={cn(inputClasses, errors.discount_expires_at && "border-red-500/50 focus:border-red-500")}
                            />
                            {errors.discount_expires_at && (
                                <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.discount_expires_at}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Main Instructors */}
                    <InstructorSelect
                        label="Main Instructors"
                        icon={Users}
                        placeholder="Add main instructor"
                        searchPlaceholder="Search main teachers..."
                        type="main"
                        teachers={teachers}
                        selectedIds={formData.instructor_ids || []}
                        opponentIds={formData.support_instructor_ids || []}
                        error={errors.instructor_ids}
                        onSelect={(id) => setFormData(prev => ({ ...prev, instructor_ids: [...(prev.instructor_ids || []), id] }))}
                        onRemove={(id) => setFormData(prev => ({ ...prev, instructor_ids: prev.instructor_ids?.filter(tid => tid !== id) }))}
                        onClearAll={() => setFormData(prev => ({ ...prev, instructor_ids: [] }))}
                    />

                    {/* Support Instructors */}
                    <InstructorSelect
                        label="Support Instructors"
                        icon={UserRound}
                        placeholder="Add support instructor"
                        searchPlaceholder="Search support teachers..."
                        type="support"
                        teachers={teachers}
                        selectedIds={formData.support_instructor_ids || []}
                        opponentIds={formData.instructor_ids || []}
                        onSelect={(id) => setFormData(prev => ({ ...prev, support_instructor_ids: [...(prev.support_instructor_ids || []), id] }))}
                        onRemove={(id) => setFormData(prev => ({ ...prev, support_instructor_ids: prev.support_instructor_ids?.filter(tid => tid !== id) }))}
                        onClearAll={() => setFormData(prev => ({ ...prev, support_instructor_ids: [] }))}
                    />

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
