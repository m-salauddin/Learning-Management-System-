"use client";
import { motion } from "motion/react";

export function ProgressRing({ value, size = 60, strokeWidth = 4 }: { value: number; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;
    const pct = Math.round(value);
    
    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(var(--primary),0.2)]">
                <circle 
                    cx={center} 
                    cy={center} 
                    r={radius} 
                    stroke="currentColor" 
                    strokeWidth={strokeWidth} 
                    fill="transparent" 
                    className="text-slate-100 dark:text-white/[0.03]" 
                />
                <motion.circle 
                    cx={center} 
                    cy={center} 
                    r={radius} 
                    stroke="currentColor" 
                    strokeWidth={strokeWidth} 
                    fill="transparent" 
                    strokeDasharray={circumference} 
                    initial={{ strokeDashoffset: circumference }} 
                    animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }} 
                    transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} 
                    strokeLinecap="round" 
                    className="text-primary" 
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-black tabular-nums text-slate-900 dark:text-white">{pct}%</span>
            </div>
        </div>
    );
}

