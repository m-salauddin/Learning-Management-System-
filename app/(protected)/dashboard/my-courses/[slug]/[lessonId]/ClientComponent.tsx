"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

import { useCoursePlayer } from "../CoursePlayerContext";
import { VideoPlayer } from "./components/VideoPlayer";
import { TextContent } from "./components/TextContent";
import { QuizView } from "./components/QuizView";
import { AssessmentCenter } from "./components/AssessmentCenter";
import { LessonNotes } from "./components/LessonNotes";
import { MissionSidebar } from "./components/MissionSidebar";
import { SubmissionModal } from "./components/SubmissionModal";

const FALLBACK_VIDEOS = [
    'https://www.youtube.com/embed/BgZHbCDFODk',
    'https://www.youtube.com/embed/vwSlYG7hFk0',
    'https://www.youtube.com/embed/rHux0gMZ3Eg',
    'https://www.youtube.com/embed/J6Hvs_E-hJc',
    'https://www.youtube.com/embed/ysz5S6PUM-U',
    'https://www.youtube.com/embed/hvivIO9zjcA',
    'https://www.youtube.com/embed/x3oFbraGifI',
    'https://www.youtube.com/embed/Gi4WeTTsQCo',
    'https://www.youtube.com/embed/G3e-cpL7oug',
    'https://www.youtube.com/embed/MiLAE6HMr10',
];

interface LessonContentProps {
    currentLesson: any;
    asset: any;
    quiz?: any;
    assignment?: any;
}

/**
 * Content-only component. The sidebar + header live in the layout shell.
 * This component ONLY renders the main content area that changes per lesson.
 */
export function CoursePlayerClient({
    currentLesson, asset, quiz, assignment
}: LessonContentProps) {
    const {
        course, userId, enrollmentId, hasAccess,
        isCinematic, isPending, navigate,
        handleCompleteAndNext, prevLesson, nextLesson,
    } = useCoursePlayer();
    const supabase = createClient();
    const { success, error } = useToast();

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [submissionLink, setSubmissionLink] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState<any>(null);

    // ── Video loading ──
    useEffect(() => {
        setVideoUrl(null);
        if (!hasAccess) { setLoadingVideo(false); return; }
        setLoadingVideo(true);
        const getFallback = (id: string) => {
            const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
            return FALLBACK_VIDEOS[hash % FALLBACK_VIDEOS.length];
        };
        (async () => {
            try {
                const { data, error: e } = await (supabase.from('lesson_assets').select('video_path').eq('lesson_id', currentLesson.id).single() as any);
                if (e || !data?.video_path) { setVideoUrl(getFallback(currentLesson.id)); return; }
                const path = data.video_path as string;
                if (path.startsWith('http')) { setVideoUrl(path); }
                else {
                    try {
                        const res = await fetch(`/api/lessons/${currentLesson.id}/video`);
                        if (res.ok) { const d = await res.json(); setVideoUrl(d?.url || getFallback(currentLesson.id)); }
                        else setVideoUrl(getFallback(currentLesson.id));
                    } catch { setVideoUrl(getFallback(currentLesson.id)); }
                }
            } catch { setVideoUrl(getFallback(currentLesson.id)); }
            finally { setLoadingVideo(false); }
        })();
    }, [currentLesson.id, hasAccess]);

    // ── Assignment submission check ──
    useEffect(() => {
        setSubmissionStatus(null);
        setSubmissionLink("");
        if (currentLesson.lesson_type === 'assignment' && userId) {
            (async () => {
                const { data } = await supabase.from('assignment_submissions').select('*').eq('lesson_id', currentLesson.id).eq('user_id', userId).maybeSingle();
                if (data) { setSubmissionStatus(data); setSubmissionLink(data.submission_link); }
            })();
        }
    }, [currentLesson.id, userId]);

    const handleDownload = () => {
        const content = assignment?.markdown_content || asset?.markdown_content || currentLesson.description;
        if (!content) { error("No content available to download."); return; }
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `assignment-${currentLesson.title.toLowerCase().replace(/\s+/g, '-')}.md`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
        success("Download started!");
    };

    const handleSubmitAssignment = async () => {
        if (!submissionLink.trim()) { error("Please provide a valid URL."); return; }
        setIsSubmitting(true);
        try {
            const { data, error: e } = await supabase.from('assignment_submissions').upsert({ user_id: userId, lesson_id: currentLesson.id, submission_link: submissionLink, status: 'pending' }, { onConflict: 'user_id,lesson_id' }).select().single();
            if (e) throw e;
            setSubmissionStatus(data); setShowSubmissionModal(false); success("Submitted successfully!");
        } catch (err: any) { error(err.message || "Submission failed."); }
        finally { setIsSubmitting(false); }
    };

    const isContentLesson = currentLesson.lesson_type === 'quiz' || currentLesson.lesson_type === 'assignment' || currentLesson.lesson_type === 'assessment_center';
    const isVideoType = !isContentLesson;

    return (
        <>
            <div className={cn("mx-auto w-full", isCinematic ? "max-w-none px-0" : "max-w-6xl p-5 lg:p-8")}>
                {/* Video */}
                {isVideoType && <VideoPlayer currentLesson={currentLesson} hasAccess={hasAccess} isCinematic={isCinematic} videoUrl={videoUrl} loadingVideo={loadingVideo} />}

                {/* Text/Assignment content */}
                {hasAccess && (
                    <div className={cn(isVideoType && "mt-6")}>
                        <TextContent currentLesson={currentLesson} asset={asset} assignment={assignment} submissionStatus={submissionStatus} onDownload={handleDownload} onSubmit={() => setShowSubmissionModal(true)} onCompleteAndNext={handleCompleteAndNext} />
                    </div>
                )}

                {/* Quiz */}
                {hasAccess && <QuizView currentLesson={currentLesson} quiz={quiz} asset={asset} userId={userId} supabase={supabase} enrollmentId={enrollmentId} onCompleteAndNext={handleCompleteAndNext} />}

                {/* Assessment Center */}
                {hasAccess && <AssessmentCenter currentLesson={currentLesson} course={course} userId={userId} supabase={supabase} enrollmentId={enrollmentId} onCompleteAndNext={handleCompleteAndNext} />}

                {/* Below-video content area */}
                {!isCinematic && isVideoType && hasAccess && (
                    <div className="mt-10 space-y-10 pb-24">
                        {/* Title + Nav */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">{currentLesson.title}</h1>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => prevLesson && navigate(`/dashboard/my-courses/${course.slug}/${prevLesson.id}`)} disabled={!prevLesson || isPending}
                                    className="h-11 w-11 rounded-xl border border-slate-200/80 dark:border-white/6 bg-white dark:bg-white/3 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/6 disabled:opacity-20 transition-all active:scale-95 text-slate-500">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={handleCompleteAndNext} disabled={!nextLesson}
                                    className="h-11 px-6 rounded-xl bg-primary text-white flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95 shadow-sm shadow-primary/15 font-bold text-[10px] uppercase tracking-wider">
                                    Complete & Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notes + Sidebar grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <LessonNotes lessonId={currentLesson.id} />
                            </div>
                            <MissionSidebar currentLesson={currentLesson} asset={asset} />
                        </div>
                    </div>
                )}
            </div>

            {/* Submission modal */}
            <SubmissionModal isOpen={showSubmissionModal} onClose={() => setShowSubmissionModal(false)} link={submissionLink} setLink={setSubmissionLink} onSubmit={handleSubmitAssignment} isSubmitting={isSubmitting} status={submissionStatus} />
        </>
    );
}
