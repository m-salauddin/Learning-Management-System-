"use client";
import { Download, Upload, CheckCircle2, Terminal, ChevronRight, Eye } from "lucide-react";
import { parseMarkdown } from "@/lib/markdown-parser";
import { cn } from "@/lib/utils";

interface TextContentProps {
    currentLesson: any;
    asset: any;
    assignment: any;
    submissionStatus: any;
    onDownload: () => void;
    onSubmit: () => void;
    onCompleteAndNext?: () => void;
}

export function TextContent({
    currentLesson, asset, assignment, submissionStatus, onDownload, onSubmit, onCompleteAndNext
}: TextContentProps) {
    const isText = currentLesson.lesson_type === 'text' || currentLesson.lesson_type === 'assignment';
    if (!isText) return null;

    return (
        <div className="bg-white dark:bg-[#060a14] rounded-2xl border border-slate-200/80 dark:border-white/6 overflow-hidden shadow-sm">
            <div className="p-8 lg:p-12 space-y-8">
                {/* Badge + Title */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className={cn(
                            "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                            currentLesson.lesson_type === 'assignment'
                                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20"
                                : "bg-slate-100 dark:bg-white/4 text-slate-500 border border-slate-200/60 dark:border-white/6"
                        )}>
                            {currentLesson.lesson_type === 'assignment' ? 'Assignment' : 'Reading'}
                        </span>
                        {submissionStatus && (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3" /> Submitted
                            </span>
                        )}
                        <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/4" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                        {currentLesson.title}
                    </h2>
                </div>

                {/* Content */}
                <div className="prose prose-sm lg:prose-base prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
                    {assignment?.markdown_content ? (
                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(assignment.markdown_content) }} />
                    ) : asset?.markdown_content ? (
                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(asset.markdown_content) }} />
                    ) : currentLesson.description ? (
                        <div dangerouslySetInnerHTML={{ __html: parseMarkdown(currentLesson.description) }} />
                    ) : (
                        <div className="py-16 flex flex-col items-center justify-center text-slate-400 italic">
                            <Terminal className="w-10 h-10 mb-4 opacity-20" />
                            <p className="text-sm">No content available for this lesson.</p>
                        </div>
                    )}
                </div>

                {/* Assignment actions */}
                {currentLesson.lesson_type === 'assignment' && (
                    <div className="space-y-3 pt-6 border-t border-slate-200/60 dark:border-white/4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onDownload}
                                className="flex-1 py-3 bg-slate-100 dark:bg-white/4 text-slate-700 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/6 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-slate-200/60 dark:border-white/6"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Download Brief
                            </button>
                            {submissionStatus ? (
                                <button
                                    onClick={onSubmit}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/4 text-slate-700 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/6 transition-all active:scale-[0.98] flex items-center justify-center gap-2 border border-slate-200/60 dark:border-white/6"
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    View Submission
                                </button>
                            ) : (
                                <button
                                    onClick={onSubmit}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all shadow-sm shadow-primary/15 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    Submit Solution
                                </button>
                            )}
                        </div>
                        {submissionStatus && onCompleteAndNext && (
                            <button
                                onClick={onCompleteAndNext}
                                className="w-full py-3.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all shadow-sm shadow-primary/15 active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                Continue to Next <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
