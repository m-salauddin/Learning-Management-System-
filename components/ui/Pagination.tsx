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
        <div className={cn("flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-sm select-none", className)}>
            {/* Info */}
            <div className="text-muted-foreground text-center md:text-left">
                Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
                <span className="font-semibold text-foreground">{endItem}</span> of{" "}
                <span className="font-semibold text-foreground">{totalItems}</span> results
            </div>

            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">

                {/* Rows Per Page */}
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground whitespace-nowrap">Rows per page</span>
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="h-8 w-16 appearance-none rounded-lg border border-border/50 bg-background/50 pl-2 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none cursor-pointer transition-all hover:bg-muted/50"
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
                        title="First page"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
                        title="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1 mx-1">
                        {getPageNumbers().map((page, idx) => (
                            page === '...' ? (
                                <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page as number)}
                                    className={cn(
                                        "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all",
                                        currentPage === page
                                            ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border/50"
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
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
                        title="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-muted-foreground hover:text-foreground"
                        title="Last page"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
