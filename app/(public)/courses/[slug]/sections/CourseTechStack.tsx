"use client";

import { Code } from "lucide-react";
import { getTechBadgeData } from "@/components/ui/TechBadge";

interface CourseTechStackProps {
    tags: string[];
}

export default function CourseTechStack({ tags }: CourseTechStackProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                        <Code className="w-3.5 h-3.5" />
                        Tools of Trade
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white transition-colors">Advanced Tech Stack</h3>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {tags.map((tag, i) => {
                    const { icon, brandColor } = getTechBadgeData(tag);
                    return (
                        <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-900/40 hover:border-primary/30 transition-all group cursor-default text-center">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:rotate-6" style={{ backgroundColor: `${brandColor}15` }}>
                                <span style={{ color: brandColor }} className="text-2xl">{icon}</span>
                            </div>
                            <span className="font-bold text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{tag}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
