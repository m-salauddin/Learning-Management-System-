import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
export interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: LucideIcon;
    active?: boolean;
}
interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
    showHomeIcon?: boolean;
    rootLabel?: string;
    rootHref?: string;
    rootIcon?: LucideIcon;
}
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    items,
    className,
    showHomeIcon = true,
    rootLabel,
    rootHref = "/dashboard",
    rootIcon: RootIcon = Home
}) => {
    return (
        <nav className={cn("hidden md:flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs lg:text-sm font-medium overflow-hidden whitespace-nowrap pb-1", className)}>
            {(showHomeIcon || rootLabel) && (
                <div className="flex items-center shrink-0">
                    {items.length === 0 ? (
                        <span className="flex items-center gap-2 md:gap-2.5 font-bold text-primary transition-colors">
                            {showHomeIcon && <RootIcon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0 text-primary" />}
                            {rootLabel && <span className="hidden md:inline-block shrink-0">{rootLabel}</span>}
                        </span>
                    ) : (
                        <Link
                            href={rootHref}
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 md:gap-2.5 group"
                        >
                            {showHomeIcon && <RootIcon className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-all shrink-0" />}
                            {rootLabel && <span className="hidden md:inline-block shrink-0">{rootLabel}</span>}
                        </Link>
                    )}
                    {items.length > 0 && (
                        <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground/50 mx-0.5 md:mx-1 shrink-0" />
                    )}
                </div>
            )}
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.active || isLast;
                return (
                    <React.Fragment key={index}>
                        <div className={cn("flex items-center", isLast ? "min-w-0" : "shrink-0")}>
                            {item.href && !isActive ? (
                                <Link
                                    href={item.href}
                                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2 md:gap-2.5 group overflow-hidden"
                                >
                                    {item.icon && <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-all shrink-0" />}
                                    <span className="truncate hidden md:inline-block text-muted-foreground" title={item.label}>{item.label}</span>
                                </Link>
                            ) : (
                                <span className={cn(
                                    "flex items-center gap-2 md:gap-2.5 overflow-hidden",
                                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                                )}>
                                    {item.icon && <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />}
                                    <span
                                        className="truncate hidden md:inline-block"
                                        title={item.label}
                                    >
                                        {item.label}
                                    </span>
                                </span>
                            )}
                            {!isLast && (
                                <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-muted-foreground/50 mx-0.5 md:mx-1 shrink-0" />
                            )}
                        </div>
                    </React.Fragment>
                );
            })}
        </nav>
    );
};
export default Breadcrumbs;
