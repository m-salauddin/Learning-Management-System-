"use client";

import Image from "next/image";

import {
    GraduationCap, Search, RefreshCw, User, Calendar,
    Activity, Award, CheckCircle2, XCircle, Clock, Mail,
    MoreVertical, CreditCard, LayoutDashboard, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getAllEnrollments, getMyEnrollments, approveEnrollment, cancelEnrollment, deleteEnrollment } from "@/lib/actions/enrollments";
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
import {
    Dialog, DialogHeader, DialogTitle, DialogDescription,
    DialogBody, DialogFooter, DialogClose
} from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ExternalLink, Link as LinkIcon, AlertTriangle } from "lucide-react";
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

const SafeAvatar = ({ src, name, size = "md" }: { src: string | null; name: string; size?: "sm" | "md" | "lg" }) => {
    const [imageError, setImageError] = useState(false);
    
    useEffect(() => {
        setImageError(false);
    }, [src]);

    const getInitials = (nameStr: string) => {
        if (!nameStr) return "U";
        return nameStr
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const sizeClasses = {
        sm: "w-7 h-7 text-[10px]",
        md: "w-9 h-9 text-xs",
        lg: "w-10 h-10 text-sm",
    };

    return (
        <div className={cn(
            "rounded-full flex items-center justify-center font-bold relative overflow-hidden border border-primary/20 shrink-0",
            sizeClasses[size],
            src && !imageError ? "bg-transparent" : "bg-primary/10 text-primary"
        )}>
            {src && !imageError ? (
                <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                />
            ) : (
                getInitials(name)
            )}
        </div>
    );
};

const EnrollmentRow = memo(({
    enrollment,
    role,
    isActive,
    onToggleMenu,
    activeMenu,
    setActiveMenu,
    onApprove,
    onRevoke,
    onDelete,
    onViewDetails,
    onContact
}: {
    enrollment: any;
    role: string;
    isActive: boolean;
    onToggleMenu: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
    activeMenu: string | null;
    setActiveMenu: (id: string | null) => void;
    onApprove: (id: string) => void;
    onRevoke: (id: string) => void;
    onDelete: (id: string) => void;
    onViewDetails: (enrollment: any) => void;
    onContact: (email: string) => void;
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
            { }
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

            { }
            {isAdmin && (
                <div className="flex flex-col min-w-0 pr-4">
                    <div className="flex items-center gap-3 justify-start">
                        <div className="relative shrink-0 w-9 h-9">
                            <SafeAvatar
                                src={enrollment.user?.avatar_url}
                                name={enrollment.user?.name || "Anonymous User"}
                                size="md"
                            />
                            {enrollment.status === 'success' || enrollment.status === 'active' ? (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-background z-10 ring-1 ring-emerald-500/20" />
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

            { }
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

            { }
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

            { }
            <div className="flex justify-center items-center">
                <StatusBadge status={enrollment.status} />
            </div>

            { }
            <div className="flex justify-center items-center">
                <ActionDropdown
                    id={enrollment.id}
                    title="Actions"
                    activeId={activeMenu}
                    setActiveId={setActiveMenu}
                    actions={[
                        ...(isAdmin && (enrollment.status === 'pending' || enrollment.status === 'cancelled') ? [{
                            label: "Approve",
                            icon: CheckCircle2,
                            onClick: () => onApprove(enrollment.id),
                            variant: 'success' as const
                        }] : []),
                        {
                            label: "View Details",
                            icon: Search,
                            onClick: () => onViewDetails(enrollment),
                            variant: 'primary'
                        },
                        ...(isAdmin ? [{
                            label: "Contact",
                            icon: Mail,
                            onClick: () => onContact(enrollment.user?.email),
                            separator: true
                        }] : []),
                        ...(isAdmin && enrollment.status !== 'cancelled' ? [{
                            label: "Cancel",
                            icon: XCircle,
                            onClick: () => onRevoke(enrollment.id),
                            variant: 'danger' as const,
                            separator: true
                        }] : []),
                        ...(isAdmin ? [{
                            label: "Delete",
                            icon: Trash2,
                            onClick: () => onDelete(enrollment.id),
                            variant: 'danger' as const
                        }] : [])
                    ]}
                />
            </div>
        </DashboardTableRow>
    );
});

EnrollmentRow.displayName = "EnrollmentRow";


export default function EnrollmentsPage() {
    const router = useRouter();
    const user = useAppSelector(state => state.auth.user);
    const role = user?.role || 'student';


    const [mounted, setMounted] = useState(false);
    const { success, error, loading, dismiss } = useToast();


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
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const paymentMethod = selectedEnrollment?.transaction?.payment_method;
    const phoneMatch = paymentMethod?.match(/\(([^)]+)\)/);
    const finalPhoneNumber = phoneMatch ? phoneMatch[1] : (selectedEnrollment?.user?.phone || null);
    const [confirmConfig, setConfirmConfig] = useState<{
        title: string;
        description: string;
        onConfirm: () => void;
        variant: "danger" | "warning" | "primary";
        confirmText: string;
    }>({
        title: "",
        description: "",
        onConfirm: () => { },
        variant: "danger",
        confirmText: "Confirm"
    });

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
            error('Failed to load enrollment records');
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
        const loadingId = loading("Approving enrollment...");
        try {
            const res = await approveEnrollment(id);
            dismiss(loadingId);
            if (res.success) {
                success("Enrollment approved successfully!");
                fetchEnrollments();
            } else {
                error(res.error || "Failed to approve enrollment");
            }
        } catch (err) {
            dismiss(loadingId);
            error("Something went wrong during approval");
        }
    };
    const handleRevoke = async (id: string) => {
        setConfirmConfig({
            title: "Cancel Access?",
            description: "Are you sure you want to cancel this student's access to the course? They will no longer be able to access the content.",
            confirmText: "Confirm",
            variant: "warning",
            onConfirm: async () => {
                setIsConfirmOpen(false);
                const loadingId = loading("Canceling access...");
                try {
                    const res = await cancelEnrollment(id);
                    dismiss(loadingId);
                    if (res.success) {
                        success("Access canceled successfully");
                        fetchEnrollments();
                    } else {
                        error(res.error || "Failed to cancel access");
                    }
                } catch (err) {
                    dismiss(loadingId);
                    error("Something went wrong while canceling access");
                }
            }
        });
        setIsConfirmOpen(true);
    };

    const handleDelete = async (id: string) => {
        setConfirmConfig({
            title: "Delete Permanently?",
            description: "This will completely erase the enrollment record and student progress. This action is terminal and cannot be undone.",
            confirmText: "Confirm",
            variant: "danger",
            onConfirm: async () => {
                setIsConfirmOpen(false);
                const loadingId = loading("Deleting enrollment...");
                try {
                    const res = await deleteEnrollment(id);
                    dismiss(loadingId);
                    if (res.success) {
                        success("Enrollment deleted successfully");
                        fetchEnrollments();
                    } else {
                        error(res.error || "Failed to delete enrollment");
                    }
                } catch (err) {
                    dismiss(loadingId);
                    error("A critical system error occurred during deletion");
                }
            }
        });
        setIsConfirmOpen(true);
    };

    const handleViewDetails = (enrollment: any) => {
        setSelectedEnrollment(enrollment);
        setIsDetailOpen(true);
    };

    const handleContact = (email: string) => {
        if (email) {
            window.location.href = `mailto:${email}`;
        } else {
            error("No contact email available for this user");
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
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
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
                        variant="blue"
                    />
                    <StatsCard
                        icon={Activity}
                        title="Active"
                        value={stats.active}
                        description="Clearance granted"
                        variant="emerald"
                    />
                    <StatsCard
                        icon={Clock}
                        title="Pending"
                        value={stats.pending}
                        description="Manual verification"
                        variant="amber"
                    />
                    {isAdmin && (
                        <StatsCard
                            icon={Award}
                            title="Completion Rate"
                            value={`${stats.rate}%`}
                            description="Course modules finished"
                            variant="violet"
                        />
                    )}
                </DashboardGrid>

                { }
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
                                        <SelectItem value="success" className="text-[11px] font-bold">ACTIVE / SUCCESS</SelectItem>
                                        <SelectItem value="pending" className="text-[11px] font-bold">PENDING</SelectItem>
                                        <SelectItem value="cancelled" className="text-[11px] font-bold">CANCELLED</SelectItem>
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
                                                <SelectItem value="bkash_auto" className="text-[11px] font-bold uppercase">bKash (Auto)</SelectItem>
                                                <SelectItem value="shurjopay" className="text-[11px] font-bold uppercase">Shurjopay</SelectItem>
                                                <SelectItem value="system" className="text-[11px] font-bold uppercase">System/Free</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                        </div>
                    </DashboardTableToolbar>

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
                                {isLoading ? (
                                    <LoadingState
                                        message="Loading enrollments..."
                                        gridClass={isAdmin ? "grid-cols-[2fr_1.5fr_1fr_110px_110px_60px]" : "grid-cols-[2fr_1fr_110px_110px_60px]"}
                                        rows={8}
                                        className="bg-transparent"
                                    />
                                ) : filteredEnrollments.length === 0 ? (
                                    <div className="py-20 min-w-[900px] flex items-center justify-center">
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
                                    <>
                                        {filteredEnrollments.map((enrollment) => (
                                            <EnrollmentRow
                                                key={enrollment.id}
                                                enrollment={enrollment}
                                                role={role}
                                                isActive={activeMenu === enrollment.id}
                                                onToggleMenu={() => { }}
                                                activeMenu={activeMenu}
                                                setActiveMenu={setActiveMenu}
                                                onApprove={handleApprove}
                                                onRevoke={handleRevoke}
                                                onDelete={handleDelete}
                                                onViewDetails={handleViewDetails}
                                                onContact={handleContact}
                                            />
                                        ))}</>
                                )}
                            </DashboardTableBody>
                        </DashboardTableWrapper>

                        { }
                        {totalEnrollments > pageSize && filteredEnrollments.length > 0 && !searchTerm && (
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
                </div>
            </motion.div>

            { }
            <Dialog open={isDetailOpen} onClose={() => setIsDetailOpen(false)} size="lg">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle>Enrollment Details</DialogTitle>
                            <DialogDescription>
                                Full breakdown of the student's enrollment and payment status.
                            </DialogDescription>
                        </div>
                        <DialogClose onClose={() => setIsDetailOpen(false)} />
                    </div>
                </DialogHeader>

                <DialogBody className="space-y-5 p-6">
                    {selectedEnrollment && (
                        <div className="space-y-5">
                            {/* Compact Header: Course & Student side-by-side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-3">Course</p>
                                    <div className="flex gap-3">
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-border/50 bg-background shrink-0">
                                            <Image 
                                                src={selectedEnrollment.course?.thumbnail_url || '/placeholder-course.jpg'} 
                                                alt="" 
                                                fill 
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm leading-tight truncate">{selectedEnrollment.course?.title}</p>
                                            <div className="flex gap-2 mt-1.5">
                                                <Badge variant="outline" className="text-[9px] h-4 font-bold border-primary/20 text-primary uppercase">ID: {selectedEnrollment.course?.id?.slice(0, 8)}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-3">Student</p>
                                    <div className="flex items-center gap-3">
                                        <SafeAvatar
                                            src={selectedEnrollment.user?.avatar_url}
                                            name={selectedEnrollment.user?.name || "Anonymous User"}
                                            size="lg"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-sm leading-tight truncate">{selectedEnrollment.user?.name}</p>
                                            <p className="text-[11px] text-muted-foreground truncate">{selectedEnrollment.user?.email}</p>
                                        </div>
                                        {role === 'admin' && (
                                            <button 
                                                onClick={() => router.push(`/dashboard/users/${selectedEnrollment.user?.id}`)}
                                                className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                title="View Profile"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dense Metrics Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-primary/3 border border-primary/10">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Status</p>
                                    <div className="pt-0.5">
                                        <StatusBadge status={selectedEnrollment.status} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Progress</p>
                                    <p className="text-sm font-black flex items-baseline gap-1">
                                        {selectedEnrollment.progress_percentage || 0}%
                                        <span className="text-[10px] text-muted-foreground/60 font-bold uppercase">Done</span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Enrolled</p>
                                    <p className="text-sm font-bold truncate">
                                        {new Date(selectedEnrollment.enrolled_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Access</p>
                                    <p className="text-sm font-bold truncate">
                                        {selectedEnrollment.last_accessed_at ? new Date(selectedEnrollment.last_accessed_at).toLocaleDateString() : 'Never'}
                                    </p>
                                </div>
                            </div>

                            {/* Financial Breakdown - Compact Grid */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60">Financial Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                    <div className="md:col-span-2 p-4 rounded-2xl border border-border/50 bg-muted/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Amount Paid</p>
                                            <p className="text-xl font-black tracking-tight text-primary">৳{selectedEnrollment.transaction?.amount?.toLocaleString() || '0'}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1.5 justify-end text-muted-foreground mb-1">
                                                <CreditCard className="w-3 h-3" />
                                                <span className="text-[9px] font-black uppercase">{selectedEnrollment.transaction?.payment_provider || 'System'}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[8px] font-bold py-0 h-4 bg-background">COMPLETED</Badge>
                                        </div>
                                    </div>

                                    <div className="md:col-span-3 p-4 rounded-2xl border border-border/50 bg-muted/10 grid grid-cols-1 gap-3">
                                        <div className="flex flex-col justify-center">
                                            <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                                                <LinkIcon className="w-3.5 h-3.5 text-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-wider text-primary/80">Transaction Details</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                {finalPhoneNumber ? (
                                                    <div className="flex items-center justify-between bg-background/55 px-3 py-2 rounded-xl border border-border/40">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</span>
                                                        <span className="text-sm font-extrabold text-foreground tracking-wide font-mono">
                                                            {finalPhoneNumber}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between bg-background/55 px-3 py-2 rounded-xl border border-border/40">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</span>
                                                        <span className="text-xs font-bold text-muted-foreground/60 italic">
                                                            Not Provided
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedEnrollment.transaction?.payment_intent_id && (
                                                    <div className="flex items-center justify-between bg-background/55 px-3 py-2 rounded-xl border border-border/40">
                                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Txn ID / Ref</span>
                                                        <span className="text-xs font-black text-foreground font-mono truncate select-all max-w-[200px]" title={selectedEnrollment.transaction.payment_intent_id}>
                                                            {selectedEnrollment.transaction.payment_intent_id}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogBody>

                <DialogFooter>
                    <button
                        onClick={() => setIsDetailOpen(false)}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-sm transition-all"
                    >
                        Close Details
                    </button>
                    {role === 'admin' && selectedEnrollment?.status === 'pending' && (
                        <button
                            onClick={() => {
                                handleApprove(selectedEnrollment.id);
                                setIsDetailOpen(false);
                            }}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 font-bold text-sm transition-all shadow-lg shadow-primary/20"
                        >
                            Approve Now
                        </button>
                    )}
                </DialogFooter>
            </Dialog>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
            />
        </>
    );
}
