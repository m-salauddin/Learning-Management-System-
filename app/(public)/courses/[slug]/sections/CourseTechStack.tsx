"use client";
import { Code } from "lucide-react";
import { getTechBadgeData } from "@/components/ui/TechBadge";
interface CourseTechStackProps {
    tags: string[];
}
export default function CourseTechStack({ tags }: CourseTechStackProps) {
    if (!tags || tags.length === 0) return null;
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                        <Code className="w-3.5 h-3.5" />
                        Advanced Tools
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white transition-colors">Advanced tools you will learn</h3>
                </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {tags.map((tag, i) => {
                    const { icon, brandColor } = getTechBadgeData(tag);
                    return (
                        <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-white/5 bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:border-primary/30 transition-all group cursor-default hover:shadow-md">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${brandColor}25` }}>
                                <span style={{ color: brandColor }} className="text-base font-bold">{icon}</span>
                            </div>
                            <span className="font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{tag}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
