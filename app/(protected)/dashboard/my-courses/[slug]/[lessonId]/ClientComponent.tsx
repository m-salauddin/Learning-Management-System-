"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Play,
    CheckCircle2,
    Lock,
    Menu,
    ChevronLeft,
    ChevronRight,
    FileText,
    ArrowLeft,
    MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import type { Database } from "@/types/supabase";

type LessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert'];

function cn_local(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Lesson {
    id: string;
    module_id: string;
    title: string;
    description?: string | null;
    lesson_type?: 'video' | 'text' | 'quiz' | 'assignment' | null;
    position?: number;
    duration_minutes?: number | null;
    is_free_preview?: boolean | null;
}

interface CoursePlayerClientProps {
    course: any;
    currentLesson: Lesson;
    asset: any;
    hasAccess: boolean;
    userId: string;
    enrollmentId?: string;
}

export function CoursePlayerClient({ course, currentLesson, asset, hasAccess, userId, enrollmentId }: CoursePlayerClientProps) {
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa' | 'notes'>('overview');
    const [isCinematic, setIsCinematic] = useState(false);
    const supabase = createClient();
    const { success, error } = useToast();

    useEffect(() => {
        if (!hasAccess || !asset?.video_path) {
            setVideoUrl(null);
            return;
        }
        setLoadingVideo(true);
        fetch(`/api/lessons/${currentLesson.id}/video`)
            .then(async res => {
                if (!res.ok) throw new Error("Failed to load video");
                return res.json();
            })
            .then(data => {
                if (data.url) setVideoUrl(data.url);
            })
            .catch(err => console.error(err))
            .finally(() => setLoadingVideo(false));
    }, [currentLesson.id, hasAccess, asset]);

    const allLessons = course.modules.flatMap((m: any) => m.lessons);
    const currentIndex = allLessons.findIndex((l: any) => l.id === currentLesson.id);
    const nextLesson = allLessons[currentIndex + 1];
    const prevLesson = allLessons[currentIndex - 1];

    const handleNext = () => {
        if (nextLesson) {
            router.push(`/dashboard/my-courses/${course.slug}/${nextLesson.id}`);
        }
    };

    const handlePrev = () => {
        if (prevLesson) {
            router.push(`/dashboard/my-courses/${course.slug}/${prevLesson.id}`);
        }
    };

    const handleCompleteAndNext = async () => {
        if (!enrollmentId) {
            if (nextLesson) {
                router.push(`/dashboard/my-courses/${course.slug}/${nextLesson.id}`);
            } else {
                router.push(`/courses/${course.slug}`);
            }
            return;
        }

        const progressData: LessonProgressInsert = {
            user_id: userId,
            lesson_id: currentLesson.id,
            enrollment_id: enrollmentId,
            is_completed: true,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        try {
            await (supabase.from('lesson_progress') as any).upsert(progressData, { onConflict: 'user_id,lesson_id' });
            success("Lesson completed!");
            if (nextLesson) {
                router.push(`/dashboard/my-courses/${course.slug}/${nextLesson.id}`);
            } else {
                router.push(`/courses/${course.slug}`);
                success("Course finished! Congratulations!");
            }
        } catch (err) {
            console.error("Failed to save progress:", err);
            handleNext();
        }
    };

    return (
        <div className={cn_local(
            "flex h-screen bg-slate-950 overflow-hidden text-slate-200 selection:bg-primary/30",
            isCinematic && "sidebar-collapsed"
        )}>
            {/* Sidebar */}
            <aside
                className={cn_local(
                    "fixed inset-y-0 left-0 z-50 w-[340px] bg-slate-950 border-r border-white/5 transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0 shadow-2xl",
                    !sidebarOpen && "-translate-x-full lg:hidden",
                    isCinematic && "lg:-translate-x-full lg:w-0 lg:opacity-0 lg:hidden"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-5 border-b border-white/5 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl sticky top-0 z-10">
                        <Link href={`/dashboard/my-courses/${course.slug}`} className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-all group">
                            <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            Exit Terminal
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2.5 hover:bg-white/5 rounded-xl transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Course Title & Progress */}
                    <div className="px-6 py-6 border-b border-white/5 bg-linear-to-b from-primary/10 via-transparent to-transparent">
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-[9px] font-black uppercase tracking-widest text-primary/80 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">Active Protocol</span>
                        </div>
                        <h2 className="font-black text-lg leading-tight tracking-tight text-white group-hover:text-primary transition-colors">{course.title}</h2>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-px">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(currentIndex / allLessons.length) * 100}%` }}
                                    className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full"
                                />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 italic">
                                {currentIndex + 1}/{allLessons.length}
                            </span>
                        </div>
                    </div>

                    {/* Lesson List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                        {course.modules.map((module: any, idx: number) => (
                            <div key={module.id} className="space-y-2">
                                <div className="flex items-center gap-3 px-3 py-2">
                                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black italic border border-white/5 text-slate-500">
                                        0{idx + 1}
                                    </div>
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">
                                        {module.title}
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    {module.lessons.map((lesson: any) => {
                                        const isActive = lesson.id === currentLesson.id;
                                        const isLocked = !hasAccess && !lesson.is_free_preview;
                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/dashboard/my-courses/${course.slug}/${lesson.id}`}
                                                className={cn_local(
                                                    "flex items-center gap-4 p-3.5 rounded-2xl text-sm transition-all duration-300 group relative overflow-hidden border border-transparent",
                                                    isActive
                                                        ? "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5"
                                                        : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                                                )}
                                            >
                                                {isActive && (
                                                    <motion.div 
                                                        layoutId="active-indicator"
                                                        className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full"
                                                    />
                                                )}
                                                <div className="shrink-0 relative">
                                                    {isLocked ? (
                                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center opacity-40">
                                                            <Lock className="w-4 h-4 text-slate-500" />
                                                        </div>
                                                    ) : (
                                                        <div className={cn_local(
                                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                                                            isActive 
                                                                ? "bg-primary text-white border-primary shadow-lg shadow-primary/40" 
                                                                : "bg-white/5 text-slate-400 border-white/5 group-hover:border-slate-700"
                                                        )}>
                                                            {lesson.lesson_type === 'video' ? <Play className="w-4 h-4 fill-current" /> : <FileText className="w-4 h-4" />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={cn_local(
                                                        "font-bold tracking-tight truncate mb-0.5",
                                                        isActive ? "text-primary" : "text-slate-200"
                                                    )}>{lesson.title}</p>
                                                    <div className="flex items-center gap-2 opacity-60">
                                                        <span className="text-[9px] font-black uppercase tracking-widest">{lesson.duration_minutes || 0} MINS</span>
                                                        {lesson.is_free_preview && <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20 shadow-inner">Preview</span>}
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-[#020617]">
                {/* Content Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-slate-950/80 backdrop-blur-xl z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={cn_local(
                                "p-2.5 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5",
                                sidebarOpen && "lg:hidden"
                            )}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/70 italic">Synchronizing Protocol</span>
                            <h1 className="font-black text-sm text-slate-100 tracking-tight truncate max-w-[200px] sm:max-w-md lg:max-w-lg">{currentLesson.title}</h1>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsCinematic(!isCinematic)}
                            className={cn_local(
                                "hidden lg:flex items-center gap-2 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                isCinematic ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-slate-400 border-white/5 hover:border-slate-700"
                            )}
                        >
                             <div className="w-2 h-2 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]" />
                             {isCinematic ? "Exit Cinematic" : "Cinematic Mode"}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className={cn_local(
                        "transition-all duration-700 mx-auto w-full",
                        isCinematic ? "max-w-none px-0" : "max-w-6xl p-6 lg:p-10"
                    )}>
                        {/* Video Player */}
                        <div className={cn_local(
                            "relative overflow-hidden group shadow-2xl transition-all duration-700",
                            isCinematic ? "aspect-21/9 border-b border-white/10" : "aspect-video rounded-[2.5rem] border border-white/10"
                        )}>
                            <div className="absolute inset-0 bg-slate-900 animate-pulse" />
                            {hasAccess ? (
                                loadingVideo ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950 z-10">
                                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(var(--primary),0.3)]"></div>
                                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Establishing Stream</p>
                                    </div>
                                ) : videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="w-full h-full relative z-10 block"
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                        autoPlay
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-950/80 backdrop-blur-3xl z-10">
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                                            <FileText className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">No visual data for this sector</p>
                                        <p className="text-xs mt-2 text-slate-600">Review the documentation below for further instructions</p>
                                    </div>
                                )
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950 p-6 text-center z-10">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 relative">
                                        <Lock className="w-10 h-10 text-primary animate-bounce-slow" />
                                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                                    </div>
                                    <h3 className="text-2xl font-black italic tracking-tighter mb-3 uppercase">Security Protocol Violation</h3>
                                    <p className="text-slate-400 max-w-md mb-10 text-sm leading-relaxed">
                                        This sector is currently restricted. Enroll in the curriculum to bypass security barriers and access high-level intelligence.
                                    </p>
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 active:scale-95"
                                    >
                                        Inquire Details
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Lesson Content */}
                        {!isCinematic && (
                            <div className="mt-12 space-y-12 pb-20">
                                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sector Index: {course.modules.find((m: any) => m.id === currentLesson.module_id)?.title}</span>
                                        </div>
                                        <h1 className="text-4xl font-black tracking-tighter text-white italic">{currentLesson.title}</h1>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handlePrev}
                                            disabled={!prevLesson}
                                            className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-slate-300"
                                            title="Previous Sector"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={!nextLesson}
                                            className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 text-slate-300"
                                            title="Next Sector"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="space-y-10">
                                    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
                                        {(['overview', 'resources', 'qa', 'notes'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={cn_local(
                                                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    activeTab === tab 
                                                        ? "bg-slate-900 text-primary border border-white/10 shadow-xl" 
                                                        : "text-slate-500 hover:text-slate-300"
                                                )}
                                            >
                                                {tab === 'qa' ? 'Q&A' : tab}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-slate-900/40 rounded-[2rem] border border-white/5 p-8 lg:p-12 min-h-[400px] backdrop-blur-xl">
                                        {activeTab === 'overview' && (
                                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                {asset?.content_markdown && hasAccess ? (
                                                    <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-p:text-slate-400 prose-p:leading-relaxed prose-strong:text-white prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-3xl shadow-inner shadow-black/20">
                                                        <div className="whitespace-pre-wrap font-sans text-slate-400 leading-relaxed text-lg">
                                                            {asset.content_markdown}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                                                        <FileText className="w-16 h-16 opacity-10 mb-6" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest italic">Sector documentation pending</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'resources' && (
                                            <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                {asset?.resources && (asset.resources as any).length > 0 ? (
                                                    (asset.resources as any).map((resource: any, i: number) => (
                                                        <a 
                                                            key={i}
                                                            href={resource.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                                        >
                                                            <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                                                <FileText className="w-5 h-5 text-primary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-bold text-[13px] text-white truncate group-hover:text-primary transition-colors">{resource.title}</p>
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Download Material</p>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-primary transition-colors" />
                                                        </a>
                                                    ))
                                                ) : (
                                                    <div className="col-span-2 py-20 flex flex-col items-center justify-center text-slate-600">
                                                        <Lock className="w-12 h-12 opacity-10 mb-4" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest italic">No external assets mapped</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {activeTab === 'qa' && (
                                            <div className="flex flex-col items-center justify-center py-20 text-slate-600 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <Menu className="w-16 h-16 opacity-10 mb-6" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic text-center leading-relaxed">Intelligence Grid Operations Restricted<br/>Direct Comms Channel Sync Pending</p>
                                            </div>
                                        )}

                                        {activeTab === 'notes' && (
                                            <div className="flex flex-col items-center justify-center py-20 text-slate-600 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                <MoreHorizontal className="w-16 h-16 opacity-10 mb-6" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic text-center leading-relaxed">Neural Mapping Subsystem Inactive<br/>Initialize Manual Entry Protocol</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Nav */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-white/5">
                                    {prevLesson ? (
                                        <button
                                            onClick={handlePrev}
                                            className="flex items-center gap-4 group text-slate-500 hover:text-white transition-all w-full sm:w-auto"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-slate-700 transition-all">
                                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Navigate Back</p>
                                                <p className="font-bold text-sm tracking-tight truncate max-w-[180px]">{prevLesson.title}</p>
                                            </div>
                                        </button>
                                    ) : <div />}

                                    {nextLesson ? (
                                        <button
                                            onClick={handleCompleteAndNext}
                                            className="h-14 px-8 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 w-full sm:w-auto justify-center group active:scale-95"
                                        >
                                            Execute Next Protocol
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCompleteAndNext}
                                            className="h-14 px-8 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/30 flex items-center gap-3 w-full sm:w-auto justify-center active:scale-95"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                            Finalize Mission
                                         </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
