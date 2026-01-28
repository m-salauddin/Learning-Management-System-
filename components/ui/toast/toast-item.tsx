"use client";

import React from "react";
import { Check, AlertTriangle, AlertOctagon, Info, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastItemProps {
    id: string;
    title: string;
    description?: string;
    variant: ToastType;
    onDismiss: () => void;
    paused?: boolean;
}

export const ToastItem = ({ title, description, variant, onDismiss, paused }: ToastItemProps) => {
    React.useEffect(() => {
        if (paused || variant === "loading") return;

        const timer = setTimeout(() => {
            onDismiss();
        }, 4000);

        return () => clearTimeout(timer);
    }, [paused, onDismiss, variant]);

    const getIcon = () => {
        switch (variant) {
            case "success":
                return (
                    <div className="flex size-11 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-500/20">
                        <Check className="size-5 text-emerald-500" strokeWidth={3} />
                    </div>
                );
            case "error":
                return (
                    <div className="flex size-11 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                        <AlertOctagon className="size-5 text-red-500" strokeWidth={3} />
                    </div>
                );
            case "warning":
                return (
                    <div className="flex size-11 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
                        <AlertTriangle className="size-5 text-amber-500" strokeWidth={3} />
                    </div>
                );
            case "info":
                return (
                    <div className="flex size-11 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
                        <Info className="size-5 text-blue-500" strokeWidth={3} />
                    </div>
                );
            case "loading":
                return (
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                        <Loader2 className="size-5 text-primary animate-spin" strokeWidth={3} />
                    </div>
                );
        }
    };

    return (
        <div
            className={cn(
                "relative flex w-full max-w-[420px] items-center gap-4 overflow-hidden rounded-[24px] border border-border/50 dark:border-white/5 bg-white dark:bg-card p-5 shadow-2xl backdrop-blur-3xl min-w-[380px] pointer-events-auto",
                // Glow effects based on variant
                variant === "success" && "shadow-[0_0_40px_-10px_rgba(16,185,129,0.1)]",
                variant === "error" && "shadow-[0_0_40px_-10px_rgba(239,68,68,0.1)]",
                variant === "warning" && "shadow-[0_0_40px_-10px_rgba(245,158,11,0.1)]",
                variant === "info" && "shadow-[0_0_40px_-10px_rgba(59,130,246,0.1)]",
            )}
        >
            <div className="shrink-0">
                {getIcon()}
            </div>

            <div className="flex flex-col gap-1 flex-1">
                <h3 className="font-semibold text-foreground text-[15px] leading-none tracking-wide">
                    {title}
                </h3>
                {description && (
                    <p className="text-muted-foreground text-[13px] font-medium leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            <button
                onClick={onDismiss}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
            >
                <X className="size-4" />
            </button>
        </div>
    );
};
