"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    totalItems: number;
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    totalItems,
    className
}: PaginationProps) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 text-sm", className)}>
            {/* Info & Page Size */}
            <div className="flex items-center gap-6">
                <div className="text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
                    <span className="font-semibold text-foreground">{endItem}</span> of{" "}
                    <span className="font-semibold text-foreground">{totalItems}</span> results
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Rows per page:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="px-3 py-1.5 rounded-lg border border-border/50 bg-background/50 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
                
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-3 py-2 text-muted-foreground">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => onPageChange(page as number)}
                                className={cn(
                                    "min-w-10 px-3 py-2 rounded-lg font-medium transition-all",
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "hover:bg-muted/50 border border-transparent hover:border-border/50"
                                )}
                            >
                                {page}
                            </button>
                        )
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
