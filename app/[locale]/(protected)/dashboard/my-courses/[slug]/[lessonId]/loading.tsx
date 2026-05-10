"use client";

/**
 * Loading skeleton for the content area only.
 * The sidebar is already mounted in the layout shell and persists during navigation.
 */
export default function LessonLoading() {
    return (
        <div className="max-w-6xl mx-auto p-5 lg:p-8 space-y-8 animate-in fade-in duration-200">
            {/* Video skeleton */}
            <div className="aspect-video w-full rounded-2xl bg-slate-200/60 dark:bg-white/4 animate-pulse" />

            {/* Title + nav buttons */}
            <div className="flex items-center justify-between">
                <div className="h-8 w-2/3 bg-slate-200/60 dark:bg-white/6 rounded animate-pulse" />
                <div className="flex gap-2">
                    <div className="h-11 w-11 rounded-xl bg-slate-200/60 dark:bg-white/6 animate-pulse" />
                    <div className="h-11 w-36 rounded-xl bg-primary/20 animate-pulse" />
                </div>
            </div>

            {/* Notes skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-3">
                    <div className="h-4 w-1/3 bg-slate-200/40 da    rk:bg-white/4 rounded animate-pulse" />
                    <div className="h-32 bg-slate-200/40 dark:bg-white/4 rounded-xl animate-pulse" />
                </div>
                <div className="h-48 bg-slate-200/40 dark:bg-white/4 rounded-xl animate-pulse" />
            </div>
        </div>
    );
}
