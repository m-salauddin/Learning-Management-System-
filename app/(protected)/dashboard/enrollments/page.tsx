"use client";

import {
    GraduationCap, Search, Filter, RefreshCw, Loader2, 
    MoreHorizontal, User, BookOpen, Calendar, Activity, Award,
    CheckCircle2, XCircle, Clock, ArrowUpRight, Mail, Hash
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getAllEnrollments, getMyEnrollments } from "@/lib/actions/enrollments";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { SearchInput, StatusBadge, LoadingState, EmptyDataState, EmptyFilterState } from "@/components/dashboard/shared";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
    DashboardTableContainer,
    DashboardTableToolbar,
    DashboardTableWrapper,
    DashboardTableHeader,
    DashboardTableHead,
    DashboardTableBody,
    DashboardTableRow,
    DashboardTableCell
} from "@/components/dashboard/ui/DashboardTable";
import { useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";

export default function EnrollmentsPage() {
    const { user } = useAppSelector(state => state.auth);
    const role = user?.role || 'student';
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
            let result;
            if (role === 'admin') {
                result = await getAllEnrollments({
                    page: currentPage,
                    pageSize
                });
            } else {
                result = await getMyEnrollments({
                    page: currentPage,
                    pageSize
                });
            }
            
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
        if (user) {
            fetchEnrollments();
        }
    }, [currentPage, pageSize, user]);


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10 font-sans text-foreground">
            <PageHeader
                title={role === 'admin' ? "Enrollment Ledger" : "My Enrollments"}
                description={role === 'admin' ? "Master database of all active learning protocols" : "Track your academic journey and course access"}
                icon={GraduationCap}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-card border border-border/50 text-foreground flex items-center gap-3 px-6 h-12 shadow-sm">
                            <Activity className="w-5 h-5 text-primary" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                                    {role === 'admin' ? "Total Records" : "Enrolled Modules"}
                                </span>
                                <span className="text-xl font-black tracking-tighter leading-none">{totalEnrollments}</span>
                            </div>
                        </div>
                    </div>
                }
            />

            <DashboardGrid cols={3}>
                <StatsCard
                    title={role === 'admin' ? "Active Matrix" : "Active Protocols"}
                    value={totalEnrollments}
                    icon={CheckCircle2}
                    className="border-emerald-500/20"
                />
                <StatsCard
                    title="Sync Status"
                    value="Operational"
                    icon={RefreshCw}
                    className="border-blue-500/20"
                />
                <StatsCard
                    title="Data Integrity"
                    value="High"
                    icon={Award}
                    className="border-violet-500/20"
                />
            </DashboardGrid>

            {/* Table Container */}
            <DashboardTableContainer>
                <DashboardTableToolbar>
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
                </DashboardTableToolbar>

                {isLoading ? (
                    <LoadingState message="Scanning Ledger Map..." />
                ) : enrollments.length === 0 ? (
                    searchTerm ? (
                        <EmptyFilterState 
                            searchTerm={searchTerm} 
                            onReset={() => setSearchTerm("")} 
                        />
                    ) : (
                        <EmptyDataState
                            icon={GraduationCap}
                            title="Zero Flux Detected"
                            description="There are no active enrollments mapped in the matrix."
                        />
                    )
                ) : (
                    <DashboardTableWrapper>
                        <DashboardTableHeader className={cn(
                            role === 'admin' ? "grid-cols-[1.5fr_1.5fr_1.2fr_100px_120px_80px]" : "grid-cols-[2fr_1.2fr_100px_120px_80px]"
                        )}>
                            {role === 'admin' && <DashboardTableHead>Candidate</DashboardTableHead>}
                            <DashboardTableHead>Target Module</DashboardTableHead>
                            <DashboardTableHead className="text-center">Progress Status</DashboardTableHead>
                            <DashboardTableHead className="text-center">Protocol Start</DashboardTableHead>
                            <DashboardTableHead className="text-center">Status</DashboardTableHead>
                            <DashboardTableHead className="text-right">Intervention</DashboardTableHead>
                        </DashboardTableHeader>
                        
                        <DashboardTableBody>
                            {enrollments.map((enrollment) => (
                                <DashboardTableRow 
                                    key={enrollment.id} 
                                    className={cn(
                                        role === 'admin' ? "grid-cols-[1.5fr_1.5fr_1.2fr_100px_120px_80px]" : "grid-cols-[2fr_1.2fr_100px_120px_80px]"
                                    )}
                                >
                                        {/* Candidate - Admin Only */}
                                        {role === 'admin' && (
                                            <div className="px-4 flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-black text-sm tracking-tight truncate uppercase">{enrollment.user?.name || 'Unknown Entity'}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 tracking-tight font-mono truncate">{enrollment.user?.email}</p>
                                                </div>
                                            </div>
                                        )}

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
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sync: {Math.round(enrollment.progress_percentage)}%</span>
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
                                        <DashboardTableCell className="text-right">
                                            <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </DashboardTableCell>
                                    </DashboardTableRow>
                                ))}
                            </DashboardTableBody>
                    </DashboardTableWrapper>
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
            </DashboardTableContainer>
        </motion.div>
    );
}
