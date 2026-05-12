import { ListChecks, Target, ChevronRight, CheckCircle2 } from "lucide-react";

interface CoursePrerequisitesProps {
    requirements: string[];
    targetAudience: string[];
    whatYouLearn?: string[];
}

export default function CoursePrerequisites({ requirements, targetAudience, whatYouLearn = [] }: CoursePrerequisitesProps) {
    const hasRequirements = requirements && requirements.length > 0;
    const hasAudience = targetAudience && targetAudience.length > 0;
    const hasOutcomes = whatYouLearn && whatYouLearn.length > 0;

    if (!hasRequirements && !hasAudience && !hasOutcomes) return null;

    return (
        <div className="mt-12 sm:mt-16 space-y-16">
            {/* What you'll learn */}
            {hasOutcomes && (
                <div className="space-y-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Learning Outcomes
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            What you'll learn
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-white/5">
                            {[
                                whatYouLearn.slice(0, Math.ceil(whatYouLearn.length / 2)),
                                whatYouLearn.slice(Math.ceil(whatYouLearn.length / 2))
                            ].map((column, colIdx) => (
                                <ul key={colIdx} className="divide-y divide-slate-100 dark:divide-white/4">
                                    {column.map((outcome, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3.5 px-6 sm:px-8 py-4 sm:py-5 group hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-colors"
                                        >
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                                            </div>
                                            <span className="text-sm sm:text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {outcome}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16">
                {/* Requirements */}
                {hasRequirements && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                                <ListChecks className="w-3.5 h-3.5" />
                                Requirements
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Prerequisites
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/2 overflow-hidden">
                            <ul className="divide-y divide-slate-100 dark:divide-white/4">
                                {requirements.map((req, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 px-5 py-3.5 group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
                                    >
                                        <div className="shrink-0 w-5 h-5 mt-0.5 rounded-md bg-amber-500/10 flex items-center justify-center">
                                            <ChevronRight className="w-3 h-3 text-amber-500" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {req}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Target Audience */}
                {hasAudience && (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                <Target className="w-3.5 h-3.5" />
                                Target Audience
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Who is this for?
                            </h2>
                        </div>

                        <div className="rounded-2xl border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/2 overflow-hidden">
                            <ul className="divide-y divide-slate-100 dark:divide-white/4">
                                {targetAudience.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 px-5 py-3.5 group hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
                                    >
                                        <div className="shrink-0 w-5 h-5 mt-0.5 rounded-md bg-blue-500/10 flex items-center justify-center">
                                            <Target className="w-3 h-3 text-blue-500" />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
