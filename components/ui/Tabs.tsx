"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: ReactNode;
    className?: string;
}

export function Tabs({  children, className }: TabsProps) {
    return (
        <div className={cn("w-full", className)}>
            {children}
        </div>
    );
}

interface TabsListProps {
    children: ReactNode;
    className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div className={cn(
            "inline-flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/40",
            className
        )}>
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: ReactNode;
    className?: string;
    activeValue: string;
    onClick: (value: string) => void;
    icon?: ReactNode;
    badge?: string | number;
}

export function TabsTrigger({ value, children, className, activeValue, onClick, icon, badge }: TabsTriggerProps) {
    const isActive = activeValue === value;
    
    return (
        <button
            onClick={() => onClick(value)}
            className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                "hover:bg-background/50",
                isActive ? "text-foreground" : "text-muted-foreground",
                className
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-background border border-border/50 rounded-lg shadow-sm"
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                />
            )}
            <span className="relative z-10 flex items-center gap-2">
                {icon}
                {children}
                {badge !== undefined && (
                    <span className={cn(
                        "ml-1 px-1.5 py-0.5 rounded-md text-xs font-semibold",
                        isActive ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
                    )}>
                        {badge}
                    </span>
                )}
            </span>
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: ReactNode;
    activeValue: string;
    className?: string;
}

export function TabsContent({ value, children, activeValue, className }: TabsContentProps) {
    if (value !== activeValue) return null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
