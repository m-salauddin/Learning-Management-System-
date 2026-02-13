"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCoupons, setFilters, resetFilters, setSort, setPage, setPageSize } from "@/lib/store/features/admin/couponsSlice";
import { couponsSelectors } from "@/lib/store/features/admin/adminSelectors";
import { DashboardTable, ColumnDef } from "@/components/dashboard/shared/DashboardTable";
import { Coupon } from "@/types/lms";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminCouponsTableProps {
    onCreate?: () => void;
}

export function AdminCouponsTable({ onCreate }: AdminCouponsTableProps) {
    const dispatch = useAppDispatch();

    // Selectors & State
    const items = useAppSelector(couponsSelectors.selectDisplayedRows);
    const isLoading = useAppSelector(couponsSelectors.selectLoading);
    const emptyStateType = useAppSelector(couponsSelectors.selectEmptyStateType);
    const filters = useAppSelector(couponsSelectors.selectFilters);
    const pagination = useAppSelector(couponsSelectors.selectPagination);
    const totalFiltered = useAppSelector(couponsSelectors.selectFilteredCount);

    // Initial Fetch
    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    // Handlers
    const handleSearchCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFilters({ search: e.target.value }));
    };

    const handleReset = () => {
        dispatch(resetFilters());
    };

    const handleCreate = () => {
        if (onCreate) onCreate();
    };

    // Columns
    const columns: ColumnDef<Coupon>[] = [
        {
            header: "Coupon Code",
            accessorKey: "code",
            width: "1.5fr",
            className: "font-mono font-bold uppercase tracking-widest",
            cell: (row) => <span className="font-mono text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">{row.code}</span>
        },
        {
            header: "Discount",
            width: "120px",
            cell: (row) => (
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        row.discount_type === 'percentage'
                            ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    )}
                >
                    {row.discount_type === 'percentage' ? `${row.discount_value}%` : `$${row.discount_value}`}
                </Badge>
            )
        },
        {
            header: "Total Usage",
            width: "100px",
            cell: (row) => <span className="text-xs font-bold tracking-tighter text-muted-foreground">{row.usage_count} uses</span>
        },
        {
            header: "Status",
            width: "100px",
            cell: (row) => (
                <Badge
                    variant="outline"
                    className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        row.is_active
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                    )}
                >
                    {row.is_active ? 'Active' : 'Inactive'}
                </Badge>
            )
        },
        {
            header: "Created On",
            width: "120px",
            className: "text-right",
            cell: (row) => <span className="text-[10px] font-black text-muted-foreground/60 tracking-widest uppercase">{new Date(row.created_at).toLocaleDateString()}</span>
        },
        {
            header: "Action",
            width: "80px",
            className: "text-right",
            cell: (row) => (
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                </Button>
            )
        }
    ];

    // Filter Bar Component
    const FilterBar = (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                    placeholder="Search coupons..."
                    value={filters.search || ""}
                    onChange={handleSearchCheck}
                    className="w-full sm:w-[250px]"
                    disabled={emptyStateType === 'EMPTY_DATA'}
                />
                {/* Additional filters (Status, etc.) can go here */}
            </div>
            <Button onClick={handleCreate} className="w-full sm:w-auto gap-2">
                <Plus className="w-4 h-4" />
                Create Coupon
            </Button>
        </div>
    );

    return (
        <DashboardTable
            columns={columns}
            rows={items}
            isLoading={isLoading}
            emptyStateType={emptyStateType}
            filterBar={FilterBar}
            pagination={{
                currentPage: pagination.page,
                pageSize: pagination.pageSize,
                totalItems: totalFiltered,
                onPageChange: (p) => dispatch(setPage(p)),
                onPageSizeChange: (s) => dispatch(setPageSize(s)),
            }}
            onResetFilters={handleReset}
            emptyDataMessage="No coupons created"
            emptyDataDescription="Get started by creating your first coupon code."
            renderEmptyDataAction={() => (
                <Button onClick={handleCreate}>
                    Create Coupon
                </Button>
            )}
        />
    );
}
