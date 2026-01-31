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
    ArrowLeft
} from "lucide-react";
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

    // Flatten lessons for navigation
    const allLessons = course.modules.flatMap((m: any) => m.lessons);
    const currentIndex = allLessons.findIndex((l: any) => l.id === currentLesson.id);
    const nextLesson = allLessons[currentIndex + 1];
    const prevLesson = allLessons[currentIndex - 1];

    const handleNext = () => {
        if (nextLesson) {
            router.push(`/courses/${course.slug}/learn/${nextLesson.id}`);
        }
    };

    const handlePrev = () => {
        if (prevLesson) {
            router.push(`/courses/${course.slug}/learn/${prevLesson.id}`);
        }
    };

    const handleCompleteAndNext = async () => {
        if (!enrollmentId) {
            if (nextLesson) {
                router.push(`/courses/${course.slug}/learn/${nextLesson.id}`);
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
                router.push(`/courses/${course.slug}/learn/${nextLesson.id}`);
            } else {
                router.push(`/courses/${course.slug}`);
                success("Course finished! Congratulations!");
            }
        } catch (err) {
            console.error("Failed to save progress:", err);
            // Fallback navigation
            handleNext();
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn_local(
                    "fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    !sidebarOpen && "-translate-x-full lg:hidden"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <Link href={`/courses/${course.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Course
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-muted rounded-md"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Course Title */}
                    <div className="p-4 border-b border-border bg-muted/30">
                        <h2 className="font-bold line-clamp-2">{course.title}</h2>
                        {/* Progress UI would go here fetching from DB or passed props */}
                    </div>

                    {/* Modules List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {course.modules.map((module: any, idx: number) => (
                            <div key={module.id}>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                                    Module {idx + 1}: {module.title}
                                </h3>
                                <div className="space-y-1">
                                    {module.lessons.map((lesson: any) => {
                                        const isActive = lesson.id === currentLesson.id;
                                        return (
                                            <Link
                                                key={lesson.id}
                                                href={`/courses/${course.slug}/learn/${lesson.id}`}
                                                className={cn_local(
                                                    "flex items-start gap-3 p-2 rounded-lg text-sm transition-colors group",
                                                    isActive
                                                        ? "bg-primary/10 text-primary font-medium"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {lesson.is_free_preview || hasAccess ? (
                                                        <div className={cn_local(
                                                            "w-5 h-5 rounded-full border flex items-center justify-center",
                                                            isActive ? "border-primary" : "border-muted-foreground/30"
                                                        )}>
                                                            {isActive ? <div className="w-2 h-2 rounded-full bg-primary" /> : null}
                                                        </div>
                                                    ) : (
                                                        <Lock className="w-4 h-4 text-muted-foreground/50" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="line-clamp-2">{lesson.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5 opacity-70">
                                                        {lesson.duration_minutes || 0} min
                                                    </p>
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
            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                {/* Mobile Header */}
                <header className="h-16 border-b border-border flex items-center px-4 lg:hidden shrink-0">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 hover:bg-muted rounded-md"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="ml-3 font-semibold truncate">{currentLesson.title}</h1>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto w-full">
                        {/* Video Player */}
                        <div className="bg-black aspect-video w-full relative">
                            {hasAccess ? (
                                loadingVideo ? (
                                    <div className="absolute inset-0 flex items-center justify-center text-white">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : videoUrl ? (
                                    <video
                                        src={videoUrl}
                                        controls
                                        className="w-full h-full"
                                        controlsList="nodownload"
                                        onContextMenu={(e) => e.preventDefault()}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                                        <FileText className="w-12 h-12 mb-4 opacity-50" />
                                        <p>No video content for this lesson.</p>
                                    </div>
                                )
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-900 p-6 text-center">
                                    <Lock className="w-12 h-12 mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-bold mb-2">This lesson is locked</h3>
                                    <p className="text-muted-foreground max-w-md mb-6">
                                        Enroll in the course to access this lesson and all other premium content.
                                    </p>
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        View Course Details
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-6 lg:p-10 space-y-8">
                            <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Module: {course.modules.find((m: any) => m.id === currentLesson.module_id)?.title}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePrev}
                                        disabled={!prevLesson}
                                        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Previous Lesson"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        disabled={!nextLesson}
                                        className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Next Lesson"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Markdown/Text Content */}
                            {asset?.content_markdown && hasAccess && (
                                <div className="prose dark:prose-invert max-w-none">
                                    <div className="whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed">
                                        {asset.content_markdown}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Footer */}
                            <div className="flex items-center justify-between pt-6 border-t border-border">
                                {prevLesson ? (
                                    <button
                                        onClick={handlePrev}
                                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        <span className="text-sm font-medium">Previous: {prevLesson.title}</span>
                                    </button>
                                ) : <div />}

                                {nextLesson ? (
                                    <button
                                        onClick={handleCompleteAndNext}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        <span className="text-sm">Complete & Continue</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCompleteAndNext}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-sm">Finish Course</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
