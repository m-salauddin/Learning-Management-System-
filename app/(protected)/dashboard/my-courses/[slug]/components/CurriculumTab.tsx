"use client";
import React, { useState, useMemo } from "react";
import { Check, ChevronDown, Lock, MonitorPlay, FileText, Edit3, HelpCircle, Target } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
    milestones: any[];
    modules: any[];
    completedLessonIds: string[];
    courseSlug: string;
    onFeedback: (mod: any) => void;
}


function isLessonDone(lesson: any, completedSet: Set<string>, moduleId?: string): boolean {
    if (completedSet.has(lesson.id)) return true;

    const modId = lesson.module_id || moduleId;
    if (lesson.lesson_type === 'quiz' && modId && completedSet.has(`assessments-${modId}`)) return true;
    return false;
}


function isModuleFullyDone(mod: any, completedSet: Set<string>): boolean {
    const lessons = mod.lessons || [];
    if (lessons.length === 0) return false;
    return lessons.every((l: any) => isLessonDone(l, completedSet, mod.id));
}

export function CurriculumTab({ milestones, modules, completedLessonIds, courseSlug, onFeedback }: Props) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const toggleModule = (id: string) => {
        setExpandedModules((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
    };

    const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);
    const milestoneList = milestones.length > 0 ? milestones : [{ title: "Course Content", modules, id: "default" }];

    return (
        <div className="divide-y divide-slate-100/80 dark:divide-white/4">
            {milestoneList.map((milestone: any, msIdx: number) => (
                <div key={milestone.id || msIdx}>
                    {milestones.length > 0 && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-linear-to-r from-primary/4 to-transparent border-b border-slate-100 dark:border-white/4">
                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Target className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em]">Milestone {msIdx + 1}</span>
                                <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">{milestone.title}</span>
                            </div>
                        </div>
                    )}

                    <div className="divide-y divide-slate-100/60 dark:divide-white/3">
                        {(milestone.modules || []).map((mod: any, idx: number) => {
                            const lessons = mod.lessons || [];
                            const completedCount = lessons.filter((l: any) => isLessonDone(l, completedSet, mod.id)).length;
                            const totalCount = lessons.length;
                            const modPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                            const modId = mod.id || `${msIdx}-${idx}`;
                            const isExpanded = expandedModules.has(modId);


                            const prevModuleComplete = idx === 0 || (milestone.modules || []).slice(0, idx).every((pm: any) =>
                                isModuleFullyDone(pm, completedSet)
                            );

                            const milestoneAccessible = msIdx === 0 || (() => {
                                const prevMs = milestones[msIdx - 1];
                                if (!prevMs) return true;
                                return (prevMs.modules || []).every((m: any) => isModuleFullyDone(m, completedSet));
                            })();

                            let status: "completed" | "ongoing" | "locked" = "locked";
                            if (totalCount > 0 && completedCount === totalCount) status = "completed";
                            else if (milestoneAccessible && prevModuleComplete) status = "ongoing";
                            else if (completedCount > 0) status = "ongoing";

                            const statusColors = {
                                completed: "border-l-emerald-500",
                                ongoing: "border-l-primary",
                                locked: "border-l-slate-200 dark:border-l-slate-700",
                            };

                            return (
                                <div key={modId} className={cn("border-l-[3px] transition-colors", statusColors[status])}>
                                    <button onClick={() => toggleModule(modId)}
                                        className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/60 dark:hover:bg-white/1.5 transition-colors text-left cursor-pointer">
                                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0",
                                            status === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : status === "ongoing" ? "bg-primary/10 text-primary"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                        )}>
                                            {status === "completed" ? <Check className="w-3.5 h-3.5" />
                                                : status === "locked" ? <Lock className="w-3 h-3" />
                                                    : <span className="tabular-nums">{String(idx + 1).padStart(2, "0")}</span>}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">{mod.title}</span>
                                                <span className={cn("shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                                                    status === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                        : status === "ongoing" ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>
                                                    {status === "completed" ? "Done" : status === "ongoing" ? "Active" : "Locked"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2.5 mt-1.5">
                                                <span className="text-[10px] text-slate-400 tabular-nums font-medium">{completedCount}/{totalCount} lessons</span>
                                                <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full max-w-[100px] overflow-hidden">
                                                    <div className={cn("h-full rounded-full transition-all duration-500", status === "completed" ? "bg-emerald-500" : "bg-primary")}
                                                        style={{ width: `${modPct}%` }} />
                                                </div>
                                                <span className="text-[9px] text-slate-400 tabular-nums font-semibold">{modPct}%</span>
                                            </div>
                                        </div>
                                        <ChevronDown className={cn("w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300", isExpanded && "rotate-180")} />
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="overflow-hidden">
                                                <div className="bg-slate-50/30 dark:bg-white/[0.008] border-t border-slate-100/60 dark:border-white/4">

                                                    {lessons.filter((l: any) => l.lesson_type !== "quiz" && l.lesson_type !== "assignment").map((lesson: any, lIdx: number, filteredArr: any[]) => {
                                                        const isDone = isLessonDone(lesson, completedSet, mod.id);
                                                        const isLessonLocked = status === "locked" || (lIdx > 0 && !filteredArr.slice(0, lIdx).every((prev: any) => isLessonDone(prev, completedSet, mod.id)));
                                                        const TypeIcon = isLessonLocked ? Lock : lesson.lesson_type === "video" ? MonitorPlay : FileText;
                                                        return (
                                                            <Link key={lesson.id} href={isLessonLocked ? "#" : `/dashboard/my-courses/${courseSlug}/${lesson.id}`}
                                                                onClick={(e) => { if (isLessonLocked) { e.preventDefault(); } }}
                                                                className={cn("flex items-center gap-3 px-5 py-2.5 pl-16 hover:bg-slate-100/40 dark:hover:bg-white/2 transition-colors border-b border-slate-100/40 dark:border-white/2 last:border-b-0 group", isDone && "opacity-55", isLessonLocked && "opacity-35 cursor-not-allowed", !isLessonLocked && "cursor-pointer")}>
                                                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                                                    isDone ? "bg-emerald-500" : isLessonLocked ? "border-[1.5px] border-slate-300 dark:border-white/8" : "border-[1.5px] border-slate-200 dark:border-white/12 group-hover:border-primary/40")}>
                                                                    {isDone ? <Check className="w-2.5 h-2.5 text-white" /> : isLessonLocked ? <Lock className="w-2 h-2 text-slate-300 dark:text-slate-600" /> : <span className="text-[8px] text-slate-400 tabular-nums font-semibold">{lIdx + 1}</span>}
                                                                </div>
                                                                <TypeIcon className={cn("w-3.5 h-3.5 shrink-0", isLessonLocked ? "text-slate-300 dark:text-slate-600" : "text-slate-400")} />
                                                                <span className={cn("flex-1 text-[11px] truncate font-medium", isLessonLocked ? "text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300")}>{lesson.title}</span>
                                                                {lesson.duration_minutes > 0 && (
                                                                    <span className="text-[10px] text-slate-400 tabular-nums shrink-0 font-medium">{lesson.duration_minutes}m</span>
                                                                )}
                                                            </Link>
                                                        );
                                                    })}


                                                    {(() => {
                                                        const quizzes = lessons.filter((l: any) => l.lesson_type === "quiz");
                                                        if (quizzes.length === 0) return null;

                                                        const coreLessons = lessons.filter((l: any) => l.lesson_type !== 'quiz' && l.lesson_type !== 'assignment');
                                                        const allCoreDone = coreLessons.length > 0 && coreLessons.every((l: any) => isLessonDone(l, completedSet, mod.id));
                                                        const isQuizLocked = status === "locked" || !allCoreDone;
                                                        const assessmentDone = completedSet.has(`assessments-${mod.id}`);
                                                        const qDone = assessmentDone ? quizzes.length : quizzes.filter((q: any) => completedSet.has(q.id)).length;
                                                        const allDone = qDone === quizzes.length;
                                                        return (
                                                            <div className={cn(
                                                                "border-t border-slate-100/60 dark:border-white/4 flex items-center gap-3 px-5 py-2.5 pl-16",
                                                                isQuizLocked ? "opacity-35" : allDone ? "bg-emerald-50/20 dark:bg-emerald-500/2" : "bg-violet-50/20 dark:bg-violet-500/2"
                                                            )}>
                                                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                                                                    isQuizLocked ? "border-[1.5px] border-slate-300 dark:border-white/8"
                                                                        : allDone ? "bg-emerald-500" : "bg-violet-500/15"
                                                                )}>
                                                                    {isQuizLocked ? <Lock className="w-2 h-2 text-slate-300 dark:text-slate-600" />
                                                                        : allDone ? <Check className="w-2.5 h-2.5 text-white" /> : <HelpCircle className="w-2.5 h-2.5 text-violet-500" />}
                                                                </div>
                                                                <HelpCircle className={cn("w-3.5 h-3.5 shrink-0", isQuizLocked ? "text-slate-300 dark:text-slate-600" : "text-violet-500")} />
                                                                <span className={cn("flex-1 text-[11px] font-bold uppercase tracking-wider",
                                                                    isQuizLocked ? "text-slate-400 dark:text-slate-600" : "text-slate-500 dark:text-slate-400"
                                                                )}>Quizzes</span>
                                                                <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full tabular-nums shrink-0",
                                                                    isQuizLocked ? "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                                        : allDone ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                                                                )}>{qDone}/{quizzes.length}</span>
                                                            </div>
                                                        );
                                                    })()}


                                                    {lessons.filter((l: any) => l.lesson_type === "assignment").map((lesson: any) => {
                                                        const isDone = isLessonDone(lesson, completedSet, mod.id);

                                                        const coreDone = lessons.filter((l: any) => l.lesson_type !== 'assignment').every((l: any) => isLessonDone(l, completedSet, mod.id));
                                                        const isLessonLocked = status === "locked" || !coreDone;
                                                        return (
                                                            <Link key={lesson.id} href={isLessonLocked ? "#" : `/dashboard/my-courses/${courseSlug}/${lesson.id}`}
                                                                onClick={(e) => { if (isLessonLocked) { e.preventDefault(); } }}
                                                                className={cn("flex items-center gap-3 px-5 py-2.5 pl-16 hover:bg-slate-100/40 dark:hover:bg-white/2 transition-colors border-t border-slate-100/40 dark:border-white/2 group", isDone && "opacity-55", isLessonLocked && "opacity-35 cursor-not-allowed", !isLessonLocked && "cursor-pointer")}>
                                                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                                                                    isDone ? "bg-emerald-500" : isLessonLocked ? "border-[1.5px] border-slate-300 dark:border-white/8" : "border-[1.5px] border-slate-200 dark:border-white/12 group-hover:border-primary/40")}>
                                                                    {isDone ? <Check className="w-2.5 h-2.5 text-white" /> : isLessonLocked ? <Lock className="w-2 h-2 text-slate-300 dark:text-slate-600" /> : <Edit3 className="w-2.5 h-2.5 text-slate-400" />}
                                                                </div>
                                                                <Edit3 className={cn("w-3.5 h-3.5 shrink-0", isLessonLocked ? "text-slate-300 dark:text-slate-600" : "text-slate-400")} />
                                                                <span className={cn("flex-1 text-[11px] truncate font-medium", isLessonLocked ? "text-slate-400 dark:text-slate-600" : "text-slate-700 dark:text-slate-300")}>{lesson.title}</span>
                                                            </Link>
                                                        );
                                                    })}


                                                    <div className="flex items-center justify-between px-5 py-2.5 border-t border-slate-100/60 dark:border-white/4 bg-slate-50/20 dark:bg-white/0.5">
                                                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                                                            {lessons.filter((l: any) => l.lesson_type === "video").length > 0 && (
                                                                <span className="flex items-center gap-1"><MonitorPlay className="w-3 h-3" />{lessons.filter((l: any) => l.lesson_type === "video").length} videos</span>
                                                            )}
                                                            {lessons.filter((l: any) => l.lesson_type === "quiz").length > 0 && (
                                                                <span className="flex items-center gap-1"><HelpCircle className="w-3 h-3" />{lessons.filter((l: any) => l.lesson_type === "quiz").length} quizzes</span>
                                                            )}
                                                            {lessons.filter((l: any) => l.lesson_type === "assignment").length > 0 && (
                                                                <span className="flex items-center gap-1"><Edit3 className="w-3 h-3" />{lessons.filter((l: any) => l.lesson_type === "assignment").length} tasks</span>
                                                            )}
                                                        </div>
                                                        <button onClick={(e) => { e.stopPropagation(); onFeedback(mod); }}
                                                            className="text-[10px] text-slate-400 hover:text-primary transition-colors font-semibold cursor-pointer">
                                                            + Feedback
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
