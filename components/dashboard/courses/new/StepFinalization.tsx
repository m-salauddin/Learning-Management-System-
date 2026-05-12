"use client";
import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Rocket, FolderKanban, Plus, X, LayoutGrid, PlayCircle, Layers, 
    ChevronDown, ChevronUp, Check, Pencil, Trash2, Brain, ClipboardList, 
    Flag, GripVertical, Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseMarkdown } from "@/lib/markdown-parser";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput, CurriculumMilestone, CurriculumModule, CurriculumItem, CurriculumItemType } from "@/types/lms";
import { StepHeader } from "./StepHeader";

interface StepFinalizationProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    errors: Record<string, string>;
}


const ItemTypeMeta = {
    lesson: { icon: PlayCircle, color: "text-violet-500", bg: "bg-violet-500/10", label: "Lesson" },
    quiz: { icon: Brain, color: "text-amber-500", bg: "bg-amber-500/10", label: "Quiz" },
    assignment: { icon: ClipboardList, color: "text-blue-500", bg: "bg-blue-500/10", label: "Task" }
};

const MemoizedCurriculumItem = memo((props: { 
    item: CurriculumItem; 
    onEdit: () => void; 
    onDelete: () => void;
}) => {
    const { 
        item,  
        onEdit, 
        onDelete 
    } = props;
    const Meta = ItemTypeMeta[item.type];
    return (
        <motion.div 
            layout
            className="group/item flex items-center justify-between p-2.5 rounded-xl border border-slate-300 dark:border-white/5 bg-white dark:bg-slate-900/60 hover:border-violet-500/50 transition-all duration-300"
        >
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", Meta.bg)}>
                    <Meta.icon className={cn("w-4 h-4", Meta.color)} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate pr-2">{item.title}</p>
                    <div className="flex items-center gap-2">
                        <span className={cn("text-[8px] font-black uppercase tracking-wider", Meta.color)}>{Meta.label}</span>
                        {item.video_url && <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />}
                        {item.video_url && <span className="text-[9px] font-mono text-slate-500/60 truncate max-w-[120px]">{item.video_url}</span>}
                        {item.type === 'quiz' && item.options && item.options.length > 0 && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/10" />
                                <span className="text-[9px] font-mono text-slate-500/60">{item.options.length} OPTIONS</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <button type="button" onClick={onEdit} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-violet-500 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={onDelete} className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-rose-500 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    );
});



export const StepFinalization = ({ formData, setFormData, errors }: StepFinalizationProps) => {
    const milestones = formData.milestones || [];
    const [activeMilestone, setActiveMilestone] = useState<number | null>(0);
    const [activeModule, setActiveModule] = useState<number | null>(0);
    const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]); 

    const toggleGroup = (moduleIdx: number, type: string) => {
        const key = `${moduleIdx}-${type}`;
        setCollapsedGroups(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const isGroupExpanded = (moduleIdx: number, type: string) => {
        return !collapsedGroups.includes(`${moduleIdx}-${type}`);
    };
    
    const [editingState, setEditingState] = useState<{type: 'milestone' | 'module' | 'item', index: number, value?: string} | null>(null);
    const [showMilestoneForm, setShowMilestoneForm] = useState(false);
    const [milestoneTitle, setMilestoneTitle] = useState("");
    
    const [newItem, setNewItem] = useState<{title: string, type: CurriculumItemType, video_url: string, options: string[], correct_answer: number, content: string}>({
        title: "", type: "lesson", video_url: "", options: ["", "", "", ""], correct_answer: 0, content: ""
    });
    const [assignmentTab, setAssignmentTab] = useState<'write'|'preview'>('write');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resizeTextarea = (el: HTMLTextAreaElement | null) => {
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    
    const textareaCallbackRef = useCallback((el: HTMLTextAreaElement | null) => {
        (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el;
        resizeTextarea(el);
    }, []);

    
    useEffect(() => {
        resizeTextarea(textareaRef.current);
    }, [newItem.content]);

    const selectedMilestone = activeMilestone !== null ? milestones[activeMilestone] : null;
    const selectedModule = (selectedMilestone && activeModule !== null) ? selectedMilestone.modules[activeModule] : null;

    const addMilestone = useCallback(() => {
        if (!milestoneTitle.trim()) return;
        setFormData(prev => ({
            ...prev,
            milestones: [...(prev.milestones || []), { title: milestoneTitle, modules: [] }]
        }));
        setMilestoneTitle("");
        setShowMilestoneForm(false);
        const newIndex = milestones.length;
        setActiveMilestone(newIndex);
        setActiveModule(null);
    }, [milestoneTitle, milestones.length, setFormData]);

    const deleteMilestone = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            milestones: (prev.milestones || []).filter((_, i) => i !== index)
        }));
        if (activeMilestone === index) {
            setActiveMilestone(null);
            setActiveModule(null);
        }
    }, [activeMilestone, setFormData]);

    const addModule = useCallback(() => {
        if (activeMilestone === null) return;
        setFormData(prev => {
            const newMilestones = (prev.milestones || []).map((m, i) => 
                i === activeMilestone 
                    ? { ...m, modules: [...m.modules, { title: "New Module", items: [] }] } 
                    : m
            );
            return { ...prev, milestones: newMilestones };
        });
        const mIndex = milestones[activeMilestone].modules.length;
        setActiveModule(mIndex);
        setEditingState({ type: 'module', index: mIndex, value: "New Module" });
    }, [activeMilestone, milestones, setFormData]);

    const deleteModule = useCallback((mIndex: number) => {
        if (activeMilestone === null) return;
        setFormData(prev => {
            const newMilestones = (prev.milestones || []).map((m, i) => 
                i === activeMilestone 
                    ? { ...m, modules: m.modules.filter((_, mi) => mi !== mIndex) } 
                    : m
            );
            return { ...prev, milestones: newMilestones };
        });
        if (activeModule === mIndex) setActiveModule(null);
    }, [activeMilestone, activeModule, setFormData]);

    const addItem = useCallback(() => {
        if (activeMilestone === null || activeModule === null || !newItem.title) return;
        
        const itemPayload = {
            title: newItem.title,
            type: newItem.type,
            ...(newItem.type === 'lesson' && { video_url: newItem.video_url }),
            ...(newItem.type === 'assignment' && {
                content: newItem.content
            }),
            ...(newItem.type === 'quiz' && { 
                options: newItem.options.filter(o => o.trim() !== ''),
                correct_answer: Math.min(newItem.correct_answer, newItem.options.filter(o => o.trim() !== '').length - 1 || 0)
            })
        };

        setFormData(prev => {
            const newMilestones = (prev.milestones || []).map((m, i) => 
                i === activeMilestone 
                    ? {
                        ...m, 
                        modules: m.modules.map((mod, mi) => 
                            mi === activeModule 
                                ? { ...mod, items: [...mod.items, itemPayload as any] } 
                                : mod
                        )
                    } 
                    : m
            );
            return { ...prev, milestones: newMilestones };
        });
        setNewItem({ title: "", type: "lesson", video_url: "", options: ["", "", "", ""], correct_answer: 0, content: "" });
        setAssignmentTab('write');
    }, [activeMilestone, activeModule, newItem, setFormData]);

    const saveAssetEdit = useCallback(() => {
        if (activeMilestone === null || activeModule === null || !editingState || editingState.type !== 'item' || !newItem.title) return;
        
        const itemPayload = {
            title: newItem.title,
            type: newItem.type,
            ...(newItem.type === 'lesson' && { video_url: newItem.video_url }),
            ...(newItem.type === 'assignment' && { content: newItem.content }),
            ...(newItem.type === 'quiz' && { 
                options: newItem.options.filter(o => o.trim() !== ''),
                correct_answer: Math.min(newItem.correct_answer, newItem.options.filter(o => o.trim() !== '').length - 1 || 0)
            })
        };

        setFormData(prev => {
            const newMilestones = (prev.milestones || []).map((m, i) => 
                i === activeMilestone 
                    ? {
                        ...m, 
                        modules: m.modules.map((mod, mi) => 
                            mi === activeModule 
                                ? { ...mod, items: mod.items.map((it, idx) => idx === editingState.index ? itemPayload as any : it) } 
                                : mod
                        )
                    } 
                    : m
            );
            return { ...prev, milestones: newMilestones };
        });
        setEditingState(null);
        setNewItem({ title: "", type: "lesson", video_url: "", options: ["", "", "", ""], correct_answer: 0, content: "" });
        setAssignmentTab('write');
    }, [activeMilestone, activeModule, editingState, newItem, setFormData]);

    const cancelAssetEdit = useCallback(() => {
        setEditingState(null);
        setNewItem({ title: "", type: "lesson", video_url: "", options: ["", "", "", ""], correct_answer: 0, content: "" });
        setAssignmentTab('write');
    }, []);

    const deleteItem = useCallback((iIndex: number) => {
        if (activeMilestone === null || activeModule === null) return;
        setFormData(prev => {
            const newMilestones = (prev.milestones || []).map((m, i) => 
                i === activeMilestone 
                    ? {
                        ...m, 
                        modules: m.modules.map((mod, mi) => 
                            mi === activeModule 
                                ? { ...mod, items: mod.items.filter((_, ii) => ii !== iIndex) } 
                                : mod
                        )
                    } 
                    : m
            );
            return { ...prev, milestones: newMilestones };
        });
    }, [activeMilestone, activeModule, setFormData]);

    const saveRename = useCallback(() => {
        if (!editingState) return;
        if ((editingState.type === 'milestone' || editingState.type === 'module') && (!editingState.value || !editingState.value.trim())) return;

        setFormData(prev => {
            const newMilestones = (prev.milestones || []).map((m, i) => {
                if (editingState.type === 'milestone' && i === editingState.index) {
                    return { ...m, title: editingState.value! };
                }
                if (activeMilestone === i && (editingState.type === 'module' || editingState.type === 'item')) {
                    return {
                        ...m,
                        modules: m.modules.map((mod, mi) => {
                            if (editingState.type === 'module' && mi === editingState.index) {
                                return { ...mod, title: editingState.value! };
                            }
                            return mod;
                        })
                    };
                }
                return m;
            });
            return { ...prev, milestones: newMilestones };
        });
        setEditingState(null);
    }, [activeMilestone, activeModule, editingState, setFormData]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <StepHeader
                phase="04" title="Curriculum Design" highlight="Architecture"
                description="Structure your course with Milestones, Modules, and Lessons."
                icon={Rocket} color="violet"
            />

            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                            <Flag className="w-4.5 h-4.5 text-violet-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-violet-500 dark:text-violet-400">Curriculum Builder</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Construct the milestone-driven learning path for your students.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowMilestoneForm(!showMilestoneForm)}
                        className={cn(
                            "h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                            showMilestoneForm 
                                ? "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10" 
                                : "bg-violet-600 text-white hover:bg-violet-700"
                        )}
                    >
                        {showMilestoneForm ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Plus className="w-3.5 h-3.5" /> Add Milestone</>}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {showMilestoneForm && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="p-4 rounded-2xl bg-violet-600/5 border border-dashed border-violet-500/30 space-y-3 mb-4">
                                <label className={cn(labelClasses, "text-violet-600 dark:text-violet-400")}>New Milestone</label>
                                <div className="flex gap-2">
                                    <input 
                                        autoFocus value={milestoneTitle} onChange={e => setMilestoneTitle(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addMilestone()}
                                        placeholder="e.g. Phase 1: Foundations" className={cn(inputClasses, "h-11 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                    />
                                    <button onClick={addMilestone} className="px-6 h-11 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all">Add</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3">
                    {milestones.length === 0 ? (
                        <div className="py-14 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white/5 text-slate-400/50">
                            <Layers className="w-10 h-10 text-violet-500/40" />
                            <p className="text-[10px] font-black uppercase tracking-[0.25em]">No Milestones Created</p>
                        </div>
                    ) : (
                        milestones.map((ms, index) => (
                            <div key={index} className={cn(
                                "rounded-2xl border transition-all overflow-hidden",
                                activeMilestone === index ? "border-violet-500 bg-slate-50/50 dark:bg-slate-900/40" : "border-slate-300 dark:border-white/5 bg-white dark:bg-slate-950 hover:border-violet-500/50"
                            )}>
                                {}
                                <div 
                                    className="p-4 flex items-center justify-between cursor-pointer group"
                                    onClick={() => { setActiveMilestone(activeMilestone === index ? null : index); setActiveModule(null); }}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors", activeMilestone === index ? "bg-violet-500 text-white" : "bg-violet-500/10 text-violet-500")}>
                                            <Flag className="w-4 h-4" />
                                        </div>
                                        {editingState?.type === 'milestone' && editingState.index === index ? (
                                            <div className="flex items-center gap-2 flex-1 max-w-sm" onClick={e => e.stopPropagation()}>
                                                <input 
                                                    autoFocus value={editingState.value} onChange={e => setEditingState({...editingState, value: e.target.value})}
                                                    onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditingState(null); }}
                                                    className={cn(inputClasses, "h-9 text-sm focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                />
                                                <button onClick={saveRename} className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/20"><Check className="w-4 h-4" /></button>
                                                <button onClick={() => setEditingState(null)} className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500/20"><X className="w-4 h-4" /></button>
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <p className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">{ms.title}</p>
                                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{ms.modules.length} MODULES</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!editingState && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                                                <button onClick={(e) => { e.stopPropagation(); setEditingState({type: 'milestone', index, value: ms.title}); }} className="p-2 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-500/10"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); deleteMilestone(index); }} className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        )}
                                        <div className={cn("w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center transition-transform", activeMilestone === index && "rotate-180 bg-violet-500/10 border-violet-500/30 text-violet-500")}>
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {}
                                <AnimatePresence>
                                    {activeMilestone === index && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                            <div className="p-4 pt-0 border-t border-slate-300 dark:border-white/5 mt-2 space-y-4 pb-6">
                                                
                                                <div className="flex justify-end pt-2">
                                                    <button onClick={addModule} className="h-8 px-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                                                        <Plus className="w-3.5 h-3.5" /> Add Module
                                                    </button>
                                                </div>

                                                <div className="space-y-3">
                                                    {ms.modules.length === 0 ? (
                                                        <div className="py-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border border-dashed rounded-xl border-slate-200 dark:border-white/10">No modules in this milestone</div>
                                                    ) : ms.modules.map((mod, modIndex) => (
                                                        <div key={modIndex} className="rounded-xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-slate-950/50 overflow-hidden">
                                                            {}
                                                            <div 
                                                                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 group transition-colors"
                                                                onClick={() => setActiveModule(activeModule === modIndex ? null : modIndex)}
                                                            >
                                                                <div className="flex items-center gap-3 pr-4 flex-1">
                                                                    <div className="w-6 h-6 rounded bg-slate-200 dark:bg-white/10 flex items-center justify-center">
                                                                        <Layers className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                                                                    </div>
                                                                    {editingState?.type === 'module' && editingState.index === modIndex ? (
                                                                        <div className="flex items-center gap-2 flex-1 max-w-sm" onClick={e => e.stopPropagation()}>
                                                                            <input 
                                                                                autoFocus value={editingState.value} onChange={e => setEditingState({...editingState, value: e.target.value})}
                                                                                onKeyDown={e => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setEditingState(null); }}
                                                                                className={cn(inputClasses, "h-8 text-xs focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                                            />
                                                                            <button onClick={saveRename} className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><Check className="w-3.5 h-3.5" /></button>
                                                                        </div>
                                                                    ) : (
                                                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">{mod.title}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 shrink-0">
                                                                    <div className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-[9px] font-black tracking-widest text-slate-500">
                                                                        {mod.items.length} ASSETS
                                                                    </div>
                                                                    {!editingState && (
                                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <button onClick={(e) => { e.stopPropagation(); setEditingState({type: 'module', index: modIndex, value: mod.title}); }} className="p-1.5 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10"><Pencil className="w-3.5 h-3.5" /></button>
                                                                            <button onClick={(e) => { e.stopPropagation(); deleteModule(modIndex); }} className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                                                                        </div>
                                                                    )}
                                                                    <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", activeModule === modIndex && "rotate-180")} />
                                                                </div>
                                                            </div>

                                                            {}
                                                            <AnimatePresence>
                                                                {activeModule === modIndex && (
                                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-slate-50/50 dark:bg-slate-900/80 border-t border-slate-300 dark:border-white/5">
                                                                    <div className="p-4 space-y-4">
                                                                        {}
                                                                        <div className="p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-white/10">
                                                                                <div className="flex p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-white/5 mb-4 max-w-fit">
                                                                                    {(['lesson', 'quiz', 'assignment'] as const).map(type => {
                                                                                        const Meta = ItemTypeMeta[type];
                                                                                        const isActive = newItem.type === type;
                                                                                        return (
                                                                                            <button
                                                                                                key={type} 
                                                                                                type="button" 
                                                                                                onClick={() => setNewItem({...newItem, type})}
                                                                                                className={cn(
                                                                                                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                                                                                    isActive 
                                                                                                        ? "text-white" 
                                                                                                        : "text-slate-500 hover:text-slate-700 dark:text-indigo-100/40 dark:hover:text-white"
                                                                                                )}
                                                                                            >
                                                                                                {isActive && (
                                                                                                    <motion.div
                                                                                                        layoutId="asset-type-pill"
                                                                                                        className="absolute inset-0 bg-violet-600 rounded-lg"
                                                                                                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                                                                                                    />
                                                                                                )}
                                                                                                <Meta.icon className={cn("w-3.5 h-3.5 relative z-10", isActive ? "text-white" : Meta.color)} />
                                                                                                <span className="relative z-10">{type}</span>
                                                                                            </button>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                                <div className="flex flex-col gap-2">
                                                                                    <div className="flex items-start gap-2">
                                                                                        <div className="flex-1">
                                                                                            <input
                                                                                                value={newItem.title}
                                                                                                onChange={e => setNewItem({...newItem, title: e.target.value})}
                                                                                                className={cn(inputClasses, "w-full h-9 text-xs focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                                                                placeholder={editingState?.type === 'item' ? `Edit ${newItem.type} content...` : `New ${newItem.type} title...`}
                                                                                            />
                                                                                        </div>
                                                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                                                            {editingState?.type === 'item' ? (
                                                                                                <>
                                                                                                    <button 
                                                                                                        type="button" disabled={!newItem.title} onClick={saveAssetEdit}
                                                                                                        className="w-9 h-9 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
                                                                                                    >
                                                                                                        <Check className="w-4 h-4" />
                                                                                                    </button>
                                                                                                    <button 
                                                                                                        type="button" onClick={cancelAssetEdit}
                                                                                                        className="w-9 h-9 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all flex items-center justify-center shrink-0"
                                                                                                    >
                                                                                                        <X className="w-4 h-4" />
                                                                                                    </button>
                                                                                                </>
                                                                                            ) : (
                                                                                                <button 
                                                                                                    type="button" disabled={!newItem.title} onClick={addItem}
                                                                                                    className="px-4 h-9 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
                                                                                                >
                                                                                                    <Plus className="w-4 h-4" />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <AnimatePresence mode="wait" initial={false}>
                                                                                        <motion.div
                                                                                            key={newItem.type}
                                                                                            initial={{ opacity: 0, y: -8 }}
                                                                                            animate={{ opacity: 1, y: 0 }}
                                                                                            exit={{ opacity: 0, y: -8 }}
                                                                                            transition={{ duration: 0.2, ease: "easeOut" }}
                                                                                            className="space-y-2"
                                                                                        >
                                                                                    {newItem.type === 'lesson' && (
                                                                                        <input
                                                                                            value={newItem.video_url}
                                                                                            onChange={e => setNewItem({...newItem, video_url: e.target.value})}
                                                                                            className={cn(inputClasses, "w-full h-9 text-[10px] font-mono focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                                                            placeholder="Video URL (Vimeo/YouTube)..."
                                                                                        />
                                                                                    )}
                                                                                    {newItem.type === 'assignment' && (
                                                                                        <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/10">
                                                                                            <div className="flex items-center justify-between mb-2">
                                                                                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assignment Instructions</label>
                                                                                                  <div className="relative flex bg-slate-200 dark:bg-white/5 rounded-lg p-1 border border-slate-300 dark:border-white/5 max-w-fit">
                                                                                                    {(['write', 'preview'] as const).map(tab => (
                                                                                                        <button
                                                                                                            key={tab}
                                                                                                            type="button"
                                                                                                            onClick={() => setAssignmentTab(tab)}
                                                                                                            className={cn(
                                                                                                                "relative px-4 py-1 text-[10px] rounded-md font-bold transition-colors z-10 capitalize",
                                                                                                                assignmentTab === tab
                                                                                                                    ? "text-slate-900 dark:text-white"
                                                                                                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                                                                                            )}
                                                                                                        >
                                                                                                            {assignmentTab === tab && (
                                                                                                                <motion.div
                                                                                                                    layoutId="md-tab-pill"
                                                                                                                    className="absolute inset-0 bg-white dark:bg-slate-950 rounded-md -z-10"
                                                                                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                                                                                                                />
                                                                                                            )}
                                                                                                            {tab}
                                                                                                        </button>
                                                                                                    ))}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="relative overflow-hidden">
                                                                                                <AnimatePresence mode="wait" initial={false}>
                                                                                                    {assignmentTab === 'write' ? (
                                                                                                        <motion.div
                                                                                                            key="write"
                                                                                                            initial={{ opacity: 0, x: -8 }}
                                                                                                            animate={{ opacity: 1, x: 0 }}
                                                                                                            exit={{ opacity: 0, x: -8 }}
                                                                                                            transition={{ duration: 0.18, ease: 'easeOut' }}
                                                                                                        >
                                                                                                            <textarea
                                                                                                                ref={textareaCallbackRef}
                                                                                                                value={newItem.content}
                                                                                                                onChange={e => setNewItem({...newItem, content: e.target.value})}
                                                                                                                className={cn(inputClasses, "w-full min-h-[120px] text-xs resize-none overflow-hidden focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                                                                                placeholder="Write assignment instructions using Markdown (# Heading, **bold**, etc)..."
                                                                                                            />
                                                                                                        </motion.div>
                                                                                                    ) : (
                                                                                                        <motion.div
                                                                                                            key="preview"
                                                                                                            initial={{ opacity: 0, x: 8 }}
                                                                                                            animate={{ opacity: 1, x: 0 }}
                                                                                                            exit={{ opacity: 0, x: 8 }}
                                                                                                            transition={{ duration: 0.18, ease: 'easeOut' }}
                                                                                                            className="w-full min-h-[120px] p-3 text-xs bg-white dark:bg-slate-950 rounded-xl border border-slate-300 dark:border-white/10 prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                                                                                                        >
                                                                                                            {newItem.content ? (
                                                                                                                <div dangerouslySetInnerHTML={{ __html: parseMarkdown(newItem.content) }} />
                                                                                                            ) : (
                                                                                                                <span className="opacity-50 italic">Nothing to preview. Start writing...</span>
                                                                                                            )}
                                                                                                        </motion.div>
                                                                                                    )}
                                                                                                </AnimatePresence>
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                    {newItem.type === 'quiz' && (
                                                                                        <div className="space-y-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-300 dark:border-white/10">
                                                                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Quiz Options & Correct Answer</label>
                                                                                            {newItem.options.map((opt, i) => (
                                                                                                <div key={i} className="flex items-center gap-2">
                                                                                                    <button 
                                                                                                        type="button"
                                                                                                        onClick={() => setNewItem({...newItem, correct_answer: i})}
                                                                                                        className={cn("w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors", newItem.correct_answer === i ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-slate-300 dark:border-white/20 bg-white dark:bg-slate-900")}
                                                                                                    >
                                                                                                        {newItem.correct_answer === i && <Check className="w-3 h-3" />}
                                                                                                    </button>
                                                                                                    <input
                                                                                                        value={opt}
                                                                                                        onChange={e => {
                                                                                                            const newOptions = [...newItem.options];
                                                                                                            newOptions[i] = e.target.value;
                                                                                                            setNewItem({...newItem, options: newOptions});
                                                                                                        }}
                                                                                                        className={cn(inputClasses, "w-full h-8 text-[11px] bg-white dark:bg-slate-950 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20")}
                                                                                                        placeholder={`Option ${i + 1}...`}
                                                                                                    />
                                                                                                    {newItem.options.length > 2 && (
                                                                                                        <button type="button" onClick={() => {
                                                                                                            const newOptions = newItem.options.filter((_, idx) => idx !== i);
                                                                                                            const newCorrect = newItem.correct_answer === i ? 0 : (newItem.correct_answer > i ? newItem.correct_answer - 1 : newItem.correct_answer);
                                                                                                            setNewItem({...newItem, options: newOptions, correct_answer: newCorrect});
                                                                                                        }} className="w-7 h-7 rounded-md border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-500/10 dark:hover:border-rose-500/30 flex items-center justify-center shrink-0 transition-all mx-1">
                                                                                                            <X className="w-3.5 h-3.5" />
                                                                                                        </button>
                                                                                                    )}
                                                                                                </div>
                                                                                            ))}
                                                                                            <button type="button" onClick={() => setNewItem({...newItem, options: [...newItem.options, ""]})} className="text-[10px] font-bold text-violet-500 hover:text-violet-600 flex items-center gap-1 mt-2 mx-1 transition-colors">
                                                                                                <Plus className="w-3 h-3" /> Add Option
                                                                                            </button>
                                                                                        </div>
                                                                                        )}
                                                                                    </motion.div>
                                                                                </AnimatePresence>
                                                                            </div>
                                                                        </div>


                                                                            {}
                                                                            {mod.items.length > 0 && (
                                                                                <motion.div layout="position" className="border-t border-slate-200 dark:border-white/5 pt-4 space-y-2">
                                                                                    {(['lesson', 'assignment', 'quiz'] as const).map((type) => {
                                                                                        const itemsOfType = mod.items
                                                                                            .map((it, idx) => ({ it, idx }))
                                                                                            .filter(x => x.it.type === type);
                                                                                        
                                                                                        if (itemsOfType.length === 0) return null;

                                                                                        const isExpanded = isGroupExpanded(modIndex, type);
                                                                                        const Meta = ItemTypeMeta[type];
                                                                                        
                                                                                        return (
                                                                                            <div key={type} className="border border-slate-300 dark:border-white/10 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-black/40">
                                                                                                {}
                                                                                                <button 
                                                                                                    onClick={() => toggleGroup(modIndex, type)}
                                                                                                    className={cn(
                                                                                                        "w-full flex items-center justify-between px-3 py-2 transition-all duration-200",
                                                                                                        isExpanded ? "bg-white dark:bg-white/5 border-b border-slate-200 dark:border-white/5" : "hover:bg-slate-100 dark:hover:bg-white/10"
                                                                                                    )}
                                                                                                >
                                                                                                    <div className="flex items-center gap-2.5">
                                                                                                        <div className={cn("p-1.5 rounded-lg", Meta.bg)}>
                                                                                                            <Meta.icon className={cn("w-3.5 h-3.5", Meta.color)} />
                                                                                                        </div>
                                                                                                        <div className="flex items-center gap-2">
                                                                                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                                                                                                {type === 'assignment' ? 'Tasks' : (type === 'lesson' ? 'Lessons' : 'Quizzes')}
                                                                                                            </span>
                                                                                                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-200/50 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                                                                                                                {itemsOfType.length}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className={cn(
                                                                                                        "transition-transform duration-300",
                                                                                                        isExpanded ? "rotate-180" : "rotate-0"
                                                                                                    )}>
                                                                                                        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                                                                                    </div>
                                                                                                </button>
                                                                                                
                                                                                                {}
                                                                                                <AnimatePresence initial={false}>
                                                                                                    {isExpanded && (
                                                                                                        <motion.div
                                                                                                            initial={{ height: 0, opacity: 0 }}
                                                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                                                            exit={{ height: 0, opacity: 0 }}
                                                                                                            transition={{ duration: 0.2, ease: "circOut" }}
                                                                                                        >
                                                                                                            <div className="p-2 space-y-1.5">
                                                                                                                {itemsOfType.map(({ it, idx }) => (
                                                                                                                    <MemoizedCurriculumItem 
                                                                                                                        key={idx} item={it}
                                                                                                                        onEdit={() => {
                                                                                                                            setEditingState({type: 'item', index: idx});
                                                                                                                            setNewItem({
                                                                                                                                title: it.title,
                                                                                                                                type: it.type,
                                                                                                                                video_url: it.video_url || "",
                                                                                                                                options: it.options && it.options.length > 0 ? it.options : ["", "", "", ""],
                                                                                                                                correct_answer: it.correct_answer || 0,
                                                                                                                                content: it.content || ""
                                                                                                                            });
                                                                                                                            if (it.type === 'assignment') setAssignmentTab('write');
                                                                                                                        }}
                                                                                                                        onDelete={() => deleteItem(idx)}
                                                                                                                    />
                                                                                                                ))}
                                                                                                            </div>
                                                                                                        </motion.div>
                                                                                                    )}
                                                                                                </AnimatePresence>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </motion.div>
                                                                            )}

                                                                    </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
};
