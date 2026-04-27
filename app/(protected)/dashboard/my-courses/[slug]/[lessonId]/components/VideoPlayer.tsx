"use client";
import { useState, useEffect } from "react";
import { FileText, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
    currentLesson: any;
    hasAccess: boolean;
    isCinematic: boolean;
    videoUrl: string | null;
    loadingVideo: boolean;
}

export function VideoPlayer({
    currentLesson, hasAccess, isCinematic, videoUrl, loadingVideo
}: VideoPlayerProps) {
    const isVideoLesson = currentLesson.lesson_type?.toLowerCase() === 'video';
    const isContentLesson = currentLesson.lesson_type === 'quiz' || currentLesson.lesson_type === 'assignment' || currentLesson.lesson_type === 'assessment_center';

    // Don't render for quiz/assignment/assessment
    if (isContentLesson) return null;

    return (
        <div className={cn(
            "relative overflow-hidden group transform-gpu bg-slate-950",
            isCinematic
                ? "aspect-21/9 border-b border-white/4"
                : "rounded-2xl border border-slate-200/60 dark:border-white/6 shadow-lg",
            "aspect-video"
        )}>
            {hasAccess ? (
                <>
                    {isVideoLesson ? (
                        loadingVideo ? (
                            <LoadingState />
                        ) : videoUrl ? (
                            <VideoEmbed videoUrl={videoUrl} title={currentLesson.title} />
                        ) : (
                            <NoVideoState />
                        )
                    ) : (
                        <NoVideoState />
                    )}
                </>
            ) : (
                <LockedState />
            )}
        </div>
    );
}

function LoadingState() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
            <div className="relative">
                <div className="w-14 h-14 border-[3px] border-primary/20 rounded-full" />
                <div className="absolute inset-0 w-14 h-14 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Loading video...</p>
        </div>
    );
}

function VideoEmbed({ videoUrl, title }: { videoUrl: string; title: string }) {
    let embedSrc = videoUrl;
    if (!videoUrl.includes('/embed/')) {
        const ytMatch = videoUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (ytMatch) embedSrc = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    const finalSrc = embedSrc.includes('?')
        ? embedSrc + '&rel=0&modestbranding=1&enablejsapi=1'
        : embedSrc + '?rel=0&modestbranding=1&enablejsapi=1';

    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    if (isYouTube) {
        return (
            <iframe
                key={finalSrc}
                src={finalSrc}
                className="absolute inset-0 w-full h-full z-10 border-none bg-black"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                title={title}
            />
        );
    }

    return (
        <video
            src={videoUrl}
            controls
            className="absolute inset-0 w-full h-full z-10"
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
        />
    );
}

function NoVideoState() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-950/80 backdrop-blur z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/6 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 opacity-40" />
            </div>
            <p className="text-[11px] font-semibold text-slate-400">No video available</p>
            <p className="text-[10px] mt-1 text-slate-600">Check the lesson content below</p>
        </div>
    );
}

function LockedState() {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center z-10">
            <div className="w-20 h-20 rounded-2xl bg-primary/6 border border-primary/15 flex items-center justify-center mb-6">
                <Terminal className="w-8 h-8 text-primary/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Content Locked</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">Enroll in this course to access the lesson content.</p>
        </div>
    );
}
