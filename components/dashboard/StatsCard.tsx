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
    className?: string;
}
export function StatsCard({ title, value, icon: Icon, trend, trendUp, description, delay = 0, className }: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "relative overflow-hidden group p-5 rounded-[1.25rem] bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300",
                className
            )}
        >
            {}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />
            
            <div className="flex items-center gap-4 relative z-10">
                <div className="shrink-0 p-3 rounded-xl bg-muted/50 text-primary border border-border group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500 shadow-xs">
                    <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.05em] leading-none mb-1.5">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-black text-foreground tracking-tight leading-none">
                            {value}
                        </h2>
                        {trend && (
                            <div className={cn(
                                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md border leading-none",
                                trendUp
                                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                                    : "text-red-500 bg-red-500/10 border-red-500/20"
                            )}>
                                {trendUp ? "↑" : "↓"} {trend}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {description && (
                <div className="mt-4 pt-3 border-t border-border/50">
                    <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        {description}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
