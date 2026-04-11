"use client";

import {
    GraduationCap, Search, Filter, RefreshCw, Loader2, 
    MoreHorizontal, User, BookOpen, Calendar, Activity, Award,
    CheckCircle2, XCircle, Clock, ArrowUpRight, Mail, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getAllEnrollments } from "@/lib/actions/enrollments";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { SearchInput } from "@/components/dashboard/shared/SearchInput";
import Image from "next/image";

export default function AdminEnrollmentsPage() {
    const toast = useToast();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalEnrollments, setTotalEnrollments] = useState(0);
    const totalPages = Math.ceil(totalEnrollments / pageSize);

    const fetchEnrollments = async () => {
        setIsLoading(true);
        try {
            const result = await getAllEnrollments({
                page: currentPage,
                pageSize
            });
            if (result.data) {
                setEnrollments(result.data);
                setTotalEnrollments(result.total);
            }
        } catch (error) {
            toast.error('Failed to fetch enrollment records');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEnrollments();
    }, [currentPage, pageSize]);

    const StatusBadge = ({ status }: { status?: string }) => {
        const s = status || 'active';
        return (
            <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                s === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                s === 'expired' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                "bg-muted text-muted-foreground border-border/50"
            )}>
                <span className={cn(
                    "w-1.5 h-1.5 rounded-full shadow-xs",
                    s === 'active' ? "bg-emerald-500 shadow-emerald-500" :
                    s === 'expired' ? "bg-rose-500 shadow-rose-500" :
                    "bg-muted-foreground"
                )} />
                {s}
            </span>
        );
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6 pb-10 font-sans text-foreground"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-3xl font-black tracking-tight uppercase italic"
                    >
                        Enrollment Ledger
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.1 }} 
                        className="text-muted-foreground mt-1 text-sm font-bold uppercase tracking-widest opacity-60"
                    >
                        Master database of all active learning protocols
                    </motion.p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center gap-3 px-6">
                        <Activity className="w-5 h-5" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Records</span>
                            <span className="text-xl font-black tracking-tighter leading-none">{totalEnrollments}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Active Matrix', value: totalEnrollments, icon: CheckCircle2, color: 'emerald' },
                    { label: 'Sync Status', value: 'Operational', icon: RefreshCw, color: 'blue' },
                    { label: 'Data Integrity', value: 'High', icon: Award, color: 'violet' }
                ].map((stat, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                <p className="text-2xl font-black mt-1 tracking-tighter">{stat.value}</p>
                            </div>
                            <div className={cn(
                                "p-3 rounded-2xl transition-all group-hover:scale-110",
                                stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                                stat.color === 'blue' && "bg-blue-500/10 text-blue-500",
                                stat.color === 'violet' && "bg-violet-500/10 text-violet-500"
                            )}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Table Container */}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-border/20 flex flex-col lg:flex-row gap-4 justify-between items-center bg-muted/5">
                    <div className="flex items-center gap-3 w-full lg:max-w-md">
                        <SearchInput
                            value={searchTerm}
                            onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                            placeholder="Locate enrollment..."
                            className="flex-1"
                        />
                        <button 
                            onClick={fetchEnrollments} 
                            className="h-11 w-11 flex items-center justify-center rounded-xl border border-border/30 hover:bg-muted/50 transition-all text-muted-foreground group"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary/30" />
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Scanning Ledger Map...</p>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
                        <div className="p-6 rounded-full bg-muted/20 ring-8 ring-muted/5">
                            <GraduationCap className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tighter opacity-70 italic">Zero Flux Detected</h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto min-w-full dashboard-scrollbar">
                        <div className="inline-block min-w-full align-middle">
                            <div className="grid grid-cols-[1.5fr_1.5fr_1.2fr_100px_120px_80px] px-8 py-5 bg-muted/5 border-b border-border/20 items-center whitespace-nowrap">
                                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Candidate</div>
                                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Target Module</div>
                                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Progress Status</div>
                                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Protocol Start</div>
                                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Status</div>
                                <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Intervention</div>
                            </div>
                            
                            <div className="divide-y divide-border/10">
                                {enrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="grid grid-cols-[1.5fr_1.5fr_1.2fr_100px_120px_80px] px-8 py-5 items-center hover:bg-primary/5 transition-all duration-300 group">
                                        {/* Candidate */}
                                        <div className="px-4 flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-sm tracking-tight truncate uppercase">{enrollment.user?.name || 'Unknown Entity'}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground/60 tracking-tight font-mono truncate">{enrollment.user?.email}</p>
                                            </div>
                                        </div>

                                        {/* Course */}
                                        <div className="px-4 flex items-center gap-3 min-w-0">
                                            <div className="relative w-12 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                                <Image 
                                                    src={enrollment.course?.thumbnail_url || '/placeholder-course.jpg'} 
                                                    alt="" 
                                                    fill 
                                                    className="object-cover"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-black text-[11px] tracking-tight truncate leading-tight">{enrollment.course?.title}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5 opacity-60">
                                                    <BookOpen className="w-3 h-3 text-primary" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Protocol ID: {enrollment.course?.id?.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <div className="px-4 min-w-[150px]">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Sync: {Math.round(enrollment.progress_percentage)}%</span>
                                                <span className="text-[9px] font-bold text-muted-foreground/60">{enrollment.completed_lessons}/{enrollment.course?.total_lessons} units</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${enrollment.progress_percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-linear-to-r from-primary to-primary/60 shadow-[0_0_8px_rgba(var(--primary),0.3)]"
                                                />
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div className="px-4 text-center">
                                            <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">
                                                {new Date(enrollment.enrolled_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="px-4 text-center">
                                            <StatusBadge status={enrollment.status} />
                                        </div>

                                        {/* Action */}
                                        <div className="px-4 text-right">
                                            <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalEnrollments > pageSize && (
                    <div className="p-8 border-t border-border/20 bg-muted/5">
                        <Pagination 
                            currentPage={currentPage} 
                            totalPages={totalPages} 
                            onPageChange={setCurrentPage} 
                            pageSize={pageSize} 
                            onPageSizeChange={setPageSize} 
                            totalItems={totalEnrollments} 
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
