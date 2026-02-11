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
        <div className="mt-8">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Requirements Card */}
                {hasRequirements && (
                    <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <ListChecks className="w-4 h-4 text-amber-500" />
                            </div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-widest">Requirements</h4>
                        </div>
                        <ul className="space-y-4">
                            {requirements.map((req, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-400">
                                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500/50 mt-1.5" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Audience Card */}
                {hasAudience && (
                    <div className="p-8 rounded-[2rem] bg-slate-950/50 border border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Target className="w-4 h-4 text-blue-500" />
                            </div>
                            <h4 className="font-bold text-white text-sm uppercase tracking-widest">Who is this for</h4>
                        </div>
                        <ul className="space-y-4">
                            {targetAudience.map((item, i) => (
                                <li key={i} className="flex gap-3 text-sm text-slate-400">
                                    <CheckCircle2 className="shrink-0 w-4 h-4 text-blue-500/50 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
