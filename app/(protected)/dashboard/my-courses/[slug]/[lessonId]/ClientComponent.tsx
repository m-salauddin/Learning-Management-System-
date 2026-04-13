"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Play, CheckCircle2, Lock, Menu, X, ChevronLeft, ChevronRight, FileText, 
    ArrowLeft, MessageSquare, User, Trophy, HelpCircle, Edit3, MoreHorizontal,
    Bold, Italic, Underline, List, ListOrdered, Code, Quote, Undo, Redo,
    Heading1, Heading2, Type, Highlighter, Link as LinkIcon, 
    CheckSquare, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight,
    ShieldAlert, Fingerprint, Eye, ShieldCheck, Terminal, Clock, Target, RotateCcw, BarChart3
} from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TiptapLink from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Image from '@tiptap/extension-image';
import { motion, AnimatePresence } from "framer-motion";
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
    lesson_type?: 'video' | 'text' | 'quiz' | 'assignment' | (string & {}) | null;
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
    const [activeTab, setActiveTab] = useState<'notes' | 'warning'>('notes');
    const [isCinematic, setIsCinematic] = useState(false);
    
    // Quiz State Management
    const [quizStatus, setQuizStatus] = useState<'idle' | 'active' | 'finished'>('idle');
    const [showRules, setShowRules] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(600); // Default 10 mins
    const [quizResult, setQuizResult] = useState<{ score: number, total: number } | null>(null);

    const questions = (asset?.content as any)?.questions || [
        { 
            question: "What is the primary benefit of SSR (Server-Side Rendering) in Next.js?", 
            options: ["Faster Initial Page Loads", "Smaller Client-Side Bundles", "Optimized SEO Performance", "All of the above"],
            correct: "All of the above"
        },
        { 
            question: "Which hook is used for client-side navigation in Next.js App Router?", 
            options: ["useRouter", "usePathname", "useParams", "useNavigation"],
            correct: "useRouter"
        },
        { 
            question: "What does the 'use client' directive signify in a file?", 
            options: ["It runs only on the user device", "It marks a component for CSR", "It enables React Hooks", "All of the above"],
            correct: "All of the above"
        }
    ];

    useEffect(() => {
        if (quizStatus === 'active' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && quizStatus === 'active') {
            setQuizStatus('finished');
            calculateResults();
        }
    }, [quizStatus, timeLeft]);

    useEffect(() => {
        if (currentLesson.lesson_type === 'quiz' && userId) {
            const checkExistingScore = async () => {
                try {
                    const { data, error } = await (supabase
                        .from('quiz_submissions') as any)
                        .select('score, total_questions')
                        .eq('lesson_id', currentLesson.id)
                        .eq('user_id', userId)
                        .maybeSingle();

                    if (data) {
                        setQuizResult({ score: data.score, total: data.total_questions });
                        setQuizStatus('finished');
                    }
                } catch (err) {
                    console.error("Tactical link error:", err);
                }
            };
            checkExistingScore();
        }
    }, [currentLesson.id, userId]);

    const calculateResults = async () => {
        let score = 0;
        questions.forEach((q: any, idx: number) => {
            if (selectedAnswers[idx] === q.correct) score++;
        });
        
        const result = { score, total: questions.length };
        setQuizResult(result);
        setQuizStatus('finished');

        // Save to database
        try {
            await (supabase.from('quiz_submissions') as any).insert({
                user_id: userId,
                lesson_id: currentLesson.id,
                score: score,
                total_questions: questions.length,
                percentage: Math.round((score / questions.length) * 100)
            });
        } catch (err) {
            console.error("Score submission failed:", err);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: 'Operational logging active... "/" for commands',
            }),
            Highlight.configure({ multicolor: true }),
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Typography,
            Image.configure({
                allowBase64: true,
            }),
        ],
        content: typeof window !== 'undefined' ? localStorage.getItem(`notes-${currentLesson.id}`) || '' : '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            if (typeof window !== 'undefined') {
                localStorage.setItem(`notes-${currentLesson.id}`, html);
            }
        },
        editorProps: {
            attributes: {
                class: 'focus:outline-none max-w-none transition-all min-h-[400px]',
            },
        },
    });

    useEffect(() => {
        if (editor && currentLesson.id) {
            const savedContent = typeof window !== 'undefined' ? localStorage.getItem(`notes-${currentLesson.id}`) || '' : '';
            editor.commands.setContent(savedContent);
        }
    }, [currentLesson.id, editor]);

    const addTimestamp = () => {
        if (!editor) return;
        const time = '01:23'; // Logic for current timestamp would go here
        editor.chain().focus().insertContent(` [${time}] `).run();
    };
    const [showPlayer, setShowPlayer] = useState(true);
    const currentMilestoneId = course.milestones?.find((ms: any) => 
        ms.modules?.some((mod: any) => mod.id === currentLesson.module_id)
    )?.id || 'default';

    const [expandedModules, setExpandedModules] = useState<string[]>([currentLesson.module_id]);
    const [expandedMilestones, setExpandedMilestones] = useState<string[]>([currentMilestoneId]);
    const supabase = createClient();
    const { success, error } = useToast();

    const toggleModule = (moduleId: string) => {
        setExpandedModules(prev => 
            prev.includes(moduleId) 
                ? prev.filter(id => id !== moduleId) 
                : [...prev, moduleId]
        );
    };

    const toggleMilestone = (msId: string) => {
        setExpandedMilestones(prev => 
            prev.includes(msId) 
                ? prev.filter(id => id !== msId) 
                : [...prev, msId]
        );
    };

    const FALLBACK_VIDEOS = [
        'https://www.youtube.com/embed/BgZHbCDFODk', // Next.js in 100s
        'https://www.youtube.com/embed/vwSlYG7hFk0', // React in 100s
        'https://www.youtube.com/embed/rHux0gMZ3Eg', // TypeScript in 100s
        'https://www.youtube.com/embed/J6Hvs_E-hJc', // Tailwind in 100s
        'https://www.youtube.com/embed/ysz5S6PUM-U', // Node.js in 100s
        'https://www.youtube.com/embed/hvivIO9zjcA', // Supabase in 100s
        'https://www.youtube.com/embed/x3oFbraGifI', // PostgreSQL in 100s
        'https://www.youtube.com/embed/Gi4WeTTsQCo', // Git in 100s
        'https://www.youtube.com/embed/G3e-cpL7oug', // Linux in 100s
        'https://www.youtube.com/embed/MiLAE6HMr10', // Docker in 100s
    ];

    const getFallbackVideo = (lessonId: string) => {
        const hash = lessonId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return FALLBACK_VIDEOS[hash % FALLBACK_VIDEOS.length];
    };

    useEffect(() => {
        setVideoUrl(null);

        if (!hasAccess) {
            setLoadingVideo(false);
            return;
        }

        setLoadingVideo(true);

        (async () => {
            try {
                const { data, error: fetchError } = await (supabase
                    .from('lesson_assets')
                    .select('video_path')
                    .eq('lesson_id', currentLesson.id)
                    .single() as any);

                if (fetchError || !data?.video_path) {
                    setVideoUrl(getFallbackVideo(currentLesson.id));
                    return;
                }

                const path = data.video_path as string;

                if (path.startsWith('http')) {
                    setVideoUrl(path);
                } else {
                    try {
                        const res = await fetch(`/api/lessons/${currentLesson.id}/video`);
                        if (res.ok) {
                            const d = await res.json();
                            if (d?.url) setVideoUrl(d.url);
                            else setVideoUrl(getFallbackVideo(currentLesson.id));
                        } else {
                            setVideoUrl(getFallbackVideo(currentLesson.id));
                        }
                    } catch {
                        setVideoUrl(getFallbackVideo(currentLesson.id));
                    }
                }
            } catch {
                setVideoUrl(getFallbackVideo(currentLesson.id));
            } finally {
                setLoadingVideo(false);
            }
        })();
    }, [currentLesson.id, hasAccess]);

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
        <>
            <div className={cn_local(
            "flex h-screen bg-slate-950 overflow-hidden text-slate-200 selection:bg-primary/30",
            isCinematic && "sidebar-collapsed"
        )}>
            
            <aside
                className={cn_local(
                    "fixed inset-y-0 left-0 z-50 w-[360px] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 shadow-xl",
                    !sidebarOpen && "-translate-x-full lg:hidden",
                    isCinematic && "lg:-translate-x-full lg:w-0 lg:opacity-0 lg:hidden"
                )}
            >
                <div className="flex flex-col h-full">
                    
                    <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase text-slate-400">Course Navigator</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-slate-400"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                        {(course.milestones?.length > 0 ? course.milestones : [{ id: 'default', title: "Curriculum Plan", modules: course.modules }]).map((milestone: any, msIdx: number) => {
                            const isMsExpanded = expandedMilestones.includes(milestone.id || 'default');

                            return (
                                <div key={milestone.id || msIdx} 
                                    className={cn_local(
                                        "rounded-2xl border transition-all duration-300",
                                        isMsExpanded 
                                            ? "bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 p-2" 
                                            : "p-0 border-transparent"
                                    )}
                                >
                                    <button 
                                        onClick={() => toggleMilestone(milestone.id || 'default')}
                                        className={cn_local(
                                            "w-full flex items-center justify-between p-2 group transition-all rounded-xl",
                                            !isMsExpanded && "hover:bg-slate-50 dark:hover:bg-white/5"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn_local(
                                                "w-1.5 h-1.5 rounded-full transition-colors",
                                                isMsExpanded ? "bg-primary" : "bg-slate-300 dark:bg-white/10"
                                            )} />
                                            <span className={cn_local(
                                                "text-[9px] font-black uppercase tracking-tight transition-colors",
                                                isMsExpanded ? "text-primary" : "text-slate-500 dark:text-slate-400"
                                            )}>
                                                {msIdx + 1}. {milestone.title}
                                            </span>
                                        </div>
                                        <ChevronRight className={cn_local(
                                            "w-3 h-3 text-slate-400 transition-transform duration-300",
                                            isMsExpanded && "rotate-90 text-primary"
                                        )} />
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isMsExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-2 mt-2">
                                                    {milestone.modules?.map((module: any, modIdx: number) => {
                                                        const isExpanded = expandedModules.includes(module.id);
                                                        const isCurrentModule = module.id === currentLesson.module_id;

                                                        return (
                                                            <div key={module.id} className="space-y-1">
                                                                <button
                                                                    onClick={() => toggleModule(module.id)}
                                                                    className={cn_local(
                                                                        "w-full flex items-center justify-between p-3 rounded-xl transition-all border shadow-sm",
                                                                        isCurrentModule 
                                                                            ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-white/20" 
                                                                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10"
                                                                    )}
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0 text-left">
                                                                        <div className={cn_local(
                                                                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-[10px] font-black",
                                                                            isCurrentModule ? "bg-primary text-white border-primary shadow-sm" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-white/5"
                                                                        )}>
                                                                            {modIdx + 1}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <h4 className={cn_local(
                                                                                "text-[11px] font-bold leading-tight truncate",
                                                                                isCurrentModule ? "text-slate-900 dark:text-white" : "text-slate-500"
                                                                            )}>
                                                                                {module.title}
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                    <ChevronRight className={cn_local(
                                                                        "w-3.5 h-3.5 text-slate-400 transition-transform duration-300",
                                                                        isExpanded && "rotate-90 text-primary"
                                                                    )} />
                                                                </button>

                                                                <AnimatePresence initial={false}>
                                                                    {isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="pl-6 pr-1 py-2 space-y-1.5 ml-3 border-l-2 border-slate-100 dark:border-white/5">
                                                                                {module.lessons?.map((lesson: any) => {
                                                                                    const isActive = lesson.id === currentLesson.id;
                                                                                    const isLocked = !hasAccess && !lesson.is_free_preview;

                                                                                    let Icon = Play;
                                                                                    if (lesson.lesson_type === 'quiz') Icon = HelpCircle;
                                                                                    if (lesson.lesson_type === 'assignment') Icon = Edit3;

                                                                                    return (
                                                                                        <Link
                                                                                            key={lesson.id}
                                                                                            href={`/dashboard/my-courses/${course.slug}/${lesson.id}`}
                                                                                            className={cn_local(
                                                                                                "flex items-center gap-3 p-2.5 rounded-xl transition-all group border",
                                                                                                isActive 
                                                                                                    ? "bg-primary/5 border-primary/20" 
                                                                                                    : "bg-white/50 dark:bg-slate-900/50 border-slate-50 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-white/10"
                                                                                            )}
                                                                                        >
                                                                                            <div className={cn_local(
                                                                                                "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                                                                                                isActive ? "bg-primary text-white" : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-white/5"
                                                                                            )}>
                                                                                                {isLocked ? <Lock className="w-3 h-3" /> : <Icon className={cn_local("w-3 h-3", isActive && "fill-current")} />}
                                                                                            </div>
                                                                                            <div className="min-w-0">
                                                                                                <p className={cn_local(
                                                                                                    "text-[10px] font-bold truncate",
                                                                                                    isActive ? "text-primary" : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                                                                                                )}>
                                                                                                    {lesson.title}
                                                                                                </p>
                                                                                            </div>
                                                                                        </Link>
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
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </aside>

            
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full bg-slate-50 dark:bg-[#020617]">
                
                
                <header className="h-16 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-[#020617] z-20">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className={cn_local(
                                "p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 transition-colors active:scale-95",
                                sidebarOpen && "lg:hidden"
                            )}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="hidden md:flex flex-col">
                            <div className="flex items-center gap-2">
                                <Link href="/dashboard" className="text-[9px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-tight">Dashboard</Link>
                                <ChevronRight className="w-2.5 h-2.5 text-slate-300" />
                                <Link href={`/dashboard/my-courses/${course.slug}`} className="text-[9px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-tight truncate max-w-[120px]">{course.title}</Link>
                                <ChevronRight className="w-2.5 h-2.5 text-slate-300" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-tight">Protocol Sync</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 mr-2">
                             <button 
                                onClick={() => setIsCinematic(!isCinematic)}
                                className={cn_local(
                                    "flex items-center gap-2 px-3 h-8 rounded-lg text-[9px] font-black uppercase transition-colors",
                                    isCinematic 
                                        ? "bg-slate-900 dark:bg-white text-primary dark:text-slate-950 shadow-md" 
                                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <Play className="w-3 h-3 fill-current" />
                                {isCinematic ? "Exit TV" : "TV Mode"}
                            </button>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
                             <User className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overscroll-contain will-change-scroll" style={{ contain: 'strict' }}>
                    <div className={cn_local(
                        "mx-auto w-full",
                        isCinematic ? "max-w-none px-0" : "max-w-6xl p-6 lg:p-10"
                    )}>
                        
                        {showPlayer && (
                            <div className={cn_local(
                                "relative overflow-hidden group shadow-xl mb-8 transform-gpu",
                                isCinematic ? "aspect-21/9 border-b border-white/10" : "rounded-[2.5rem] border border-white/10 transition-[border-radius] duration-500",
                                !isCinematic && (currentLesson.lesson_type as string) !== 'quiz' && (currentLesson.lesson_type as string) !== 'assignment' && "aspect-video"
                            )}>
                                {((currentLesson.lesson_type as string) === 'quiz' || (currentLesson.lesson_type as string) === 'assignment') ? null : <div className="absolute inset-0 bg-slate-900" />}
                                {hasAccess ? (
                                    <>
                                        
                                        {(currentLesson.lesson_type?.toLowerCase() === 'video') && (
                                            loadingVideo ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950 z-10">
                                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(var(--primary),0.3)]"></div>
                                                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Establishing Stream</p>
                                                </div>
                                            ) : videoUrl ? (() => {
                                                let embedSrc = videoUrl;
                                                if (!videoUrl.includes('/embed/')) {
                                                    const ytMatch = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
                                                    if (ytMatch) embedSrc = `https://www.youtube.com/embed/${ytMatch[1]}`;
                                                }
                                                const finalSrc = embedSrc.includes('?')
                                                    ? embedSrc + '&rel=0&modestbranding=1&enablejsapi=1'
                                                    : embedSrc + '?rel=0&modestbranding=1&enablejsapi=1';
                                                return videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                                                    <iframe
                                                        key={finalSrc}
                                                        src={finalSrc}
                                                        className="absolute inset-0 w-full h-full z-10 border-none bg-black transform-gpu"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                        allowFullScreen
                                                        referrerPolicy="strict-origin-when-cross-origin"
                                                        title={currentLesson.title}
                                                    />
                                                ) : (
                                                    <video
                                                        src={videoUrl}
                                                        controls
                                                        className="absolute inset-0 w-full h-full z-10"
                                                        controlsList="nodownload"
                                                        onContextMenu={(e) => e.preventDefault()}
                                                    />
                                                );
                                            })() : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-950/70 backdrop-blur-md z-10">
                                                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                                                        <FileText className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-tight">No visual data available</p>
                                                    <p className="text-xs mt-2 text-slate-600">Review the documentation below for further instructions</p>
                                                </div>
                                            )
                                        )}

                                        
                                        {currentLesson.lesson_type === 'quiz' && (
                                            <div className="relative w-full bg-[#020617] z-20 flex flex-col overflow-hidden animate-in fade-in duration-500">
                                                {quizStatus === 'idle' ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10 animate-in fade-in zoom-in duration-500">
                                                        <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center relative group">
                                                            <div className="absolute inset-0 bg-primary/20 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all" />
                                                            <HelpCircle className="w-10 h-10 text-primary relative z-10" />
                                                        </div>
                                                        
                                                        <div className="space-y-3">
                                                            <h2 className="text-4xl font-bold tracking-tight">Start Your Quiz</h2>
                                                            <p className="text-slate-400 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                                                                Test your knowledge of this section.
                                                            </p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
                                                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-left">
                                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Time Limit</p>
                                                                <p className="text-xl font-bold text-white">{questions.length * 2} Mins</p>
                                                            </div>
                                                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-1 text-left">
                                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Questions</p>
                                                                <p className="text-xl font-bold text-white">{questions.length} Total</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 w-full max-w-[320px]">
                                                            <button 
                                                                onClick={() => {
                                                                    setTimeLeft(questions.length * 120);
                                                                    setQuizStatus('active');
                                                                }}
                                                                className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                                            >
                                                                <Play className="w-3 h-3" />
                                                                Start Now
                                                            </button>
                                                            <button 
                                                                onClick={() => setShowRules(true)}
                                                                className="flex-1 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <FileText className="w-3 h-3" />
                                                                Rules
                                                            </button>
                                                        </div>

                                                    </div>
                                                ) : quizStatus === 'active' ? (
                                                    <div className="flex-1 flex flex-col">
                                                        {/* Header */}
                                                        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                                                                    <span className="text-[8px] font-bold text-primary uppercase tracker-widest">Live</span>
                                                                </div>
                                                                <p className="text-[9px] font-bold text-slate-500 uppercase">Question {currentQuestionIndex + 1} of {questions.length}</p>
                                                            </div>
                                                            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                                <span className="text-[11px] font-bold text-white font-mono">{formatTime(timeLeft)}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Question Content */}
                                                        <div className="p-10 lg:p-16">
                                                            <div className="max-w-3xl mx-auto space-y-12">
                                                                <h3 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                                                                    {questions[currentQuestionIndex].question}
                                                                </h3>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                                                                    {questions[currentQuestionIndex].options.map((option: string, idx: number) => (
                                                                        <button 
                                                                            key={idx}
                                                                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }))}
                                                                            className={cn_local(
                                                                                "p-6 rounded-2xl border transition-all text-left flex items-center justify-between group",
                                                                                selectedAnswers[currentQuestionIndex] === option
                                                                                    ? "bg-primary/10 border-primary text-white"
                                                                                    : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                                                                            )}
                                                                        >
                                                                            <span className="text-sm font-bold leading-relaxed">{option}</span>
                                                                            <div className={cn_local(
                                                                                "w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-4",
                                                                                selectedAnswers[currentQuestionIndex] === option 
                                                                                    ? "border-primary bg-primary" 
                                                                                    : "border-white/20 group-hover:border-white/40"
                                                                            )}>
                                                                                {selectedAnswers[currentQuestionIndex] === option && (
                                                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                                                )}
                                                                            </div>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-black/40 mt-auto">
                                                            <button 
                                                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                                                disabled={currentQuestionIndex === 0}
                                                                className="px-4 py-2 rounded-lg border border-white/10 text-white font-bold text-[9px] uppercase tracking-widest hover:bg-white/5 disabled:opacity-20 transition-all"
                                                            >
                                                                Back
                                                            </button>
                                                            {currentQuestionIndex === questions.length - 1 ? (
                                                                <button 
                                                                    onClick={calculateResults}
                                                                    className="px-8 py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all"
                                                                >
                                                                    Finish Quiz
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                                                    className="px-8 py-2.5 bg-primary text-white rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-primary/90 active:scale-95 transition-all"
                                                                >
                                                                    Next
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in fade-in slide-in-from-bottom duration-700">
                                                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 relative">
                                                            <Trophy className="w-8 h-8 text-emerald-500" />
                                                            <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl" />
                                                        </div>
                                                        <h2 className="text-3xl font-bold uppercase mb-1">Quiz Summary</h2>
                                                        <div className="flex items-center gap-2 mb-8">
                                                            <div className="h-px w-4 bg-white/10" />
                                                            <p className="text-slate-500 text-[8px] font-bold uppercase tracking-widest">Results Overview</p>
                                                            <div className="h-px w-4 bg-white/10" />
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md mb-8">
                                                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Final Score</p>
                                                                <p className="text-3xl font-bold text-white">{Math.round((quizResult?.score || 0) / (quizResult?.total || 1) * 100)}%</p>
                                                                <p className="text-[9px] text-emerald-500 font-bold uppercase">{quizResult?.score} / {quizResult?.total} Correct</p>
                                                            </div>
                                                            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center text-left">
                                                                <p className="text-slate-400 text-xs leading-relaxed italic">
                                                                    "{Math.round((quizResult?.score || 0) / (quizResult?.total || 1) * 100) >= 80 
                                                                        ? "Great job! You've mastered this section." 
                                                                        : "Keep practicing! You can review the material and try again."}"
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3 w-full max-w-sm">
                                                            <button 
                                                                onClick={handleCompleteAndNext}
                                                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                                                            >
                                                                Continue
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        
                                        {currentLesson.lesson_type === 'assignment' && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950/80 backdrop-blur-md z-10 p-12 overflow-hidden">
                                                <div className="mb-8">
                                                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center relative group">
                                                        <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all" />
                                                        <Edit3 className="w-10 h-10 text-emerald-500 relative z-10" />
                                                    </div>
                                                </div>
                                                <h2 className="text-3xl font-black tracking-tighter mb-4 text-center">DEPLOY TACTICAL TASK</h2>
                                                <p className="text-slate-400 max-w-md text-center text-sm leading-relaxed mb-10">
                                                    Practical application protocol. Download the technical brief, implement solutions, and submit your source files for verification.
                                                </p>
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <button className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
                                                        Download Brief
                                                    </button>
                                                    <button className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all active:scale-95">
                                                        Upload Solution
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-slate-950 p-6 text-center z-10">
                                        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 relative">
                                            <Lock className="w-10 h-10 text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tighter mb-3 uppercase">Security Protocol Violation</h3>
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
                        )}

                        
                        {!isCinematic && (
                            <div className="mt-12 space-y-12 pb-32 max-w-5xl mx-auto">
                                {(currentLesson.lesson_type as string) !== 'quiz' && (currentLesson.lesson_type as string) !== 'assignment' && (
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                    <div className="space-y-2">
                                        <h1 className="text-4xl font-black tracking-tight text-white leading-tight capitalize">{currentLesson.title}</h1>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handlePrev} disabled={!prevLesson} className="h-14 w-14 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95 text-slate-400">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button 
                                            onClick={handleCompleteAndNext} 
                                            disabled={!nextLesson} 
                                            className="h-14 px-8 rounded-2xl bg-primary text-white flex items-center justify-center gap-3 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-xl shadow-primary/20 font-black text-[10px] uppercase tracking-widest group"
                                        >
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[7px] text-white/60 mb-1">Mission</span>
                                                <span>Execute Next</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {(currentLesson.lesson_type as string) !== 'quiz' && (currentLesson.lesson_type as string) !== 'assignment' && (
                                        <div className="lg:col-span-2 space-y-8">
                                        <div className="space-y-4">
                                            
                                            <div className="flex items-center gap-1 p-1 bg-[#020617] border border-white/10 rounded-xl w-fit relative">
                                                <button 
                                                    onClick={() => setActiveTab('notes')}
                                                    className={cn_local(
                                                        "px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 relative z-10",
                                                        activeTab === 'notes' ? "text-white" : "text-slate-500 hover:text-slate-300"
                                                    )}
                                                >
                                                    {activeTab === 'notes' && (
                                                        <motion.div 
                                                            layoutId="activeTabPill"
                                                            className="absolute inset-0 bg-primary rounded-lg shadow-sm"
                                                            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                                                        />
                                                    )}
                                                    <Edit3 className="w-3 h-3 relative z-10" />
                                                    <span className="relative z-10">Intelligence</span>
                                                </button>
                                                <button 
                                                    onClick={() => setActiveTab('warning')}
                                                    className={cn_local(
                                                        "px-4 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2 relative z-10",
                                                        activeTab === 'warning' ? "text-white" : "text-slate-500 hover:text-red-400"
                                                    )}
                                                >
                                                    {activeTab === 'warning' && (
                                                        <motion.div 
                                                            layoutId="activeTabPill"
                                                            className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                                                            transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                                                        />
                                                    )}
                                                    <Lock className="w-3 h-3 relative z-10" />
                                                    <span className="relative z-10">Security</span>
                                                </button>
                                            </div>

                                            <div className="relative">
                                                <div className="relative bg-[#020617] border border-white/10 rounded-2xl overflow-hidden shadow-lg translate-z-0">
                                                    <div className="p-0 relative">
                                                        <AnimatePresence mode="wait">
                                                            <motion.div
                                                                key={activeTab}
                                                                initial={{ opacity: 0, x: 10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -10 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {activeTab === 'notes' ? (
                                                                    <div>
                                                                        <div className="px-6 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
                                                                            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                                                <button 
                                                                                    onClick={() => editor?.chain().focus().toggleBold().run()}
                                                                                    className={cn_local("p-2 rounded hover:bg-white/5 transition-colors", editor?.isActive('bold') && "text-primary bg-primary/10")}
                                                                                >
                                                                                    <Bold className="w-3 h-3" />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                                                                                    className={cn_local("p-2 rounded hover:bg-white/5 transition-colors", editor?.isActive('italic') && "text-primary bg-primary/10")}
                                                                                >
                                                                                    <Italic className="w-3 h-3" />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                                                                    className={cn_local("p-2 rounded hover:bg-white/5 transition-colors", editor?.isActive('strike') && "text-primary bg-primary/10")}
                                                                                >
                                                                                    <Underline className="w-3 h-3" />
                                                                                </button>
                                                                                <div className="w-px h-3 bg-white/10 mx-1" />
                                                                                <button 
                                                                                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                                                                                    className={cn_local("p-2 rounded hover:bg-white/5 transition-colors", editor?.isActive('bulletList') && "text-primary bg-primary/10")}
                                                                                >
                                                                                    <List className="w-3 h-3" />
                                                                                </button>
                                                                                <button 
                                                                                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                                                                                    className={cn_local("p-2 rounded hover:bg-white/5 transition-colors", editor?.isActive('orderedList') && "text-primary bg-primary/10")}
                                                                                >
                                                                                    <ListOrdered className="w-3 h-3" />
                                                                                </button>
                                                                                <div className="w-px h-3 bg-white/10 mx-1" />
                                                                                <button 
                                                                                    onClick={addTimestamp}
                                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-white/5 hover:text-primary transition-all group text-[8px]"
                                                                                >
                                                                                    <Play className="w-2.5 h-2.5 group-hover:fill-current" />
                                                                                    Timestamp
                                                                                </button>
                                                                            </div>
                                                                            <div className="flex items-center gap-1">
                                                                                <button onClick={() => editor?.chain().focus().undo().run()} className="p-2 hover:text-primary transition-colors"><Undo className="w-3 h-3" /></button>
                                                                                <button onClick={() => editor?.chain().focus().redo().run()} className="p-2 hover:text-primary transition-colors"><Redo className="w-3 h-3" /></button>
                                                                            </div>
                                                                        </div>
                                                                        <div className="relative tiptap-editor">
                                                                            {mounted && editor && (
                                                                                <>
                                                                                    <BubbleMenu editor={editor} className="flex items-center gap-1 p-1 bg-[#1e293b] border border-white/10 rounded-lg shadow-xl">
                                                                                        <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn_local("p-1.5 rounded hover:bg-white/5", editor.isActive('bold') && "text-primary")}><Bold className="w-3.5 h-3.5" /></button>
                                                                                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn_local("p-1.5 rounded hover:bg-white/5", editor.isActive('italic') && "text-primary")}><Italic className="w-3.5 h-3.5" /></button>
                                                                                        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={cn_local("p-1.5 rounded hover:bg-white/5", editor.isActive('strike') && "text-primary")}><Underline className="w-3.5 h-3.5" /></button>
                                                                                        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={cn_local("p-1.5 rounded hover:bg-white/5", editor.isActive('highlight') && "text-yellow-400")}><Highlighter className="w-3.5 h-3.5" /></button>
                                                                                        <div className="w-px h-3 bg-white/10 mx-1" />
                                                                                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={cn_local("p-1.5 rounded hover:bg-white/5", editor.isActive('heading', { level: 1 }) && "text-primary")}><Heading1 className="w-3.5 h-3.5" /></button>
                                                                                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn_local("p-1.5 rounded hover:bg-white/5", editor.isActive('heading', { level: 2 }) && "text-primary")}><Heading2 className="w-3.5 h-3.5" /></button>
                                                                                    </BubbleMenu>

                                                                                    <FloatingMenu editor={editor} className="flex flex-col gap-0.5 p-1.5 bg-[#1e293b] border border-white/10 rounded-xl shadow-xl min-w-[140px]">
                                                                                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors"><Heading1 className="w-3.5 h-3.5 text-primary" /> Heading 1</button>
                                                                                        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors"><Heading2 className="w-3.5 h-3.5 text-primary" /> Heading 2</button>
                                                                                        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors"><List className="w-3.5 h-3.5 text-primary" /> Bullet List</button>
                                                                                        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors"><CheckSquare className="w-3.5 h-3.5 text-primary" /> Task List</button>
                                                                                        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors"><Code className="w-3.5 h-3.5 text-primary" /> Code Block</button>
                                                                                        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-[10px] font-bold uppercase transition-colors"><Quote className="w-3.5 h-3.5 text-primary" /> Quote</button>
                                                                                    </FloatingMenu>

                                                                                    <div className="px-6 py-4">
                                                                                        <EditorContent editor={editor} />
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                        <div className="px-6 py-2 bg-black/60 border-t border-white/5 flex items-center justify-between">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sync Active</span>
                                                                            </div>
                                                                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">System_v4.2</span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="p-8 space-y-10">
                                                                        <div className="flex items-center justify-between border-b border-red-500/20 pb-6">
                                                                            <div className="space-y-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <ShieldAlert className="w-4 h-4 text-red-500" />
                                                                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Security Briefing</h3>
                                                                                </div>
                                                                                <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-widest">Clearance Level: Restricted Sector 4</p>
                                                                            </div>
                                                                            <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col items-center">
                                                                                <span className="text-[8px] font-black text-red-500 uppercase">Status</span>
                                                                                <span className="text-[10px] font-black text-white uppercase animate-pulse">Scanning...</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                            <div className="space-y-6">
                                                                                <div className="flex items-center gap-2 text-slate-400">
                                                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                                                    <span className="text-[9px] font-black uppercase tracking-widest">Protection Protocols</span>
                                                                                </div>
                                                                                <div className="space-y-4">
                                                                                    {[
                                                                                        { step: "01", title: "Encrypted Stream Sync", desc: "Data is watermarked with your unique identifier for mission tracking." },
                                                                                        { step: "02", title: "Zero-Point Access", desc: "Unauthorized session sharing triggers immediate hardware blacklisting." },
                                                                                        { step: "03", title: "Integrity Verification", desc: "Any attempt to extract sector data will result in a protocol violation." }
                                                                                    ].map((p, i) => (
                                                                                        <div key={i} className="flex gap-4 group/p">
                                                                                            <span className="text-[10px] font-black text-red-500/40 group-hover/p:text-red-500 transition-colors">{p.step}</span>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-[11px] font-black text-white uppercase tracking-tight">{p.title}</p>
                                                                                                <p className="text-[10px] text-slate-500 leading-relaxed">{p.desc}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-6">
                                                                                <div className="flex items-center gap-2 text-slate-400">
                                                                                    <Terminal className="w-3.5 h-3.5" />
                                                                                    <span className="text-[9px] font-black uppercase tracking-widest">Termination Matrix</span>
                                                                                </div>
                                                                                <div className="grid grid-cols-1 gap-3">
                                                                                    {[
                                                                                        { term: "Asset Leakage", penalty: "Permanent Account Erasure" },
                                                                                        { term: "Credential Fraud", penalty: "Protocol Ban (IP Level)" },
                                                                                        { term: "Sector Theft", penalty: "Legal Compliance Review" }
                                                                                    ].map((t, i) => (
                                                                                        <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/20 transition-all flex items-center justify-between group/t">
                                                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{t.term}</span>
                                                                                            <span className="text-[10px] font-black text-red-500/80 group-hover/t:text-red-500 transition-colors uppercase">{t.penalty}</span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                                <div className="pt-4 mt-2 border-t border-white/5 flex items-center gap-4">
                                                                                    <div className="flex -space-x-2">
                                                                                        {[1, 2, 3].map(i => (
                                                                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-red-500/20 flex items-center justify-center">
                                                                                                <Fingerprint className="w-3 h-3 text-red-500/60" />
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                    <p className="text-[8px] font-medium text-slate-500 uppercase tracking-tighter max-w-[140px]">Biometric beacons embedded in all classified streams</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        </AnimatePresence>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    )}

                                    {(currentLesson.lesson_type as string) !== 'quiz' && (currentLesson.lesson_type as string) !== 'assignment' && (
                                        <div className={cn_local(
                                            "space-y-4 lg:pt-[44px]",
                                            (currentLesson.lesson_type === 'quiz' || currentLesson.lesson_type === 'assignment') && "lg:col-span-3 lg:pt-0 max-w-2xl mx-auto w-full"
                                        )}>
                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 relative overflow-hidden hover:border-primary/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                        <Trophy className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <h3 className="font-black text-[10px] uppercase tracking-widest text-white">Mission Success</h3>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {/* Guidelines based on lesson type */}
                                                    {(asset?.resources?.guidelines as string[] || (
                                                        currentLesson.lesson_type === 'video' ? [
                                                            "Complete visual module traversal",
                                                            "Log critical intelligence checkpoints",
                                                            "Finalize sector synchronization"
                                                        ] : currentLesson.lesson_type === 'quiz' ? [
                                                            "Maintain 80%+ accuracy threshold",
                                                            "Complete session before timer expiration",
                                                            "Verify all tactical responses"
                                                        ] : currentLesson.lesson_type === 'assignment' ? [
                                                            "Download operational brief",
                                                            "Deploy solution within parameters",
                                                            "Upload assets for instructor verification"
                                                        ] : [
                                                            "Review comprehensive documentation",
                                                            "Extract key learning protocols",
                                                            "Update personal intelligence bank"
                                                        ]
                                                    )).map((step, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                                                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 transition-transform group-hover/item:scale-110" /> 
                                                            <span className="text-[11px] text-slate-400 font-medium tracking-tight leading-none">{step}</span>
                                                        </div>
                                                    ))}

                                                    {/* Explicit Success Steps if available in resources */}
                                                    {asset?.resources?.success_steps && (asset.resources.success_steps as string[]).map((step, idx) => (
                                                        <div key={`custom-${idx}`} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors group/item">
                                                            <Trophy className="w-3.5 h-3.5 text-primary shrink-0" /> 
                                                            <span className="text-[11px] text-white font-bold tracking-tight leading-none">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>

            {/* Quiz Rules Modal - Root Level */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-200 flex items-center justify-center p-4"
                        onClick={() => setShowRules(false)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm bg-[#0a0f1e] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-primary" />
                                    </div>
                                    <h2 className="text-base font-bold tracking-tight">Quiz Rules</h2>
                                </div>
                                <button 
                                    onClick={() => setShowRules(false)}
                                    className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-1.5">
                                {[
                                    { icon: Clock, rule: `${questions.length * 2} minutes total time`, color: "text-blue-400", bg: "bg-blue-400/10" },
                                    { icon: Target, rule: "80% accuracy to pass", color: "text-amber-400", bg: "bg-amber-400/10" },
                                    { icon: RotateCcw, rule: "Navigate between questions freely", color: "text-emerald-400", bg: "bg-emerald-400/10" },
                                    { icon: BarChart3, rule: "Instant results after submission", color: "text-violet-400", bg: "bg-violet-400/10" },
                                    { icon: Lock, rule: "One attempt only", color: "text-red-400", bg: "bg-red-400/10" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/3 border border-white/5">
                                        <div className={`w-6 h-6 rounded-md ${item.bg} flex items-center justify-center shrink-0`}>
                                            <item.icon className={`w-3 h-3 ${item.color}`} />
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium">{item.rule}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setShowRules(false)}
                                    className="px-5 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-bold text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

