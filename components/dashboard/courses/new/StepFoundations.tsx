"use client";

import { motion } from "motion/react";
import { BookOpen, Layers, Users, BarChart, Globe, Info } from "lucide-react";
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
                className="relative group overflow-hidden p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(59,130,246,1)]" />
                            Phase 01
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            The <span className="text-primary">Foundations</span>
                        </h2>
                        <p className="text-white/40 text-sm md:text-base max-w-lg font-medium leading-relaxed">
                            Establish the core identity and categorization of your course to help students find their perfect match.
                        </p>
                    </div>
                    <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-primary/20 to-primary/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl backdrop-blur-md">
                        <Info className="w-10 h-10" />
                    </div>
                </div>
            </motion.div>

            {/* Main Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/40 backdrop-blur-3xl shadow-xl space-y-6 group">
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <BookOpen className="w-4 h-4 text-primary" /> Global Course Title
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="What should the world call your expertise?"
                            className={inputClasses}
                            required
                        />
                    </div>
                </div>

                <div className="md:col-span-6 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-3xl shadow-lg space-y-4">
                    <label className={labelClasses}>
                        <Layers className="w-4 h-4 text-primary" /> Specialized Field
                    </label>
                    <Select value={formData.category_id} onValueChange={(val) => setFormData(prev => ({ ...prev, category_id: val }))}>
                        <SelectTrigger className={selectTriggerClasses}>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-white/10">
                            {categories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-6 p-8 rounded-[2.5rem] border border-white/5 bg-slate-900/30 backdrop-blur-3xl shadow-lg space-y-4">
                    <label className={labelClasses}>
                        <Users className="w-4 h-4 text-primary" /> Expert Assignee
                    </label>
                    <Select value={formData.instructor_id} onValueChange={(val) => setFormData(prev => ({ ...prev, instructor_id: val }))}>
                        <SelectTrigger className={selectTriggerClasses}>
                            <SelectValue placeholder="Assign an instructor" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-950 border-white/10">
                            {teachers.map(teacher => <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="md:col-span-6 p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-3xl shadow-lg space-y-4 group/field">
                    <label className={labelClasses}>
                        <BarChart className="w-4 h-4 text-primary" /> Cognitive Level
                    </label>
                    <div className="flex gap-2">
                        {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                            <button
                                key={lvl}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, level: lvl as any }))}
                                className={cn(
                                    "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    formData.level === lvl
                                        ? "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                        : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"
                                )}
                            >
                                {lvl}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6 p-8 rounded-[2rem] border border-white/5 bg-slate-950/40 backdrop-blur-3xl shadow-lg space-y-4 group/field">
                    <label className={labelClasses}>
                        <Globe className="w-4 h-4 text-primary" /> Delivery Language
                    </label>
                    <div className="flex gap-2">
                        {['English', 'Bengali'].map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, language: lang }))}
                                className={cn(
                                    "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    formData.language === lang
                                        ? "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                        : "bg-white/5 text-white/40 border border-white/5 hover:bg-white/10"
                                )}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
