"use client";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useId, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface CourseDescriptionProps {
    description: string;
}

export default function CourseDescription({ description }: CourseDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const scopeId = useId().replace(/:/g, '-');
    const scopeClass = `cd-${scopeId}`;
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
    }, [description]);

    if (!description) return null;

    const isHtml = /<[a-z][\s\S]*>/i.test(description);
    const COLLAPSED_HEIGHT = 380;
    const needsExpansion = contentHeight > COLLAPSED_HEIGHT + 60;

    return (
        <div id="description" className="mt-12 sm:mt-16 scroll-mt-24">
            <style dangerouslySetInnerHTML={{ __html: `
                .${scopeClass} ul { list-style: none !important; padding-left: 0 !important; margin: 0.75rem 0 !important; }
                .${scopeClass} ul > li { 
                    position: relative !important; 
                    padding-left: 1.75rem !important; 
                    margin: 0.5rem 0 !important; 
                    list-style: none !important; 
                    color: inherit !important;
                    line-height: 1.6 !important;
                }
                .${scopeClass} ul > li::before {
                    content: '' !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0.25rem !important;
                    width: 1.1rem !important;
                    height: 1.1rem !important;
                    background-color: #6366f1 !important;
                    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%2F%3E%3Cpath d='m9 11 3 3L22 4'%2F%3E%3C%2Fsvg%3E") !important;
                    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%2F%3E%3Cpath d='m9 11 3 3L22 4'%2F%3E%3C%2Fsvg%3E") !important;
                    mask-size: contain !important;
                    -webkit-mask-size: contain !important;
                    mask-repeat: no-repeat !important;
                    -webkit-mask-repeat: no-repeat !important;
                }
                /* Hide any input checkboxes found in the list */
                .${scopeClass} ul > li input[type="checkbox"] {
                    display: none !important;
                }
                /* Ensure label or wrapper doesn't mess up layout */
                .${scopeClass} ul > li label {
                    display: contents !important;
                }
                .${scopeClass} ol { list-style: decimal !important; padding-left: 1.5rem !important; margin: 0.75rem 0 !important; }
                .${scopeClass} ol > li { margin: 0.15rem 0 !important; padding-left: 0.5rem !important; color: inherit !important; }
                .${scopeClass} blockquote { 
                    border-left: 3px solid #6366f1 !important; 
                    padding-left: 1.5rem !important; 
                    font-style: italic !important; 
                    margin: 1rem 0 !important;
                    background: linear-gradient(to right, rgba(99, 102, 241, 0.06), transparent) !important;
                    padding: 0.75rem 1.5rem !important;
                    border-radius: 0 0.75rem 0.75rem 0 !important;
                }
                .${scopeClass} h1 { font-size: 1.75rem !important; font-weight: 900 !important; margin-top: 1.5rem !important; margin-bottom: 0.75rem !important; line-height: 1.2 !important; }
                .${scopeClass} h2 { font-size: 1.5rem !important; font-weight: 800 !important; margin-top: 1.25rem !important; margin-bottom: 0.5rem !important; line-height: 1.3 !important; }
                .${scopeClass} h3 { font-size: 1.25rem !important; font-weight: 700 !important; margin-top: 1rem !important; margin-bottom: 0.35rem !important; }
                .${scopeClass} a { color: #6366f1 !important; text-decoration: underline !important; font-weight: 600 !important; text-underline-offset: 4px !important; text-decoration-color: rgba(99, 102, 241, 0.3) !important; }
                .${scopeClass} a:hover { text-decoration-color: rgba(99, 102, 241, 0.8) !important; }
                .${scopeClass} p { margin: 1.25rem 0 !important; }
                .${scopeClass} li p { margin: 0 !important; }
                .${scopeClass} strong { color: inherit !important; font-weight: 700 !important; }
            `}} />

            {/* Section header */}
            <div className="mb-8 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    <FileText className="w-3.5 h-3.5" />
                    Course Overview
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    About this course
                </h2>
            </div>

            {/* Content card */}
            <div className="relative rounded-2xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/2 backdrop-blur-sm overflow-hidden">
                <motion.div
                    initial={false}
                    animate={{ 
                        height: isExpanded || !needsExpansion ? 'auto' : COLLAPSED_HEIGHT,
                    }}
                    transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
                    className="relative overflow-hidden"
                >
                    <div
                        ref={contentRef}
                        className={cn(
                            scopeClass,
                            "px-6 sm:px-8 py-6 sm:py-8",
                            "text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] font-medium",
                            "prose dark:prose-invert prose-slate max-w-none",
                            "prose-p:leading-relaxed prose-li:leading-snug"
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

                    {/* Gradient mask */}
                    <AnimatePresence>
                        {!isExpanded && needsExpansion && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                                className="absolute inset-x-0 bottom-0 h-44 pointer-events-none z-10" 
                                style={{
                                    background: 'linear-gradient(to top, var(--color-background) 0%, var(--color-background) 10%, color-mix(in srgb, var(--color-background) 85%, transparent) 40%, transparent 100%)'
                                }}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>

                {needsExpansion && (
                    <div className={cn(
                        "relative z-20 flex items-center justify-center",
                        "border-t border-slate-300 dark:border-white/10",
                        "bg-slate-50/80 dark:bg-white/2"
                    )}>
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="group flex items-center gap-2 py-3.5 px-6 w-full justify-center transition-colors duration-200 hover:bg-slate-100/80 dark:hover:bg-white/4"
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={isExpanded ? 'less' : 'more'}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                                >
                                    {isExpanded ? (
                                        <>
                                            Show Less
                                            <ChevronUp className="w-3.5 h-3.5" />
                                        </>
                                    ) : (
                                        <>
                                            Read Full Description
                                            <ChevronDown className="w-3.5 h-3.5" />
                                        </>
                                    )}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
