"use client";

import {
    Search, Shield, User, Trash2, Edit, MoreHorizontal, Filter, ChevronDown,
    UserPlus, Download, Mail, Phone, MapPin, Calendar, Activity, Award,
    CheckCircle2, XCircle, AlertCircle, Users, TrendingUp, TrendingDown,
    Eye, Lock, Unlock, RotateCcw, Settings, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
    ExtendedUser, UserRole, UserStats, UserFilters
} from "@/types/user";
import {
    getUsers, getUserStats, updateUserRole, deleteUser,
    bulkDeleteUsers, bulkUpdateRoles, exportUsersToCSV, createUser
} from "@/lib/actions/users";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter, DialogClose } from "@/components/ui/Dialog";
import { Select, SelectOption } from "@/components/ui/Select";
import { Dropdown, DropdownItem, DropdownSeparator, DropdownLabel } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";


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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    // Modals
    const [viewUserModal, setViewUserModal] = useState<ExtendedUser | null>(null);
    const [editUserModal, setEditUserModal] = useState<ExtendedUser | null>(null);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState<string | null>(null);
    const [bulkActionModal, setBulkActionModal] = useState<'delete' | 'role' | null>(null);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');

    // Add User State
    const [addUserModal, setAddUserModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student" as UserRole
    });

    // Fetch Users
    const fetchUsers = async () => {
        setIsLoading(true);
        const result = await getUsers({
            search: searchTerm,
            role: roleFilter,
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
    }, [searchTerm, roleFilter, currentPage, pageSize]);

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

    const handleExport = async () => {
        const result = await exportUsersToCSV({ search: searchTerm, role: roleFilter });
        if (result.csv) {
            const blob = new Blob([result.csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Users exported successfully');
        } else {
            toast.error('Failed to export users', result.error || 'An error occurred');
        }
    };

    const handleCreateUser = async () => {
        if (!newUserData.name || !newUserData.email || !newUserData.password) {
            toast.error("Missing fields", "Please fill in all fields");
            return;
        }

        setIsCreating(true);
        const result = await createUser(newUserData);
        setIsCreating(false);

        if (result.success) {
            toast.success("User created", "New user has been added successfully");
            setAddUserModal(false);
            setNewUserData({ name: "", email: "", password: "", role: "student" });
            fetchUsers();
            fetchStats();
        } else {
            toast.error("Error", result.error || "Failed to create user");
        }
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
                        User Management
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
                        onClick={handleExport}
                        className="px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-background text-sm font-semibold transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAddUserModal(true)}
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Add User</span>
                    </motion.button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
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
                    ))}
                </div>
            )}

            {/* Main Table Container */}
            <div className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">

                {/* Toolbar */}
                <div className="p-4 md:p-6 border-b border-border/40 bg-muted/20">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/70"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Role Filter */}
                            <Select
                                value={roleFilter}
                                onChange={(val) => {
                                    setRoleFilter(val);
                                    setCurrentPage(1);
                                }}
                                icon={<Filter className="w-4 h-4" />}
                                className="w-full sm:w-40"
                            >
                                <SelectOption value="all">All Roles</SelectOption>
                                <SelectOption value="student">Student</SelectOption>
                                <SelectOption value="teacher">Teacher</SelectOption>
                                <SelectOption value="moderator">Moderator</SelectOption>
                                <SelectOption value="admin">Admin</SelectOption>
                            </Select>

                            {/* Bulk Actions */}
                            {selectedUsers.size > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20"
                                >
                                    <span className="text-sm font-semibold text-primary">
                                        {selectedUsers.size} selected
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setBulkActionModal('role')}
                                            className="p-2 rounded-lg hover:bg-primary/20 transition-colors"
                                            title="Change role"
                                        >
                                            <Shield className="w-4 h-4 text-primary" />
                                        </button>
                                        <button
                                            onClick={() => setBulkActionModal('delete')}
                                            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                            title="Delete selected"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary/50 pb-2">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/10 text-muted-foreground font-semibold uppercase tracking-wider text-xs border-b border-border/40">
                            <tr>
                                <th className="px-6 py-4">
                                    <AnimatedCheckbox
                                        id="select-all"
                                        checked={selectedUsers.size === users.length && users.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {isLoading ? (
                                // Loading Skeletons
                                [...Array(pageSize)].map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="bg-card/20">
                                        <td className="px-6 py-4"><div className="w-4 h-4 bg-muted/40 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-muted/40 animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-muted/40 rounded animate-pulse" />
                                                    <div className="h-3 w-32 bg-muted/30 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-muted/30 rounded-full animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-muted/30 rounded-full animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-muted/30 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-muted/30 rounded ml-auto animate-pulse" /></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 rounded-full bg-muted/30">
                                                <Users className="w-8 h-8 text-muted-foreground opacity-50" />
                                            </div>
                                            <p className="font-medium text-foreground">No users found</p>
                                            <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, i) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <AnimatedCheckbox
                                                id={`select-${user.id}`}
                                                checked={selectedUsers.has(user.id)}
                                                onChange={() => toggleSelectUser(user.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                                                        {user.avatar_url ? (
                                                            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            (user.name?.[0] || 'U').toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {user.name || 'Unnamed User'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={cn(
                                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm",
                                                getRoleBadgeStyle(user.role || 'student')
                                            )}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                                <span className="capitalize">{user.role || 'student'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs">
                                            {formatDate(user.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Dropdown
                                                trigger={
                                                    <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                }
                                            >
                                                <DropdownItem
                                                    icon={<Eye className="w-4 h-4" />}
                                                    onClick={() => setViewUserModal(user)}
                                                >
                                                    View Details
                                                </DropdownItem>
                                                <DropdownItem
                                                    icon={<Edit className="w-4 h-4" />}
                                                    onClick={() => setEditUserModal(user)}
                                                >
                                                    Edit User
                                                </DropdownItem>
                                                <DropdownSeparator />
                                                <DropdownLabel>Change Role</DropdownLabel>
                                                {(['student', 'teacher', 'moderator', 'admin'] as UserRole[]).map(role => (
                                                    <DropdownItem
                                                        key={role}
                                                        onClick={() => handleRoleUpdate(user.id, role)}
                                                    >
                                                        <span className="capitalize">{role}</span>
                                                    </DropdownItem>
                                                ))}
                                                <DropdownSeparator />
                                                <DropdownItem
                                                    icon={<Trash2 className="w-4 h-4" />}
                                                    onClick={() => setDeleteConfirmModal(user.id)}
                                                    destructive
                                                >
                                                    Delete User
                                                </DropdownItem>
                                            </Dropdown>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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

            {/* Add User Modal */}
            <Dialog open={addUserModal} onClose={() => setAddUserModal(false)}>
                <DialogClose onClose={() => setAddUserModal(false)} />
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new user account with specific role.</DialogDescription>
                </DialogHeader>
                <DialogBody className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            value={newUserData.name}
                            onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="John Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            value={newUserData.password}
                            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-background border border-border/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Select
                            value={newUserData.role}
                            onChange={(val) => setNewUserData({ ...newUserData, role: val as UserRole })}
                        >
                            <SelectOption value="student">Student</SelectOption>
                            <SelectOption value="teacher">Teacher</SelectOption>
                            <SelectOption value="moderator">Moderator</SelectOption>
                            <SelectOption value="admin">Admin</SelectOption>
                        </Select>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <button
                        onClick={() => setAddUserModal(false)}
                        className="px-4 py-2 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateUser}
                        disabled={isCreating}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                        Create User
                    </button>
                </DialogFooter>
            </Dialog>

            {/* View User Modal */}
            <Dialog open={!!viewUserModal} onClose={() => setViewUserModal(null)} size="lg">
                <DialogClose onClose={() => setViewUserModal(null)} />
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>View detailed information about this user</DialogDescription>
                </DialogHeader>
                {viewUserModal && (
                    <DialogBody className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/10 overflow-hidden">
                                {viewUserModal.avatar_url ? (
                                    <img src={viewUserModal.avatar_url} alt={viewUserModal.name} className="w-full h-full object-cover" />
                                ) : (
                                    (viewUserModal.name?.[0] || 'U').toUpperCase()
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{viewUserModal.name || 'Unnamed User'}</h3>
                                <p className="text-muted-foreground">{viewUserModal.email}</p>
                                <div className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm mt-2",
                                    getRoleBadgeStyle(viewUserModal.role || 'student')
                                )}>
                                    <span className="capitalize">{viewUserModal.role || 'student'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">User ID</p>
                                <p className="text-sm font-mono">{viewUserModal.id.slice(0, 8)}...</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Active
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Joined</p>
                                <p className="text-sm">{formatDate(viewUserModal.created_at)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Last Updated</p>
                                <p className="text-sm">{formatDate(viewUserModal.updated_at)}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Auth Providers</p>
                                <div className="flex gap-1">
                                    {viewUserModal.providers?.map(provider => (
                                        <span key={provider} className="px-2 py-1 text-xs rounded-md bg-muted/50 border border-border/50 capitalize">
                                            {provider}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Enrolled Courses</p>
                                <p className="text-sm font-semibold">{viewUserModal.courses_enrolled?.length || 0}</p>
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
                        onChange={(val) => setSelectedRole(val as UserRole)}
                        icon={<Shield className="w-4 h-4" />}
                    >
                        <SelectOption value="student">Student</SelectOption>
                        <SelectOption value="teacher">Teacher</SelectOption>
                        <SelectOption value="moderator">Moderator</SelectOption>
                        <SelectOption value="admin">Admin</SelectOption>
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
        </motion.div>
    );
}
