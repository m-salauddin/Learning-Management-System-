"use client";
import { Trophy, User, Medal } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
    stats: { overallScore: number; quiz: number; assignment: number; progress: number };
    progressPct: number;
    completedTotal: number;
    totalLessons: number;
    leaderboard: any[];
    onSeeAll: () => void;
}

export function Sidebar({ stats, progressPct, completedTotal, totalLessons, leaderboard, onSeeAll }: Props) {
    return (
        <div className="sticky top-4 space-y-4">

            <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/6 rounded-2xl overflow-hidden">
                <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Your Progress</span>
                        <span className="text-[15px] font-black text-slate-900 dark:text-white tabular-nums">{progressPct}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1.2, ease: "easeOut" }}
                            className="h-full bg-primary rounded-full" />
                    </div>
                    <p className="mt-2 text-[10px] text-slate-400 tabular-nums font-medium">{completedTotal} of {totalLessons} lessons completed</p>
                </div>
                <div className="divide-y divide-slate-100/60 dark:divide-white/4">
                    {[
                        { label: "Overall Score", value: stats.overallScore, color: "text-primary" },
                        { label: "Quiz Score", value: stats.quiz, color: "text-violet-600 dark:text-violet-400" },
                        { label: "Assignment Score", value: stats.assignment, color: "text-emerald-600 dark:text-emerald-400" },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between px-5 py-3">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{label}</span>
                            <span className={cn("text-[12px] font-bold tabular-nums", color)}>{(value || 0).toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
            </div>


            <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/6 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Learners</span>
                    </div>
                    <button onClick={onSeeAll} className="text-[10px] text-primary hover:underline font-bold cursor-pointer">See all</button>
                </div>
                <div className="divide-y divide-slate-100/60 dark:divide-white/4">
                    {leaderboard.slice(0, 5).map((student) => (
                        <div key={student.id} className={cn("flex items-center gap-2.5 px-5 py-2.5", student.isCurrentUser && "bg-primary/3")}>
                            <span className={cn("w-5 text-center text-[11px] font-black tabular-nums shrink-0",
                                student.rank === 1 ? "text-yellow-500" : student.rank === 2 ? "text-slate-400" : student.rank === 3 ? "text-amber-600" : "text-slate-400 font-semibold"
                            )}>{student.rank}</span>
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                {student.avatar ? <Image src={student.avatar} alt={student.name} width={24} height={24} className="object-cover w-full h-full" /> : <User className="w-3 h-3 text-slate-400" />}
                            </div>
                            <span className={cn("flex-1 text-[11px] truncate", student.isCurrentUser ? "font-bold text-primary" : "font-semibold text-slate-600 dark:text-slate-300")}>
                                {student.name || "Student"}{student.isCurrentUser && <span className="ml-1 text-[9px] text-primary/50">(you)</span>}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 tabular-nums shrink-0">{(student.score || 0).toFixed(1)}%</span>
                        </div>
                    ))}
                    {leaderboard.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <Medal className="w-5 h-5 text-slate-300 dark:text-slate-700" />
                            <p className="text-[10px] text-slate-400 font-medium">No rankings yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
