"use client";
import React from "react";
import { RefreshCw, Inbox, FileX, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";


import { motion } from "motion/react";

interface LoadingStateProps {
    message?: string;
    className?: string;
    rows?: number;
    gridClass?: string;
}

export function LoadingState({
    message = "Synchronizing data...",
    className,
    rows = 6,
    gridClass = "grid-cols-[1.5fr_1fr_1fr_1fr_100px]",
    colCount
}: LoadingStateProps & { colCount?: number }) {
    const inferredColCount = colCount || (gridClass.match(/ /g) || []).length + 1;

    return (
        <div className={cn("divide-y divide-border/10 w-full", className)}>
            {/* Shimmer Bar at the Top */}
            <div className="h-0.5 w-full bg-primary/5 overflow-hidden">
                <motion.div 
                    className="h-full w-1/3 bg-primary/40"
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {Array.from({ length: rows }).map((_, i) => (
                <div 
                    key={i} 
                    className={cn("grid gap-4 px-8 py-6 items-center animate-pulse", gridClass)}
                >
                    {Array.from({ length: inferredColCount }).map((_, j) => {
                        if (j === 0) {
                            return (
                                <div key={j} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-muted/60 shrink-0" />
                                    <div className="flex-1 space-y-2.5">
                                        <div className="h-3 w-3/4 bg-muted/80 rounded-full" />
                                        <div className="h-2 w-1/2 bg-muted/40 rounded-full" />
                                    </div>
                                </div>
                            );
                        }
                        
                        if (j === inferredColCount - 1) {
                            return (
                                <div key={j} className="flex justify-end pr-2">
                                    <div className="w-9 h-9 rounded-xl bg-muted/40" />
                                </div>
                            );
                        }

                        return (
                            <div key={j} className="flex flex-col items-center gap-2">
                                <div className="h-2.5 w-16 bg-muted/60 rounded-full" />
                                <div className="h-1.5 w-10 bg-muted/40 rounded-full" />
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}


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



export function StatsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-[104px] rounded-[1.25rem] bg-card/60 border border-border/40 p-5 flex items-center gap-4 animate-pulse"
                >
                    <div className="w-11 h-11 rounded-xl bg-muted/60 shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-16 bg-muted/60 rounded-full" />
                        <div className="h-6 w-12 bg-muted/80 rounded-lg" />
                    </div>
                </div>
            ))}
        </>
    );
}
