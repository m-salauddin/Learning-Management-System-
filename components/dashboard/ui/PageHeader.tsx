"use client";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, icon: Icon, actions, className }: PageHeaderProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}
        >
            <div className="flex items-start gap-4">
                {Icon && (
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5">
                        <Icon className="w-6 h-6 text-primary" />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            )}
        </motion.div>
    );
}
