"use client";

import {
    Shield, User, Trash2, Edit, MoreHorizontal, Filter, ChevronDown,
    UserPlus, Download, Mail, Phone, MapPin, Calendar, Activity, Award,
    CheckCircle2, XCircle, AlertCircle, Users, TrendingUp, TrendingDown,
    Eye, Lock, Unlock, RefreshCw, Settings, Loader2, X, FileText, FileCode, File, FileSpreadsheet,
    ScanLine, Hash, Clock, BookOpen
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
    ExtendedUser, UserRole, UserStats, UserFilters, UserStatus
} from "@/types/user";
import {
    getUsers, getUserStats, updateUserRole, deleteUser,
    bulkDeleteUsers, bulkUpdateRoles, exportUsersToCSV, exportUsersToJSON
} from "@/lib/actions/users";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose } from "@/components/ui/Dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { SearchInput } from "@/components/dashboard/shared/SearchInput";


export default function UserManagementPage() {
    // Toast
    const toast = useToast();

    // State Management
    const [users, setUsers] = useState<ExtendedUser[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState('all');

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    // Modals
    const [viewUserModal, setViewUserModal] = useState<ExtendedUser | null>(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);
    const [bulkActionModal, setBulkActionModal] = useState<'delete' | 'role' | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const [exportModal, setExportModal] = useState(false);

    // Loading State for actions
    const [isActionLoading, setIsActionLoading] = useState(false);

    // Fetch Users
    const fetchUsers = async () => {
        setIsLoading(true);
        const result = await getUsers({
            search: searchTerm,
            role: roleFilter,
            status: statusFilter,
            page: currentPage,
            pageSize
        });

        if (!result.error) {
            setUsers(result.users);
            setTotalUsers(result.total);
        } else {
            toast.error('Failed to fetch users', result.error);
        }
        setIsLoading(false);
    };

    // Fetch Stats
    const fetchStats = async () => {
        const result = await getUserStats();
        if (!result.error && result.stats) {
            setStats(result.stats);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, roleFilter, statusFilter, currentPage, pageSize]);

    useEffect(() => {
        fetchStats();
    }, []);

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedUsers.size === users.length) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map(u => u.id)));
        }
    };

    const toggleSelectUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const clearSelection = () => {
        setSelectedUsers(new Set());
    };

    // Filters Handler
    const clearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    // Action Handlers
    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
            toast.success('User role updated successfully');
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to update role', result.error || 'An error occurred');
        }
    };

    const handleDeleteUser = async (userId: string) => {
        const result = await deleteUser(userId);
        if (result.success) {
            toast.success('User deleted successfully');
            setDeleteConfirmModal(null);
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to delete user', result.error || 'An error occurred');
        }
    };

    const handleBulkDelete = async () => {
        const result = await bulkDeleteUsers(Array.from(selectedUsers));
        if (result.success) {
            toast.success('Users deleted', `${result.deletedCount} users deleted successfully`);
            setBulkActionModal(null);
            setSelectedUsers(new Set());
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to delete users', result.error || 'An error occurred');
        }
    };

    const handleBulkRoleUpdate = async () => {
        const result = await bulkUpdateRoles(Array.from(selectedUsers), selectedRole);
        if (result.success) {
            toast.success('Users updated', `${result.updatedCount} users updated successfully`);
            setBulkActionModal(null);
            setSelectedUsers(new Set());
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to update users', result.error || 'An error occurred');
        }
    };

    const handleExportCSV = async () => {
        const result = await exportUsersToCSV({ search: searchTerm, role: roleFilter });
        if (result.csv) {
            const blob = new Blob([result.csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Users exported to CSV');
            setExportModal(false);
        } else {
            toast.error('Failed to export users', result.error || 'An error occurred');
        }
    };

    const handleExportJSON = async () => {
        const result = await exportUsersToJSON({ search: searchTerm, role: roleFilter });
        if (result.json) {
            const blob = new Blob([result.json], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Users exported to JSON');
            setExportModal(false);
        } else {
            toast.error('Failed to export users', result.error || 'An error occurred');
        }
    };

    const getStatusType = (status?: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'suspended': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const StatusBadge = ({ status }: { status?: string }) => {
        const styles = {
            active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
            inactive: "bg-muted text-muted-foreground border-border/50",
            suspended: "bg-rose-500/10 text-rose-600 border-rose-500/20",
            pending: "bg-amber-500/10 text-amber-600 border-amber-500/20"
        };
        const dotStyles = {
            active: "bg-emerald-500",
            inactive: "bg-muted-foreground",
            suspended: "bg-rose-500",
            pending: "bg-amber-500 animate-pulse"
        };
        const s = (status as keyof typeof styles) || 'active';

        return (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium capitalize", styles[s])}>
                <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[s])} />
                {s}
            </span>
        );
    };

    const handleExportPDF = async () => {
        setIsLoading(true);
        try {
            // Fetch all users for export (re-using existing list if possible, but better to fetch all if paginated)
            // For now, we'll fetch using the store helper to get pure data without pagination limit if possible,
            // or just use current list? The CSV export function fetches ALL. We should probably do the same here.
            // But we don't have a "fetch all" client side readily available without making a new request.
            // Actually, exportUsersToCSV fetches all server side.
            // We should ideally have a server-side PDF generation or fetch all data here.
            // Let's use the JSON export to get all data first, then generate PDF.

            const result = await exportUsersToJSON({ search: searchTerm, role: roleFilter });

            if (result.json) {
                const usersData = JSON.parse(result.json);
                const doc = new jsPDF();

                // Add Header
                doc.setFillColor(63, 81, 181); // Primary Blue Color (Indigo 500 equivalent)
                doc.rect(0, 0, 210, 40, 'F');

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(22);
                doc.setFont("helvetica", "bold");
                doc.text("Dokkhota IT LMS", 14, 25);

                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text("User Management Report", 14, 33);

                // Add Report Meta Info
                doc.setTextColor(100, 100, 100);
                doc.setFontSize(10);
                doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 14, 50);
                doc.text(`Total Users: ${usersData.length}`, 14, 56);

                const tableColumn = ["Name", "Email", "Role", "Joined Date", "Status"];
                const tableRows = usersData.map((user: any) => [
                    user.name || "N/A",
                    user.email || "N/A",
                    (user.role || "student").toUpperCase(),
                    new Date(user.created_at).toLocaleDateString(),
                    (user.role || "student").toUpperCase(),
                    new Date(user.created_at).toLocaleDateString(),
                    (user.status || "active").toUpperCase()
                ]);

                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 65,
                    theme: 'grid',
                    styles: {
                        fontSize: 9,
                        cellPadding: 4,
                        font: "helvetica",
                        lineColor: [230, 230, 230],
                        lineWidth: 0.1
                    },
                    headStyles: {
                        fillColor: [245, 247, 250],
                        textColor: [60, 60, 60],
                        fontStyle: 'bold',
                        halign: 'left'
                    },
                    bodyStyles: {
                        textColor: [80, 80, 80]
                    },
                    alternateRowStyles: {
                        fillColor: [252, 252, 252]
                    },
                    columnStyles: {
                        0: { fontStyle: 'bold', cellWidth: 40 }, // Name
                        1: { cellWidth: 60 }, // Email
                        2: { cellWidth: 30 }, // Role
                        3: { cellWidth: 30 }, // Joined
                        4: { cellWidth: 20, halign: 'center' }  // Status
                    },
                    didDrawPage: (data) => {
                        // Footer
                        const pageCount = doc.getNumberOfPages();
                        doc.setFontSize(8);
                        doc.setTextColor(150, 150, 150);
                        doc.text(
                            `Page ${data.pageNumber} of ${pageCount}`,
                            data.settings.margin.left,
                            doc.internal.pageSize.height - 10
                        );
                        doc.text(
                            `© ${new Date().getFullYear()} Dokkhota IT. Confidential Report.`,
                            doc.internal.pageSize.width - 70,
                            doc.internal.pageSize.height - 10
                        );
                    }
                });

                doc.save(`users-export-${new Date().toISOString().split('T')[0]}.pdf`);
                toast.success('Users exported to PDF');
                setExportModal(false);
            } else {
                toast.error('Failed to fetch data for PDF', result.error || undefined);
            }
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error('Failed to generate PDF');
        }
        setIsLoading(false);
    };


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            case 'teacher':
                return 'bg-violet-500/10 text-violet-600 border-violet-500/20';
            case 'moderator':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            default:
                return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
        }
    };

    const AVATAR_COLORS = [
        "bg-blue-500/15 text-blue-500 border-blue-500/20",
        "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
        "bg-rose-500/15 text-rose-500 border-rose-500/20",
        "bg-amber-500/15 text-amber-500 border-amber-500/20",
        "bg-violet-500/15 text-violet-500 border-violet-500/20",
        "bg-indigo-500/15 text-indigo-500 border-indigo-500/20",
        "bg-cyan-500/15 text-cyan-500 border-cyan-500/20",
        "bg-pink-500/15 text-pink-500 border-pink-500/20",
        "bg-orange-500/15 text-orange-500 border-orange-500/20",
        "bg-fuchsia-500/15 text-fuchsia-500 border-fuchsia-500/20",
    ];

    const getAvatarColor = (seed: string) => {
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % AVATAR_COLORS.length;
        return AVATAR_COLORS[index];
    };

    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-10 font-sans"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight"
                    >
                        Users
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Manage users, roles, and permissions across the platform
                    </motion.p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExportModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-border/50 bg-muted/40 hover:bg-muted/60 text-sm font-semibold transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </motion.button>

                    <Link href="/dashboard/users/new">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Add User</span>
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {!stats ? (
                    // Skeletons
                    [...Array(4)].map((_, i) => (
                        <div key={`skel-${i}`} className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl animate-pulse">
                            <div className="h-4 w-24 bg-muted/40 rounded mb-3" />
                            <div className="h-8 w-16 bg-muted/40 rounded" />
                        </div>
                    ))
                ) : (
                    // Actual Stats
                    [
                        { label: 'Total Users', value: stats.total, icon: Users, color: 'blue' },
                        { label: 'Active Users', value: stats.active, icon: CheckCircle2, color: 'emerald' },
                        { label: 'New This Month', value: stats.newThisMonth, icon: TrendingUp, color: 'violet' },
                        { label: 'Growth', value: `${stats.growthPercentage}%`, icon: stats.growthPercentage >= 0 ? TrendingUp : TrendingDown, color: stats.growthPercentage >= 0 ? 'emerald' : 'rose' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === 'blue' && "bg-blue-500/10 text-blue-600",
                                    stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                                    stat.color === 'violet' && "bg-violet-500/10 text-violet-600",
                                    stat.color === 'rose' && "bg-rose-500/10 text-rose-600"
                                )}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Main Table Container */}
            <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-sm shadow-black/5">

                {/* Toolbar */}
                <div className="p-4 md:p-6 border-b border-border/40 bg-card/30 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        {/* Search & Refresh Group */}
                        <div className="flex items-center gap-2 w-full lg:max-w-md">
                            <SearchInput
                                value={searchTerm}
                                onChange={(value) => {
                                    setSearchTerm(value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search by name or email..."
                                debounceMs={300}
                                isSearching={isLoading}
                                className="flex-1"
                            />

                            {/* Refresh Button */}
                            <button
                                onClick={() => {
                                    fetchUsers();
                                    toast.success("Users list refreshed");
                                }}
                                className="h-11 w-11 flex items-center justify-center shrink-0 rounded-xl border border-input-dark-border bg-input-dark hover:bg-input-dark-hover hover:text-foreground focus:shadow-[0_0_0_2px_var(--input-dark-glow)] focus:outline-none transition-all duration-200 text-input-dark-text"
                                title="Refresh list"
                            >
                                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4 lg:mt-0">

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {/* Role Filter */}
                                <Select
                                    value={roleFilter}
                                    onValueChange={(val) => {
                                        setRoleFilter(val);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-fit sm:min-w-[140px]">
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4" />
                                            <SelectValue placeholder="All Roles" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="moderator">Moderator</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Status Filter */}
                                <Select
                                    value={statusFilter}
                                    onValueChange={(val) => {
                                        setStatusFilter(val);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectTrigger className="w-full sm:w-fit sm:min-w-[140px]">
                                        <div className="flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            <SelectValue placeholder="All Status" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Clear Filters */}
                                {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                                    <button
                                        onClick={clearFilters}
                                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                        <span className="sm:hidden lg:inline">Clear</span>
                                        <span className="hidden sm:inline lg:hidden">Clear Filters</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                {/* Content Rendering */}
                {isLoading ? (
                    <div className="py-20 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground animate-pulse">Syncing user directory...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="bg-muted/50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                            <Users className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-lg font-bold">No users found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                            We couldn&apos;t find any users matching your criteria.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-hidden overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/50">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/40">
                                    <TableHead className="w-[50px] px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        <AnimatedCheckbox
                                            id="select-all"
                                            checked={selectedUsers.size === users.length && users.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</TableHead>
                                    <TableHead className="px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/20">
                                {users.map((user) => (
                                    <TableRow key={user.id} className="border-b border-border/30 transition-all duration-200 group">
                                        <TableCell className="px-6 py-4">
                                            <AnimatedCheckbox
                                                id={`select-${user.id}`}
                                                checked={selectedUsers.has(user.id)}
                                                onChange={() => toggleSelectUser(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {(() => {
                                                        const userInitial = (user.name?.[0] || user.email?.[0] || 'U').toUpperCase();
                                                        const avatarStyle = user.avatar_color || getAvatarColor(user.id || user.email || user.name || 'user');

                                                        return (
                                                            <div className={cn(
                                                                "w-10 h-10 rounded-full flex items-center justify-center font-bold border overflow-hidden shadow-sm transition-all duration-300",
                                                                user.avatar_url
                                                                    ? "border-primary/10 bg-linear-to-br from-primary/20 to-primary/5 text-primary"
                                                                    : avatarStyle
                                                            )}>
                                                                {user.avatar_url ? (
                                                                    <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    userInitial
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground">
                                                        {user.name || 'Unnamed User'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm",
                                                getRoleBadgeStyle(user.role || 'student')
                                            )}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                <span className="capitalize">{user.role || 'student'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <StatusBadge status={user.status} />
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-muted-foreground text-xs">
                                            {formatDate(user.created_at)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors outline-none">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-44 p-1.5 rounded-xl border border-border/50 dark:border-white/10 bg-white dark:bg-[#040a14] shadow-xl dark:shadow-2xl">
                                                    <DropdownMenuItem onClick={() => setViewUserModal(user)} className="rounded-lg cursor-pointer text-sm gap-2.5 text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-white/10 focus:text-slate-900 dark:focus:text-white">
                                                        <Eye className="w-4 h-4" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-sm gap-2.5 text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-white/10 focus:text-slate-900 dark:focus:text-white">
                                                        <Link href={`/dashboard/users/${user.id}/edit`} className="flex items-center w-full gap-2.5">
                                                            <Edit className="w-4 h-4" />
                                                            Edit User
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer text-sm gap-2.5 text-slate-700 dark:text-slate-200 focus:bg-slate-100 dark:focus:bg-white/10 focus:text-slate-900 dark:focus:text-white">
                                                        <Link href={`/dashboard/users/${user.id}/edit`} className="flex items-center w-full gap-2.5">
                                                            <Lock className="w-4 h-4" />
                                                            Update Password
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator className="my-1 bg-slate-200 dark:bg-white/10" />

                                                    <DropdownMenuItem onClick={() => setDeleteConfirmModal(user.id)} className="rounded-lg cursor-pointer text-sm gap-2.5 text-red-500 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/15 focus:text-red-600 dark:focus:text-red-300">
                                                        <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                                                        Delete User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}


                {/* Pagination */}
                {!isLoading && users.length > 0 && (
                    <div className="p-6 border-t border-border/40 bg-muted/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                            totalItems={totalUsers}
                        />
                    </div>
                )}
            </div>


            {/* View User Modal */}
            {/* View User Modal */}
            <Dialog open={!!viewUserModal} onClose={() => setViewUserModal(null)} size="lg">
                <DialogClose onClose={() => setViewUserModal(null)} />
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600">
                            <ScanLine className="w-5 h-5" />
                        </div>
                        User Details
                    </DialogTitle>
                    <DialogDescription>View detailed information about this user account.</DialogDescription>
                </DialogHeader>
                {viewUserModal && (
                    <DialogBody className="space-y-8">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-3xl border-2 border-primary/10 overflow-hidden shadow-2xl">
                                    {viewUserModal.avatar_url ? (
                                        <img src={viewUserModal.avatar_url} alt={viewUserModal.name} className="w-full h-full object-cover" />
                                    ) : (
                                        (viewUserModal.name?.[0] || 'U').toUpperCase()
                                    )}
                                </div>
                                <div className={cn(
                                    "absolute bottom-0 right-0 w-6 h-6 rounded-full border-[3px] border-card flex items-center justify-center",
                                    viewUserModal.status === 'active' ? "bg-emerald-500" : "bg-slate-500"
                                )} />
                            </div>

                            <div className="text-center sm:text-left space-y-2">
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight">{viewUserModal.name || 'Unnamed User'}</h3>
                                    <p className="text-muted-foreground font-medium">{viewUserModal.email}</p>
                                </div>
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm",
                                        getRoleBadgeStyle(viewUserModal.role || 'student')
                                    )}>
                                        <span className="capitalize">{viewUserModal.role || 'student'}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-muted/50 font-mono">
                                        ID: {viewUserModal.id.slice(0, 8)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* User ID Card */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Hash className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Full User ID</span>
                                </div>
                                <p className="text-sm font-mono truncate text-foreground/80" title={viewUserModal.id}>
                                    {viewUserModal.id}
                                </p>
                            </div>

                            {/* Detailed Status Card */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Account Status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {viewUserModal.status === 'active' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            Active Account
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 text-slate-600 border border-slate-500/20 text-xs font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                            Inactive
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Joined Date</span>
                                </div>
                                <p className="text-sm font-medium text-foreground/80">
                                    {formatDate(viewUserModal.created_at)}
                                </p>
                            </div>

                            {/* Last Updated */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Last Updated</span>
                                </div>
                                <p className="text-sm font-medium text-foreground/80">
                                    {formatDate(viewUserModal.updated_at)}
                                </p>
                            </div>

                            {/* Auth Providers */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Auth Providers</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {viewUserModal.providers && viewUserModal.providers.length > 0 ? (
                                        viewUserModal.providers.map(provider => (
                                            <span key={provider} className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-background border border-border/50 capitalize font-medium">
                                                {provider === 'google' && <span className="text-rose-500 p-0.5">G</span>}
                                                {provider === 'github' && <span className="text-foreground p-0.5">git</span>}
                                                {provider === 'email' && <Mail className="w-3 h-3 text-blue-500" />}
                                                {provider}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground italic">Email Only</span>
                                    )}
                                </div>
                            </div>

                            {/* Enrolled Courses */}
                            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-1">
                                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Courses</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold">{viewUserModal.courses_enrolled?.length || 0}</span>
                                    <span className="text-xs text-muted-foreground">active enrollments</span>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                )}
            </Dialog>


            {/* Delete Confirmation Modal */}
            <Dialog open={!!deleteConfirmModal} onClose={() => setDeleteConfirmModal(null)}>
                <DialogClose onClose={() => setDeleteConfirmModal(null)} />
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                    <DialogDescription>This action cannot be undone. Are you sure?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        onClick={() => setDeleteConfirmModal(null)}
                        className="px-4 py-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => deleteConfirmModal && handleDeleteUser(deleteConfirmModal)}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </DialogFooter>
            </Dialog>


            {/* Bulk Delete Modal */}
            <Dialog open={bulkActionModal === 'delete'} onClose={() => setBulkActionModal(null)}>
                <DialogClose onClose={() => setBulkActionModal(null)} />
                <DialogHeader>
                    <DialogTitle>Delete Multiple Users</DialogTitle>
                    <DialogDescription>
                        You are about to delete {selectedUsers.size} users. This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        onClick={() => setBulkActionModal(null)}
                        className="px-4 py-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                        Delete {selectedUsers.size} Users
                    </button>
                </DialogFooter>
            </Dialog>

            {/* Bulk Role Update Modal */}
            <Dialog open={bulkActionModal === 'role'} onClose={() => setBulkActionModal(null)}>
                <DialogClose onClose={() => setBulkActionModal(null)} />
                <DialogHeader>
                    <DialogTitle>Update User Roles</DialogTitle>
                    <DialogDescription>
                        Change the role for {selectedUsers.size} selected users
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <Select
                        value={selectedRole}
                        onValueChange={(val) => setSelectedRole(val as UserRole)}
                    >
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <SelectValue placeholder="Select role" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </DialogBody>
                <DialogFooter>
                    <button
                        onClick={() => setBulkActionModal(null)}
                        className="px-4 py-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBulkRoleUpdate}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Update {selectedUsers.size} Users
                    </button>
                </DialogFooter>
            </Dialog>

            {/* Floating Bulk selection Bar */}
            <AnimatePresence>
                {selectedUsers.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 pr-4 pl-4 rounded-full border border-border bg-card/95 text-foreground shadow-xl backdrop-blur-md"
                    >
                        <span className="text-sm font-semibold mr-2 whitespace-nowrap pl-1">{selectedUsers.size} selected</span>
                        <div className="h-4 w-px bg-border mx-1" />
                        <div className="flex items-center gap-1">
                            <button onClick={() => setBulkActionModal('role')} className="p-2 rounded-full hover:bg-muted transition-colors text-blue-500" title="Change Role">
                                <Shield className="w-4 h-4" />
                            </button>
                            <button onClick={() => setBulkActionModal('delete')} className="p-2 rounded-full hover:bg-muted transition-colors text-red-500" title="Delete Selected">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="h-4 w-px bg-border mx-1" />
                        <button onClick={clearSelection} className="p-2 rounded-full hover:bg-muted transition-colors ml-1 text-muted-foreground hover:text-foreground" title="Clear Selection">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Export Modal */}
            <Dialog open={exportModal} onClose={() => setExportModal(false)}>
                <DialogClose onClose={() => setExportModal(false)} />
                <DialogHeader>
                    <DialogTitle>Export Users</DialogTitle>
                    <DialogDescription>
                        Choose a format to export the user list.
                    </DialogDescription>
                </DialogHeader>
                <DialogBody className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                    <button
                        onClick={handleExportCSV}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                    >
                        <div className="p-4 rounded-full bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <FileSpreadsheet className="w-8 h-8" />
                        </div>
                        <span className="font-semibold">CSV</span>
                    </button>

                    <button
                        onClick={handleExportJSON}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                    >
                        <div className="p-4 rounded-full bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <FileCode className="w-8 h-8" />
                        </div>
                        <span className="font-semibold">JSON</span>
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-primary/5 hover:border-primary/50 transition-all group"
                    >
                        <div className="p-4 rounded-full bg-rose-500/10 text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <File className="w-8 h-8" />
                        </div>
                        <span className="font-semibold">PDF</span>
                    </button>
                </DialogBody>
            </Dialog>
        </motion.div>
    );
}
