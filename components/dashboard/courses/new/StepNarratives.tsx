"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
    PencilLine, ListChecks, FileText, Target, Plus, X, Users, Tags, AlertCircle, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";
interface StepNarrativesProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    errors: Record<string, string>;
}
export const StepNarratives = ({ formData, setFormData, errors }: StepNarrativesProps) => {
    const [requirementInput, setRequirementInput] = useState("");
    const [audienceInput, setAudienceInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [faqInput, setFaqInput] = useState({ question: "", answer: "" });
    const addArrayItem = (field: 'requirements' | 'target_audience' | 'tags', value: string, setter: (v: string) => void) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...(prev[field] as string[]), value.trim()]
            }));
            setter("");
        }
    };
    const removeArrayItem = (field: 'requirements' | 'target_audience' | 'tags', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
    };
    const addFaq = () => {
        if (faqInput.question.trim() && faqInput.answer.trim()) {
            setFormData(prev => ({ ...prev, faqs: [...(prev.faqs || []), faqInput] }));
            setFaqInput({ question: "", answer: "" });
        }
    };
    const removeFaq = (index: number) => {
        setFormData(prev => ({ ...prev, faqs: (prev.faqs || []).filter((_, i) => i !== index) }));
    };
    return (
        <motion.div
            key="step2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
        >
            {}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group overflow-hidden p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]" />
                            Phase 02
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            The <span className="text-emerald-500">Narratives</span>
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm max-w-lg font-medium leading-relaxed">
                            Craft the story and objectives. Compelling narratives bridge the gap between curiosity and commitment.
                        </p>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5 border border-white/10 flex items-center justify-center text-emerald-500 shadow-2xl backdrop-blur-md">
                        <PencilLine className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                </div>
            </motion.div>
            <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {}
                    <div className="space-y-3">
                        <label className={labelClasses}>
                            <ListChecks className="w-4 h-4 text-muted-foreground" />
                            Requirements
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={requirementInput}
                                onChange={(e) => setRequirementInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('requirements', requirementInput, setRequirementInput))}
                                placeholder="Add requirement..."
                                className={cn(inputClasses, "py-2", errors.requirements && "border-red-500/50 focus:border-red-500")}
                            />
                            <button
                                type="button"
                                onClick={() => addArrayItem('requirements', requirementInput, setRequirementInput)}
                                className="px-4 rounded-xl bg-muted border border-border/50 text-foreground hover:bg-muted/80 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.requirements?.map((req, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-lg bg-muted border border-border/50 text-[11px] font-semibold text-muted-foreground flex items-center gap-2">
                                    {req}
                                    <button onClick={() => removeArrayItem('requirements', i)}><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                        {errors.requirements && (
                            <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.requirements}
                            </p>
                        )}
                    </div>
                    {}
                    <div className="space-y-3">
                        <label className={labelClasses}>
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Target Audience
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={audienceInput}
                                onChange={(e) => setAudienceInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('target_audience', audienceInput, setAudienceInput))}
                                placeholder="Who is this for?"
                                className={cn(inputClasses, "py-2", errors.target_audience && "border-red-500/50 focus:border-red-500")}
                            />
                            <button
                                type="button"
                                onClick={() => addArrayItem('target_audience', audienceInput, setAudienceInput)}
                                className="px-4 rounded-xl bg-muted border border-border/50 text-foreground hover:bg-muted/80 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.target_audience?.map((item, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-lg bg-muted border border-border/50 text-[11px] font-semibold text-muted-foreground flex items-center gap-2">
                                    {item}
                                    <button onClick={() => removeArrayItem('target_audience', i)}><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                        {errors.target_audience && (
                            <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.target_audience}
                            </p>
                        )}
                    </div>
                    {}
                    <div className="space-y-3">
                        <label className={labelClasses}>
                            <Tags className="w-4 h-4 text-muted-foreground" />
                            Search Tags
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', tagInput, setTagInput))}
                                placeholder="Add tags..."
                                className={cn(inputClasses, "py-2")}
                            />
                            <button
                                type="button"
                                onClick={() => addArrayItem('tags', tagInput, setTagInput)}
                                className="px-4 rounded-xl bg-muted border border-border/50 text-foreground hover:bg-muted/80 transition-all active:scale-95"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags?.map((tag, i) => (
                                <div key={i} className="px-3 py-1.5 rounded-lg bg-muted border border-border/50 text-[11px] font-semibold text-muted-foreground flex items-center gap-2">
                                    {tag}
                                    <button onClick={() => removeArrayItem('tags', i)}><X className="w-3 h-3" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {}
                <div className="pt-8 border-t border-border/50 space-y-6">
                    <label className={labelClasses}>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        Course FAQs
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 p-5 rounded-2xl bg-muted/20 border border-border/50">
                            <input
                                value={faqInput.question}
                                onChange={(e) => setFaqInput(prev => ({ ...prev, question: e.target.value }))}
                                placeholder="Common Student Question..."
                                className={cn(inputClasses, "bg-background")}
                            />
                            <textarea
                                value={faqInput.answer}
                                onChange={(e) => setFaqInput(prev => ({ ...prev, answer: e.target.value }))}
                                placeholder="The helpful answer..."
                                className={cn(inputClasses, "h-28 resize-none py-3 bg-background")}
                            />
                            <button
                                type="button"
                                onClick={addFaq}
                                className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add FAQ
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            {!formData.faqs?.length ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40 py-10">
                                    <HelpCircle className="w-8 h-8 mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No FAQs Added</p>
                                </div>
                            ) : (
                                formData.faqs.map((f, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 flex justify-between items-start group">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-foreground">Q: {f.question}</p>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2">A: {f.answer}</p>
                                        </div>
                                        <button onClick={() => removeFaq(i)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
