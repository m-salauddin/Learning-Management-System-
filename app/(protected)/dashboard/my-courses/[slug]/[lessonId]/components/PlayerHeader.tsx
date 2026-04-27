"use client";
import Link from "next/link";
import {
    Menu, ChevronRight, Play, User, Maximize2, Minimize2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerHeaderProps {
    course: any;
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    isCinematic: boolean;
    setIsCinematic: (v: boolean) => void;
}

export function PlayerHeader({
    course, sidebarOpen, setSidebarOpen, isCinematic, setIsCinematic
}: PlayerHeaderProps) {
    return (
        <header className="h-14 border-b border-slate-200/80 dark:border-white/4 flex items-center justify-between px-5 shrink-0 bg-white dark:bg-[#060a14] z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className={cn(
                        "p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl border border-slate-200/80 dark:border-white/6 transition-colors active:scale-95",
                        sidebarOpen && "lg:hidden"
                    )}
                >
                    <Menu className="w-4 h-4 text-slate-500" />
                </button>

                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center gap-1.5">
                    <Link href="/dashboard" className="text-[10px] font-semibold text-slate-400 hover:text-primary transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <Link
                        href={`/dashboard/my-courses/${course.slug}`}
                        className="text-[10px] font-semibold text-slate-400 hover:text-primary transition-colors truncate max-w-[160px]"
                    >
                        {course.title}
                    </Link>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-white">Lesson</span>
                </nav>
            </div>

            <div className="flex items-center gap-2">
                {/* Cinematic toggle */}
                <button
                    onClick={() => setIsCinematic(!isCinematic)}
                    className={cn(
                        "flex items-center gap-2 px-3.5 h-9 rounded-xl text-[10px] font-bold transition-all border",
                        isCinematic
                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-800 dark:border-white shadow-md"
                            : "bg-slate-50 dark:bg-white/3 text-slate-500 border-slate-200/80 dark:border-white/6 hover:text-slate-700 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/10"
                    )}
                >
                    {isCinematic ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                    {isCinematic ? "Exit Focus" : "Focus Mode"}
                </button>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/4 border border-slate-200/80 dark:border-white/6 flex items-center justify-center overflow-hidden">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
            </div>
        </header>
    );
}
