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
                className="relative group overflow-hidden p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,1)]" />
                            Phase 04
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            The <span className="text-indigo-500">Finalization</span>
                        </h2>
                        <p className="text-white/40 text-sm md:text-base max-w-lg font-medium leading-relaxed">
                            Polish the curriculum with projects, localized support, and FAQs. The final mile of your student's success journey.
                        </p>
                    </div>
                    <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-indigo-500/20 to-indigo-500/5 border border-white/10 flex items-center justify-center text-indigo-500 shadow-2xl backdrop-blur-md">
                        <Sparkles className="w-10 h-10" />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-8 group">

                    {/* Projects Section */}
                    <div className="space-y-6">
                        <label className={labelClasses}>
                            <FolderKanban className="w-4 h-4 text-indigo-500" /> Practical Projects
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6 shadow-inner">
                                <div className="space-y-4">
                                    <input
                                        value={projectInput.title}
                                        onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Project Name (e.g. E-commerce Platform)"
                                        className={inputClasses}
                                    />
                                    <textarea
                                        value={projectInput.description}
                                        onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Detail the technical milestones students will achieve..."
                                        className={cn(inputClasses, "resize-none h-32 py-5")}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addProject}
                                    className="w-full py-4.5 bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-[0_10px_30px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-3 active:scale-95 group/btn"
                                >
                                    <Plus className="w-5 h-5 transition-transform group-hover/btn:rotate-90" />
                                    Integrate Project
                                </button>
                            </div>
                            <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
                                {!formData.projects || formData.projects.length === 0 ? (
                                    <div className="h-full border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-white/10 p-10 text-center">
                                        <LayoutGrid className="w-12 h-12 mb-4 opacity-50" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Projects Defined</p>
                                    </div>
                                ) : (
                                    formData.projects.map((p, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={i}
                                            className="p-5 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-start group/item hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
                                        >
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                                                    <p className="text-[11px] font-black uppercase text-white tracking-widest leading-none">{p.title}</p>
                                                </div>
                                                <p className="text-xs text-white/40 leading-relaxed font-medium line-clamp-2 md:line-clamp-none">{p.description}</p>
                                            </div>
                                            <button type="button" onClick={() => removeProject(i)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all shrink-0"><X className="w-4 h-4" /></button>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FAQ & Resources Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div className="space-y-4">
                            <label className={labelClasses}>
                                <HelpCircle className="w-4 h-4 text-indigo-500" /> Recursive FAQs
                            </label>
                            <div className="space-y-4">
                                <input value={faqInput.question} onChange={(e) => setFaqInput(prev => ({ ...prev, question: e.target.value }))} placeholder="Question..." className={inputClasses} />
                                <textarea value={faqInput.answer} onChange={(e) => setFaqInput(prev => ({ ...prev, answer: e.target.value }))} placeholder="Answer..." className={cn(inputClasses, "h-24 resize-none")} />
                                <button type="button" onClick={addFaq} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Archive Entry</button>
                            </div>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {formData.faqs?.map((f, i) => (
                                    <div key={i} className="px-4 py-3 rounded-lg bg-white/2 border border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-white/40 font-bold truncate max-w-[200px]">{f.question}</span>
                                        <button onClick={() => removeFaq(i)}><X className="w-3.5 h-3.5 text-white/20 hover:text-red-500" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className={labelClasses}>
                                <FileText className="w-4 h-4 text-indigo-500" /> Digital Assets
                            </label>
                            <div className="space-y-4">
                                <input value={resourceInput.title} onChange={(e) => setResourceInput(prev => ({ ...prev, title: e.target.value }))} placeholder="Resource Name..." className={inputClasses} />
                                <input value={resourceInput.url} onChange={(e) => setResourceInput(prev => ({ ...prev, url: e.target.value }))} placeholder="URL or Shared Link..." className={inputClasses} />
                                <button type="button" onClick={addResource} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Link Resource</button>
                            </div>
                            <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {formData.resources?.map((r, i) => (
                                    <div key={i} className="px-4 py-3 rounded-lg bg-white/2 border border-white/5 flex justify-between items-center">
                                        <span className="text-[10px] text-white/40 font-bold truncate max-w-[200px]">{r.title}</span>
                                        <button onClick={() => removeResource(i)}><X className="w-3.5 h-3.5 text-white/20 hover:text-red-500" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
