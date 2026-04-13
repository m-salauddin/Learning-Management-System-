"use client";

import {
    GraduationCap, Search, RefreshCw, User, Calendar, 
    Activity, Award, CheckCircle2, XCircle, Clock, Mail,
    MoreVertical, CreditCard, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { getAllEnrollments, getMyEnrollments, approveEnrollment } from "@/lib/actions/enrollments";
import { getAllCoursesList } from "@/lib/actions/courses";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchInput, StatusBadge, LoadingState, EmptyDataState, EmptyFilterState, ActionDropdown } from "@/components/dashboard/shared";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
    DashboardTableWrapper,
    DashboardTableHeader,
    DashboardTableHead,
    DashboardTableBody,
    DashboardTableRow,
    DashboardTableToolbar,
} from "@/components/dashboard/ui/DashboardTable";
import { useAppSelector } from "@/lib/store/hooks";
import Image from "next/image";


const EnrollmentRow = memo(({ 
    enrollment, 
    role, 
    isActive, 
    onToggleMenu,
    activeMenu,
    setActiveMenu,
    onApprove
}: { 
    enrollment: any; 
    role: string; 
    isActive: boolean;
    onToggleMenu: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    activeMenu: string | null;
    setActiveMenu: (id: string | null) => void;
    onApprove: (id: string) => void;
}) => {
    const isAdmin = role === 'admin';
    const gridCols = isAdmin 
        ? "grid-cols-[2fr_1.5fr_1fr_110px_110px_60px]" 
        : "grid-cols-[2fr_1fr_110px_110px_60px]";

    return (
        <DashboardTableRow 
            className={cn(
                "min-w-[900px] py-3 px-6 hover:bg-muted/40 group/row border-b border-border/80 transition-colors last:border-0",
                gridCols,
                isActive ? "bg-primary/5 hover:bg-primary/10 border-primary/20" : "bg-card",
                "gap-4 items-center"
            )}
        >
            {}
            <div className="flex flex-col min-w-0 pr-4 justify-center">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-8 rounded-md shrink-0 overflow-hidden border border-border shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
                        <Image 
                            src={enrollment.course?.thumbnail_url || '/placeholder-course.jpg'} 
                            alt="" 
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[13px] text-foreground truncate leading-tight">
                            {enrollment.course?.title || 'Unknown Course'}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate bg-muted/50 px-1.5 py-0.5 rounded">
                                ID: {enrollment.course?.id?.slice(0, 8)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {}
            {isAdmin && (
                <div className="flex flex-col min-w-0 pr-4">
                    <div className="flex items-center gap-3 justify-start">
                        <div className="relative shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <User className="w-4 h-4 text-primary" />
                            {enrollment.status === 'success' || enrollment.status === 'active' ? (
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />
                            ) : null}
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                            <p className="font-semibold text-[13px] text-foreground truncate leading-tight">
                                {enrollment.user?.name || 'Anonymous User'}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                                {enrollment.user?.email || 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {}
            <div className="flex flex-col items-center justify-center text-center">
                <div className="text-[13px] font-bold text-foreground">
                    ৳{enrollment.transaction?.amount > 0 ? enrollment.transaction.amount.toLocaleString() : '0'}
                </div>
                <div className={cn(
                    "mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase",
                    enrollment.transaction?.payment_provider === 'manual' 
                        ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                )}>
                    <CreditCard className="w-3 h-3" />
                    {enrollment.transaction?.payment_provider || 'System'}
                </div>
            </div>

            {}
            <div className="flex flex-col items-center justify-center text-center">
                <p className="text-[12px] font-semibold text-foreground">
                    {new Date(enrollment.enrolled_at).toLocaleDateString(undefined, { 
                        day: '2-digit', 
                        month: 'short',
                        year: 'numeric'
                    })}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1 text-[10px] font-medium text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(enrollment.enrolled_at).toLocaleTimeString(undefined, {
                        hour: '2-digit', minute: '2-digit'
                    })}
                </div>
            </div>

            {}
            <div className="flex justify-center items-center">
                <StatusBadge status={enrollment.status} />
            </div>

            {}
            <div className="flex justify-center items-center">
                <ActionDropdown 
                    id={enrollment.id}
                    title="Actions"
                    activeId={activeMenu}
                    setActiveId={setActiveMenu}
                    actions={[
                        ...(isAdmin && enrollment.status === 'pending' ? [{
                            label: "Approve",
                            icon: CheckCircle2,
                            onClick: () => onApprove(enrollment.id),
                            variant: 'success' as const
                        }] : []),
                        {
                            label: "View Details",
                            icon: Search,
                            onClick: () => {}, 
                            variant: 'primary'
                        },
                        ...(isAdmin ? [{
                            label: "Contact",
                            icon: Mail,
                            onClick: () => {}, 
                        }] : []),
                        {
                            label: "Revoke",
                            icon: XCircle,
                            onClick: () => {}, 
                            variant: 'danger'
                        }
                    ]}
                />
            </div>
        </DashboardTableRow>
    );
});

EnrollmentRow.displayName = "EnrollmentRow";


export default function EnrollmentsPage() {
    
    const user = useAppSelector(state => state.auth.user);
    const role = user?.role || 'student';
    
    
    const [mounted, setMounted] = useState(false);
    const { success, error, loading } = useToast();
    
    
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");
    const [paymentFilter, setPaymentFilter] = useState("all");
    const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalEnrollments, setTotalEnrollments] = useState(0);
    
    
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const totalPages = Math.ceil(totalEnrollments / pageSize);

    
    const fetchEnrollments = useCallback(async () => {
        setIsLoading(true);
        try {
            const apiCall = role === 'admin' ? getAllEnrollments : getMyEnrollments;
            const result = await apiCall({ 
                page: currentPage, 
                pageSize, 
                status: statusFilter as any,
                courseId: courseFilter === 'all' ? undefined : courseFilter,
                paymentMethod: paymentFilter === 'all' ? undefined : paymentFilter
            });
            
            if (result.data) {
                setEnrollments(result.data);
                setTotalEnrollments(result.total);
            }
        } catch (err) {
            error('Matrix Synchro Error: Failed to fetch records');
        } finally {
            setIsLoading(false);
        }
    }, [role, currentPage, pageSize, statusFilter, courseFilter, paymentFilter, error]);

    const fetchCourses = useCallback(async () => {
        if (role !== 'admin') return;
        try {
            const res = await getAllCoursesList();
            if (res.success && res.data) {
                setCourses(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch courses list");
        }
    }, [role]);

    const handleApprove = async (id: string) => {
        loading("Authenticating administrative approval...");
        try {
            const res = await approveEnrollment(id);
            if (res.success) {
                success("Enrollment protocol activated successfully!");
                fetchEnrollments();
            } else {
                error(res.error || "Administrative override failed");
            }
        } catch (err) {
            error("A critical system error occurred during approval");
        }
    };

    useEffect(() => {
        setMounted(true);
        if (role === 'admin') {
            fetchCourses();
        }
    }, [role, fetchCourses]);

    
    useEffect(() => {
        if (mounted) {
            fetchEnrollments();
        }
    }, [mounted, fetchEnrollments, statusFilter, courseFilter, paymentFilter]);

    
    useEffect(() => {
        const handleClose = () => setActiveMenu(null);
        window.addEventListener('scroll', handleClose, true);
        window.addEventListener('resize', handleClose);
        return () => {
            window.removeEventListener('scroll', handleClose, true);
            window.removeEventListener('resize', handleClose);
        };
    }, []);

    

    
    const filteredEnrollments = useMemo(() => {
        if (!searchTerm) return enrollments;
        const lowTerm = searchTerm.toLowerCase();
        return enrollments.filter(e =>
            e.course?.title?.toLowerCase().includes(lowTerm) ||
            e.user?.name?.toLowerCase().includes(lowTerm) ||
            e.user?.email?.toLowerCase().includes(lowTerm)
        );
    }, [enrollments, searchTerm]);

    const activeEnrollment = useMemo(() => 
        enrollments.find(e => e.id === activeMenu),
    [enrollments, activeMenu]);

    
    const stats = useMemo(() => {
        const active = enrollments.filter(e => e.status === 'active' || e.status === 'success').length;
        const pending = enrollments.filter(e => e.status === 'pending').length;
        const rate = enrollments.length > 0
            ? Math.round((enrollments.filter(e => e.progress_percentage >= 100).length / enrollments.length) * 100)
            : 0;
        return { active, pending, rate };
    }, [enrollments]);

    if (!mounted) return null;

    const isAdmin = role === 'admin';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="pb-10"
        >
            <PageHeader
                icon={GraduationCap}
                title="Enrollments"
                description="Manage student enrollments and course access."
                actions={
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchEnrollments}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border shadow-sm hover:border-primary/40 hover:bg-muted/50 transition-all font-bold text-[13px] tracking-tight disabled:opacity-50"
                        >
                            <RefreshCw className={cn("w-4 h-4 text-primary", isLoading && "animate-spin")} />
                            <span>Refresh</span>
                        </button>
                    </div>
                }
            />

            <DashboardGrid cols={isAdmin ? 4 : 3} className="mb-8">
                <StatsCard 
                    icon={LayoutDashboard} 
                    title="Total Enrollments" 
                    value={totalEnrollments} 
                    description="Total recorded"
                />
                <StatsCard 
                    icon={Activity} 
                    title="Active" 
                    value={stats.active}  
                    description="Clearance granted"
                />
                <StatsCard 
                    icon={Clock} 
                    title="Pending" 
                    value={stats.pending} 
                    description="Manual verification"
                />
                {isAdmin && (
                    <StatsCard 
                        icon={Award} 
                        title="Completion Rate" 
                        value={`${stats.rate}%`} 
                        description="Course modules finished"
                    />
                )}
            </DashboardGrid>

            {}
            <div className="rounded-[1.5rem] bg-card border border-border shadow-md overflow-hidden">
                <DashboardTableToolbar className="flex-col xl:flex-row items-stretch xl:items-center px-6 py-4 gap-4 border-b border-border bg-muted/10 rounded-none">
                    <div className="flex flex-1 items-center gap-3">
                        <SearchInput 
                            placeholder="Filter by user or course..." 
                            value={searchTerm} 
                            onChange={setSearchTerm} 
                        />
                        <button 
                            onClick={fetchEnrollments}
                            disabled={isLoading}
                            className="h-10 w-10 flex items-center justify-center shrink-0 rounded-xl bg-card border border-border hover:bg-muted transition-all text-muted-foreground hover:text-primary active:scale-95 shadow-sm disabled:opacity-50"
                            title="Refresh records"
                        >
                            <RefreshCw className={cn("w-4 h-4 text-primary", isLoading && "animate-spin")} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-3 bg-background p-1 rounded-xl border border-border shadow-sm">
                            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}>
                                <SelectTrigger className="w-fit min-w-[120px] rounded-lg font-bold text-[11px] uppercase tracking-wider h-8 bg-transparent border-none hover:bg-muted transition-all">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-card text-foreground">
                                    <SelectItem value="all" className="text-[11px] font-bold">ALL STATUS</SelectItem>
                                    <SelectItem value="active" className="text-[11px] font-bold">ACTIVE</SelectItem>
                                    <SelectItem value="success" className="text-[11px] font-bold">SUCCESS</SelectItem>
                                    <SelectItem value="pending" className="text-[11px] font-bold">PENDING</SelectItem>
                                    <SelectItem value="failed" className="text-[11px] font-bold">FAILED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isAdmin && (
                            <>
                                <div className="flex items-center gap-3 bg-background p-1 rounded-xl border border-border shadow-sm">
                                    <Select value={courseFilter} onValueChange={(val) => { setCourseFilter(val); setCurrentPage(1); }}>
                                        <SelectTrigger className="w-fit min-w-[140px] max-w-[200px] rounded-lg font-bold text-[11px] uppercase tracking-wider h-8 bg-transparent border-none hover:bg-muted transition-all">
                                            <SelectValue placeholder="Course" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border bg-card text-foreground max-h-[300px]">
                                            <SelectItem value="all" className="text-[11px] font-bold">ALL COURSES</SelectItem>
                                            {courses.map(course => (
                                                <SelectItem key={course.id} value={course.id} className="text-[11px] font-bold truncate">
                                                    {course.title.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-3 bg-background p-1 rounded-xl border border-border shadow-sm">
                                    <Select value={paymentFilter} onValueChange={(val) => { setPaymentFilter(val); setCurrentPage(1); }}>
                                        <SelectTrigger className="w-fit min-w-[120px] rounded-lg font-bold text-[11px] uppercase tracking-wider h-8 bg-transparent border-none hover:bg-muted transition-all">
                                            <SelectValue placeholder="Payment" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border bg-card text-foreground">
                                            <SelectItem value="all" className="text-[11px] font-bold">ALL PAYMENTS</SelectItem>
                                            <SelectItem value="manual" className="text-[11px] font-bold uppercase">Manual Payment</SelectItem>
                                            <SelectItem value="bkash" className="text-[11px] font-bold uppercase">bKash (Auto)</SelectItem>
                                            <SelectItem value="shurjopay" className="text-[11px] font-bold uppercase">Shurjopay</SelectItem>
                                            <SelectItem value="system" className="text-[11px] font-bold uppercase">System/Free</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </>
                        )}
                    </div>
                </DashboardTableToolbar>

                {isLoading ? (
                    <div className="bg-card">
                        <LoadingState message="Synchronizing data..." />
                    </div>
                ) : filteredEnrollments.length === 0 ? (
                    <div className="bg-card">
                        {searchTerm ? (
                            <EmptyFilterState searchTerm={searchTerm} onReset={() => setSearchTerm("")} />
                        ) : (
                            <EmptyDataState
                                icon={GraduationCap}
                                title="No Enrollments Found"
                                description="There are no records in the database yet."
                            />
                        )}
                    </div>
                ) : (
                    <div className="bg-card w-full">
                        <DashboardTableWrapper className="dashboard-scrollbar">
                            <DashboardTableHeader className={cn(
                                "min-w-[900px] bg-muted/30 border-b border-border/80 px-6 py-3.5 items-center",
                                isAdmin 
                                    ? "grid-cols-[2fr_1.5fr_1fr_110px_110px_60px] gap-4" 
                                    : "grid-cols-[2fr_1fr_110px_110px_60px] gap-4"
                            )}>
                                <DashboardTableHead className="px-0">Course</DashboardTableHead>
                                {isAdmin && <DashboardTableHead className="px-0 text-left">User</DashboardTableHead>}
                                <DashboardTableHead className="px-0 text-center">Payment</DashboardTableHead>
                                <DashboardTableHead className="px-0 text-center">Date</DashboardTableHead>
                                <DashboardTableHead className="px-0 text-center">Status</DashboardTableHead>
                                <DashboardTableHead className="px-0 text-center">Action</DashboardTableHead>
                            </DashboardTableHeader>
                            
                            <DashboardTableBody className="divide-y-0">
                                {filteredEnrollments.map((enrollment) => (
                                    <EnrollmentRow 
                                        key={enrollment.id}
                                        enrollment={enrollment}
                                        role={role}
                                        isActive={activeMenu === enrollment.id}
                                        onToggleMenu={() => {}} 
                                        activeMenu={activeMenu}
                                        setActiveMenu={setActiveMenu}
                                        onApprove={handleApprove}
                                    />
                                ))}
                            </DashboardTableBody>
                        </DashboardTableWrapper>

                        {}
                        {totalEnrollments > pageSize && (
                            <div className="px-6 py-4 border-t border-border bg-muted/10">
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
                )}
            </div>
        </motion.div>
    );
}
