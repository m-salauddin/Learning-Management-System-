"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
    Sparkles, FolderKanban, Plus, X, LayoutGrid, CheckCircle2, HelpCircle, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";

interface StepFinalizationProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
}

export const StepFinalization = ({ formData, setFormData }: StepFinalizationProps) => {
    const [projectInput, setProjectInput] = useState({ title: "", description: "" });
    const [faqInput, setFaqInput] = useState({ question: "", answer: "" });
    const [resourceInput, setResourceInput] = useState({ title: "", url: "", type: "link" });

    const addProject = () => {
        if (projectInput.title.trim()) {
            setFormData(prev => ({ ...prev, projects: [...(prev.projects || []), projectInput] }));
            setProjectInput({ title: "", description: "" });
        }
    };

    const removeProject = (index: number) => {
        setFormData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== index) }));
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

    const addResource = () => {
        if (resourceInput.title.trim() && resourceInput.url.trim()) {
            setFormData(prev => ({ ...prev, resources: [...(prev.resources || []), resourceInput] }));
            setResourceInput({ title: "", url: "", type: "link" });
        }
    };

    const removeResource = (index: number) => {
        setFormData(prev => ({ ...prev, resources: (prev.resources || []).filter((_, i) => i !== index) }));
    };

    return (
        <motion.div
            key="step4"
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
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                            Phase 04
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            The <span className="text-indigo-500">Finalization</span>
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm max-w-lg font-medium leading-relaxed">
                            Polish the curriculum with projects, localized support, and FAQs. The final mile of your student&apos;s success journey.
                        </p>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-indigo-500/20 to-indigo-500/5 border border-white/10 flex items-center justify-center text-indigo-500 shadow-2xl backdrop-blur-md">
                        <Sparkles className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                </div>
            </motion.div>
            <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-10">
                {/* Projects Section */}
                <div className="space-y-6">
                    <label className={labelClasses}>
                        <FolderKanban className="w-4 h-4 text-muted-foreground" />
                        Practical Projects
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 p-5 rounded-2xl bg-muted/20 border border-border/50">
                            <input
                                value={projectInput.title}
                                onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Project Title"
                                className={cn(inputClasses, "bg-background")}
                            />
                            <textarea
                                value={projectInput.description}
                                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="What will they build?"
                                className={cn(inputClasses, "resize-none h-28 py-3 bg-background")}
                            />
                            <button
                                type="button"
                                onClick={addProject}
                                className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {!formData.projects?.length ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40 py-10">
                                    <LayoutGrid className="w-8 h-8 mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">No Projects Added</p>
                                </div>
                            ) : (
                                formData.projects.map((p, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 flex justify-between items-start group">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-foreground">{p.title}</p>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2">{p.description}</p>
                                        </div>
                                        <button onClick={() => removeProject(i)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-border/50">
                    {/* FAQ Section */}
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            Course FAQs
                        </label>
                        <div className="space-y-4">
                            <input value={faqInput.question} onChange={(e) => setFaqInput(prev => ({ ...prev, question: e.target.value }))} placeholder="Question..." className={inputClasses} />
                            <textarea value={faqInput.answer} onChange={(e) => setFaqInput(prev => ({ ...prev, answer: e.target.value }))} placeholder="Answer..." className={cn(inputClasses, "h-20 resize-none")} />
                            <button type="button" onClick={addFaq} className="w-full py-2 bg-muted border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-all">Add FAQ</button>
                        </div>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                            {formData.faqs?.map((f, i) => (
                                <div key={i} className="px-3 py-2 rounded-lg bg-muted/20 border border-border/50 flex justify-between items-center group">
                                    <span className="text-[10px] text-muted-foreground font-bold truncate max-w-[200px]">{f.question}</span>
                                    <button onClick={() => removeFaq(i)}><X className="w-3 h-3 text-muted-foreground/40 hover:text-red-500" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources Section */}
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            Learning Assets
                        </label>
                        <div className="space-y-4">
                            <input value={resourceInput.title} onChange={(e) => setResourceInput(prev => ({ ...prev, title: e.target.value }))} placeholder="Asset Title..." className={inputClasses} />
                            <input value={resourceInput.url} onChange={(e) => setResourceInput(prev => ({ ...prev, url: e.target.value }))} placeholder="Resource Link..." className={inputClasses} />
                            <button type="button" onClick={addResource} className="w-full py-2 bg-muted border border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-muted/80 transition-all">Link Asset</button>
                        </div>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                            {formData.resources?.map((r, i) => (
                                <div key={i} className="px-3 py-2 rounded-lg bg-muted/20 border border-border/50 flex justify-between items-center group">
                                    <span className="text-[10px] text-muted-foreground font-bold truncate max-w-[200px]">{r.title}</span>
                                    <button onClick={() => removeResource(i)}><X className="w-3 h-3 text-muted-foreground/40 hover:text-red-500" /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
