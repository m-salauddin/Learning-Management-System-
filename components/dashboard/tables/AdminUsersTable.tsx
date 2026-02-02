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

    // Selectors
    const users = useAppSelector(usersTableSelectors.selectDisplayedRows) as UserManagement[]; // Type cast as necessary
    const isLoading = useAppSelector(usersTableSelectors.selectLoading);
    const emptyStateType = useAppSelector(usersTableSelectors.selectEmptyStateType);
    const filters = useAppSelector(usersTableSelectors.selectFilters);
    const totalUsers = useAppSelector(usersTableSelectors.selectTotal);

    // We need to get page/pageSize from admin slice directly as they are not structured in 'pagination'
    // Or we can use selectors if we made them. AdminSlice has usersPage, usersPageSize
    const page = useAppSelector((state) => state.admin.usersPage);
    const pageSize = useAppSelector((state) => state.admin.usersPageSize);

    // Initial Fetch & Refetch on change
    useEffect(() => {
        // If we are in "Empty Data" state (total === 0 and initialized), we might skip fetching with filters
        // But the UI disables filters so it's fine.
        dispatch(fetchUsers({
            page,
            pageSize,
            role: filters.role === 'all' ? undefined : filters.role,
            search: filters.search
        }));
    }, [dispatch, page, pageSize, filters.role, filters.search]); // Add sort dependencies if needed

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setUsersFilters({ search: e.target.value }));
        dispatch(setUsersPage(1)); // Reset to page 1
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
        console.log("Invite users");
    };

    // Columns
    const columns: ColumnDef<UserManagement>[] = [
        {
            header: "User",
            accessorKey: "name",
            cell: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-foreground">{row.name}</span>
                    <span className="text-xs text-muted-foreground">{row.email}</span>
                </div>
            )
        },
        {
            header: "Role",
            accessorKey: "role",
            cell: (row) => (
                <Badge
                    variant="outline"
                    className={
                        row.role === 'admin' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                            row.role === 'teacher' ? 'bg-primary/10 text-primary border-primary/20' :
                                'bg-secondary/50 text-secondary-foreground border-secondary'
                    }
                >
                    {row.role}
                </Badge>
            )
        },
        {
            header: "Joined",
            accessorKey: "created_at",
            className: "text-right",
            cell: (row) => new Date(row.created_at).toLocaleDateString()
        }
    ];

    // Filter Bar
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
                    // Need action for pageSize if exists, currently undefined in slice but usually standard
                    // dispatch(setUsersPageSize(s)); 
                    console.log("Size change", s);
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
