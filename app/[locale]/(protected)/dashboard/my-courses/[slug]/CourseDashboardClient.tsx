"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CoursePageData } from "@/types/course-page";
import { cn } from "@/lib/utils";


import { CourseHeader } from "./components/CourseHeader";
import { ContinueBanner } from "./components/ContinueBanner";
import { CommunityLinks } from "./components/CommunityLinks";
import { CurriculumTab } from "./components/CurriculumTab";
import { AssignmentsTab } from "./components/AssignmentsTab";
import { LeaderboardTab } from "./components/LeaderboardTab";
import { CertificateTab } from "./components/CertificateTab";
import { Sidebar } from "./components/CourseSidebar";
import { FeedbackModal } from "./components/FeedbackModal";

interface CourseDashboardClientProps {
    data: CoursePageData;
}

export default function CourseDashboardClient({ data }: CourseDashboardClientProps) {
    const {
        course,
        modules,
        milestones = [],
        totalLessons,
        userProgress,
        dashboardStats,
        leaderboard: realLeaderboard,
        completedLessonIds = [],
    } = data;

    const [activeTab, setActiveTab] = useState("curriculum");
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedModuleForFeedback, setSelectedModuleForFeedback] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");

    const stats = {
        overallScore: dashboardStats?.overallScore || 0,
        quiz: dashboardStats?.quizScore || 0,
        assignment: dashboardStats?.assignmentScore || 0,
        progress: userProgress || 0,
    };

    const leaderboard = realLeaderboard || [];
    const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);

    const allModulesOrdered = useMemo(() => {
        if (milestones.length > 0) return milestones.flatMap((ms: any) => ms.modules || []);
        return modules;
    }, [milestones, modules]);


    const isLessonDone = (lesson: any, moduleId?: string) => {
        if (completedSet.has(lesson.id)) return true;
        const modId = lesson.module_id || moduleId;
        if (lesson.lesson_type === 'quiz' && modId && completedSet.has(`assessments-${modId}`)) return true;
        return false;
    };


    const allLessonsWithMod = useMemo(() =>
        allModulesOrdered.flatMap((m: any) => (m.lessons || []).map((l: any) => ({ ...l, _modId: m.id }))),
        [allModulesOrdered]
    );
    const completedTotal = useMemo(() => allLessonsWithMod.filter((l: any) => isLessonDone(l, l._modId)).length, [allLessonsWithMod, completedSet]);
    const progressPct = allLessonsWithMod.length > 0 ? Math.round((completedTotal / allLessonsWithMod.length) * 100) : Math.round(userProgress || 0);

    const nextLesson = useMemo(() => {
        for (const mod of allModulesOrdered) {
            for (const lesson of mod.lessons || []) {
                if (!isLessonDone(lesson, mod.id)) return { lesson, module: mod };
            }
        }
        return null;
    }, [allModulesOrdered, completedSet]);

    const allAssignments = useMemo(() => {
        return allModulesOrdered.flatMap((m: any) =>
            (m.lessons || []).filter((l: any) => l.lesson_type === "assignment").map((l: any) => ({ ...l, moduleName: m.title }))
        );
    }, [allModulesOrdered]);

    const tabs = [
        { id: "curriculum", label: "Curriculum", count: allModulesOrdered.length },
        { id: "assignments", label: "Assignments", count: allAssignments.length },
        { id: "leaderboard", label: "Leaderboard", count: leaderboard.length },
        { id: "certificate", label: "Certificate" },
    ];

    return (
        <div className="pb-16">
            <div className="max-w-6xl mx-auto px-4 space-y-5">


                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <CourseHeader
                        course={course}
                        modulesCount={allModulesOrdered.length}
                        totalLessons={allLessonsWithMod.length}
                        completedTotal={completedTotal}
                        progressPct={progressPct}
                    />
                </motion.div>


                <ContinueBanner nextLesson={nextLesson} courseSlug={course.slug} />


                <CommunityLinks facebookUrl={course.community_facebook_url} whatsappUrl={course.community_whatsapp_url} />


                <div className="grid lg:grid-cols-12 gap-5">


                    <div className="lg:col-span-8 space-y-0">

                        <div className="border-b border-slate-200/80 dark:border-white/6 bg-white dark:bg-slate-900/60 rounded-t-2xl">
                            <div className="flex items-center overflow-x-auto px-1">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "relative flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold transition-colors whitespace-nowrap cursor-pointer",
                                                isActive ? "text-slate-900 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                            )}
                                        >
                                            {tab.label}
                                            {tab.count !== undefined && tab.count > 0 && (
                                                <span className={cn(
                                                    "text-[9px] tabular-nums px-1.5 py-0.5 rounded-md leading-none font-bold",
                                                    isActive ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                                )}>{tab.count}</span>
                                            )}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="courseDashTab"
                                                    className="absolute bottom-0 inset-x-2 h-[2px] bg-primary rounded-full"
                                                    transition={{ type: "spring", bounce: 0.15, duration: 0.45 }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>


                        <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/6 border-t-0 rounded-b-2xl overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    {activeTab === "curriculum" && (
                                        <CurriculumTab
                                            milestones={milestones}
                                            modules={modules}
                                            completedLessonIds={completedLessonIds}
                                            courseSlug={course.slug}
                                            onFeedback={(mod) => { setSelectedModuleForFeedback(mod); setIsFeedbackOpen(true); }}
                                        />
                                    )}
                                    {activeTab === "assignments" && (
                                        <AssignmentsTab assignments={allAssignments} completedLessonIds={completedLessonIds} courseSlug={course.slug} />
                                    )}
                                    {activeTab === "leaderboard" && (
                                        <LeaderboardTab leaderboard={leaderboard} />
                                    )}
                                    {activeTab === "certificate" && (
                                        <CertificateTab userProgress={userProgress} progressPct={progressPct} completedTotal={completedTotal} totalLessons={totalLessons} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>


                    <div className="lg:col-span-4">
                        <Sidebar
                            stats={stats}
                            progressPct={progressPct}
                            completedTotal={completedTotal}
                            totalLessons={totalLessons}
                            leaderboard={leaderboard}
                            onSeeAll={() => setActiveTab("leaderboard")}
                        />
                    </div>
                </div>
            </div>


            <FeedbackModal
                isOpen={isFeedbackOpen}
                module={selectedModuleForFeedback}
                rating={rating}
                hoverRating={hoverRating}
                feedbackText={feedbackText}
                onClose={() => setIsFeedbackOpen(false)}
                onRatingChange={setRating}
                onHoverChange={setHoverRating}
                onTextChange={setFeedbackText}
                onSubmit={() => { setIsFeedbackOpen(false); setRating(0); setFeedbackText(""); }}
            />
        </div>
    );
}
