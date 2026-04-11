"use client";
import React from "react";
import { Pagination } from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/Button";
import { FileX, RotateCcw, Inbox } from "lucide-react";
import { EmptyStateType } from "@/lib/store/utils/tableState";
export interface ColumnDef<T> {
    header: string | React.ReactNode;
    accessorKey?: keyof T;
    cell?: (row: T) => React.ReactNode;
    className?: string;
    width?: string;
}
interface DashboardTableProps<T> {
    columns: ColumnDef<T>[];
    rows: T[];
    isLoading?: boolean;
    emptyStateType: EmptyStateType;
    filterBar?: React.ReactNode;
    pagination?: {
        currentPage: number;
        pageSize: number;
        totalItems: number;
        onPageChange: (page: number) => void;
        onPageSizeChange: (size: number) => void;
    };
    onResetFilters?: () => void;
    emptyDataMessage?: string;
    emptyDataDescription?: string;
    emptySearchResultsMessage?: string;
    renderEmptyDataAction?: () => React.ReactNode;
    className?: string;
}
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
    const gridTemplate = columns.map(col => col.width || "1fr").join(" ");
    const renderSkeletonRows = () => {
        return Array.from({ length: 5 }).map((_, i) => (
            <div
                key={`skeleton-${i}`}
                className="grid px-8 py-5 items-center bg-card/10 hover:bg-muted/5 transition-colors"
                style={{ gridTemplateColumns: gridTemplate }}
            >
                {columns.map((col, j) => (
                    <div key={j} className={cn("px-4", col.className)}>
                        <Skeleton className="h-4 w-full max-w-48 rounded bg-muted/60" />
                    </div>
                ))}
            </div>
        ));
    };
    const renderDataRows = () => {
        return rows.map((row, i) => (
            <div
                key={row.id || i}
                className="grid px-8 py-5 items-center transition-all duration-300 hover:bg-primary/5 group"
                style={{ gridTemplateColumns: gridTemplate }}
            >
                {columns.map((col, j) => (
                    <div key={j} className={cn("px-4 text-sm font-medium", col.className)}>
                        {col.cell
                            ? col.cell(row)
                            : (col.accessorKey ? String(row[col.accessorKey]) : null)
                        }
                    </div>
                ))}
            </div>
        ));
    };
    const showTable = emptyStateType === 'HAS_ROWS' || isLoading;
    const showEmptyData = !isLoading && emptyStateType === 'EMPTY_DATA';
    const showEmptyFilter = !isLoading && emptyStateType === 'EMPTY_FILTER_RESULTS';
    return (
        <div className={cn("space-y-4", className)}>
            {}
            {filterBar && <div>{filterBar}</div>}
            {}
            {showEmptyData && (
                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] overflow-hidden">
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                        <div className="bg-muted/50 p-6 rounded-full ring-8 ring-muted/5">
                            <Inbox className="w-12 h-12 text-muted-foreground/60" strokeWidth={1.5} />
                        </div>
                        <div className="mt-8 space-y-2 max-w-sm">
                            <h3 className="text-xl font-bold text-foreground tracking-tight">
                                {emptyDataMessage}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">
                                {emptyDataDescription}
                            </p>
                        </div>
                        {renderEmptyDataAction && (
                            <div className="mt-8">{renderEmptyDataAction()}</div>
                        )}
                    </div>
                </div>
            )}
            {}
            {showEmptyFilter && (
                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] overflow-hidden">
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                        <div className="bg-muted/50 p-5 rounded-full ring-8 ring-muted/5">
                            <FileX className="w-10 h-10 text-muted-foreground/60" strokeWidth={1.5} />
                        </div>
                        <div className="mt-6 space-y-1.5 max-w-sm">
                            <h3 className="text-lg font-bold text-foreground">
                                {emptySearchResultsMessage}
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium">
                                We couldn't find any results matching your search terms.
                            </p>
                        </div>
                        {onResetFilters && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onResetFilters}
                                className="mt-8 gap-2 px-6 rounded-xl border-border/50 hover:bg-muted font-bold"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Filter Interface
                            </Button>
                        )}
                    </div>
                </div>
            )}
            {/* Grid Container */}
            {showTable && (
                <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-[2.5rem] overflow-hidden overflow-x-auto min-w-0">
                    <div className="min-w-[800px] divide-y divide-border/10">
                        {/* Header */}
                        <div
                            className="grid px-8 py-5 bg-muted/5 border-b border-border/20 items-center whitespace-nowrap"
                            style={{ gridTemplateColumns: gridTemplate }}
                        >
                            {columns.map((col, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70",
                                        col.className
                                    )}
                                >
                                    {col.header}
                                </div>
                            ))}
                        </div>
                        {/* Body */}
                        <div className="divide-y divide-border/10">
                            {isLoading ? renderSkeletonRows() : renderDataRows()}
                        </div>
                    </div>
                </div>
            )}
            {/* Pagination Component */}
            {pagination && emptyStateType === 'HAS_ROWS' && (
                <div className="pt-2">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))}
                        onPageChange={pagination.onPageChange}
                        pageSize={pagination.pageSize}
                        onPageSizeChange={pagination.onPageSizeChange}
                        totalItems={pagination.totalItems}
                    />
                </div>
            )}
        </div>
    );
}
