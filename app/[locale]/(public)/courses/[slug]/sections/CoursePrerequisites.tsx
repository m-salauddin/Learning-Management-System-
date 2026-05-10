"use client";
import { ListChecks, Target, ChevronRight } from "lucide-react";

interface CoursePrerequisitesProps {
    requirements: string[];
    targetAudience: string[];
}

export default function CoursePrerequisites({ requirements, targetAudience }: CoursePrerequisitesProps) {
    const hasRequirements = requirements && requirements.length > 0;
    const hasAudience = targetAudience && targetAudience.length > 0;

    if (!hasRequirements && !hasAudience) return null;

    return (
        <div className="mt-12 sm:mt-16 space-y-12">
            {/* Requirements */}
            {hasRequirements && (() => {
                const mid = Math.ceil(requirements.length / 2);
                const leftItems = requirements.slice(0, mid);
                const rightItems = requirements.slice(mid);
                
                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                                <ListChecks className="w-3.5 h-3.5" />
                                Requirements
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                What you'll need
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/4">
                                <ul className="divide-y divide-slate-100 dark:divide-white/4">
                                    {leftItems.map((req, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 px-5 sm:px-6 py-3.5 sm:py-4 group hover:bg-slate-50/80 dark:hover:bg-white/2 transition-colors"
                                        >
                                            <div className="shrink-0 w-5 h-5 mt-0.5 rounded-md bg-amber-500/10 flex items-center justify-center">
                                                <ChevronRight className="w-3 h-3 text-amber-500" />
                                            </div>
                                            <span className="text-sm sm:text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                                                {req}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="divide-y divide-slate-100 dark:divide-white/4">
                                    {rightItems.map((req, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 px-5 sm:px-6 py-3.5 sm:py-4 group hover:bg-slate-50/80 dark:hover:bg-white/2 transition-colors"
                                        >
                                            <div className="shrink-0 w-5 h-5 mt-0.5 rounded-md bg-amber-500/10 flex items-center justify-center">
                                                <ChevronRight className="w-3 h-3 text-amber-500" />
                                            </div>
                                            <span className="text-sm sm:text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                                                {req}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* Target Audience */}
            {hasAudience && (() => {
                const mid = Math.ceil(targetAudience.length / 2);
                const leftItems = targetAudience.slice(0, mid);
                const rightItems = targetAudience.slice(mid);

                return (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                <Target className="w-3.5 h-3.5" />
                                Target Audience
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                Who is this for?
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-none">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-white/4">
                                <ul className="divide-y divide-slate-100 dark:divide-white/4">
                                    {leftItems.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 px-5 sm:px-6 py-3.5 sm:py-4 group hover:bg-slate-50/80 dark:hover:bg-white/2 transition-colors"
                                        >
                                            <div className="shrink-0 w-5 h-5 mt-0.5 rounded-md bg-blue-500/10 flex items-center justify-center">
                                                <Target className="w-3 h-3 text-blue-500" />
                                            </div>
                                            <span className="text-sm sm:text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <ul className="divide-y divide-slate-100 dark:divide-white/4">
                                    {rightItems.map((item, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 px-5 sm:px-6 py-3.5 sm:py-4 group hover:bg-slate-50/80 dark:hover:bg-white/2 transition-colors"
                                        >
                                            <div className="shrink-0 w-5 h-5 mt-0.5 rounded-md bg-blue-500/10 flex items-center justify-center">
                                                <Target className="w-3 h-3 text-blue-500" />
                                            </div>
                                            <span className="text-sm sm:text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-snug">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}
