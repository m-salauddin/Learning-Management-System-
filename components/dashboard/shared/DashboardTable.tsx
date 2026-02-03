"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/Button";
import { FileX, RotateCcw, Inbox } from "lucide-react";
import { EmptyStateType } from "@/lib/store/utils/tableState";

// ============================================================================
// TYPES
// ============================================================================

export interface ColumnDef<T> {
    header: string | React.ReactNode;
    accessorKey?: keyof T;
    cell?: (row: T) => React.ReactNode;
    className?: string;
}

interface DashboardTableProps<T> {
    columns: ColumnDef<T>[];
    rows: T[];
    isLoading?: boolean;
    emptyStateType: EmptyStateType;

    // UI Slots
    filterBar?: React.ReactNode;

    // Pagination (Required unless hidden)
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };

    // Actions
    onResetFilters?: () => void;

    // Customization
    emptyDataMessage?: string;
    emptyDataDescription?: string;
    emptySearchResultsMessage?: string;
    renderEmptyDataAction?: () => React.ReactNode;
    className?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function DashboardTable<T extends { id?: string | number }>({
    columns,
    rows,
    isLoading = false,
    emptyStateType,
    filterBar,
    pagination,
    onResetFilters,
    emptyDataMessage = "No data yet",
    emptyDataDescription = "There are no items to display at this moment.",
    emptySearchResultsMessage = "No results found",
    renderEmptyDataAction,
    className
}: DashboardTableProps<T>) {

    // Helper: Render Loading Skeletons
    const renderSkeletonRows = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
                {columns.map((col, j) => (
                    <TableCell key={j} className={col.className}>
                        <Skeleton className="h-4 w-full max-w-48 rounded bg-muted/60" />
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    // Helper: Render Data Rows
    const renderDataRows = () => {
        return rows.map((row, i) => (
            <TableRow key={row.id || i}>
                {columns.map((col, j) => (
                    <TableCell key={j} className={col.className}>
                        {col.cell
                            ? col.cell(row)
                            : (col.accessorKey ? String(row[col.accessorKey]) : null)
                        }
                    </TableCell>
                ))}
            </TableRow>
        ));
    };

    // Determine content to show
    const showTable = emptyStateType === 'HAS_ROWS' || isLoading;
    const showEmptyData = !isLoading && emptyStateType === 'EMPTY_DATA';
    const showEmptyFilter = !isLoading && emptyStateType === 'EMPTY_FILTER_RESULTS';

    return (
        <div className={cn("space-y-4", className)}>

            {/* Filter Bar */}
            {filterBar && <div>{filterBar}</div>}

            {/* Empty Data State */}
            {showEmptyData && (
                <div className="">
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-muted/50 p-4 rounded-full">
                            <Inbox className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <div className="mt-6 space-y-2 max-w-sm">
                            <h3 className="text-lg font-semibold text-foreground">
                                {emptyDataMessage}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {emptyDataDescription}
                            </p>
                        </div>
                        {renderEmptyDataAction && (
                            <div className="mt-6">{renderEmptyDataAction()}</div>
                        )}
                    </div>
                </div>
            )}

            {/* Empty Filter Results */}
            {showEmptyFilter && (
                <div className="">
                    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                        <div className="bg-muted/50 p-4 rounded-full">
                            <FileX className="w-8 h-8 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <div className="mt-5 space-y-1.5">
                            <h3 className="text-base font-medium text-foreground">
                                {emptySearchResultsMessage}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Try adjusting your filters to see results
                            </p>
                        </div>
                        {onResetFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onResetFilters}
                                className="mt-5 gap-2"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reset Filters
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            {showTable && (
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((col, i) => (
                                <TableHead key={i} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? renderSkeletonRows() : renderDataRows()}
                    </TableBody>
                </Table>
            )}

            {/* Pagination */}
            {pagination && emptyStateType === 'HAS_ROWS' && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))}
                    onPageChange={pagination.onPageChange}
                    pageSize={pagination.pageSize}
                    onPageSizeChange={pagination.onPageSizeChange}
                    totalItems={pagination.totalItems}
                />
            )}
        </div>
    );
}
