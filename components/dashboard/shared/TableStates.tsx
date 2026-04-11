"use client";
import React from "react";
import { RefreshCw, Inbox, FileX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── LoadingState ────────────────────────────────────────────────────────────
interface LoadingStateProps {
    message?: string;
    className?: string;
}
export function LoadingState({
    message = "Synchronizing data...",
    className
}: LoadingStateProps) {
    return (
        <div className={cn("py-24 flex flex-col items-center justify-center gap-4 text-center", className)}>
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse" />
                </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                {message}
            </p>
        </div>
    );
}

// ─── EmptyDataState ──────────────────────────────────────────────────────────
interface EmptyDataStateProps {
    icon?: React.ElementType;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}
export function EmptyDataState({
    icon: Icon = Inbox,
    title = "No data yet",
    description = "There are no items to display at this moment.",
    action,
    className
}: EmptyDataStateProps) {
    return (
        <div className={cn("p-12 border-2 border-dashed border-border/60 rounded-[2rem] flex flex-col items-center justify-center text-center bg-card/10 backdrop-blur-xs", className)}>
            <div className="p-4 bg-card/40 rounded-2xl shadow-sm border border-border/40 mb-6">
                <Icon className="w-8 h-8 text-muted-foreground opacity-60" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-bold text-foreground">
                {title}
            </h4>
            <p className="text-muted-foreground mb-8 max-w-sm font-medium mt-2">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    );
}

// ─── EmptyFilterState ────────────────────────────────────────────────────────
interface EmptyFilterStateProps {
    searchTerm?: string;
    message?: string;
    onReset?: () => void;
    className?: string;
}
export function EmptyFilterState({
    searchTerm,
    message = "No matching results found",
    onReset,
    className
}: EmptyFilterStateProps) {
    return (
        <div className={cn("p-12 border-2 border-dashed border-border/60 rounded-[2rem] flex flex-col items-center justify-center text-center bg-card/10 backdrop-blur-xs", className)}>
            <div className="p-4 bg-card/40 rounded-2xl shadow-sm border border-border/40 mb-6">
                <FileX className="w-8 h-8 text-muted-foreground opacity-60" strokeWidth={1.5} />
            </div>
            <h4 className="text-xl font-bold text-foreground">
                {message}
            </h4>
            
            {searchTerm ? (
                <p className="text-muted-foreground mb-8 max-w-sm font-medium mt-2">
                    Your search for <span className="text-foreground font-black">"{searchTerm}"</span> yielded zero results.
                </p>
            ) : (
                <p className="text-muted-foreground mb-8 max-w-sm font-medium mt-2">
                    We couldn't find any results matching your current filters.
                </p>
            )}

            {onReset && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 hover:bg-muted font-black uppercase tracking-widest transition-all text-xs"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Clear Filters
                </button>
            )}
        </div>
    );
}

// ─── StatsSkeleton ────────────────────────────────────────────────────────────
// Standard loading skeleton for stats cards grid
export function StatsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-32 rounded-2xl bg-card/50 border border-border/20 animate-pulse"
                />
            ))}
        </>
    );
}
