"use client";

import { useState } from "react";
import { 
    Play, 
    BookOpen as BookOpenIcon, 
    ChevronRight, 
    Star, 
    FileText, 
    Video, 
    HelpCircle,
    Trophy,
    MessageCircle,
    Facebook,
    Lock,
    X,
    User,
    Check,
    CheckCircle2,
    MonitorPlay,
    Edit3,
    MoreVertical,
    MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CoursePageData } from "@/types/course-page";
import { cn } from "@/lib/utils";

interface CourseDashboardClientProps {
    data: CoursePageData;
}

export default function CourseDashboardClient({ data }: CourseDashboardClientProps) {
    const { course, modules, milestones = [], totalLessons, userProgress, dashboardStats, leaderboard: realLeaderboard, completedLessonIds = [] } = data;
    const [activeTab, setActiveTab] = useState("modules");
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedModuleForFeedback, setSelectedModuleForFeedback] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");

    const handleFeedbackClick = (module: any) => {
        setSelectedModuleForFeedback(module);
        setIsFeedbackOpen(true);
    };

    const stats = {
        overallScore: dashboardStats?.overallScore || 0,
        quiz: dashboardStats?.quizScore || 0,
        assignment: dashboardStats?.assignmentScore || 0,
        progress: userProgress || 0
    };

    const leaderboard = realLeaderboard || [];
    const currentUser = leaderboard.find(s => s.isCurrentUser);

    const getProgressStatus = (progress: number) => {
        if (progress === 0) return {
            title: "Ready to start?",
            message: "Click on the first module to begin your learning journey!"
        };
        if (progress < 25) return {
            title: "Off to a good start!",
            message: "You're just beginning. Keep up the momentum!"
        };
        if (progress < 50) return {
            title: "You're doing great!",
            message: "Consistency is key. You're almost halfway there!"
        };
        if (progress < 75) return {
            title: "Superb Progress!",
            message: "Building strong habits. Keep going, you're doing amazing."
        };
        if (progress < 100) return {
            title: "Almost there!",
            message: "Just a few more modules to complete. Finish strong!"
        };
        return {
            title: "Mission Accomplished!",
            message: "Congratulations! You've completed the course. Check your certificate!"
        };
    };

    const progressStatus = getProgressStatus(userProgress);

    const currentModule = modules.find(m => {
        const moduleLessons = m.lessons || [];
        return moduleLessons.some(l => !completedLessonIds.includes(l.id));
    }) || modules[0];

    return (
        <div className="pb-10 selection:bg-primary/30">
            <div className="max-w-7xl mx-auto px-4 mb-5">
                <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-2xl p-3 md:p-5 flex flex-col md:flex-row items-center gap-5 shadow-xl">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-60" />
                    <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
                    
                    <div className="relative z-10 w-full md:w-36 aspect-16/10 rounded-xl overflow-hidden shadow-xl ring-1 ring-white/10 group cursor-pointer shrink-0">
                        <img 
                            src={course.thumbnail_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"} 
                            alt={course.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="eager"
                        />
                    </div>

                    <div className="relative z-10 flex-1 space-y-2 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-0.5">
                                <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md uppercase tracking-[0.2em]">
                                    Batch {course.batch_no || 1}
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/5 border border-emerald-500/10 rounded-md">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                        Active
                                    </span>
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                                {course.title}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1.5 border-t border-slate-300 dark:border-white/5">
                            {[
                                { icon: BookOpenIcon, label: `${modules.length} Modules` },
                                { icon: CheckCircle2, label: `${totalLessons} Lessons` },
                                { icon: Trophy, label: `Support` },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <item.icon className="w-3 h-3 text-primary/70" />
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 pb-8 pt-0">
                <div className="grid lg:grid-cols-12 gap-5">
                    <div className="lg:col-span-8 space-y-5">
                        <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/80 backdrop-blur-md border border-slate-300 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-5 shadow-lg group">
                            <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-transparent to-transparent opacity-30 group-hover:opacity-50 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center justify-center bg-white/5 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white rounded-xl w-16 h-16 shadow-2xl border border-white/20 shrink-0 ring-1 ring-white/10 group-hover:bg-white/10 transition-all">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] leading-none opacity-40 mb-1">MOD</span>
                                <span className="text-2xl font-black leading-none">{currentModule?.position === 0 ? 1 : (currentModule?.position || 1)}</span>
                            </div>
                            <div className="relative z-10 flex-1 space-y-2 text-center md:text-left">
                                <div className="space-y-0.5">
                                    <h3 className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Next Objective</h3>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight truncate max-w-xs">{currentModule?.title}</h2>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <div className="flex-1 h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden max-w-[120px]">
                                        <div 
                                            className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                                            style={{ 
                                                width: `${currentModule?.lessons?.length ? (currentModule.lessons.filter(l => completedLessonIds.includes(l.id)).length / currentModule.lessons.length) * 100 : 0}%` 
                                            }}
                                        />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-500 tabular-nums">
                                        {currentModule?.lessons?.filter(l => completedLessonIds.includes(l.id)).length || 0}/{currentModule?.lessons?.length || 0}
                                    </span>
                                </div>
                            </div>
                            <Link 
                                href={`/dashboard/my-courses/${course.slug}/${currentModule?.lessons?.[0]?.id || ''}`}
                                className="relative z-10 px-4 h-9 bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-900 dark:hover:bg-slate-100 transition-all flex items-center gap-2 shrink-0 shadow-lg"
                            >
                                Resume
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {(course.community_facebook_url || course.community_whatsapp_url) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {course.community_facebook_url && (
                                    <a href={course.community_facebook_url} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                <Facebook className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Facebook Group</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Join Community</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </a>
                                )}

                                {course.community_whatsapp_url && (
                                    <a href={course.community_whatsapp_url} target="_blank" rel="noopener noreferrer" className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                                <MessageCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">WhatsApp Group</h3>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Live Support</p>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </a>
                                )}
                            </div>
                        )}


                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/40 border border-slate-300 dark:border-white/5 rounded-xl w-full md:w-fit shadow-inner">
                            {[
                                { id: "modules", label: "Curriculum" },
                                { id: "assignments", label: "Assignments" },
                                { id: "certificate", label: "Certificates" },
                            ].map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "relative flex-1 md:flex-none px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 z-10",
                                            isActive 
                                                ? "text-white dark:text-slate-950" 
                                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeDashboardTab"
                                                className="absolute inset-0 bg-slate-950 dark:bg-white rounded-lg shadow-lg shadow-black/10"
                                                transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content with Animation */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === "modules" && (
                                    <div className="space-y-12 pb-20">
                                        {(milestones.length > 0 ? milestones : [{ title: "Course Content", modules: modules }]).map((milestone: any, msIdx: number) => (
                                            <div key={milestone.id || msIdx} className="space-y-6">
                                                {milestones.length > 0 && (
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-px flex-1 bg-slate-300 dark:bg-white/5" />
                                                        <div className="flex flex-col items-center gap-1 group">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                                                                    <Trophy className="w-5 h-5" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-1">Milestone {msIdx + 1}</h3>
                                                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{milestone.title}</h2>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="h-px flex-1 bg-slate-300 dark:bg-white/5" />
                                                    </div>
                                                )}

                                                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                                                    {milestone.modules.map((mod: any, idx: number) => {
                                                        const moduleLessons = mod.lessons || [];
                                                        const completedCount = moduleLessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
                                                        const totalCount = moduleLessons.length;
                                                        
                                                        let status: 'completed' | 'ongoing' | 'upcoming' = 'upcoming';
                                                        if (totalCount > 0 && completedCount === totalCount) {
                                                            status = 'completed';
                                                        } else if (completedCount > 0) {
                                                            status = 'ongoing';
                                                        } else {
                                                            // For milestone-based modules, logic for 'ongoing' might need to check previous modules in previous milestones too
                                                            status = 'upcoming'; 
                                                            // Simplified for now: if it's the first module and nothing is completed, it's ongoing
                                                            if (msIdx === 0 && idx === 0 && completedCount === 0) status = 'ongoing';
                                                        }

                                                        return (
                                                            <ModuleCard 
                                                                key={mod.id} 
                                                                module={mod} 
                                                                index={idx + 1} 
                                                                courseSlug={course.slug} 
                                                                status={status}
                                                                completedCount={completedCount}
                                                                totalCount={totalCount}
                                                                completedLessonIds={completedLessonIds}
                                                                onFeedbackClick={handleFeedbackClick} 
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "assignments" && (
                                    <div className="grid gap-4 pb-20 mt-8">
                                        {modules.flatMap(m => m.lessons.filter(l => l.lesson_type === 'assignment')).length > 0 ? (
                                            modules.flatMap(m => m.lessons.filter(l => l.lesson_type === 'assignment')).map((assignment, idx) => (
                                                <div key={assignment.id} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-6 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                                            <FileText className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignment {idx + 1}</span>
                                                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">{assignment.title}</h4>
                                                            <p className="text-[10px] font-bold text-slate-500 mt-1">Status: {completedLessonIds.includes(assignment.id) ? 'Completed' : 'Pending'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Marks</span>
                                                            <span className={cn(
                                                                "text-xs font-black uppercase",
                                                                completedLessonIds.includes(assignment.id) ? "text-emerald-500" : "text-amber-500"
                                                            )}>
                                                                {completedLessonIds.includes(assignment.id) ? "N/A" : "Pending"}
                                                            </span>
                                                        </div>
                                                        <Link 
                                                            href={`/dashboard/my-courses/${course.slug}/${assignment.id}`}
                                                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all"
                                                        >
                                                            {completedLessonIds.includes(assignment.id) ? "Review" : "Submit"}
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-12 text-center">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No assignments found for this course.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === "certificate" && (
                                    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-12 text-center space-y-6 mt-8">
                                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto border-4 border-slate-100 dark:border-white/5 relative">
                                            <Trophy className="w-12 h-12 text-slate-300" />
                                            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Certificate Locked</h3>
                                            <p className="text-xs font-bold text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                                                You need to complete 100% of the lessons and pass the final exam to unlock your certificate.
                                            </p>
                                        </div>
                                        <div className="pt-4">
                                            <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
                                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${userProgress}%` }} />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-widest">{userProgress}% COMPLETED</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4 space-y-5">
                        {/* Progress Dashboard Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-2xl p-5 lg:p-6 shadow-xl space-y-6 sticky top-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] opacity-60">Status Dashboard</h3>
                                <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </div>

                            <div className="p-4 bg-slate-100 dark:bg-slate-950/40 rounded-xl border border-slate-300 dark:border-white/10 flex gap-4 group items-center">
                                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shrink-0 shadow-lg ring-2 ring-white/5 overflow-hidden border border-slate-300 dark:border-white/10">
                                    {currentUser?.avatar ? (
                                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    ) : (
                                        <User className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">{progressStatus.title}</p>
                                    <p className="text-[9px] font-bold text-slate-500 leading-tight italic">
                                        "{progressStatus.message}"
                                    </p>
                                </div>
                            </div>

                            {/* Main Progress Bar */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-0.5">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Mastery</span>
                                        <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Combined Score</h4>
                                    </div>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{(stats.overallScore || 0).toFixed(1)}%</span>
                                </div>
                                <div className="h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-300 dark:border-white/5 p-0.5">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats.overallScore || 0}%` }}
                                        transition={{ duration: 2, ease: "circOut" }}
                                        className="h-full bg-emerald-500 rounded-full relative" 
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shine" />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <CircularStat value={parseFloat(stats.quiz.toFixed(1))} label="Quizzes" color="text-primary" />
                                <CircularStat value={parseFloat(stats.assignment.toFixed(1))} label="Tasks" color="text-emerald-500" />
                            </div>

                            {/* Leaderboard Section */}
                            <div className="pt-6 border-t border-slate-300 dark:border-white/10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                        <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Rankings</h4>
                                    </div>
                                    <button className="text-[8px] font-black text-slate-500 hover:text-primary transition-colors uppercase tracking-widest border border-slate-300 dark:border-white/10 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-white/5">View all</button>
                                </div>
                                <div className="space-y-1.5">
                                    {leaderboard.map((student) => (
                                        <div 
                                            key={student.id} 
                                            className={cn(
                                                "flex items-center p-2 rounded-xl border border-transparent transition-all",
                                                student.isCurrentUser 
                                                    ? "bg-primary/5 border-primary/10" 
                                                    : "hover:bg-slate-100 dark:hover:bg-white/5"
                                            )}
                                        >
                                            <div className="w-6 text-[10px] font-black text-slate-400 text-center">
                                                {student.rank}
                                            </div>
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-white/10 mx-3 bg-slate-100 shrink-0 flex items-center justify-center">
                                                {student.avatar ? (
                                                    <Image src={student.avatar} alt={student.name} width={32} height={32} className="object-cover w-full h-full" />
                                                ) : (
                                                    <User className="w-4 h-4 text-slate-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-tighter truncate",
                                                    student.isCurrentUser ? "text-primary" : "text-slate-900 dark:text-white"
                                                )}>{student.name || 'Student'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-900 dark:text-white">{(student.score || 0).toFixed(1)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <AnimatePresence>
                {isFeedbackOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFeedbackOpen(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 border border-white/10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Module Feedback</h3>
                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                            {selectedModuleForFeedback?.title}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsFeedbackOpen(false)}
                                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-5">
                                    {/* Rating */}
                                    <div className="text-center space-y-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rate your experience</p>
                                        <div className="flex items-center justify-center gap-1.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button 
                                                    key={star} 
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                    className="transition-all active:scale-90"
                                                >
                                                    <Star className={cn(
                                                        "w-7 h-7 transition-all duration-200",
                                                        (hoverRating || rating) >= star 
                                                            ? "text-yellow-500 scale-110 shadow-lg shadow-yellow-500/20" 
                                                            : "text-slate-200 dark:text-slate-800"
                                                    )} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Textarea */}
                                    <div className="space-y-2">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Share your thoughts</p>
                                        <textarea 
                                            value={feedbackText}
                                            onChange={(e) => setFeedbackText(e.target.value)}
                                            placeholder="What did you learn? Any suggestions?"
                                            className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none"
                                        />
                                    </div>

                                    <button 
                                        onClick={() => {
                                            // Handle submit logic here
                                            setIsFeedbackOpen(false);
                                            setRating(0);
                                            setFeedbackText("");
                                        }}
                                        className="w-full py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                                    >
                                        Submit Feedback
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ModuleCard({ 
    module, 
    index, 
    courseSlug, 
    status,
    completedCount,
    totalCount,
    completedLessonIds,
    onFeedbackClick 
}: { 
    module: any; 
    index: number; 
    courseSlug: string; 
    status: 'completed' | 'ongoing' | 'upcoming';
    completedCount: number;
    totalCount: number;
    completedLessonIds: string[];
    onFeedbackClick: (module: any) => void 
}) {
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const videoCount = module.lessons?.filter((l: any) => l.lesson_type === 'video').length || 0;
    const assignmentCount = module.lessons?.filter((l: any) => l.lesson_type === 'assignment').length || 0;
    const quizCount = module.lessons?.filter((l: any) => l.lesson_type === 'quiz').length || 0;

    return (
        <motion.div 
            className={cn(
                "group relative bg-white dark:bg-slate-900/60 border rounded-[2rem] p-6 transition-all duration-500",
                status === 'ongoing' 
                    ? "border-primary/20 shadow-xl shadow-primary/5 ring-1 ring-primary/10" 
                    : "border-slate-200 dark:border-white/5 shadow-sm hover:shadow-2xl"
            )}
        >
            <div className="relative z-10 flex flex-col h-full space-y-5">
                {/* Header structure */}
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-14 h-14 shrink-0 border border-slate-300 dark:border-white/10 shadow-inner overflow-hidden transition-all duration-500">
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">MOD</span>
                        <span className="text-2xl font-black leading-none">{index}</span>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div className={cn(
                                "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.15em] border inline-flex items-center gap-1.5",
                                status === 'completed' 
                                    ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/30" 
                                    : status === 'ongoing'
                                        ? "bg-primary/5 text-primary border-primary/10"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-white/10"
                            )}>
                                <div className={cn(
                                    "w-1 h-1 rounded-full",
                                    status === 'completed' ? "bg-emerald-500 animate-pulse" : status === 'ongoing' ? "bg-primary animate-pulse" : "bg-slate-400"
                                )} />
                                {status}
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className={cn(
                                    "text-[10px] font-black tracking-tight",
                                    progress === 100 ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {completedCount}/{totalCount} Items
                                </span>
                                <HelpCircle className="w-3 h-3 text-slate-400 opacity-50 cursor-pointer" />
                            </div>
                        </div>

                        {/* Segmented Progress Bar */}
                        <div className="h-3 flex gap-0.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800/50 p-0.5 border border-slate-200 dark:border-white/5">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={cn(
                                    "h-full rounded-full relative",
                                    progress === 100 ? "bg-emerald-500" : "bg-primary"
                                )}
                            />
                            {progress < 100 && (
                                <div className="flex-1 bg-rose-500/10 dark:bg-rose-500/5 rounded-full" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-12 transition-colors">
                    {module.title}
                </h4>

                {/* Meta Info Row */}
                <div className="flex flex-wrap items-center gap-2">
                    {/* Video Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/5 dark:bg-blue-400/10 border border-blue-500/30 dark:border-blue-400/20 rounded-lg">
                        <MonitorPlay className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                        <span className="text-[8px] font-black text-blue-600/70 dark:text-blue-400/70 uppercase tracking-widest">Videos</span>
                        <div className="w-px h-2.5 bg-blue-500/20 mx-0.5" />
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-300 tabular-nums">{videoCount}</span>
                    </div>

                    {/* Quiz Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/5 dark:bg-amber-400/10 border border-amber-500/30 dark:border-amber-400/20 rounded-lg">
                        <HelpCircle className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                        <span className="text-[8px] font-black text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest">Quizzes</span>
                        <div className="w-px h-2.5 bg-amber-500/20 mx-0.5" />
                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-300 tabular-nums">{quizCount}</span>
                    </div>

                    {/* Task Badge */}
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 dark:bg-emerald-400/10 border border-emerald-500/30 dark:border-emerald-400/20 rounded-lg">
                        <Edit3 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-[8px] font-black text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest">Tasks</span>
                        <div className="w-px h-2.5 bg-emerald-500/20 mx-0.5" />
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-300 tabular-nums">{assignmentCount}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                    <button 
                        onClick={() => onFeedbackClick(module)}
                        className="flex items-center gap-2 px-5 h-9 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold hover:bg-amber-500/25 transition-all active:scale-95 border border-amber-500/20"
                        title="Give Feedback"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Feedback
                    </button>
                    <Link 
                        href={`/dashboard/my-courses/${courseSlug}/${module.lessons?.[0]?.id || ''}`}
                        className="flex items-center gap-2 px-5 h-9 rounded-lg bg-blue-600/15 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-600/25 transition-all active:scale-[0.98] border border-blue-600/20"
                    >
                        Explore
                        <Play className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function CircularStat({ value, label, color }: { value: number; label: string; color: string }) {
    const circumference = 125.6; // 2 * Math.PI * 20
    return (
        <div className="flex flex-col items-center gap-2.5 p-3 rounded-2xl border border-slate-300 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/20 transition-all">
            <div className="relative w-16 h-16">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-white/5" />
                    <motion.circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="transparent" 
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={cn("transition-all duration-700", color)} 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{value}%</span>
                </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-none">{label}</span>
        </div>
    );
}
