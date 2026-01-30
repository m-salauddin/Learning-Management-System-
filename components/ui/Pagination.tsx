"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectOption } from "@/components/ui/Select";

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

    return (
        <div className={cn("flex flex-col-reverse md:flex-row items-center justify-between gap-4 text-sm select-none", className)}>
            {/* Simple Info */}
            <div className="text-muted-foreground font-medium">
                {startItem}-{endItem} of {totalItems}
            </div>

            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto">

                {/* Rows Per Page */}
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Rows</span>
                    <div className="w-[72px]">
                        <Select
                            value={String(pageSize)}
                            onChange={(val) => onPageSizeChange(Number(val))}
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <SelectOption key={size} value={String(size)}>
                                    {size}
                                </SelectOption>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border border-border/50">
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-muted-foreground"
                        title="First page"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-muted-foreground"
                        title="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center px-2">
                        <span className="text-sm font-semibold text-foreground min-w-[20px] text-center">
                            {currentPage}
                        </span>
                        <span className="text-muted-foreground mx-1">/</span>
                        <span className="text-sm font-medium text-muted-foreground min-w-[20px] text-center">
                            {totalPages}
                        </span>
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-muted-foreground"
                        title="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-muted-foreground"
                        title="Last page"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
