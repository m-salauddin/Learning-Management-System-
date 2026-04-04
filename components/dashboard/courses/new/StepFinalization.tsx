"use client";
import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Rocket, FolderKanban, Plus, X, LayoutGrid, PlayCircle, Layers, ChevronDown, ChevronUp, Check, Pencil, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { inputClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";
import { StepHeader } from "./StepHeader";
interface StepFinalizationProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    errors: Record<string, string>;
}
const MemoizedLessonItem = memo(({
    lesson,
    mIndex,
    lIndex,
    editingLesson,
    setEditingLesson,
    updateLesson,
    removeLessonFromModule
}: any) => {
    const isEditing = editingLesson?.mIndex === mIndex && editingLesson?.lIndex === lIndex;
    return (
        <motion.div
            layout
            className="p-3.5 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/40 flex flex-col gap-3 group/lesson hover:border-violet-500/40 transition-all duration-300 relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500/0 group-hover/lesson:bg-violet-500/50 transition-all" />
            {isEditing ? (
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                autoFocus
                                value={editingLesson.title}
                                onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-violet-500/20 text-slate-900 dark:text-white transition-all"
                                placeholder="Lesson title"
                            />
                        </div>
                        <div className="flex gap-1.5 px-1">
                            <button onClick={() => updateLesson(mIndex, lIndex)} className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all active:scale-90"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setEditingLesson(null)} className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"><X className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-violet-500/50">
                            <PlayCircle className="w-3.5 h-3.5" />
                        </div>
                        <input
                            value={editingLesson.video_url}
                            onChange={(e) => setEditingLesson({ ...editingLesson, video_url: e.target.value })}
                            className="w-full bg-violet-50/30 dark:bg-violet-500/5 border border-violet-100 dark:border-violet-500/10 rounded-xl px-9 py-2 text-[10px] font-mono outline-none focus:ring-2 focus:ring-violet-500/20 text-violet-600 dark:text-violet-400"
                            placeholder="Paste video URL here..."
                        />
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shrink-0">
                            <PlayCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 pt-0.5">
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">{lesson.title}</p>
                                {lesson.video_url && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-wider border border-emerald-500/20">Link Ready</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                {lesson.video_url ? (
                                    <div className="flex items-center gap-1.5 max-w-full">
                                        <div className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                                        <p className="text-[10px] font-medium font-mono text-violet-500/60 truncate">{lesson.video_url}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                                        <p className="text-[10px] text-rose-500 font-bold italic tracking-tight">Missing video content</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover/lesson:opacity-100 transition-all duration-300 translate-x-2 group-hover/lesson:translate-x-0">
                        <button
                            onClick={() => setEditingLesson({ mIndex, lIndex, title: lesson.title, video_url: lesson.video_url })}
                            className="p-2 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-white dark:hover:bg-white/5 transition-all shadow-none hover:shadow-sm active:scale-90"
                            title="Edit Lesson"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => removeLessonFromModule(mIndex, lIndex)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-white/5 transition-all shadow-none hover:shadow-sm active:scale-90"
                            title="Remove Lesson"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
});
const MemoizedModuleItem = memo(({
    module,
    mIndex,
    activeModuleIndex,
    setActiveModuleIndex,
    editingModule,
    setEditingModule,
    updateModule,
    removeModule,
    lessonInput,
    setLessonInput,
    addLessonToModule,
    editingLesson,
    setEditingLesson,
    updateLesson,
    removeLessonFromModule
}: any) => {
    const isActive = activeModuleIndex === mIndex;
    return (
        <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 overflow-hidden transition-all">
            <div
                className={cn(
                    "p-3.5 flex items-center justify-between cursor-pointer transition-all duration-300",
                    isActive
                        ? "bg-violet-500/5 dark:bg-violet-500/10"
                        : "hover:bg-slate-50 dark:hover:bg-white/2"
                )}
                onClick={() => setActiveModuleIndex(isActive ? null : mIndex)}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-sm shrink-0 border border-violet-100 dark:border-violet-500/20">
                        {mIndex + 1}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                        {editingModule?.index === mIndex ? (
                            <div className="flex items-center gap-2 pr-4">
                                <input
                                    autoFocus
                                    value={editingModule.title}
                                    onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && updateModule(mIndex)}
                                    className="bg-white dark:bg-[#0b0f1a] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-1.5 text-sm font-bold w-full focus:ring-2 focus:ring-violet-500/20 outline-none"
                                />
                                <div className="flex gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); updateModule(mIndex); }} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"><Check className="w-4 h-4" /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setEditingModule(null); }} className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ) : (
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {module.title}
                            </h4>
                        )}
                        <p className="text-[10px] text-slate-500 font-medium">
                            {module.lessons?.length || 0} Lessons
                        </p>
                    </div>
                </div>
                {editingModule?.index !== mIndex && (
                    <div className="flex items-center gap-1.5 pr-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); setEditingModule({ index: mIndex, title: module.title }); }}
                            className="p-2 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-white dark:hover:bg-white/5 transition-all active:scale-90"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); removeModule(mIndex); }}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-white/5 transition-all active:scale-90"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                            isActive
                                ? "text-violet-600 scale-110"
                                : "text-slate-300 dark:text-slate-600"
                        )}>
                            {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                    </div>
                )}
            </div>
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 dark:border-white/5"
                    >
                        <div className="p-4 space-y-3 bg-slate-50/50 dark:bg-black/20">
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    value={lessonInput.title}
                                    onChange={(e) => setLessonInput((prev: any) => ({ ...prev, title: e.target.value }))}
                                    placeholder="Lesson title..."
                                    className={cn(inputClasses, "flex-1 py-1.5 h-10 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white")}
                                />
                                <input
                                    value={lessonInput.video_url}
                                    onChange={(e) => setLessonInput((prev: any) => ({ ...prev, video_url: e.target.value }))}
                                    placeholder="Video URL..."
                                    className={cn(inputClasses, "flex-1 py-1.5 h-10 text-xs font-mono rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-violet-600 dark:text-violet-400")}
                                />
                                <button
                                    type="button"
                                    onClick={() => addLessonToModule(mIndex)}
                                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-sm hover:shadow active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                                </button>
                            </div>
                            <div className="space-y-2">
                                {module.lessons?.map((lesson: any, lIndex: number) => (
                                    <MemoizedLessonItem
                                        key={lIndex}
                                        lesson={lesson}
                                        mIndex={mIndex}
                                        lIndex={lIndex}
                                        editingLesson={editingLesson}
                                        setEditingLesson={setEditingLesson}
                                        updateLesson={updateLesson}
                                        removeLessonFromModule={removeLessonFromModule}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
const MemoizedProjectItem = memo(({ project, index, editIndex, startEditingProject, removeProject }: any) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group/project relative flex items-center gap-4 p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 hover:border-violet-500/30 transition-all"
        >
            <div className="w-24 h-16 shrink-0 relative rounded-lg overflow-hidden bg-slate-100 dark:bg-black/20 border border-slate-200/50 dark:border-white/5">
                {project.image_url ? (
                    <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x200/1e293b/violet?text=LAB'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                        <FolderKanban className="w-6 h-6 opacity-40" />
                    </div>
                )}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-violet-600 text-white text-[7px] font-black uppercase tracking-tighter">
                    Lab {index + 1}
                </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center text-left">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate mb-0.5">{project.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed mb-1.5">{project.description}</p>
                {project.tech_stack && (
                    <div className="flex flex-wrap gap-1">
                        {project.tech_stack.split(',').slice(0, 4).map((tech: string, idx: number) => (
                            <span key={idx} className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 uppercase">
                                {tech.trim()}
                            </span>
                        ))}
                        {project.tech_stack.split(',').length > 4 && (
                            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-violet-500">
                                +{project.tech_stack.split(',').length - 4}more
                            </span>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1.5 px-2 opacity-0 group-hover/project:opacity-100 transition-all">
                <button
                    type="button"
                    onClick={() => startEditingProject(index)}
                    className={cn(
                        "p-2 rounded-lg transition-all active:scale-90",
                        editIndex === index
                            ? "bg-violet-600 text-white"
                            : "bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-violet-600 hover:bg-white dark:hover:bg-white/5"
                    )}
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                    type="button"
                    onClick={() => removeProject(index)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-white/5 transition-all active:scale-90"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
});
export const StepFinalization = ({ formData, setFormData, errors }: StepFinalizationProps) => {
    const [projectInput, setProjectInput] = useState({ title: "", description: "", image_url: "", tech_stack: "" });
    const [moduleTitle, setModuleTitle] = useState("");
    const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(0);
    const [lessonInput, setLessonInput] = useState({ title: "", video_url: "" });
    const [editingModule, setEditingModule] = useState<{ index: number, title: string } | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ mIndex: number, lIndex: number, title: string, video_url: string } | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showProjectList, setShowProjectList] = useState(true);
    const addOrUpdateProject = useCallback(() => {
        if (!projectInput.title.trim()) return;
        setFormData(prev => {
            const projects = prev.projects || [];
            if (editIndex !== null) {
                return {
                    ...prev,
                    projects: projects.map((p, i) => i === editIndex ? projectInput : p)
                };
            }
            return { ...prev, projects: [...projects, projectInput] };
        });
        setEditIndex(null);
        setProjectInput({ title: "", description: "", image_url: "", tech_stack: "" });
        setShowProjectForm(false);
        setShowProjectList(true);
    }, [projectInput, editIndex, setFormData]);
    const removeProject = useCallback((index: number) => {
        setFormData(prev => ({ ...prev, projects: (prev.projects || []).filter((_, i) => i !== index) }));
        if (editIndex === index) {
            setEditIndex(null);
            setProjectInput({ title: "", description: "", image_url: "", tech_stack: "" });
            setShowProjectForm(false);
        }
    }, [editIndex, setFormData]);
    const startEditingProject = useCallback((index: number) => {
        const project = formData.projects?.[index];
        if (project) {
            setProjectInput({
                title: project.title,
                description: project.description || "",
                image_url: project.image_url || "",
                tech_stack: project.tech_stack || ""
            });
            setEditIndex(index);
            setShowProjectForm(true);
            window.scrollTo({ top: 300, behavior: 'smooth' });
        }
    }, [formData.projects]);
    const addModule = useCallback(() => {
        if (!moduleTitle.trim()) return;
        setFormData(prev => ({
            ...prev,
            modules: [...(prev.modules || []), { title: moduleTitle, lessons: [] }]
        }));
        setModuleTitle("");
        setActiveModuleIndex((formData.modules?.length || 0));
    }, [moduleTitle, formData.modules?.length, setFormData]);
    const removeModule = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).filter((_, i) => i !== index)
        }));
        setActiveModuleIndex(null);
    }, [setFormData]);
    const updateModule = useCallback((index: number) => {
        if (!editingModule || !editingModule.title.trim()) return;
        setFormData(prev => ({
            ...prev,
            modules: (prev.modules || []).map((m, i) => i === index ? { ...m, title: editingModule.title } : m)
        }));
        setEditingModule(null);
    }, [editingModule, setFormData]);
    const addLessonToModule = useCallback((mIndex: number) => {
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
    }, [lessonInput, setFormData]);
    const removeLessonFromModule = useCallback((mIndex: number, lIndex: number) => {
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
    }, [setFormData]);
    const updateLesson = useCallback((mIndex: number, lIndex: number) => {
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
    }, [editingLesson, setFormData]);
    return (
        <motion.div
            key="step4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
        >
            <StepHeader
                phase="04"
                title="Finalization"
                highlight="Finalization"
                description="Structure the curriculum and hands-on projects."
                icon={Rocket}
                color="violet"
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-12 space-y-4">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-3">
                                <div className="text-left">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-violet-500" />
                                        Curriculum Modules
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Structure your course into modules and lessons</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <input
                                        value={moduleTitle}
                                        onChange={(e) => setModuleTitle(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addModule()}
                                        placeholder="Add a new module..."
                                        className={cn(inputClasses, "rounded-xl flex-1 sm:w-64 py-1.5 h-10 text-xs bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white")}
                                    />
                                    <button
                                        type="button"
                                        onClick={addModule}
                                        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-[11px] font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Module
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                {!formData.modules?.length ? (
                                    <div className="p-12 rounded-2xl border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-slate-50/50 dark:bg-white/2">
                                        <Layers className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">No modules added yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.modules.map((module, mIndex) => (
                                            <MemoizedModuleItem
                                                key={mIndex}
                                                module={module}
                                                mIndex={mIndex}
                                                activeModuleIndex={activeModuleIndex}
                                                setActiveModuleIndex={setActiveModuleIndex}
                                                editingModule={editingModule}
                                                setEditingModule={setEditingModule}
                                                updateModule={updateModule}
                                                removeModule={removeModule}
                                                lessonInput={lessonInput}
                                                setLessonInput={setLessonInput}
                                                addLessonToModule={addLessonToModule}
                                                editingLesson={editingLesson}
                                                setEditingLesson={setEditingLesson}
                                                updateLesson={updateLesson}
                                                removeLessonFromModule={removeLessonFromModule}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-12 space-y-4">
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950 transition-all">
                        <div className="space-y-3 text-left">
                            <div className="pb-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <FolderKanban className="w-5 h-5 text-violet-500" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Practical Forge</h3>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Add hands-on projects for your students</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowProjectForm(!showProjectForm)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
                                        showProjectForm
                                            ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                                            : "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/20"
                                    )}
                                >
                                    {showProjectForm ? <><X className="w-3.5 h-3.5" /> Close</> : <><Plus className="w-3.5 h-3.5" /> Add Project</>}
                                </button>
                            </div>
                            <AnimatePresence>
                                {showProjectForm && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4 p-5 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-100 dark:border-white/5"
                                    >
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
                                            <input
                                                value={projectInput.title}
                                                onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                                                placeholder="What are they building?"
                                                className="w-full h-10 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Asset URL</label>
                                            <input
                                                value={projectInput.image_url}
                                                onChange={(e) => setProjectInput(prev => ({ ...prev, image_url: e.target.value }))}
                                                placeholder="Thumbnail link (https://...)"
                                                className="w-full h-10 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm font-mono focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Tech Stack <span className="text-[8px] font-normal lowercase opacity-50">(comma separated)</span></label>
                                            <input
                                                value={projectInput.tech_stack}
                                                onChange={(e) => setProjectInput(prev => ({ ...prev, tech_stack: e.target.value }))}
                                                placeholder="React, Next.js, Tailwind, Supabase..."
                                                className="w-full h-10 px-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Project Description</label>
                                            <textarea
                                                value={projectInput.description}
                                                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                                                placeholder="Detail the technical hurdles and final outcome the student will achieve..."
                                                className="w-full h-24 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-sm resize-none focus:ring-2 focus:ring-violet-500/20 outline-none transition-all custom-scrollbar"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex justify-end items-center gap-2 pt-1">
                                            {editIndex !== null && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditIndex(null);
                                                        setProjectInput({ title: "", description: "", image_url: "", tech_stack: "" });
                                                        setShowProjectForm(false);
                                                    }}
                                                    className="h-10 px-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold transition-all hover:bg-slate-200 dark:hover:bg-white/10"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={addOrUpdateProject}
                                                className="h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                <Plus className="w-4 h-4 text-white/80" /> {editIndex !== null ? 'Update Project' : 'Add Project'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="mt-4 border-t border-slate-100 dark:border-white/5 pt-4">
                                <div
                                    onClick={() => setShowProjectList(!showProjectList)}
                                    className="flex items-center justify-between cursor-pointer group/list-header mb-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-bold">
                                            {String(formData.projects?.length || 0).padStart(2, '0')} Projects
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/list-header:text-slate-600 dark:group-hover/list-header:text-slate-300 transition-colors">Managed Labs</span>
                                    </div>
                                    <div className={cn(
                                        "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300",
                                        showProjectList ? "text-violet-500 bg-violet-500/5 rotate-0" : "text-slate-400 bg-slate-50 dark:bg-white/2 rotate-180"
                                    )}>
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <AnimatePresence initial={false}>
                                    {showProjectList && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            {!formData.projects?.length ? (
                                                <div className="py-10 flex flex-col items-center justify-center gap-3 opacity-20 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/1">
                                                    <LayoutGrid className="w-8 h-8 text-slate-500" />
                                                    <p className="text-xs font-medium uppercase tracking-widest">No projects added yet</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
                                                    {formData.projects.map((p, i) => (
                                                        <MemoizedProjectItem
                                                            key={i}
                                                            project={p}
                                                            index={i}
                                                            editIndex={editIndex}
                                                            startEditingProject={startEditingProject}
                                                            removeProject={removeProject}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
