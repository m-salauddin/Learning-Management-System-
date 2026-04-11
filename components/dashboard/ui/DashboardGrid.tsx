"use client";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DashboardGridProps {
    children: React.ReactNode;
    cols?: 1 | 2 | 3 | 4;
    gap?: number;
    className?: string;
}

export function DashboardGrid({ children, cols = 3, gap = 6, className }: DashboardGridProps) {
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={cn(
            "grid gap-6",
            gridCols[cols],
            className
        )}>
            {children}
        </div>
    );
}
