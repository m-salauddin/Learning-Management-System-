"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    icon?: any;
    action?: React.ReactNode;
    className?: string;
    contentClassName?: string;
    delay?: number;
}

export function DashboardCard({ 
    children, 
    title, 
    description, 
    icon: Icon, 
    action, 
    className, 
    contentClassName,
    delay = 0 
}: DashboardCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "rounded-[2rem] bg-card/50 backdrop-blur-xl border border-slate-200 dark:border-white/10 overflow-hidden",
                className
            )}
        >
            {(title || Icon || action) && (
                <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <Icon className="w-5 h-5" />
                            </div>
                        )}
                        <div>
                            {title && <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>}
                            {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
                        </div>
                    </div>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className={cn("p-6", contentClassName)}>
                {children}
            </div>
        </motion.div>
    );
}
