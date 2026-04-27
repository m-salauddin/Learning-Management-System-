"use client";
import { Check, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
    assignments: any[];
    completedLessonIds: string[];
    courseSlug: string;
}

export function AssignmentsTab({ assignments, completedLessonIds, courseSlug }: Props) {
    if (assignments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-center">
                    <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">No Assignments Yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Assignments will appear here as they become available</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50/50 dark:bg-white/1.5 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100 dark:border-white/4">
                <span className="col-span-1 text-center">#</span>
                <span className="col-span-6">Assignment</span>
                <span className="col-span-3">Module</span>
                <span className="col-span-2 text-right">Action</span>
            </div>
            <div className="divide-y divide-slate-100/60 dark:divide-white/3">
                {assignments.map((assignment, idx) => {
                    const isDone = completedLessonIds.includes(assignment.id);
                    return (
                        <div key={assignment.id} className="grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-slate-50/40 dark:hover:bg-white/1.5 transition-colors">
                            <span className="col-span-1 text-center">
                                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center mx-auto",
                                    isDone ? "bg-emerald-500" : "border-[1.5px] border-slate-200 dark:border-white/1"
                                )}>
                                    {isDone ? <Check className="w-3 h-3 text-white" /> : <span className="text-[9px] text-slate-400 tabular-nums font-bold">{String(idx + 1).padStart(2, "0")}</span>}
                                </div>
                            </span>
                            <div className="col-span-6 min-w-0">
                                <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 truncate">{assignment.title}</p>
                                <span className={cn("inline-flex text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider mt-1",
                                    isDone ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                )}>{isDone ? "Submitted" : "Pending"}</span>
                            </div>
                            <p className="col-span-3 text-[10px] text-slate-400 truncate font-medium">{assignment.moduleName}</p>
                            <div className="col-span-2 flex justify-end">
                                <Link href={`/dashboard/my-courses/${courseSlug}/${assignment.id}`}
                                    className={cn("inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                                        isDone ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            : "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/20"
                                    )}>
                                    {isDone ? "Review" : "Submit"} <ChevronRight className="w-2.5 h-2.5" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
