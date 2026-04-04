"use client";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
interface CourseDescriptionProps {
    description: string;
}
export default function CourseDescription({ description }: CourseDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    if (!description) return null;
    const isHtml = /<[a-z][\s\S]*>/i.test(description);
    return (
        <div id="description" className="mt-12 sm:mt-16 space-y-8 scroll-mt-24">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <FileText className="w-3.5 h-3.5" />
                    Course Overview
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                    About this course
                </h2>
            </div>
            <div className="relative group">
                {}
                <div
                    className={cn(
                        "relative overflow-hidden transition-all duration-700 ease-in-out",
                        !isExpanded ? "max-h-[400px]" : "max-h-[4000px]"
                    )}
                >
                    <div
                        className={cn(
                            "text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed sm:leading-loose font-medium space-y-6",
                            "prose dark:prose-invert prose-slate max-w-none prose-p:leading-loose prose-li:leading-relaxed"
                        )}
                    >
                        {isHtml ? (
                            <div dangerouslySetInnerHTML={{ __html: description }} />
                        ) : (
                            <div className="whitespace-pre-line">
                                {description}
                            </div>
                        )}
                    </div>
                    {}
                    {!isExpanded && (
                        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background via-background/80 to-transparent z-10 pointer-events-none" />
                    )}
                </div>
                {}
                <div className="mt-8 flex justify-start">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 z-20"
                    >
                        {isExpanded ? (
                            <>
                                Show Less
                                <ChevronUp className="w-3.5 h-3.5" />
                            </>
                        ) : (
                            <>
                                Read Full Description
                                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
