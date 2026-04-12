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
    CheckCircle2,
    Calendar,
    ArrowRight,
    Users,
    Facebook,
    MessageCircle,
    Lock,
    X
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
    const { course, modules, totalLessons, userProgress } = data;
    const [activeTab, setActiveTab] = useState("modules");
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedModuleForFeedback, setSelectedModuleForFeedback] = useState<any>(null);

    const handleFeedbackClick = (module: any) => {
        setSelectedModuleForFeedback(module);
        setIsFeedbackOpen(true);
    };

    const stats = {
        overallScore: 60.5,
        quiz: 71.9,
        assignment: 50,
        progress: userProgress || 0
    };

    const leaderboard = [
        { id: 1, name: "Shuvo Chandra Debnath", score: 60.5, avatar: "https://i.pravatar.cc/150?u=shuvo", isCurrentUser: true, rank: 75 },
        { id: 2, name: "Md. Tausif Jafar", score: 100, avatar: "https://i.pravatar.cc/150?u=tausif", rank: 1 },
        { id: 3, name: "Mohammad Rafid Amin", score: 100, avatar: "https://i.pravatar.cc/150?u=rafid", rank: 2 },
        { id: 4, name: "Muhtasim Billah Sabit", score: 100, avatar: "https://i.pravatar.cc/150?u=sabit", rank: 3 },
    ];

    const currentModule = modules.find(m => m.position === 14) || modules[0];

    return (
        <div className="pb-10 selection:bg-primary/30">
            {/* Header / Top Info */}
            <div className="max-w-7xl mx-auto px-2 mb-5">
                <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-32 aspect-video rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10 shrink-0 bg-slate-100 dark:bg-slate-800">
                            <img 
                                src={course.thumbnail_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"} 
                                alt={course.title} 
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <h1 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">
                                {course.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black text-slate-400 bg-slate-900 px-2 py-1 rounded-md uppercase tracking-wider border border-white/5">
                                    Batch {course.batch_no || 1}
                                </span>
                                <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md">
                                    <div className="w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">Ongoing</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 pb-8 pt-0">
                <div className="grid lg:grid-cols-12 gap-5">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-5">
                        
                        {/* Current Active Module Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl overflow-hidden shadow-sm group hover:border-emerald-500/30 transition-all">
                            <div className="flex flex-col md:flex-row">
                                <div className="bg-emerald-500 text-white w-full md:w-24 flex flex-col items-center justify-center py-4 md:py-0 border-r border-white/10">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Module</span>
                                    <span className="text-3xl font-black leading-none">{currentModule?.position === 0 ? 1 : (currentModule?.position || 1)}</span>
                                </div>
                                <div className="flex-1 p-5 relative">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[200px]">
                                            <div className="h-full bg-emerald-500 w-[40%] rounded-full" />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 italic">0/{currentModule?.lessons?.length || 0} Items <HelpCircle className="w-3 h-3 inline ml-1 opacity-50" /></span>
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{currentModule?.title}</h2>
                                    <Link 
                                        href={`/dashboard/my-courses/${course.slug}/${currentModule?.lessons?.[0]?.id || ''}`}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/5 group-hover:bg-emerald-500 group-hover:text-white transition-all flex items-center justify-center"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Social Links Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <a href="#" className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                        <Facebook className="w-5 h-5 fill-current" />
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

                            <a href="#" className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/30 transition-all shadow-sm">
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
                        </div>


                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl w-fit shadow-sm">
                            {[
                                { id: "modules", label: "Modules" },
                                { id: "assignments", label: "Assignments" },
                                { id: "certificate", label: "Certificates" },
                            ].map(tab => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 z-10",
                                            isActive 
                                                ? "text-white dark:text-slate-950" 
                                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeDashboardTab"
                                                className="absolute inset-0 bg-slate-950 dark:bg-white rounded-xl shadow-lg shadow-black/10"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
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
                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                                            {modules.map((mod, idx) => {
                                                const isFinished = idx < 3; // Placeholder logic, should ideally use mod.isFinished
                                                const isPreviousFinished = idx === 0 || idx <= 3; // Simplified logic
                                                
                                                let status: 'completed' | 'ongoing' | 'upcoming' = 'upcoming';
                                                if (idx < 3) status = 'completed';
                                                else if (idx === 3) status = 'ongoing';
                                                else status = 'upcoming';

                                                return (
                                                    <ModuleCard 
                                                        key={mod.id} 
                                                        module={mod} 
                                                        index={idx} 
                                                        courseSlug={course.slug} 
                                                        status={status}
                                                        onFeedbackClick={handleFeedbackClick} 
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "assignments" && (
                                    <div className="grid gap-4 pb-20 mt-8">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-6 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignment {i}</span>
                                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">Project Implementation Phase {i}</h4>
                                                        <p className="text-[10px] font-bold text-slate-500 mt-1">Deadline: {new Date(Date.now() + i * 86400000).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Status</span>
                                                        <span className="text-xs font-black text-amber-500 uppercase">Pending</span>
                                                    </div>
                                                    <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
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
                    <div className="lg:col-span-4 h-full">
                        {/* Progress Dashboard Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-xl p-5 shadow-sm space-y-6 h-full flex flex-col">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Total Progress</h3>
                                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 group cursor-help">
                                    How is result calculated? <HelpCircle className="w-3 h-3" />
                                </div>
                            </div>

                            {/* Status Avatar Alert */}
                            <div className="p-4 bg-orange-50 dark:bg-orange-500/5 rounded-xl border border-orange-100 dark:border-orange-500/10 flex gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-orange-200">
                                    <Image src="https://img.freepik.com/free-vector/fox-face_1308-84222.jpg" alt="Status" width={40} height={40} className="scale-110" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-orange-600">Great! You are performing well.</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                                        Push yourself a little harder. You have the potential to be the best in your class.
                                    </p>
                                </div>
                            </div>

                            {/* Main Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Overall Score</span>
                                    <span className="text-xl font-black text-slate-900 dark:text-white">60.5%</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[60.5%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <CircularStat value={71.9} label="Quiz" color="text-rose-500" />
                                <CircularStat value={50} label="Assignment" color="text-teal-500" />
                            </div>

                            {/* Leaderboard Section */}
                            <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                        Leaderboard
                                    </h4>
                                    <button className="text-[10px] font-bold text-slate-400 hover:text-primary transition-colors uppercase">View All</button>
                                </div>
                                <div className="space-y-1">
                                    {leaderboard.map((student) => (
                                        <div 
                                            key={student.id} 
                                            className={cn(
                                                "flex items-center p-2 rounded-xl border border-transparent transition-all",
                                                student.isCurrentUser 
                                                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 shadow-sm" 
                                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            <div className="w-6 text-[10px] font-black text-slate-400 italic">
                                                {student.rank === 75 ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[8px] leading-tight opacity-60">YOU</span>
                                                        <span className="text-slate-900 dark:text-white leading-none">75</span>
                                                    </div>
                                                ) : student.rank}
                                            </div>
                                            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-white/5 mx-2 bg-slate-100 font-bold flex items-center justify-center group shrink-0">
                                                <Image src={student.avatar} alt={student.name} width={32} height={32} className="group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate uppercase tracking-tighter">{student.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">{student.score}%</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Mark</p>
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-slate-900 border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Module Feedback</h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                            {selectedModuleForFeedback?.title}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => setIsFeedbackOpen(false)}
                                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* Rating */}
                                    <div className="text-center space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate your experience</p>
                                        <div className="flex items-center justify-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} className="text-slate-200 dark:text-slate-800 hover:text-yellow-500 transition-colors">
                                                    <Star className="w-8 h-8 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Textarea */}
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Share your thoughts</p>
                                        <textarea 
                                            placeholder="What did you learn? Any suggestions?"
                                            className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                        />
                                    </div>

                                    <button 
                                        onClick={() => setIsFeedbackOpen(false)}
                                        className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
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
    onFeedbackClick 
}: { 
    module: any; 
    index: number; 
    courseSlug: string; 
    status: 'completed' | 'ongoing' | 'upcoming';
    onFeedbackClick: (module: any) => void 
}) {
    const isCompleted = index < 3;
    const itemsCount = module.lessons?.length || 0;
    const completedItems = isCompleted ? itemsCount : (index === 3 ? Math.floor(itemsCount / 2) : 0);
    const progress = itemsCount > 0 ? (completedItems / itemsCount) * 100 : 0;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/5 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:border-emerald-500/20 transition-all duration-300 group h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        status === 'ongoing' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-transparent'
                    }`}>
                        Module {index + 1}
                    </div>
                </div>
                
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all ${
                    status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    status === 'ongoing' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                    'bg-slate-50 dark:bg-slate-800/50 border-transparent text-slate-400'
                }`}>
                    <div className={`w-1 h-1 rounded-full ${
                        status === 'completed' ? 'bg-emerald-500' :
                        status === 'ongoing' ? 'bg-orange-500 animate-pulse' :
                        'bg-slate-300'
                    }`} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">
                        {status}
                    </span>
                </div>
            </div>

            <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-8 line-clamp-2 min-h-[56px] group-hover:text-emerald-500 transition-colors">
                {module.title}
            </h4>

            <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-8">
                <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {itemsCount} Live Classes</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto">
                <Link 
                    href={`/dashboard/my-courses/${courseSlug}/${module.lessons?.[0]?.id || ''}`}
                    className="flex items-center justify-center h-8 rounded-lg bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
                >
                    Continue <Play className="w-2.5 h-2.5 ml-1.5 fill-current" />
                </Link>
                <button 
                    onClick={() => onFeedbackClick(module)}
                    className="flex items-center justify-center h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-black uppercase tracking-widest border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                    Feedback <MessageCircle className="w-2.5 h-2.5 ml-1.5" />
                </button>
            </div>
        </div>
    );
}

function CircularStat({ value, label, color }: { value: number; label: string; color: string }) {
    const circumference = 125.6; // 2 * Math.PI * 20
    return (
        <div className="flex flex-col items-center gap-3 p-4 rounded-3xl border border-slate-300 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/20 group hover:border-primary/20 transition-all">
            <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-white/5" />
                    <motion.circle 
                        cx="40" 
                        cy="40" 
                        r="32" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={circumference * 1.6}
                        initial={{ strokeDashoffset: circumference * 1.6 }}
                        animate={{ strokeDashoffset: (circumference * 1.6) - (circumference * 1.6 * value) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className={cn("transition-all duration-700", color)} 
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{value}%</span>
                </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500 text-center leading-none">{label}</span>
        </div>
    );
}
