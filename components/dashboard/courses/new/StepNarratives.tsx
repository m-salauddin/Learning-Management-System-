"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
    PencilLine, ListChecks, FileText, Target, Plus, X, Users, Tags
} from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";

interface StepNarrativesProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
}

export const StepNarratives = ({ formData, setFormData }: StepNarrativesProps) => {
    const [objectiveInput, setObjectiveInput] = useState("");
    const [requirementInput, setRequirementInput] = useState("");
    const [audienceInput, setAudienceInput] = useState("");
    const [tagInput, setTagInput] = useState("");

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

    return (
        <motion.div
            key="step2"
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
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                            Phase 02
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            The <span className="text-emerald-500">Narratives</span>
                        </h2>
                        <p className="text-white/40 text-sm md:text-base max-w-lg font-medium leading-relaxed">
                            Craft the story of your course. Detail the journey, the transformation, and the technical depth provided.
                        </p>
                    </div>
                    <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-emerald-500/20 to-emerald-500/5 border border-white/10 flex items-center justify-center text-emerald-500 shadow-2xl backdrop-blur-md">
                        <PencilLine className="w-10 h-10" />
                    </div>
                </div>
            </motion.div>

            {/* Description Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-8 group">
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <ListChecks className="w-4 h-4 text-emerald-500" /> Defining Headline
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

                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <FileText className="w-4 h-4 text-emerald-500" /> Comprehensive Overview
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Dive deep into what makes this course special..."
                            className={cn(inputClasses, "resize-none h-48")}
                        />
                    </div>
                </div>

                {/* Lists Section */}
                <div className="md:col-span-6 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-6 group">
                    <label className={labelClasses}>
                        <Target className="w-4 h-4 text-emerald-500" /> Learning Objectives
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={objectiveInput}
                            onChange={(e) => setObjectiveInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('learning_objectives', objectiveInput, setObjectiveInput))}
                            placeholder="What will they master?"
                            className={cn(inputClasses, "py-3.5")}
                        />
                        <button
                            type="button"
                            onClick={() => addArrayItem('learning_objectives', objectiveInput, setObjectiveInput)}
                            className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all shrink-0 active:scale-90"
                        >
                            <Plus className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {formData.learning_objectives?.map((obj, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i}
                                className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 flex items-center gap-3 group/tag hover:bg-emerald-500/20 transition-all cursor-default"
                            >
                                {obj}
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('learning_objectives', i)}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-6 group">
                    <label className={labelClasses}>
                        <ListChecks className="w-4 h-4 text-emerald-500" /> Requirements
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={requirementInput}
                            onChange={(e) => setRequirementInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('requirements', requirementInput, setRequirementInput))}
                            placeholder="What should they know?"
                            className={cn(inputClasses, "py-3.5")}
                        />
                        <button
                            type="button"
                            onClick={() => addArrayItem('requirements', requirementInput, setRequirementInput)}
                            className="w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 border border-white/10 transition-all shrink-0 active:scale-90"
                        >
                            <Plus className="w-6 h-6" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {formData.requirements?.map((req, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 flex items-center gap-3 group/tag hover:border-white/20 transition-all cursor-default"
                            >
                                {req}
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('requirements', i)}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-6 group">
                    <label className={labelClasses}>
                        <Users className="w-4 h-4 text-emerald-500" /> Target Audience
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={audienceInput}
                            onChange={(e) => setAudienceInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('target_audience', audienceInput, setAudienceInput))}
                            placeholder="Who is this for?"
                            className={cn(inputClasses, "py-3.5")}
                        />
                        <button
                            type="button"
                            onClick={() => addArrayItem('target_audience', audienceInput, setAudienceInput)}
                            className="w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 border border-white/10 transition-all shrink-0 active:scale-90"
                        >
                            <Plus className="w-6 h-6" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {formData.target_audience?.map((item, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 flex items-center gap-3 group/tag hover:border-white/20 transition-all cursor-default"
                            >
                                {item}
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('target_audience', i)}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-6 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-6 group">
                    <label className={labelClasses}>
                        <Tags className="w-4 h-4 text-emerald-500" /> Search Tags
                    </label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', tagInput, setTagInput))}
                            placeholder="Add relevant tags..."
                            className={cn(inputClasses, "py-3.5")}
                        />
                        <button
                            type="button"
                            onClick={() => addArrayItem('tags', tagInput, setTagInput)}
                            className="w-14 h-14 rounded-2xl bg-white/5 text-white flex items-center justify-center hover:bg-white/10 border border-white/10 transition-all shrink-0 active:scale-90"
                        >
                            <Plus className="w-6 h-6" strokeWidth={2.5} />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {formData.tags?.map((tag, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={i}
                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-white/50 flex items-center gap-3 group/tag hover:border-white/20 transition-all cursor-default"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeArrayItem('tags', i)}
                                    className="hover:text-white transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
