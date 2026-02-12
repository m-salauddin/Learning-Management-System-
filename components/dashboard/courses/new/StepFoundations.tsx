"use client";

import { motion } from "motion/react";
import {
    BookOpen, Layers, Users, BarChart, Globe, Info, PencilLine, FileText,
    Smartphone, Palette, TrendingUp, Briefcase, Database, Code, Shield, Cloud
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

interface StepFoundationsProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    categories: any[];
    teachers: any[];
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

export const StepFoundations = ({ formData, setFormData, categories, teachers }: StepFoundationsProps) => {
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
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Master Next.js 14 and Framer Motion"
                            className={inputClasses}
                            required
                        />
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className={labelClasses}>
                            <PencilLine className="w-4 h-4 text-muted-foreground" />
                            Short Description
                        </label>
                        <input
                            type="text"
                            value={formData.short_description}
                            onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                            placeholder="A punchy one-liner that summarizes the value"
                            className={inputClasses}
                            required
                        />
                    </div>

                    {/* Long Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className={labelClasses}>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Long Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Dive deep into what makes this course special..."
                            className={cn(inputClasses, "resize-none h-32 py-3")}
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            Category
                        </label>
                        <Select value={formData.category_id} onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}>
                            <SelectTrigger className={selectTriggerClasses}>
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
                    </div>

                    {/* Instructor */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Assigned Instructor
                        </label>
                        <Select value={formData.instructor_id} onValueChange={(val) => setFormData(prev => ({ ...prev, instructor_id: val }))}>
                            <SelectTrigger className={selectTriggerClasses}>
                                <SelectValue placeholder="Choose instructor" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-950 border-white/10">
                                {teachers.map(teacher => <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Course Level */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <BarChart className="w-4 h-4 text-muted-foreground" />
                            Difficulty Level
                        </label>
                        <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/50">
                            {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, level: lvl as any }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all",
                                        formData.level === lvl
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <label className={labelClasses}>
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            Course Language
                        </label>
                        <div className="flex gap-2 p-1 bg-muted/30 rounded-xl border border-border/50">
                            {['English', 'Bengali'].map((lang) => (
                                <button
                                    key={lang}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, language: lang }))}
                                    className={cn(
                                        "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                                        formData.language === lang
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
