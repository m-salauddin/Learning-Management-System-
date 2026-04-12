"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    PencilLine, ListChecks, FileText, Target, Plus, X, Users, Tags, AlertCircle, HelpCircle,
    Pencil, Trash2, MessageSquare, Tag, FolderKanban, Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";
import { StepHeader } from "./StepHeader";
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
    const [showFaqForm, setShowFaqForm] = useState(false);
    const [editFaqIndex, setEditFaqIndex] = useState<number | null>(null);

    const addFaq = () => {
        if (faqInput.question.trim() && faqInput.answer.trim()) {
            setFormData(prev => {
                const updatedFaqs = [...(prev.faqs || [])];
                if (editFaqIndex !== null) {
                    updatedFaqs[editFaqIndex] = faqInput;
                } else {
                    updatedFaqs.push(faqInput);
                }
                return { ...prev, faqs: updatedFaqs };
            });
            setFaqInput({ question: "", answer: "" });
            setEditFaqIndex(null);
            setShowFaqForm(false);
        }
    };

    const startEditingFaq = (index: number) => {
        const faq = formData.faqs![index];
        setFaqInput(faq);
        setEditFaqIndex(index);
        setShowFaqForm(true);
    };

    const removeFaq = (index: number) => {
        setFormData(prev => ({ ...prev, faqs: (prev.faqs || []).filter((_, i) => i !== index) }));
        if (editFaqIndex === index) {
            setEditFaqIndex(null);
            setFaqInput({ question: "", answer: "" });
        }
    };

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editProjectIndex, setEditProjectIndex] = useState<number | null>(null);
    const [projectInput, setProjectInput] = useState({ title: "", description: "", tech_stack: "" });

    const addProject = () => {
        if (projectInput.title.trim() && projectInput.description.trim()) {
            setFormData(prev => {
                const updatedProjects = [...(prev.projects || [])];
                if (editProjectIndex !== null) {
                    updatedProjects[editProjectIndex] = projectInput;
                } else {
                    updatedProjects.push(projectInput);
                }
                return { ...prev, projects: updatedProjects };
            });
            setProjectInput({ title: "", description: "", tech_stack: "" });
            setEditProjectIndex(null);
            setShowProjectForm(false);
        }
    };

    const startEditingProject = (index: number) => {
        const p = formData.projects![index];
        setProjectInput({ title: p.title, description: p.description, tech_stack: p.tech_stack || "" });
        setEditProjectIndex(index);
        setShowProjectForm(true);
    };

    const removeProject = (index: number) => {
        setFormData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== index) }));
        if (editProjectIndex === index) {
            setEditProjectIndex(null);
            setProjectInput({ title: "", description: "", tech_stack: "" });
        }
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
            <StepHeader
                phase="02"
                title="Narratives"
                highlight="Narratives"
                description="Define objectives and prerequisites for your students."
                icon={PencilLine}
                color="amber"
            />
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
                            <Target className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-amber-400">Phase Objectives</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Clearly define course expectations and audience targets.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3 group/req">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <ListChecks className="w-4 h-4 text-muted-foreground group-focus-within/req:text-amber-400 transition-colors" />
                                    Requirements
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={requirementInput}
                                        onChange={(e) => setRequirementInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('requirements', requirementInput, setRequirementInput))}
                                        placeholder="Add requirement..."
                                        className={cn(inputClasses, "py-2 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20", errors.requirements && "border-red-500/50 focus:border-red-500")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('requirements', requirementInput, setRequirementInput)}
                                        className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.requirements?.map((req, i) => (
                                        <div key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                            {req}
                                            <button type="button" onClick={() => removeArrayItem('requirements', i)} className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.requirements && (
                                    <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 px-2">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.requirements}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-3 group/audience">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Users className="w-4 h-4 text-muted-foreground group-focus-within/audience:text-amber-400 transition-colors" />
                                    Target Audience
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={audienceInput}
                                        onChange={(e) => setAudienceInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('target_audience', audienceInput, setAudienceInput))}
                                        placeholder="Who is this for?"
                                        className={cn(inputClasses, "py-2 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20", errors.target_audience && "border-red-500/50 focus:border-red-500")}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('target_audience', audienceInput, setAudienceInput)}
                                        className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.target_audience?.map((item, i) => (
                                        <div key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                            {item}
                                            <button type="button" onClick={() => removeArrayItem('target_audience', i)} className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.target_audience && (
                                    <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 px-2">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.target_audience}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
                            <Tags className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-amber-400">Course Discoverability</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Add search tags to help students find your masterpiece.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="space-y-3 group/tags">
                            <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                <Tags className="w-4 h-4 text-muted-foreground group-focus-within/tags:text-amber-400 transition-colors" />
                                Search Tags
                            </label>
                            <div className="flex gap-2 max-w-md">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('tags', tagInput, setTagInput))}
                                    placeholder="Add hex, skill, or topic tags..."
                                    className={cn(inputClasses, "py-2 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20")}
                                />
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('tags', tagInput, setTagInput)}
                                    className="h-10 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-amber-500/10 hover:text-amber-500 hover:border-amber-500/30 transition-all active:scale-95 flex items-center justify-center"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags?.map((tag, i) => (
                                    <div key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                                        #{tag}
                                        <button type="button" onClick={() => removeArrayItem('tags', i)} className="hover:text-amber-700 dark:hover:text-amber-300">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
                            <HelpCircle className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-amber-400">Knowledge Base</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Anticipate student questions and provide detailed answers.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
                                <label className={cn(labelClasses, "text-slate-600 dark:text-slate-300 pointer-events-none")}>
                                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                    FAQ Management
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowFaqForm(!showFaqForm);
                                        if (showFaqForm) {
                                            setEditFaqIndex(null);
                                            setFaqInput({ question: "", answer: "" });
                                        }
                                    }}
                                    className={cn(
                                        "h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                        showFaqForm 
                                            ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10" 
                                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]"
                                    )}
                                >
                                    {showFaqForm ? <><X className="w-3.5 h-3.5" /> Close</> : <><Plus className="w-3.5 h-3.5" /> Add New</>}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {showFaqForm && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/2 border border-slate-200 dark:border-white/10 space-y-4">
                                            <div className="grid grid-cols-1 gap-5">
                                                <div className="space-y-2 group/q">
                                                    <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground group-focus-within/q:text-amber-400 transition-colors" />
                                                        FAQ Question
                                                    </label>
                                                    <input
                                                        value={faqInput.question}
                                                        onChange={(e) => setFaqInput(prev => ({ ...prev, question: e.target.value }))}
                                                        placeholder="What will I build by the end?"
                                                        className={cn(inputClasses, "h-11 bg-white dark:bg-slate-950 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20")}
                                                    />
                                                </div>
                                                <div className="space-y-2 group/a">
                                                    <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground group-focus-within/a:text-amber-400 transition-colors" />
                                                        Helpful Answer
                                                    </label>
                                                    <textarea
                                                        value={faqInput.answer}
                                                        onChange={(e) => setFaqInput(prev => ({ ...prev, answer: e.target.value }))}
                                                        placeholder="Provide a detailed, encouraging response..."
                                                        className={cn(inputClasses, "h-[100px] resize-none py-3 bg-white dark:bg-slate-950 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 custom-scrollbar mt-1.5")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="button"
                                                    onClick={addFaq}
                                                    disabled={!faqInput.question || !faqInput.answer}
                                                    className="h-10 px-6 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                                                >
                                                    {editFaqIndex !== null ? <><Pencil className="w-3.5 h-3.5" /> Update FAQ</> : <><Plus className="w-3.5 h-3.5" /> Save to Knowledge Base</>}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {!formData.faqs?.length ? (
                                    <div className="py-14 sm:py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white/5 text-slate-400/50 transition-colors hover:border-amber-500/20 group/empty">
                                        <div className="w-16 h-16 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/10 group-hover/empty:scale-110 transition-transform">
                                            <HelpCircle className="w-8 h-8 text-amber-500/40" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-center px-6">No Insight Queries Found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-tight">
                                                {String(formData.faqs?.length || 0).padStart(2, '0')} ENTRIES
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Knowledge Base</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            <AnimatePresence mode="popLayout">
                                                {formData.faqs.map((f, i) => (
                                                    <motion.div
                                                        key={f.question}
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 flex items-center justify-between group/fq transition-all hover:border-amber-500/30"
                                                    >
                                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                                            <div className="w-10 h-10 rounded-lg bg-amber-500/5 border border-amber-500/10 flex items-center justify-center shrink-0">
                                                                <HelpCircle className="w-4 h-4 text-amber-500" />
                                                            </div>
                                                            <div className="flex flex-col min-w-0 overflow-hidden">
                                                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">{f.question}</p>
                                                                <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{f.answer}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0 ml-4">
                                                            <button
                                                                type="button" 
                                                                onClick={() => startEditingFaq(i)} 
                                                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-all flex items-center justify-center"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button" 
                                                                onClick={() => removeFaq(i)} 
                                                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]">
                            <FolderKanban className="w-4.5 h-4.5 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-violet-400">Practical Forge (Projects)</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Add hands-on projects and laboratory exercises for real-world practice.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-white/5">
                                <label className={cn(labelClasses, "text-slate-600 dark:text-slate-300 pointer-events-none")}>
                                    <FolderKanban className="w-4 h-4 text-muted-foreground" />
                                    Project Management
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProjectForm(!showProjectForm);
                                        if (showProjectForm) {
                                            setEditProjectIndex(null);
                                            setProjectInput({ title: "", description: "", tech_stack: "" });
                                        }
                                    }}
                                    className={cn(
                                        "h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                        showProjectForm 
                                            ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10" 
                                            : "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20 shadow-[0_0_15px_-5px_rgba(139,92,246,0.3)]"
                                    )}
                                >
                                    {showProjectForm ? <><X className="w-3.5 h-3.5" /> Close</> : <><Plus className="w-3.5 h-3.5" /> Add Project</>}
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {showProjectForm && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-5 rounded-2xl bg-white/50 dark:bg-white/2 border border-slate-200 dark:border-white/10 space-y-4">
                                            <div className="grid grid-cols-1 gap-5">
                                                <div className="space-y-2 group/pt">
                                                    <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                                        <FileText className="w-3.5 h-3.5 text-muted-foreground group-focus-within/pt:text-violet-400 transition-colors" />
                                                        Project Title
                                                    </label>
                                                    <input
                                                        value={projectInput.title}
                                                        onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                                                        placeholder="e.g. Build evaluating dashboard"
                                                        className={cn(inputClasses, "h-11 bg-white dark:bg-slate-950 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                    />
                                                </div>
                                                <div className="space-y-2 group/ptech">
                                                    <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                                        <Code2 className="w-3.5 h-3.5 text-muted-foreground group-focus-within/ptech:text-violet-400 transition-colors" />
                                                        Tech Stack
                                                    </label>
                                                    <input
                                                        value={projectInput.tech_stack}
                                                        onChange={(e) => setProjectInput(prev => ({ ...prev, tech_stack: e.target.value }))}
                                                        placeholder="e.g. React, Node.js, PostgreSQL (comma separated)"
                                                        className={cn(inputClasses, "h-11 bg-white dark:bg-slate-950 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                    />
                                                </div>
                                                <div className="space-y-2 group/pd">
                                                    <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground group-focus-within/pd:text-violet-400 transition-colors" />
                                                        Project Description
                                                    </label>
                                                    <textarea
                                                        value={projectInput.description}
                                                        onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                                                        placeholder="Provide a detailed brief of the project requirements..."
                                                        className={cn(inputClasses, "h-[100px] resize-none py-3 bg-white dark:bg-slate-950 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 custom-scrollbar mt-1.5")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-2">
                                                <button
                                                    type="button"
                                                    onClick={addProject}
                                                    disabled={!projectInput.title || !projectInput.description}
                                                    className="h-10 px-6 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-sm"
                                                >
                                                    {editProjectIndex !== null ? <><Pencil className="w-3.5 h-3.5" /> Update Project</> : <><Plus className="w-3.5 h-3.5" /> Deploy Project</>}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-4">
                                {!formData.projects?.length ? (
                                    <div className="py-14 sm:py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white/5 text-slate-400/50 transition-colors hover:border-violet-500/20 group/empty">
                                        <div className="w-16 h-16 rounded-full bg-violet-500/5 flex items-center justify-center border border-violet-500/10 group-hover/empty:scale-110 transition-transform">
                                            <FolderKanban className="w-8 h-8 text-violet-500/40" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-center px-6">No Projects Forged Yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-black tracking-tight">
                                                {String(formData.projects?.length || 0).padStart(2, '0')} PROJECTS
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Practical Forge</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2.5">
                                            <AnimatePresence mode="popLayout">
                                                {formData.projects.map((p, i) => (
                                                    <motion.div
                                                        key={p.title}
                                                        layout
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 flex items-center justify-between group/pj transition-all hover:border-violet-500/30"
                                                    >
                                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                                            <div className="w-10 h-10 rounded-lg bg-violet-500/5 border border-violet-500/10 flex items-center justify-center shrink-0">
                                                                <FolderKanban className="w-4 h-4 text-violet-500" />
                                                            </div>
                                                            <div className="flex flex-col min-w-0 overflow-hidden">
                                                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">{p.title}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    {p.tech_stack && (
                                                                        <span className="text-[9px] font-medium text-slate-500 truncate"><Code2 className="w-3 h-3 inline mr-1" />{p.tech_stack}</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 shrink-0 ml-4">
                                                            <button
                                                                type="button" 
                                                                onClick={() => startEditingProject(i)} 
                                                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-500/10 transition-all flex items-center justify-center"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button" 
                                                                onClick={() => removeProject(i)} 
                                                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
