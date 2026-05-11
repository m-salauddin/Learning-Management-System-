"use client";
import { motion } from "motion/react";

export function ProgressRing({ value, size = 60, strokeWidth = 4 }: { value: number; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full -rotate-90">
                <circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <motion.circle cx={center} cy={center} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }} transition={{ duration: 1.4, ease: "easeOut", delay: 0.15 }} strokeLinecap="round" className="text-primary" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[11px] font-bold tabular-nums text-slate-700 dark:text-slate-200">{value}%</span>
            </div>
        </div>
    );
}
