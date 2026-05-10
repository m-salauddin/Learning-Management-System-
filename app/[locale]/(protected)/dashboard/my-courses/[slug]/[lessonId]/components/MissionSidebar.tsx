"use client";
import { CheckCircle2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionSidebarProps { currentLesson: any; asset: any; }

export function MissionSidebar({ currentLesson, asset }: MissionSidebarProps) {
    const guidelines = (asset?.resources?.guidelines as string[]) || (
        currentLesson.lesson_type === 'video' ? [
            "Watch the complete lesson video",
            "Take notes on key concepts",
            "Complete the lesson to proceed"
        ] : currentLesson.lesson_type === 'assignment' ? [
            "Download the assignment brief",
            "Complete the solution",
            "Submit your work for review"
        ] : [
            "Review the documentation thoroughly",
            "Extract key learning points",
            "Mark as complete when done"
        ]
    );

    const successSteps = asset?.resources?.success_steps as string[] | undefined;

    return (
        <div className="space-y-4 lg:pt-[44px]">
            <div className="bg-white dark:bg-[#060a14] border border-slate-200/80 dark:border-white/6 rounded-2xl p-5 space-y-4 shadow-sm hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/6 border border-primary/15 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-[11px] uppercase tracking -wider text-slate-700 dark:text-white">Objectives</h3>
                </div>
                <div className="space-y-1.5">
                    {guidelines.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/40 dark:border-white/4 hover:bg-slate-100 dark:hover:bg-white/4 transition-colors group/item">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 group-hover/item:scale-110 transition-transform" />
                            <span className="text-[11px] text-slate-500 font-medium">{step}</span>
                        </div>
                    ))}
                    {successSteps?.map((step: string, idx: number) => (
                        <div key={`s-${idx}`} className="flex items-center gap-3 p-2.5 rounded-xl bg-primary/3 border border-primary/10 hover:bg-primary/6 transition-colors">
                            <Trophy className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-[11px] text-slate-700 dark:text-white font-semibold">{step}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
