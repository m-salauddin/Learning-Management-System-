"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Play, CheckCircle2, Lock, X, ChevronRight, ChevronDown, Edit3, ShieldCheck, Search, BookOpen, Layers
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlayerSidebarProps {
    course: any;
    currentLesson: any;
    allLessons: any[];
    lessonProgress: Record<string, boolean>;
    lessonsWithStatus: { id: string; isCompleted: boolean; isLocked: boolean }[];
    hasAccess: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    isCinematic: boolean;
    onError: (msg: string) => void;
}

export function PlayerSidebar({
    course, currentLesson, allLessons, lessonProgress, lessonsWithStatus,
    hasAccess, sidebarOpen, setSidebarOpen, isCinematic, onError
}: PlayerSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const currentMilestoneId = course.milestones?.find((ms: any) =>
        ms.modules?.some((mod: any) => mod.id === currentLesson.module_id)
    )?.id || 'default';

    const [expandedModules, setExpandedModules] = useState<string[]>([currentLesson.module_id]);
    const [expandedMilestones, setExpandedMilestones] = useState<string[]>([currentMilestoneId]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev =>
            prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
        );
    };

    const toggleMilestone = (msId: string) => {
        setExpandedMilestones(prev =>
            prev.includes(msId) ? prev.filter(id => id !== msId) : [...prev, msId]
        );
    };

    const progressPercent = useMemo(() => {
        const completed = allLessons.filter((l: any) => lessonProgress[l.id]).length;
        return Math.round((completed / (allLessons.length || 1)) * 100);
    }, [lessonProgress, allLessons]);

    const milestones = course.milestones && course.milestones.length > 0
        ? course.milestones
        : [{ id: 'default', title: "Curriculum Plan", modules: course.modules || [] }];

    // Per-milestone progress
    const getMilestoneProgress = (ms: any) => {
        // Count only items that appear in the navigation (exclude quiz-type lessons, include assessment virtual)
        const items: { id: string }[] = [];
        (ms.modules || []).forEach((mod: any) => {
            (mod.lessons || []).filter((l: any) => l.lesson_type !== 'quiz').forEach((l: any) => items.push({ id: l.id }));
            if ((mod.quizzes || []).length > 0) items.push({ id: `assessments-${mod.id}` });
        });
        const done = items.filter((l) => lessonProgress[l.id]).length;
        return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
    };

    // Check if milestone contains current lesson
    const isMilestoneActive = (ms: any) =>
        (ms.modules || []).some((mod: any) => mod.id === currentLesson.module_id);

    // Accent colors per milestone (cycles through a curated palette)
    const ACCENT_PALETTE = [
        { bg: "bg-violet-500", light: "bg-violet-50 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", ring: "ring-violet-500/20", bar: "bg-violet-500" },
        { bg: "bg-sky-500", light: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", ring: "ring-sky-500/20", bar: "bg-sky-500" },
        { bg: "bg-amber-500", light: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/20", bar: "bg-amber-500" },
        { bg: "bg-rose-500", light: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/20", bar: "bg-rose-500" },
        { bg: "bg-emerald-500", light: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/20", bar: "bg-emerald-500" },
        { bg: "bg-indigo-500", light: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-600 dark:text-indigo-400", ring: "ring-indigo-500/20", bar: "bg-indigo-500" },
    ];

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-[340px] bg-white dark:bg-[#060a14] border-r border-slate-200/80 dark:border-white/4 transform transition-all duration-300 ease-out lg:relative lg:translate-x-0",
                !sidebarOpen && "-translate-x-full lg:hidden",
                isCinematic && "lg:-translate-x-full lg:w-0 lg:opacity-0 lg:hidden"
            )}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="h-14 px-5 border-b border-slate-100 dark:border-white/4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                            Course Navigator
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-400 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-2.5 border-b border-slate-100/80 dark:border-white/4">
                    <div className="relative group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within/search:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search lessons..."
                            className="w-full bg-slate-50 dark:bg-white/3 border border-slate-200/80 dark:border-white/6 rounded-xl py-2 pl-9 pr-4 text-[11px] font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-3 h-3 text-slate-400" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 py-2.5 flex items-center gap-3 border-b border-slate-100/80 dark:border-white/4">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Progress</span>
                            <span className="text-[11px] font-extrabold text-primary tabular-nums">{progressPercent}%</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-slate-100 dark:bg-white/4 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 tabular-nums whitespace-nowrap">
                        {allLessons.filter((l: any) => lessonProgress[l.id]).length}/{allLessons.length}
                    </div>
                </div>

                {/* ─── Milestone Listing ─── */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                    {milestones
                        .filter((ms: any) => {
                            if (!searchQuery) return true;
                            const q = searchQuery.toLowerCase();
                            return ms.title.toLowerCase().includes(q) ||
                                ms.modules?.some((mod: any) =>
                                    mod.title.toLowerCase().includes(q) ||
                                    mod.lessons?.some((less: any) => less.title.toLowerCase().includes(q))
                                );
                        })
                        .map((milestone: any, msIdx: number) => {
                            const isMsExpanded = expandedMilestones.includes(milestone.id || 'default') || !!searchQuery;
                            const isActive = isMilestoneActive(milestone);
                            const prog = getMilestoneProgress(milestone);
                            const accent = ACCENT_PALETTE[msIdx % ACCENT_PALETTE.length];
                            const isComplete = prog.pct === 100 && prog.total > 0;

                            return (
                                <div key={milestone.id || msIdx} className="group/ms">
                                    {/* ── Milestone Card ── */}
                                    <button
                                        onClick={() => toggleMilestone(milestone.id || 'default')}
                                        className={cn(
                                            "w-full rounded-xl p-3 transition-all duration-200 text-left relative overflow-hidden border",
                                            isActive
                                                ? "bg-primary/4 border-primary/15 shadow-sm"
                                                : isMsExpanded
                                                    ? "bg-slate-50/80 dark:bg-white/3 border-slate-200/60 dark:border-white/6"
                                                    : "bg-white dark:bg-white/2 border-slate-200/40 dark:border-white/4 hover:border-slate-300/60 dark:hover:border-white/8 hover:shadow-sm"
                                        )}
                                    >
                                        {/* Left accent stripe */}
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl transition-all", isActive ? "bg-primary" : isComplete ? "bg-emerald-500" : accent.bar, !isMsExpanded && "opacity-0 group-hover/ms:opacity-100")} style={isMsExpanded ? { opacity: 1 } : undefined} />

                                        <div className="flex items-start gap-3 pl-1.5">
                                            {/* Phase number badge */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-extrabold transition-all",
                                                isActive
                                                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                                                    : isComplete
                                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                        : `${accent.light} ${accent.text}`
                                            )}>
                                                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : String(msIdx + 1).padStart(2, '0')}
                                            </div>

                                            {/* Title + meta */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className={cn(
                                                    "text-[11px] font-bold leading-snug transition-colors",
                                                    isActive ? "text-primary" : "text-slate-700 dark:text-slate-200"
                                                )}>
                                                    {milestone.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                                                        <Layers className="w-2.5 h-2.5" />
                                                        {milestone.modules?.length || 0} modules
                                                    </span>
                                                    <span className="text-slate-200 dark:text-white/10">·</span>
                                                    <span className={cn(
                                                        "text-[9px] font-bold tabular-nums",
                                                        isComplete ? "text-emerald-500" : isActive ? "text-primary" : "text-slate-400"
                                                    )}>
                                                        {prog.done}/{prog.total}
                                                    </span>
                                                </div>
                                                {/* Mini progress bar */}
                                                <div className="mt-2 h-[3px] w-full rounded-full bg-slate-100 dark:bg-white/4 overflow-hidden">
                                                    <motion.div
                                                        className={cn("h-full rounded-full", isComplete ? "bg-emerald-500" : isActive ? "bg-primary" : accent.bar)}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${prog.pct}%` }}
                                                        transition={{ duration: 0.6, ease: "easeOut", delay: msIdx * 0.05 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Chevron */}
                                            <div className={cn(
                                                "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all mt-0.5",
                                                isMsExpanded ? "bg-slate-100 dark:bg-white/5" : "bg-transparent"
                                            )}>
                                                <ChevronDown className={cn(
                                                    "w-3.5 h-3.5 text-slate-400 transition-transform duration-300",
                                                    isMsExpanded ? "rotate-180 text-primary" : ""
                                                )} />
                                            </div>
                                        </div>
                                    </button>

                                    {/* ── Expanded modules ── */}
                                    <AnimatePresence initial={false}>
                                        {isMsExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-1 mt-1.5 pl-2">
                                                    {milestone.modules?.filter((mod: any) => {
                                                        if (!searchQuery) return true;
                                                        const q = searchQuery.toLowerCase();
                                                        return mod.title.toLowerCase().includes(q) ||
                                                            mod.lessons?.some((less: any) => less.title.toLowerCase().includes(q));
                                                    }).map((module: any, modIdx: number) => {
                                                        const isExpanded = expandedModules.includes(module.id) || !!searchQuery;
                                                        const isCurrentModule = module.id === currentLesson.module_id;
                                                        // Build module items matching navigation: non-quiz lessons + assessment virtual
                                                        const moduleItems: { id: string }[] = [];
                                                        (module.lessons || []).filter((l: any) => l.lesson_type !== 'quiz').forEach((l: any) => moduleItems.push({ id: l.id }));
                                                        if ((module.quizzes || []).length > 0) moduleItems.push({ id: `assessments-${module.id}` });
                                                        const moduleLessons = module.lessons || [];
                                                        const completedCount = moduleItems.filter((l) => lessonProgress[l.id]).length;
                                                        const modComplete = completedCount === moduleItems.length && moduleItems.length > 0;

                                                        return (
                                                            <div key={module.id} className="space-y-0.5">
                                                                <button
                                                                    onClick={() => toggleModule(module.id)}
                                                                    className={cn(
                                                                        "w-full flex items-center gap-2.5 p-2 rounded-lg transition-all group/mod",
                                                                        isCurrentModule
                                                                            ? "bg-white dark:bg-white/4 shadow-sm border border-slate-200/60 dark:border-white/6"
                                                                            : "hover:bg-white dark:hover:bg-white/3 border border-transparent"
                                                                    )}
                                                                >
                                                                    <div className={cn(
                                                                        "w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[9px] font-extrabold transition-all",
                                                                        isCurrentModule
                                                                            ? "bg-primary text-white shadow-sm shadow-primary/25"
                                                                            : modComplete
                                                                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500"
                                                                                : "bg-slate-100 dark:bg-white/5 text-slate-400 group-hover/mod:text-primary"
                                                                    )}>
                                                                        {modComplete ? <CheckCircle2 className="w-3 h-3" /> : String(modIdx + 1).padStart(2, '0')}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1 text-left">
                                                                        <h4 className={cn(
                                                                            "text-[10.5px] font-semibold leading-tight truncate",
                                                                            isCurrentModule ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                                                                        )}>
                                                                            {module.title}
                                                                        </h4>
                                                                        <span className="text-[8.5px] font-medium text-slate-400 dark:text-slate-600">
                                                                            {completedCount}/{moduleItems.length} lessons
                                                                        </span>
                                                                    </div>
                                                                    <ChevronRight className={cn(
                                                                        "w-3 h-3 text-slate-300 transition-transform duration-200",
                                                                        isExpanded && "rotate-90 text-primary"
                                                                    )} />
                                                                </button>

                                                                <AnimatePresence initial={false}>
                                                                    {isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="pl-4 pr-1 py-1 space-y-0.5 ml-3 border-l-2 border-slate-100 dark:border-white/4">
                                                                                {renderLessonItems(module, moduleLessons, searchQuery, course, currentLesson, lessonsWithStatus, hasAccess, lessonProgress, onError)}
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                </div>
            </div>
        </aside>
    );
}

function renderLessonItems(
    module: any, lessons: any[], searchQuery: string, course: any,
    currentLesson: any, lessonsWithStatus: any[], hasAccess: boolean,
    lessonProgress: Record<string, boolean>, onError: (msg: string) => void
) {
    const filteredLessons = lessons.filter((less: any) => {
        if (!searchQuery) return true;
        return less.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const quizzes = filteredLessons.filter((l: any) => l.lesson_type === 'quiz');
    const processedItems: any[] = [];
    let quizGroupAdded = false;

    filteredLessons.forEach((lesson: any) => {
        if (lesson.lesson_type === 'quiz') {
            if (!quizGroupAdded && quizzes.length > 0) {
                processedItems.push({ type: 'assessment_group', items: quizzes });
                quizGroupAdded = true;
            }
        } else {
            processedItems.push({ type: 'single', item: lesson });
        }
    });

    return processedItems.map((group, groupIdx) => {
        if (group.type === 'assessment_group') {
            const assessmentId = `assessments-${module.id}`;
            const isGroupActive = currentLesson.id === assessmentId
                || (currentLesson.lesson_type === 'quiz' && currentLesson.module_id === module.id)
                || (currentLesson.lesson_type === 'assessment_center' && currentLesson.module_id === module.id);
            const assessmentStatus = lessonsWithStatus.find((l: any) => l.id === assessmentId);
            const isCompleted = assessmentStatus?.isCompleted || lessonProgress[assessmentId] || false;
            const isLocked = !hasAccess || (assessmentStatus?.isLocked ?? false);
            return (
                <Link key={`group-${groupIdx}`} href={isLocked ? "#" : `/dashboard/my-courses/${course.slug}/assessments-${module.id}`}
                    onClick={(e) => { if (isLocked) { e.preventDefault(); onError("Complete previous lessons first."); } }}
                    className={cn("flex items-center gap-2.5 p-2 rounded-lg transition-all group/assess relative",
                        isGroupActive
                            ? "bg-primary/6 border border-primary/15"
                            : isLocked
                                ? "opacity-40 border border-transparent"
                                : "hover:bg-slate-50 dark:hover:bg-white/2 border border-transparent"
                    )}>
                    <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0",
                        isGroupActive
                            ? "bg-primary text-white"
                            : isCompleted
                                ? "text-emerald-500"
                                : isLocked
                                    ? "text-slate-300 dark:text-slate-600"
                                    : "text-violet-500"
                    )}>{isCompleted ? <CheckCircle2 className="w-3 h-3" /> : isLocked ? <Lock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}</div>
                    <div className="min-w-0 flex-1">
                        <p className={cn("text-[10.5px] font-semibold truncate",
                            isGroupActive
                                ? "text-primary font-bold"
                                : isLocked
                                    ? "text-slate-400"
                                    : "text-slate-600 dark:text-slate-400 group-hover/assess:text-slate-900 dark:group-hover/assess:text-white"
                        )}>Assessment · {group.items.length} quizzes</p>
                    </div>
                    {isGroupActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--primary),0.6)]" />}
                </Link>
            );
        }

        const lesson = group.item;
        const isActive = lesson.id === currentLesson.id;
        const statusData = lessonsWithStatus.find((l: any) => l.id === lesson.id);
        const isCompleted = statusData?.isCompleted;
        const isLocked = (!hasAccess || statusData?.isLocked) && !lesson.is_free_preview;
        let LessonIcon = Play, iconColor = "text-slate-500";
        if (isCompleted) { LessonIcon = CheckCircle2; iconColor = "text-emerald-500"; }
        else if (isLocked) { LessonIcon = Lock; iconColor = "text-slate-300 dark:text-slate-600"; }
        else if (lesson.lesson_type === 'assignment') { LessonIcon = Edit3; iconColor = "text-blue-500"; }

        return (
            <Link key={lesson.id} href={isLocked ? "#" : `/dashboard/my-courses/${course.slug}/${lesson.id}`}
                onClick={(e) => { if (isLocked) { e.preventDefault(); onError("Complete previous lessons first."); } }}
                className={cn("flex items-center gap-2.5 p-2 rounded-lg transition-all group/lesson relative",
                    isActive ? "bg-primary/6 border border-primary/15" : isLocked ? "opacity-40 border border-transparent" : "hover:bg-slate-50 dark:hover:bg-white/2 border border-transparent"
                )}>
                <div className={cn("w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all", isActive && "scale-110")}>
                    <LessonIcon className={cn("w-3.5 h-3.5", isActive ? "text-primary" : iconColor)} />
                </div>
                <p className={cn("text-[10.5px] font-semibold truncate flex-1",
                    isActive ? "text-primary font-bold" : isLocked ? "text-slate-400" : "text-slate-600 dark:text-slate-400 group-hover/lesson:text-slate-900 dark:group-hover/lesson:text-white"
                )}>{lesson.title}</p>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--primary),0.6)]" />}
            </Link>
        );
    });
}
