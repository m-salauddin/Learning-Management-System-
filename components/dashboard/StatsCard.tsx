"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
    delay?: number;
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, description, delay = 0 }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="p-6 rounded-2xl bg-card/50 backdrop-blur-xl border border-white/5 shadow-sm hover:shadow-md hover:bg-card/80 transition-all border-border/50 group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-xs font-medium px-2 py-1 rounded-full border",
                        trendUp
                            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            : "text-red-500 bg-red-500/10 border-red-500/20"
                    )}>
                        {trendUp ? "+" : ""}{trend}
                    </div>
                )}
            </div>

            <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                    {value}
                </h2>
                {description && <span className="text-xs text-muted-foreground">{description}</span>}
            </div>
        </motion.div>
    );
}
