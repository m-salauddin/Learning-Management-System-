"use client";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsCardVariant =
    | "primary"
    | "blue"
    | "emerald"
    | "amber"
    | "rose"
    | "violet"
    | "indigo"
    | "cyan";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
    delay?: number;
    className?: string;
    variant?: StatsCardVariant;
}

const variantStyles: Record<StatsCardVariant, {
    glow: string;
    iconContainer: string;
    dot: string;
    borderHover: string;
    textAccent: string;
    badge: string;
}> = {
    primary: {
        glow: "bg-primary/5 group-hover:bg-primary/10",
        iconContainer: "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary group-hover:text-white group-hover:border-primary shadow-primary/10",
        dot: "bg-primary",
        borderHover: "hover:border-primary/45 hover:shadow-primary/5",
        textAccent: "text-primary",
        badge: "text-primary bg-primary/10 border-primary/20"
    },
    blue: {
        glow: "bg-blue-500/5 group-hover:bg-blue-500/12",
        iconContainer: "bg-blue-500/10 text-blue-500 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500 shadow-blue-500/10",
        dot: "bg-blue-500",
        borderHover: "hover:border-blue-500/45 hover:shadow-blue-500/5",
        textAccent: "text-blue-500",
        badge: "text-blue-500 bg-blue-500/10 border-blue-500/20"
    },
    emerald: {
        glow: "bg-emerald-500/5 group-hover:bg-emerald-500/12",
        iconContainer: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 shadow-emerald-500/10",
        dot: "bg-emerald-500",
        borderHover: "hover:border-emerald-500/45 hover:shadow-emerald-500/5",
        textAccent: "text-emerald-500",
        badge: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    },
    amber: {
        glow: "bg-amber-500/5 group-hover:bg-amber-500/12",
        iconContainer: "bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 shadow-amber-500/10",
        dot: "bg-amber-500",
        borderHover: "hover:border-amber-500/45 hover:shadow-amber-500/5",
        textAccent: "text-amber-500",
        badge: "text-amber-500 bg-amber-500/10 border-amber-500/20"
    },
    rose: {
        glow: "bg-rose-500/5 group-hover:bg-rose-500/12",
        iconContainer: "bg-rose-500/10 text-rose-500 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 shadow-rose-500/10",
        dot: "bg-rose-500",
        borderHover: "hover:border-rose-500/45 hover:shadow-rose-500/5",
        textAccent: "text-rose-500",
        badge: "text-rose-500 bg-rose-500/10 border-rose-500/20"
    },
    violet: {
        glow: "bg-violet-500/5 group-hover:bg-violet-500/12",
        iconContainer: "bg-violet-500/10 text-violet-500 border-violet-500/20 group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500 shadow-violet-500/10",
        dot: "bg-violet-500",
        borderHover: "hover:border-violet-500/45 hover:shadow-violet-500/5",
        textAccent: "text-violet-500",
        badge: "text-violet-500 bg-violet-500/10 border-violet-500/20"
    },
    indigo: {
        glow: "bg-indigo-500/5 group-hover:bg-indigo-500/12",
        iconContainer: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500 shadow-indigo-500/10",
        dot: "bg-indigo-500",
        borderHover: "hover:border-indigo-500/45 hover:shadow-indigo-500/5",
        textAccent: "text-indigo-500",
        badge: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20"
    },
    cyan: {
        glow: "bg-cyan-500/5 group-hover:bg-cyan-500/12",
        iconContainer: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 shadow-cyan-500/10",
        dot: "bg-cyan-500",
        borderHover: "hover:border-cyan-500/45 hover:shadow-cyan-500/5",
        textAccent: "text-cyan-500",
        badge: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20"
    }
};

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    trendUp,
    description,
    delay = 0,
    className,
    variant: explicitVariant
}: StatsCardProps) {
    const resolvedVariant: StatsCardVariant = (() => {
        if (explicitVariant) return explicitVariant;
        if (!className) return "primary";
        
        const cls = className.toLowerCase();
        if (cls.includes("blue")) return "blue";
        if (cls.includes("emerald")) return "emerald";
        if (cls.includes("violet") || cls.includes("purple")) return "violet";
        if (cls.includes("amber") || cls.includes("orange")) return "amber";
        if (cls.includes("rose") || cls.includes("red")) return "rose";
        if (cls.includes("indigo")) return "indigo";
        if (cls.includes("cyan")) return "cyan";
        
        return "primary";
    })();

    const styles = variantStyles[resolvedVariant];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -2 }}
            className={cn(
                "relative overflow-hidden group p-5 rounded-[1.25rem] bg-card border border-border/80 shadow-sm",
                "hover:shadow-lg transition-all duration-300",
                styles.borderHover,
                className
            )}
        >
            <div className={cn(
                "absolute -right-4 -top-4 w-28 h-28 rounded-full blur-3xl transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-110",
                styles.glow
            )} />
            
            <div className={cn(
                "absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                resolvedVariant === "primary" ? "bg-primary" : `bg-${resolvedVariant}-500`
            )} style={{
                backgroundColor: resolvedVariant === "primary" ? undefined : `var(--color-${resolvedVariant}-500)`
            }} />

            <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                    "shrink-0 p-3 rounded-xl border transition-all duration-500 shadow-sm",
                    "group-hover:scale-105 group-hover:-rotate-3",
                    styles.iconContainer
                )}>
                    <Icon className="w-5 h-5 transition-transform duration-500 group-hover:scale-110" />
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.05em] leading-none mb-2">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-black text-foreground tracking-tight leading-none">
                            {value}
                        </h2>
                        {trend && (
                            <div className={cn(
                                "flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md border leading-none gap-0.5",
                                trendUp
                                    ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                                    : "text-red-500 bg-red-500/10 border-red-500/20"
                            )}>
                                <span className="text-[9px]">{trendUp ? "▲" : "▼"}</span>
                                <span>{trend}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {description && (
                <div className="mt-4 pt-3 border-t border-border/40 relative z-10">
                    <p className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider flex items-center gap-2">
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 animate-pulse", styles.dot)} />
                        {description}
                    </p>
                </div>
            )}
        </motion.div>
    );
}
