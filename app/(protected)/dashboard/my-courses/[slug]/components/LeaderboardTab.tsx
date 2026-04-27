"use client";
import { Trophy, Flame, User, Medal } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
    leaderboard: any[];
}

export function LeaderboardTab({ leaderboard }: Props) {
    const currentUser = leaderboard.find((s) => s.isCurrentUser);

    if (leaderboard.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-slate-400" />
                </div>
                <div className="text-center">
                    <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">No Rankings Yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Leaderboard appears once students start learning</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {currentUser && (
                <div className="flex items-center gap-3.5 px-5 py-3.5 bg-linear-to-r from-primary/5 to-transparent border-b border-primary/10">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-[11px] shrink-0 tabular-nums">
                        #{currentUser.rank}
                    </div>
                    <div className="flex-1">
                        <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Your Current Rank</p>
                        <p className="text-[10px] text-slate-500">
                            Score: <span className="font-bold text-primary tabular-nums">{(currentUser.score || 0).toFixed(1)}%</span>
                        </p>
                    </div>
                    <Flame className="w-4.5 h-4.5 text-primary" />
                </div>
            )}

            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50/50 dark:bg-white/1.5 border-b border-slate-100 dark:border-white/4 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
                <span className="col-span-1 text-center">Rank</span>
                <span className="col-span-7">Student</span>
                <span className="col-span-2 text-right">Score</span>
                <span className="col-span-2 text-right">Progress</span>
            </div>

            <div className="divide-y divide-slate-100/60 dark:divide-white/3">
                {leaderboard.map((student) => (
                    <div key={student.id} className={cn("grid grid-cols-12 gap-2 px-5 py-3 items-center transition-colors",
                        student.isCurrentUser ? "bg-primary/3 dark:bg-primary/4" : "hover:bg-slate-50/40 dark:hover:bg-white/1"
                    )}>
                        <span className="col-span-1 flex justify-center">
                            {student.rank <= 3 ? (
                                <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-black",
                                    student.rank === 1 ? "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400"
                                        : student.rank === 2 ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                )}>{student.rank}</span>
                            ) : (
                                <span className="text-[11px] font-semibold text-slate-400 tabular-nums">{student.rank}</span>
                            )}
                        </span>
                        <div className="col-span-7 flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                                {student.avatar ? <Image src={student.avatar} alt={student.name} width={28} height={28} className="object-cover w-full h-full" /> : <User className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                            <span className={cn("text-[11px] truncate", student.isCurrentUser ? "font-bold text-primary" : "font-semibold text-slate-700 dark:text-slate-300")}>
                                {student.name || "Student"}
                                {student.isCurrentUser && <span className="ml-1 text-[9px] text-primary/50">(you)</span>}
                            </span>
                        </div>
                        <span className="col-span-2 text-right text-[11px] font-bold text-slate-900 dark:text-white tabular-nums">{(student.score || 0).toFixed(1)}%</span>
                        <div className="col-span-2 flex justify-end">
                            <div className="w-full max-w-[60px] h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${student.score || 0}%` }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
