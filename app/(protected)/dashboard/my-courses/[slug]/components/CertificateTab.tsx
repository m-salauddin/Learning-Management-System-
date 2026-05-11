"use client";
import { Award, Lock } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
    userProgress: number;
    progressPct: number;
    completedTotal: number;
    totalLessons: number;
}

export function CertificateTab({ userProgress, progressPct, completedTotal, totalLessons }: Props) {
    const unlocked = userProgress >= 100;
    return (
        <div className="flex flex-col items-center py-16 px-6 text-center space-y-6">
            <div className="relative">
                <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center transition-colors",
                    unlocked ? "bg-linear-to-br from-yellow-100 to-amber-50 dark:from-yellow-500/15 dark:to-amber-500/10" : "bg-slate-100 dark:bg-slate-800"
                )}>
                    <Award className={cn("w-10 h-10", unlocked ? "text-yellow-500" : "text-slate-300 dark:text-slate-600")} />
                </div>
                {!unlocked && (
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-slate-800 dark:bg-slate-700 border-2 border-white dark:border-slate-900 text-white rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                    </div>
                )}
            </div>
            <div className="space-y-2">
                <h3 className="text-[16px] font-bold text-slate-900 dark:text-white">
                    {unlocked ? "Certificate Unlocked! 🎉" : "Certificate Locked"}
                </h3>
                <p className="text-[12px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                    {unlocked ? "Congratulations! Your certificate is ready to download." : "Complete all lessons and pass the final assessment to unlock your certificate."}
                </p>
            </div>
            <div className="w-full max-w-[240px] space-y-2.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span>Progress</span>
                    <span className="tabular-nums">{progressPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className={cn("h-full rounded-full", unlocked ? "bg-emerald-500" : "bg-primary")} />
                </div>
                <p className="text-[10px] text-slate-400 tabular-nums">{completedTotal} of {totalLessons} lessons completed</p>
            </div>
            {unlocked && (
                <Link href="/dashboard/certificates"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-[12px] font-bold rounded-xl hover:brightness-110 transition-all shadow-md shadow-emerald-500/20 cursor-pointer">
                    <Award className="w-4 h-4" /> View Certificate
                </Link>
            )}
        </div>
    );
}
