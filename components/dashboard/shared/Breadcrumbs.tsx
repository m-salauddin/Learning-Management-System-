"use client";

import Link from "next/link";
import { ChevronRight, LucideIcon, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
    icon?: LucideIcon;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
    showHomeIcon?: boolean;
}

export function Breadcrumbs({ items, className, showHomeIcon = false }: BreadcrumbsProps) {
    return (
        <nav className={cn("flex items-center space-x-2 text-sm text-muted-foreground mb-6 overflow-x-auto no-scrollbar pb-1", className)}>
            <Link
                href="/dashboard"
                className="hover:text-primary transition-colors flex items-center gap-1.5 shrink-0 group"
            >
                {showHomeIcon && <Home className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Dashboard</span>
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 shrink-0">
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 text-muted-foreground" />

                    {item.active ? (
                        <div className="flex items-center gap-1.5 text-primary">
                            {item.icon && <item.icon className="w-3.5 h-3.5" />}
                            <span className="font-semibold truncate max-w-[150px] sm:max-w-[200px]">
                                {item.label}
                            </span>
                        </div>
                    ) : (
                        <Link
                            href={item.href || "#"}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors group"
                        >
                            {item.icon && <item.icon className="w-3.5 h-3.5" />}
                            <span>{item.label}</span>
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
