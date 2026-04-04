"use client";
import { ListChecks, Target, CheckCircle2 } from "lucide-react";
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
            {}
            {hasRequirements && (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                            <ListChecks className="w-3.5 h-3.5" />
                            Requirements
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                            What you'll need
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
                            Here's a list of everything you'll need before starting this course.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {requirements.map((req, i) => {
                            const [title, ...descParts] = req.includes(":") ? req.split(":") : [`Requirement ${i + 1}`, req];
                            const desc = descParts.join(":").trim();
                            return (
                                <div
                                    key={i}
                                    className="group p-5 sm:p-6 rounded-[2rem] bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-amber-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm dark:shadow-none group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                            <ListChecks className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1">{title.trim()}</p>
                                            <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {}
            {hasAudience && (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                            <Target className="w-3.5 h-3.5" />
                            Target Audience
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                            Who is this for?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
                            This course is designed for anyone looking to take their skills to the next level.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {targetAudience.map((item, i) => {
                            const [title, ...descParts] = item.includes(":") ? item.split(":") : [`Target ${i + 1}`, item];
                            const desc = descParts.join(":").trim();
                            return (
                                <div
                                    key={i}
                                    className="group p-5 sm:p-6 rounded-[2rem] bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm dark:shadow-none group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                                            <Target className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-blue-600 dark:text-blue-500 uppercase tracking-widest mb-1">{title.trim()}</p>
                                            <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
