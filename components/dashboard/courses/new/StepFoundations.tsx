"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
    BookOpen, Layers, Users, BarChart, Globe, Info, PencilLine,
    Smartphone, Palette, TrendingUp, Briefcase, Database, Code, Shield, Cloud,
    GraduationCap, UserRound, Hash, AlertCircle,
    SignalLow, SignalMedium, SignalHigh, BookOpenText, Target,
    Video, Radio, MonitorPlay, X, Search, Clock,
    Calendar, Trophy, UserCheck, UserPlus, Shapes, Play, LayoutGrid, Box
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
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { BlockEditor } from "@/components/ui/BlockEditor";
import { StepHeader } from "./StepHeader";
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
    searchPlaceholder = "Search...",
    selectedIds = [],
    opponentIds = [],
    onSelect,
    onRemove,
    onClearAll,
    teachers = [],
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
            <div className="space-y-1 mt-1.5">
                <Select
                    value=""
                    onValueChange={(val) => {
                        if (val) {
                            onSelect(val);
                            setSearch("");
                        }
                    }}
                >
                    <SelectTrigger className={cn(selectTriggerClasses, "h-[46px] text-slate-900 dark:text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20", error && "border-red-500/50 focus:border-red-500")}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-0 overflow-hidden shadow-2xl">
                        <div className="sticky top-0 z-10 p-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
                            <div className="relative group">
                                <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-white/30 transition-colors focus-within:text-blue-500")} />
                                <input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className={cn(inputClasses, "py-2 pl-9 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20")}
                                />
                            </div>
                        </div>
                        <div className="p-1.5 max-h-[320px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
                            {teachers
                                .filter(t => !selectedIds.includes(t.id) && !opponentIds.includes(t.id))
                                .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
                                .map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.id} className={cn("rounded-xl px-2 py-2.5 group/item cursor-pointer focus:bg-blue-500/10 focus:text-blue-400")}>
                                        <div className="flex items-center justify-between gap-4 w-full min-w-[240px]">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border transition-all bg-blue-500/5 border-blue-500/10 group-focus:border-blue-500/30")}>
                                                    <RoleIcon className={cn("w-4 h-4 transition-colors text-blue-500/60 group-focus:text-blue-400")} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">{teacher.name}</span>
                                                    <span className="text-[10px] text-slate-500 dark:text-white/30 font-medium">{isMain ? "Professional Instructor" : "Support Faculty"}</span>
                                                </div>
                                            </div>
                                            {typeof teacher.course_count === 'number' && (
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 transition-all group-focus:bg-blue-500/20 group-focus:text-blue-400 group-focus:border-blue-500/30")}>
                                                        {teacher.course_count} {teacher.course_count === 1 ? 'Course' : 'Courses'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                             {teachers.filter(t => !selectedIds.includes(t.id) && !opponentIds.includes(t.id)).filter(t => t.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                                <div className="py-12 px-4 flex flex-col items-center justify-center gap-2 opacity-50">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-dashed border-slate-200 dark:border-white/20">
                                        <Search className="w-5 h-5 text-slate-400 dark:text-white/20" />
                                    </div>
                                    <p className="text-[11px] text-muted-foreground italic font-medium">No results found for "{search}"</p>
                                </div>
                            )}
                        </div>
                    </SelectContent>
                </Select>
                {selectedIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {selectedIds.map(id => {
                            const teacher = teachers.find(t => t.id === id);
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={id}
                                    className={cn("inline-flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all bg-blue-500/10 border-blue-500/20 text-blue-400")}
                                >
                                    <RoleIcon className="w-3 h-3" />
                                    {teacher?.name}
                                    <button
                                        type="button"
                                        onClick={() => onRemove(id)}
                                        className="hover:text-slate-900 dark:hover:text-white transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
                {error && (
                    <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1 whitespace-nowrap pt-0.5">
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
            {}
            <StepHeader
                phase="01"
                title="Foundations"
                highlight="Foundations"
                description="Establish the core identity and essential details."
                icon={Info}
                color="blue"
            />
            {}
            <div className="space-y-6">
                {}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
                            <BookOpen className="w-4.5 h-4.5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-400">Course Identity</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Set the essential name and core narrative of the course.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {}
                            <div className="md:col-span-2 space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left")}>
                                    <BookOpen className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Course Title
                                </label>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="e.g. Master Next.js 14 and Framer Motion"
                                        className={cn(inputClasses, "h-[46px] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20", errors.title && "border-red-500/50 focus:border-red-500")}
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.title}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {}
                            <div className="md:col-span-2 space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left")}>
                                    <PencilLine className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Short Description
                                </label>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        value={formData.short_description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                                        placeholder="A punchy one-liner that summarizes the value"
                                        className={cn(inputClasses, "h-[46px] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20", errors.short_description && "border-red-500/50 focus:border-red-500")}
                                        required
                                    />
                                    {errors.short_description && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.short_description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {}
                            <div className="md:col-span-2 space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left")}>
                                    <Layers className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Block Diagram
                                </label>
                                <div className="space-y-1">
                                    <BlockEditor
                                        value={formData.description || ''}
                                        onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
                                        placeholder="Establish the visual and textual architecture of your course here..."
                                        error={errors.description}
                                        color="blue"
                                        className="focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20"
                                    />
                                    {errors.description && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
                            <Target className="w-4.5 h-4.5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-400">Categorization & Scheduling</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Define where this course sits and its operational timeline.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {}
                            <div className="space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Layers className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Category
                                </label>
                                <div className="">
                                    <Select value={formData.category_id} onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}>
                                        <SelectTrigger className={cn(selectTriggerClasses, "h-[46px] text-slate-900 dark:text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20", errors.category_id && "border-red-500/50 focus:border-red-500")}>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-1 overflow-hidden shadow-2xl">
                                            <div className="sticky top-0 z-10 p-2 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                                                <div className="relative group/search">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within/search:text-blue-500 transition-colors" />
                                                    <input
                                                        placeholder="Search categories..."
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        onKeyDown={(e) => e.stopPropagation()}
                                                        className={cn(inputClasses, "py-2 pl-9 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-xs")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-1 max-h-[280px] overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent">
                                                {categories
                                                    .filter(cat => cat.name.toLowerCase().includes(categorySearch.toLowerCase()))
                                                    .map(cat => {
                                                        const Icon = iconMap[cat.icon] || Layers;
                                                        return (
                                                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl px-2 py-2.5 group/item cursor-pointer focus:bg-blue-500/10 focus:text-blue-400">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all bg-blue-500/5 border-blue-500/10 group-focus:border-blue-500/30">
                                                                        <Icon className="w-4 h-4 text-blue-500/60 group-focus:text-blue-400" />
                                                                    </div>
                                                                    <div className="flex flex-col text-left">
                                                                        <span className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">{cat.name}</span>
                                                                        <span className="text-[10px] text-slate-500 dark:text-white/30 font-medium">Topic Specific Content</span>
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
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Hash className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Batch Number
                                </label>
                                 <div className="">
                                    <input
                                        type="number"
                                        value={formData.batch_no || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, batch_no: parseInt(e.target.value) || undefined }))}
                                        placeholder="e.g. 1, 2, 3"
                                        className={cn(inputClasses, "h-[46px] focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20", errors.batch_no && "border-red-500/50 focus:border-red-500")}
                                    />
                                    {errors.batch_no && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.batch_no}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Calendar className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Enrollment Deadline
                                </label>
                                <div className="">
                                    <DateTimePicker
                                        date={formData.discount_expires_at ? new Date(formData.discount_expires_at) : undefined}
                                        setDate={(date: Date | undefined) => setFormData(prev => ({ ...prev, discount_expires_at: date ? date.toISOString() : undefined }))}
                                        placeholder="mm/dd/yyyy --:-- --"
                                        className={cn("rounded-xl h-[46px] transition-all focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20", errors.discount_expires_at && "border-red-500/50 focus:border-red-500")}
                                    />
                                    {errors.discount_expires_at && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.discount_expires_at}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {}
                            <div className="space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Trophy className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Difficulty Level
                                </label>
                                <div className="">
                                    <Select value={formData.level} onValueChange={(val) => setFormData(prev => ({ ...prev, level: val as any }))}>
                                        <SelectTrigger className={cn(selectTriggerClasses, "h-[46px] text-slate-900 dark:text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20", errors.level && "border-red-500/50 focus:border-red-500")}>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-1 overflow-hidden shadow-2xl">
                                            <div className="p-1 flex flex-col gap-1">
                                                {[
                                                    { value: 'beginner', label: 'Beginner', desc: 'Foundational concepts' },
                                                    { value: 'intermediate', label: 'Intermediate', desc: 'Practical application' },
                                                    { value: 'advanced', label: 'Advanced', desc: 'Expert level mastery' }
                                                ].map((lvl) => (
                                                    <SelectItem key={lvl.value} value={lvl.value} className="rounded-xl px-2 py-2.5 group/item cursor-pointer focus:bg-blue-500/10 focus:text-blue-400">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all bg-blue-500/5 border-blue-500/10 group-focus:border-blue-500/30">
                                                                <Trophy className="w-4 h-4 text-blue-500/60 group-focus:text-blue-400" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">{lvl.label}</span>
                                                                <span className="text-[10px] text-slate-500 dark:text-white/30 font-medium">{lvl.desc}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                    {errors.level && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.level}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
                            <Users className="w-4.5 h-4.5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-400">Instruction Team</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Assign the subject matter expert and support faculty.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <InstructorSelect
                                    label="Main Instructor"
                                    icon={UserCheck}
                                    placeholder="Select primary expert"
                                    searchPlaceholder="Search main teachers..."
                                    teachers={teachers}
                                    selectedIds={formData.instructor_ids || []}
                                    opponentIds={formData.support_instructor_ids || []}
                                    onSelect={(id) => setFormData(prev => ({ ...prev, instructor_ids: [id] }))}
                                    onRemove={() => setFormData(prev => ({ ...prev, instructor_ids: [] }))}
                                    onClearAll={() => setFormData(prev => ({ ...prev, instructor_ids: [] }))}
                                    type="main"
                                    error={errors.instructor_ids}
                                />
                            </div>
                            <div className="space-y-2">
                                <InstructorSelect
                                    label="Support Instructor"
                                    icon={UserPlus}
                                    placeholder="Select co-instructor"
                                    searchPlaceholder="Search support teachers..."
                                    teachers={teachers}
                                    selectedIds={formData.support_instructor_ids || []}
                                    opponentIds={formData.instructor_ids?.[0] ? [formData.instructor_ids[0]] : []}
                                    onSelect={(id) => setFormData(prev => ({ ...prev, support_instructor_ids: [id] }))}
                                    onRemove={(id) => setFormData(prev => ({ ...prev, support_instructor_ids: prev.support_instructor_ids?.filter(sid => sid !== id) }))}
                                    onClearAll={() => setFormData(prev => ({ ...prev, support_instructor_ids: [] }))}
                                    type="support"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]">
                            <MonitorPlay className="w-4.5 h-4.5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-blue-400">Technical Settings</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Configure delivery mode and linguistic accessibility.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {}
                            <div className="space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Shapes className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Course Type
                                </label>
                                <div className="">
                                    <Select value={formData.course_type} onValueChange={(val) => setFormData(prev => ({ ...prev, course_type: val as any }))}>
                                        <SelectTrigger className={cn(selectTriggerClasses, "h-[46px] text-slate-900 dark:text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20", errors.course_type && "border-red-500/50 focus:border-red-500")}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-1 overflow-hidden shadow-2xl">
                                            <div className="p-1 flex flex-col gap-1">
                                                {[
                                                    { value: 'live', label: 'Live Course', icon: Play, desc: 'Real-time interaction' },
                                                    { value: 'recorded', label: 'Video Course', icon: MonitorPlay, desc: 'Self-paced learning' },
                                                    { value: 'hybrid', label: 'Live + Recorded', icon: Shapes, desc: 'Best of both worlds' }
                                                ].map((type) => (
                                                    <SelectItem key={type.value} value={type.value} className="rounded-xl px-2 py-2.5 group/item cursor-pointer focus:bg-blue-500/10 focus:text-blue-400">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all bg-blue-500/5 border-blue-500/10 group-focus:border-blue-500/30">
                                                                <type.icon className="w-4 h-4 text-blue-500/60 group-focus:text-blue-400" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">{type.label}</span>
                                                                <span className="text-[10px] text-slate-500 dark:text-white/30 font-medium">{type.desc}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                    {errors.course_type && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.course_type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {}
                            <div className="space-y-2">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Globe className="w-4 h-4 text-muted-foreground group-focus-within/section:text-blue-400 transition-colors" />
                                    Language
                                </label>
                                <div className="">
                                    <Select value={formData.language} onValueChange={(val) => setFormData(prev => ({ ...prev, language: val }))}>
                                        <SelectTrigger className={cn(selectTriggerClasses, "h-[46px] text-slate-900 dark:text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 data-[state=open]:border-blue-500/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20", errors.language && "border-red-500/50 focus:border-red-500")}>
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-1 overflow-hidden shadow-2xl">
                                            <div className="p-1 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                                                {[
                                                    { value: 'Bengali', desc: 'বাংলা ভাষায় পাঠদান' },
                                                    { value: 'English', desc: 'Instruction in English' },
                                                    { value: 'Hindi', desc: 'हिंदी में निर्देश' },
                                                    { value: 'Arabic', desc: 'التعليم باللغة العربية' },
                                                    { value: 'Urdu', desc: 'اردو میں ہدایات' }
                                                ].map((item) => (
                                                    <SelectItem key={item.value} value={item.value} className="rounded-xl px-2 py-2.5 group/item cursor-pointer focus:bg-blue-500/10 focus:text-blue-400">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all bg-blue-500/5 border-blue-500/10 group-focus:border-blue-500/30">
                                                                <Globe className="w-4 h-4 text-blue-500/60 group-focus:text-blue-400" />
                                                            </div>
                                                            <div className="flex flex-col text-left">
                                                                <span className="text-[13px] font-semibold tracking-tight text-slate-900 dark:text-white">{item.value}</span>
                                                                <span className="text-[10px] text-slate-500 dark:text-white/30 font-medium">{item.desc}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        </SelectContent>
                                    </Select>
                                    {errors.language && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1 px-2 whitespace-nowrap">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.language}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </motion.div>
    );
};
