"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    glowColor: "primary" | "secondary" | "warning" | "success";
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    animationDelay?: string;
    showStatusDot?: boolean;
    children?: React.ReactNode;
}

const positionClasses = {
    "top-left": "top-40 left-6 xl:left-16 2xl:left-28",
    "top-right": "top-40 right-6 xl:right-16 2xl:right-28",
    "bottom-left": "bottom-[10%] left-6 xl:left-20 2xl:left-32",
    "bottom-right": "bottom-[10%] right-6 xl:right-20 2xl:right-32",
};

const glowColorClasses = {
    primary: {
        line: "via-primary",
        glow: "from-primary/15",
        icon: "from-primary to-secondary",
    },
    secondary: {
        line: "via-secondary",
        glow: "from-secondary/15",
        icon: "from-secondary to-accent",
    },
    warning: {
        line: "via-warning",
        glow: "from-warning/15",
        icon: "from-warning to-orange-500",
    },
    success: {
        line: "via-success",
        glow: "from-success/15",
        icon: "from-success to-emerald-400",
    },
};

export function FloatingCard({
    icon: Icon,
    title,
    subtitle,
    glowColor,
    position,
    animationDelay = "0s",
    showStatusDot = false,
    children,
}: FloatingCardProps) {
    const colors = glowColorClasses[glowColor];

    return (
        <div
            className={cn(
                "absolute hidden lg:block pointer-events-none animate-float",
                positionClasses[position]
            )}
            style={{ animationDelay }}
        >
            <div className="relative rounded-2xl bg-card border border-border/50 shadow-lg overflow-hidden">
                {/* Top Side Glowing Border */}
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent to-transparent",
                    colors.line
                )} />
                <div className={cn(
                    "absolute top-0 left-0 right-0 h-6 bg-linear-to-b to-transparent",
                    colors.glow
                )} />
                <div className="p-4 pt-5">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={cn(
                                "w-11 h-11 rounded-xl bg-linear-to-br flex items-center justify-center",
                                colors.icon
                            )}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            {showStatusDot && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-success border-2 border-card" />
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-sm">{title}</p>
                            {subtitle && (
                                <p className="text-[11px] text-muted-foreground">{subtitle}</p>
                            )}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
