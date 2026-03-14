"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Sparkles, FolderKanban, Plus, X, LayoutGrid, PlayCircle, Layers, ChevronDown, ChevronUp, Edit, Check, Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";

interface StepFinalizationProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    errors: Record<string, string>;
}

export const StepFinalization = ({ formData, setFormData, errors }: StepFinalizationProps) => {
    const [projectInput, setProjectInput] = useState({ title: "", description: "", image_url: "" });
    const [moduleTitle, setModuleTitle] = useState("");
    const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(0);
    const [lessonInput, setLessonInput] = useState({ title: "", video_url: "" });

    const addProject = () => {
        if (projectInput.title.trim()) {
            setFormData(prev => ({ ...prev, projects: [...(prev.projects || []), projectInput] }));
            setProjectInput({ title: "", description: "", image_url: "" });
        }
    };

    const removeProject = (index: number) => {
        setFormData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== index) }));
    };

    const [editingModule, setEditingModule] = useState<{ index: number, title: string } | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ mIndex: number, lIndex: number, title: string, video_url: string } | null>(null);
    const [editingProject, setEditingProject] = useState<{ index: number, title: string, description: string, image_url: string } | null>(null);

    const updateProject = (index: number) => {
        if (!editingProject || !editingProject.title.trim()) return;
        setFormData(prev => ({
            ...prev,
            projects: (prev.projects || []).map((p, i) => i === index ? { 
                title: editingProject.title, 
                description: editingProject.description, 
                image_url: editingProject.image_url 
            } : p)
        }));
        setEditingProject(null);
    };

    const addModule = () => {
        if (!moduleTitle.trim()) return;
        setFormData(prev => ({
            ...prev,
            modules: [...(prev.modules || []), { title: moduleTitle, lessons: [] }]
        }));
        setModuleTitle("");
        setActiveModuleIndex((formData.modules?.length || 0));
    };

    const removeModule = (index: number) => {
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).filter((_, i) => i !== index)
        }));
        if (activeModuleIndex === index) setActiveModuleIndex(null);
    };

    const updateModule = (index: number) => {
        if (!editingModule || !editingModule.title.trim()) return;
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).map((m, i) => i === index ? { ...m, title: editingModule.title } : m)
        }));
        setEditingModule(null);
    };

    const addLessonToModule = (mIndex: number) => {
        if (!lessonInput.title.trim()) return;
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).map((module, i) => {
                if (i === mIndex) {
                    return {
                        ...module,
                        lessons: [...(module.lessons || []), lessonInput]
                    };
                }
                return module;
            })
        }));
        setLessonInput({ title: "", video_url: "" });
    };

    const removeLessonFromModule = (mIndex: number, lIndex: number) => {
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).map((module, i) => {
                if (i === mIndex) {
                    return {
                        ...module,
                        lessons: (module.lessons || []).filter((_, li) => li !== lIndex)
                    };
                }
                return module;
            })
        }));
    };

    const updateLesson = (mIndex: number, lIndex: number) => {
        if (!editingLesson || !editingLesson.title.trim()) return;
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).map((m, i) => {
                if (i === mIndex) {
                    return {
                        ...m,
                        lessons: (m.lessons || []).map((l, li) => li === lIndex ? { title: editingLesson.title, video_url: editingLesson.video_url } : l)
                    };
                }
                return m;
            })
        }));
        setEditingLesson(null);
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
                            Polish the curriculum with projects and a structured module-based learning path.
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <label className={labelClasses}>
                            <FolderKanban className="w-4 h-4 text-muted-foreground" />
                            Practical Projects
                        </label>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-black/20 border border-white/5 shadow-inner">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                                value={projectInput.title}
                                onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Project Title"
                                className={cn(inputClasses, "py-1.5 h-10 text-[11px] rounded-lg bg-background")}
                            />
                            <input
                                value={projectInput.image_url}
                                onChange={(e) => setProjectInput(prev => ({ ...prev, image_url: e.target.value }))}
                                placeholder="Project Image URL (Optional)"
                                className={cn(inputClasses, "py-1.5 h-10 text-[11px] rounded-lg bg-background")}
                            />
                            <textarea
                                value={projectInput.description}
                                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="What will they build? (Description)"
                                className={cn(inputClasses, "resize-none h-10 sm:col-span-2 py-2 text-[11px] rounded-lg bg-background")}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={addProject}
                            className="px-6 py-3 md:py-0 md:h-24 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 flex flex-row md:flex-col items-center justify-center gap-2 shadow-lg shadow-indigo-500/10 min-w-[140px]"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="whitespace-nowrap">Add Project</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!formData.projects?.length ? (
                            <div className="md:col-span-2 h-32 flex flex-col items-center justify-center text-muted-foreground/30 border border-dashed border-border/50 rounded-2xl bg-muted/5">
                                <LayoutGrid className="w-6 h-6 mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">No Projects Added Yet</p>
                            </div>
                        ) : (
                            formData.projects.map((p, i) => (
                                <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 flex justify-between items-start group min-h-[80px]">
                                    {editingProject?.index === i ? (
                                        <div className="flex-1 space-y-3">
                                            <input 
                                                autoFocus
                                                value={editingProject.title}
                                                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                                                className="bg-background/50 border-white/10 rounded px-2 py-1.5 text-xs font-bold text-white outline-none w-full"
                                                placeholder="Project Title"
                                            />
                                            <input 
                                                value={editingProject.image_url}
                                                onChange={(e) => setEditingProject({ ...editingProject, image_url: e.target.value })}
                                                className="bg-background/50 border-white/10 rounded px-2 py-1.5 text-[10px] text-muted-foreground outline-none w-full"
                                                placeholder="Image URL"
                                            />
                                            <textarea 
                                                value={editingProject.description}
                                                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                                                className="bg-background/50 border-white/10 rounded px-2 py-1.5 text-[11px] text-muted-foreground outline-none w-full resize-none h-20"
                                                placeholder="Description"
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => updateProject(i)} className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"><Check className="w-3 h-3" /> Save</button>
                                                <button onClick={() => setEditingProject(null)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"><X className="w-3 h-3" /> Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-1 min-w-0">
                                                <p className="text-xs font-bold text-foreground truncate uppercase tracking-tight">{p.title}</p>
                                                {p.image_url && <p className="text-[9px] text-indigo-500 truncate">{p.image_url}</p>}
                                                <p className="text-[11px] text-muted-foreground line-clamp-2">{p.description}</p>
                                            </div>
                                            <div className="flex flex-col gap-1 items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setEditingProject({ index: i, title: p.title, description: p.description, image_url: p.image_url || "" })} 
                                                    className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button 
                                                    onClick={() => removeProject(i)} 
                                                    className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Modules & Lessons Section */}
                <div className="space-y-6 pt-8 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <label className={cn(labelClasses, "mb-0")}>
                            <Layers className="w-4 h-4 text-muted-foreground" />
                            Course Curriculum
                        </label>
                        <div className="flex gap-2">
                            <input
                                value={moduleTitle}
                                onChange={(e) => setModuleTitle(e.target.value)}
                                placeholder="New Module Title..."
                                className={cn(inputClasses, "rounded-lg flex-1 sm:w-48 md:w-60 py-1.5 text-[11px] bg-background")}
                            />
                            <button
                                type="button"
                                onClick={addModule}
                                className="px-4 py-1.5 bg-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-indigo-400 transition-all active:scale-95 flex items-center gap-1 whitespace-nowrap"
                            >
                                <Plus className="w-3 h-3" /> Module
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {!formData.modules?.length ? (
                            <div className="p-8 md:p-12 rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground/40 bg-muted/5 text-center">
                                <Layers className="w-8 h-8 md:w-10 md:h-10 mb-3" />
                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-tight">No Curriculum Modules Defined</p>
                                <p className="text-[9px] md:text-[10px] mt-1 font-medium">Add a module to start building your course flow</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {formData.modules.map((module, mIndex) => (
                                    <div key={mIndex} className="rounded-2xl border border-border/50 bg-background/40 overflow-hidden transition-all shadow-sm">
                                        <div 
                                            className={cn(
                                                "p-4 flex items-center justify-between cursor-pointer hover:bg-muted/10 transition-colors",
                                                activeModuleIndex === mIndex && "bg-muted/10"
                                            )}
                                            onClick={() => setActiveModuleIndex(activeModuleIndex === mIndex ? null : mIndex)}
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-110 transition-transform">
                                                    <Layers className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic opacity-60">Module {mIndex + 1}</span>
                                                    </div>
                                                    {editingModule?.index === mIndex ? (
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                autoFocus
                                                                value={editingModule.title}
                                                                onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                                                                onKeyDown={(e) => e.key === 'Enter' && updateModule(mIndex)}
                                                                className="bg-background/50 border-white/10 rounded px-2 py-1 text-sm font-black text-white outline-none focus:border-primary/50 w-full"
                                                            />
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateModule(mIndex);
                                                                }} 
                                                                className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingModule(null);
                                                                }} 
                                                                className="p-1.5 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <h4 className="text-sm md:text-md font-black text-white truncate uppercase tracking-tight">
                                                            {module.title}
                                                        </h4>
                                                    )}
                                                </div>
                                            </div>
                                            {editingModule?.index !== mIndex && (
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingModule({ index: mIndex, title: module.title });
                                                        }}
                                                        className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); removeModule(mIndex); }} 
                                                        className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                    {activeModuleIndex === mIndex ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                                </div>
                                            )}
                                        </div>

                                        <AnimatePresence>
                                            {activeModuleIndex === mIndex && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="border-t border-border/30"
                                                >
                                                    <div className="p-5 bg-slate-900/40 space-y-5">
                                                        {/* Add Lesson Form */}
                                                        <div className="flex flex-col md:flex-row gap-4 p-5 rounded-2xl bg-black/20 border border-white/5 shadow-inner">
                                                            <div className="flex-1 space-y-3">
                                                                <input
                                                                    value={lessonInput.title}
                                                                    onChange={(e) => setLessonInput(prev => ({ ...prev, title: e.target.value }))}
                                                                    placeholder="Lesson Title"
                                                                    className={cn(inputClasses, "py-1.5 h-10 text-[11px] rounded-lg")}
                                                                />
                                                                <input
                                                                    value={lessonInput.video_url}
                                                                    onChange={(e) => setLessonInput(prev => ({ ...prev, video_url: e.target.value }))}
                                                                    placeholder="Video URL"
                                                                    className={cn(inputClasses, "py-1.5 h-10 text-[11px] rounded-lg")}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => addLessonToModule(mIndex)}
                                                                className="px-5 py-3 md:py-0 md:h-[92px] bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-95 flex flex-row md:flex-col items-center justify-center gap-2"
                                                            >
                                                                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                                                <span className="whitespace-nowrap">Add Lesson</span>
                                                            </button>
                                                        </div>

                                                        {/* Lessons List within Module */}
                                                        <div className="space-y-2">
                                                            {!module.lessons?.length ? (
                                                                <div className="text-center py-10 border border-dashed border-border/30 rounded-xl flex flex-col items-center justify-center gap-2">
                                                                    <PlayCircle className="w-5 h-5 opacity-20" />
                                                                    <span className="opacity-20 capitalize text-[10px] font-bold tracking-widest">No lessons in this module yet</span>
                                                                </div>
                                                            ) : (
                                                                module.lessons.map((lesson, lIndex) => (
                                                                    <div key={lIndex} className="p-3 rounded-lg border border-border/30 bg-background/20 flex justify-between items-center group gap-3">
                                                                        {editingLesson?.mIndex === mIndex && editingLesson?.lIndex === lIndex ? (
                                                                            <div className="flex-1 space-y-2">
                                                                                <input 
                                                                                    autoFocus
                                                                                    value={editingLesson.title}
                                                                                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                                                                    className="bg-background/50 border-white/10 rounded px-2 py-1 text-[11px] font-bold text-white outline-none w-full"
                                                                                    placeholder="Lesson Title"
                                                                                />
                                                                                <input 
                                                                                    value={editingLesson.video_url}
                                                                                    onChange={(e) => setEditingLesson({ ...editingLesson, video_url: e.target.value })}
                                                                                    className="bg-background/50 border-white/10 rounded px-2 py-1 text-[9px] text-muted-foreground outline-none w-full italic"
                                                                                    placeholder="Video URL"
                                                                                />
                                                                                <div className="flex justify-end gap-2">
                                                                                    <button onClick={() => updateLesson(mIndex, lIndex)} className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"><Check className="w-3 h-3" /> Save</button>
                                                                                    <button onClick={() => setEditingLesson(null)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"><X className="w-3 h-3" /> Cancel</button>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <div className="flex items-center gap-3 min-w-0">
                                                                                    <PlayCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                                                    <div className="min-w-0">
                                                                                        <p className="text-[11px] font-bold text-white leading-none truncate">{lesson.title}</p>
                                                                                        <p className="text-[9px] text-muted-foreground mt-1 truncate">{lesson.video_url}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex items-center gap-1">
                                                                                    <button 
                                                                                        onClick={() => setEditingLesson({ mIndex, lIndex, title: lesson.title, video_url: lesson.video_url })} 
                                                                                        className="p-1.5 rounded-md text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100"
                                                                                    >
                                                                                        <Pencil className="w-3 h-3" />
                                                                                    </button>
                                                                                    <button 
                                                                                        onClick={() => removeLessonFromModule(mIndex, lIndex)} 
                                                                                        className="p-1.5 rounded-md text-muted-foreground/30 hover:text-red-500 hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                                                                                    >
                                                                                        <X className="w-3 h-3" />
                                                                                    </button>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                ))
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
