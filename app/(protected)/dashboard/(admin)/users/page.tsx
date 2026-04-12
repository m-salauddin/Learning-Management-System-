"use client";
import {
    Shield, User, Trash2, Edit, MoreHorizontal, Filter, ChevronDown,
    UserPlus, Download, Mail, Phone, MapPin, Calendar, Activity, Award,
    CheckCircle2, XCircle, AlertCircle, Users, TrendingUp, TrendingDown,
    Eye, Lock, Unlock, RefreshCw, Settings, Loader2, X, FileText, FileCode, File, FileSpreadsheet,
    ScanLine, Hash, Clock, BookOpen, Archive
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    ExtendedUser, UserRole, UserStats, UserStatus
} from "@/types/user";
import {
    getUsers, getUserStats, updateUserRole, deleteUser,
    bulkDeleteUsers, bulkUpdateRoles, exportUsersToCSV, exportUsersToJSON
} from "@/lib/actions/users";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { SearchInput, StatusBadge, RoleBadge, StatsSkeleton, LoadingState, EmptyFilterState, ActionDropdown } from "@/components/dashboard/shared";
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

export default function UserManagementPage() {
    const toast = useToast();
    const router = useRouter();
    const [users, setUsers] = useState<ExtendedUser[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const totalPages = Math.ceil(totalUsers / pageSize);
    const [viewUserModal, setViewUserModal] = useState<ExtendedUser | null>(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);
    const [bulkActionModal, setBulkActionModal] = useState<'delete' | 'role' | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const [exportModal, setExportModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
            toast.error('Failed to fetch users');
        }
        setIsLoading(false);
    };
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
    const toggleSelectAll = () => {
        if (selectedUsers.size === users.length && users.length > 0) {
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
    const clearFilters = () => {
        setSearchTerm("");
        setRoleFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
    };
    const handleRoleUpdate = async (userId: string, newRole: UserRole) => {
        const result = await updateUserRole(userId, newRole);
        if (result.success) {
            toast.success('User role updated successfully');
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to update role');
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
            toast.error('Failed to delete user');
        }
    };
    const handleBulkDelete = async () => {
        const result = await bulkDeleteUsers(Array.from(selectedUsers));
        if (result.success) {
            toast.success(`${result.deletedCount} users deleted successfully`);
            setBulkActionModal(null);
            setSelectedUsers(new Set());
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to delete users');
        }
    };
    const handleBulkRoleUpdate = async () => {
        const result = await bulkUpdateRoles(Array.from(selectedUsers), selectedRole);
        if (result.success) {
            toast.success(`${result.updatedCount} users updated successfully`);
            setBulkActionModal(null);
            setSelectedUsers(new Set());
            fetchUsers();
            fetchStats();
        } else {
            toast.error('Failed to update users');
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
            toast.error('Failed to export users');
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
            toast.error('Failed to export users');
        }
    };
    const handleExportPDF = async () => {
        try {
            const result = await exportUsersToJSON({ search: searchTerm, role: roleFilter });
            if (result.json) {
                const usersData = JSON.parse(result.json);
                const doc = new jsPDF();
                doc.setFillColor(63, 81, 181);
                doc.rect(0, 0, 210, 40, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(22);
                doc.setFont("helvetica", "bold");
                doc.text("Dokkhota IT LMS", 14, 25);
                doc.setFontSize(12);
                doc.text("User Management Report", 14, 33);
                const tableColumn = ["Name", "Email", "Role", "Joined Date", "Status"];
                const tableRows = usersData.map((user: any) => [
                    user.name || "N/A",
                    user.email || "N/A",
                    (user.role || "student").toUpperCase(),
                    new Date(user.created_at).toLocaleDateString(),
                    (user.status || "active").toUpperCase()
                ]);
                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 50,
                    theme: 'grid',
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [63, 81, 181] }
                });
                doc.save(`users-export-${new Date().toISOString().split('T')[0]}.pdf`);
                toast.success('Users exported to PDF');
                setExportModal(false);
            }
        } catch (error) {
            toast.error('Failed to generate PDF');
        }
    };
    const getAvatarColor = (seed: string) => {
        const AVATAR_COLORS = [
            "bg-blue-500/15 text-blue-500 border-blue-500/20",
            "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
            "bg-rose-500/15 text-rose-500 border-rose-500/20",
            "bg-amber-500/15 text-amber-500 border-amber-500/20",
            "bg-violet-500/15 text-violet-500 border-violet-500/20"
        ];
        let hash = 0;
        for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10 font-sans text-foreground">
            <PageHeader
                title="User Directory"
                description="High-fidelity authority management system"
                icon={Users}
                actions={
                    <div className="flex items-center gap-3">
                        <button onClick={() => setExportModal(true)} className="px-5 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-muted/50 text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <Link href="/dashboard/users/new">
                            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Add Entity
                            </button>
                        </Link>
                    </div>
                }
            />

            <DashboardGrid cols={4}>
                {!stats ? <StatsSkeleton count={4} /> : (
                    <>
                        <StatsCard
                            title="Total Entities"
                            value={stats.total}
                            icon={Users}
                            className="border-blue-500/20"
                        />
                        <StatsCard
                            title="Active Matrix"
                            value={stats.active}
                            icon={CheckCircle2}
                            className="border-emerald-500/20"
                        />
                        <StatsCard
                            title="Velocity"
                            value={stats.newThisMonth}
                            icon={TrendingUp}
                            description="New this month"
                            className="border-violet-500/20"
                        />
                        <StatsCard
                            title="Growth"
                            value={`${stats.growthPercentage}%`}
                            icon={stats.growthPercentage >= 0 ? TrendingUp : TrendingDown}
                            description={stats.growthPercentage >= 0 ? "Increasing" : "Decreasing"}
                            className={stats.growthPercentage >= 0 ? "border-emerald-500/20" : "border-rose-500/20"}
                        />
                    </>
                )}
            </DashboardGrid>
            {}
            <DashboardTableContainer>
                <DashboardTableToolbar>
                    <div className="flex items-center gap-3 w-full lg:max-w-md">
                        <SearchInput
                            value={searchTerm}
                            onChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
                            placeholder="Identify user..."
                            className="flex-1"
                        />
                        <button onClick={fetchUsers} className="h-11 w-11 flex items-center justify-center rounded-xl border border-border/30 hover:bg-muted/50 transition-all text-muted-foreground group">
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-fit min-w-[150px] rounded-xl"><SelectValue placeholder="All Roles" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin Authority</SelectItem>
                                <SelectItem value="teacher">Educator</SelectItem>
                                <SelectItem value="student">Candidate</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-fit min-w-[150px] rounded-xl"><SelectValue placeholder="All Status" /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">Any Status</SelectItem>
                                <SelectItem value="active">Operational</SelectItem>
                                <SelectItem value="suspended">Locked</SelectItem>
                                <SelectItem value="pending">Awaiting</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchTerm || roleFilter !== 'all' || statusFilter !== 'all') && (
                            <button onClick={clearFilters} className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive/20 transition-all">Reset Filters</button>
                        )}
                    </div>
                </DashboardTableToolbar>
                {isLoading ? (
                    <LoadingState message="Resolving Directory Hash..." />
                ) : users.length === 0 ? (
                    <EmptyFilterState searchTerm={searchTerm} message="Null Data Set" />
                ) : (
                    <DashboardTableWrapper className="min-w-[1000px]">
                        <DashboardTableHeader className="grid-cols-[48px_2.5fr_1fr_120px_120px_80px]">
                            <div className="flex justify-center">
                                <AnimatedCheckbox id="select-all" checked={selectedUsers.size === users.length && users.length > 0} onChange={toggleSelectAll} />
                            </div>
                            <DashboardTableHead>Subject / Credentials</DashboardTableHead>
                            <DashboardTableHead>Authority Level</DashboardTableHead>
                            <DashboardTableHead className="text-center">Status</DashboardTableHead>
                            <DashboardTableHead className="text-center">Protocol Start</DashboardTableHead>
                            <DashboardTableHead className="text-right">Intervention</DashboardTableHead>
                        </DashboardTableHeader>
                        <DashboardTableBody>
                            {users.map((user) => (
                                <DashboardTableRow key={user.id} className="grid-cols-[48px_2.5fr_1fr_120px_120px_80px]">
                                    <div className="flex justify-center">
                                        <AnimatedCheckbox id={`select-${user.id}`} checked={selectedUsers.has(user.id)} onChange={() => toggleSelectUser(user.id)} />
                                    </div>
                                    <div className="px-4 flex items-center gap-4 min-w-0">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 shadow-inner group-hover:scale-105 transition-transform duration-500", user.avatar_url ? "border-primary/20 bg-primary/5" : getAvatarColor(user.id))}>
                                            {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" /> : (user.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-sm tracking-tight capitalize">{user.name || 'Anonymous Entity'}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground/60 tracking-tight font-mono truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="px-4">
                                        <RoleBadge role={user.role} />
                                    </div>
                                    <div className="px-4 text-center"><StatusBadge status={user.status} /></div>
                                    <div className="px-4 text-center">
                                        <p className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <DashboardTableCell className="text-right">
                                        <ActionDropdown 
                                            id={user.id}
                                            title="Intervention"
                                            activeId={activeMenu}
                                            setActiveId={setActiveMenu}
                                            actions={[
                                                {
                                                    label: "Biometrics",
                                                    icon: Eye,
                                                    onClick: () => setViewUserModal(user),
                                                    variant: 'info'
                                                },
                                                {
                                                    label: "Adjust Profile",
                                                    icon: Edit,
                                                    onClick: () => router.push(`/dashboard/users/${user.id}/edit`),
                                                    variant: 'warning'
                                                },
                                                {
                                                    label: "Purge Entity",
                                                    icon: Trash2,
                                                    onClick: () => setDeleteConfirmModal(user.id),
                                                    variant: 'danger'
                                                }
                                            ]}
                                        />
                                    </DashboardTableCell>
                                </DashboardTableRow>
                            ))}
                        </DashboardTableBody>
                    </DashboardTableWrapper>
                )}
                {!isLoading && totalUsers > pageSize && (
                    <div className="p-8 border-t border-border/20 bg-muted/5">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={setPageSize} totalItems={totalUsers} />
                    </div>
                )}
            </DashboardTableContainer>
            {}
            <AnimatePresence>
                {selectedUsers.size > 0 && (
                    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-3 rounded-2xl border border-primary/20 bg-card/90 shadow-2xl backdrop-blur-2xl ring-4 ring-primary/5">
                        <div className="flex items-center gap-3 pl-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-black text-xs">{selectedUsers.size}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Active Selections</span>
                        </div>
                        <div className="h-6 w-px bg-border/40" />
                        <div className="flex items-center gap-2">
                            <button onClick={handleBulkDelete} className="p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-4 shadow-xs"><Trash2 className="w-4 h-4" /> Purge</button>
                            <button onClick={() => setBulkActionModal('role')} className="p-3 rounded-xl hover:bg-indigo-500/10 text-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-4 shadow-xs"><Shield className="w-4 h-4" /> Adjust Authority</button>
                        </div>
                        <div className="h-6 w-px bg-border/40" />
                        <button onClick={clearSelection} className="p-3 rounded-xl hover:bg-muted text-muted-foreground transition-all"><X className="w-5 h-5" /></button>
                    </motion.div>
                )}
            </AnimatePresence>
            {}
            <Dialog open={exportModal} onClose={() => setExportModal(false)} size="sm">
                <DialogHeader>
                    <DialogTitle>Data Extraction</DialogTitle>
                    <DialogDescription>Convert directory topology into portable formats.</DialogDescription>
                </DialogHeader>
                <DialogBody className="space-y-3">
                    {[
                        { name: 'CSV', desc: 'Symmetric Spreadsheet', color: 'emerald', action: handleExportCSV },
                        { name: 'JSON', desc: 'Raw Object Stream', color: 'amber', action: handleExportJSON },
                        { name: 'PDF', desc: 'Vector Graphic Record', color: 'rose', action: handleExportPDF }
                    ].map(type => (
                        <button key={type.name} onClick={type.action} className="w-full flex items-center gap-4 p-5 rounded-3xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left outline-none">
                            <div className={cn("p-3 rounded-2xl transition-all group-hover:scale-110", type.color === 'emerald' && "bg-emerald-500/10 text-emerald-500", type.color === 'amber' && "bg-amber-500/10 text-amber-500", type.color === 'rose' && "bg-rose-500/10 text-rose-500")}><Download className="w-5 h-5" /></div>
                            <div>
                                <p className="font-black text-sm tracking-tight text-foreground">Export as {type.name}</p>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-60 mt-0.5">{type.desc}</p>
                            </div>
                        </button>
                    ))}
                </DialogBody>
            </Dialog>
            {}
            <Dialog open={bulkActionModal === 'role'} onClose={() => setBulkActionModal(null)} size="sm">
                <DialogHeader>
                    <DialogTitle>Authority Adjustment</DialogTitle>
                    <DialogDescription>Apply global privilege overrides to {selectedUsers.size} entities.</DialogDescription>
                </DialogHeader>
                <DialogBody className="space-y-6 pt-4">
                    <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
                        <SelectTrigger className="w-full h-14 rounded-2xl border-border/40 bg-muted/20">
                            <SelectValue placeholder="Select Authority" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                            <SelectItem value="admin">Admin Authority</SelectItem>
                            <SelectItem value="teacher">Educator</SelectItem>
                            <SelectItem value="student">Candidate</SelectItem>
                        </SelectContent>
                    </Select>
                </DialogBody>
                <DialogFooter className="grid grid-cols-2 gap-3 p-6 pt-0">
                    <button onClick={() => setBulkActionModal(null)} className="py-4 bg-muted/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/40 transition-all">Abort</button>
                    <button onClick={handleBulkRoleUpdate} className="py-4 bg-indigo-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/30">Commit Changes</button>
                </DialogFooter>
            </Dialog>
            {}
            <Dialog open={!!deleteConfirmModal} onClose={() => setDeleteConfirmModal(null)} size="sm">
                <div className="p-6 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-500/5"><AlertCircle className="w-10 h-10" /></div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black tracking-tight text-foreground">Confirm Purge?</h2>
                        <p className="text-sm font-bold text-muted-foreground opacity-70">This action will permanently extract the entity from the system matrix. This protocol is irreversible.</p>
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-3 p-6 pt-0">
                    <button onClick={() => setDeleteConfirmModal(null)} className="py-4 bg-muted/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/40 transition-all">Abort</button>
                    <button onClick={() => deleteConfirmModal && handleDeleteUser(deleteConfirmModal)} className="py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/30">Execute Purge</button>
                </DialogFooter>
            </Dialog>
            {}
            <Dialog open={!!viewUserModal} onClose={() => setViewUserModal(null)} size="lg">
                <DialogHeader>
                    <DialogTitle>Entity Intelligence</DialogTitle>
                </DialogHeader>
                {viewUserModal && (
                    <DialogBody className="space-y-6">
                        <div className="flex gap-6 items-center bg-muted/20 p-6 rounded-[2rem] border border-border/20">
                            <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center font-black text-3xl border-2 shadow-2xl", viewUserModal.avatar_url ? "border-primary/20 bg-primary/5" : getAvatarColor(viewUserModal.id))}>
                                {viewUserModal.avatar_url ? <img src={viewUserModal.avatar_url} alt="" className="w-full h-full object-cover rounded-3xl" /> : (viewUserModal.name?.[0] || 'U').toUpperCase()}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black tracking-tight">{viewUserModal.name}</h3>
                                <p className="text-xs font-bold text-muted-foreground flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {viewUserModal.email}</p>
                                <div className="mt-2"><RoleBadge role={viewUserModal.role} /></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-3xl bg-muted/10 border border-border/15 space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Operational Start</p>
                                <p className="font-bold text-sm">{new Date(viewUserModal.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="p-5 rounded-3xl bg-muted/10 border border-border/15 space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Current Status</p>
                                <div className="pt-1"><StatusBadge status={viewUserModal.status} /></div>
                            </div>
                        </div>
                    </DialogBody>
                )}
                <DialogFooter className="p-6">
                    <button onClick={() => setViewUserModal(null)} className="w-full py-4 bg-muted/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/40 transition-all border border-border/20">Dismiss Dossier</button>
                </DialogFooter>
            </Dialog>
        </motion.div>
    );
}
