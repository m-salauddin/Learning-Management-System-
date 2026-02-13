"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchUsers, setUsersFilters, clearUsersFilters, setUsersPage } from "@/lib/store/features/admin/adminSlice"; // Import from Slice
import { usersTableSelectors } from "@/lib/store/features/admin/adminSelectors";
import { DashboardTable, ColumnDef } from "@/components/dashboard/shared/DashboardTable";
import { UserManagement } from "@/types/lms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminUsersTable() {
    const dispatch = useAppDispatch();


    const users = useAppSelector(usersTableSelectors.selectDisplayedRows) as UserManagement[]; // Type cast as necessary
    const isLoading = useAppSelector(usersTableSelectors.selectLoading);
    const emptyStateType = useAppSelector(usersTableSelectors.selectEmptyStateType);
    const filters = useAppSelector(usersTableSelectors.selectFilters);
    const totalUsers = useAppSelector(usersTableSelectors.selectTotal);



    const page = useAppSelector((state) => state.admin.usersPage);
    const pageSize = useAppSelector((state) => state.admin.usersPageSize);


    useEffect(() => {


        dispatch(fetchUsers({
            page,
            pageSize,
            role: filters.role === 'all' ? undefined : filters.role,
            search: filters.search
        }));
    }, [dispatch, page, pageSize, filters.role, filters.search]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setUsersFilters({ search: e.target.value }));
        dispatch(setUsersPage(1));
    };

    const handleRoleChange = (val: string) => {
        dispatch(setUsersFilters({ role: val }));
        dispatch(setUsersPage(1));
    };

    const handleReset = () => {
        dispatch(clearUsersFilters());
        dispatch(setUsersPage(1));
    };

    const handleInvite = () => {
    };

    const columns: ColumnDef<UserManagement>[] = [
        {
            header: "User",
            accessorKey: "name",
            width: "2fr",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-bold text-foreground tracking-tight">{row.name}</span>
                    <span className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter opacity-70">{row.email}</span>
                </div>
            )
        },
        {
            header: "Role",
            accessorKey: "role",
            width: "1fr",
            cell: (row) => (
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0",
                        row.role === 'admin' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                            row.role === 'teacher' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' :
                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    )}
                >
                    {row.role}
                </Badge>
            )
        },
        {
            header: "Joined Date",
            accessorKey: "created_at",
            width: "120px",
            className: "text-right",
            cell: (row) => (
                <span className="text-xs font-black tracking-tighter text-muted-foreground/80">
                    {new Date(row.created_at).toLocaleDateString()}
                </span>
            )
        }
    ];

    const FilterBar = (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-[250px]">
                    <Search className={cn("absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground", emptyStateType === 'EMPTY_DATA' && "opacity-50")} />
                    <Input
                        placeholder="Search users..."
                        value={filters.search || ""}
                        onChange={handleSearch}
                        className="pl-9 w-full"
                        disabled={emptyStateType === 'EMPTY_DATA'}
                    />
                </div>
                <Select
                    value={filters.role || "all"}
                    onValueChange={handleRoleChange}
                    disabled={emptyStateType === 'EMPTY_DATA'}
                >
                    <SelectTrigger className="w-fit min-w-[150px]">
                        <div className="flex items-center gap-2">
                            <SelectValue placeholder="Filter by role" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleInvite} className="w-full sm:w-auto gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Users
            </Button>
        </div>
    );

    return (
        <DashboardTable
            columns={columns}
            rows={users}
            isLoading={isLoading}
            emptyStateType={emptyStateType}
            filterBar={FilterBar}
            pagination={{
                currentPage: page,
                pageSize: pageSize,
                totalItems: totalUsers,
                onPageChange: (p) => dispatch(setUsersPage(p)),
                onPageSizeChange: (s) => {
                },
            }}
            onResetFilters={handleReset}
            emptyDataMessage="No users found"
            emptyDataDescription="Get started by inviting users to the platform."
            renderEmptyDataAction={() => (
                <Button onClick={handleInvite}>
                    Invite First User
                </Button>
            )}
        />
    );
}
