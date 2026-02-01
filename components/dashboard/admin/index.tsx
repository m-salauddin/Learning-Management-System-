"use client";

import { motion } from "motion/react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// =============================================================================
// ADMIN STATS CARD
// =============================================================================

export interface AdminStatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: number;
    color?: 'primary' | 'emerald' | 'violet' | 'rose' | 'amber' | 'sky' | 'blue';
    delay?: number;
    prefix?: string;
    suffix?: string;
}

const colorStyles = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-emerald-500/10 text-emerald-600",
    violet: "bg-violet-500/10 text-violet-600",
    rose: "bg-rose-500/10 text-rose-600",
    amber: "bg-amber-500/10 text-amber-600",
    sky: "bg-sky-500/10 text-sky-600",
    blue: "bg-blue-500/10 text-blue-600",
};

export function AdminStatsCard({
    label,
    value,
    icon: Icon,
    trend,
    color = 'primary',
    delay = 0,
    prefix = '',
    suffix = ''
}: AdminStatsCardProps) {
    const hasTrend = trend !== undefined;
    const isPositive = trend !== undefined && trend >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="relative p-6 rounded-3xl bg-card/30 backdrop-blur-xl border border-border/40 hover:border-border/60 shadow-lg shadow-black/5 overflow-hidden group transition-all duration-300"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                        <h3 className="text-3xl font-bold tracking-tight">
                            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
                        </h3>
                    </div>
                    <div className={cn(
                        "p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110",
                        colorStyles[color]
                    )}>
                        <Icon className="w-6 h-6" />
                    </div>
                </div>

                {hasTrend && (
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs font-medium",
                        isPositive ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        <span>{isPositive ? '+' : ''}{trend}% from last month</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// =============================================================================
// ADMIN PAGE HEADER
// =============================================================================

export interface AdminPageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold tracking-tight"
                >
                    {title}
                </motion.h1>
                {description && (
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        {description}
                    </motion.p>
                )}
            </div>
            {actions && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                >
                    {actions}
                </motion.div>
            )}
        </div>
    );
}

// =============================================================================
// ADMIN TABLE CONTAINER
// =============================================================================

export interface AdminTableContainerProps {
    children: ReactNode;
    toolbar?: ReactNode;
    footer?: ReactNode;
    className?: string;
}

export function AdminTableContainer({ children, toolbar, footer, className }: AdminTableContainerProps) {
    return (
        <div className={cn(
            "rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl shadow-black/5",
            className
        )}>
            {toolbar && (
                <div className="p-4 md:p-6 border-b border-border/40 bg-muted/20">
                    {toolbar}
                </div>
            )}
            <div className="overflow-visible">
                {children}
            </div>
            {footer && (
                <div className="p-6 border-t border-border/40 bg-muted/10">
                    {footer}
                </div>
            )}
        </div>
    );
}

// =============================================================================
// STATUS BADGE
// =============================================================================

export type StatusType = 'published' | 'draft' | 'archived' | 'active' | 'inactive' | 'suspended' | 'pending';

const statusStyles: Record<StatusType, { bg: string; dot: string }> = {
    published: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500' },
    active: { bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', dot: 'bg-emerald-500' },
    draft: { bg: 'bg-muted text-muted-foreground border-border/50', dot: 'bg-muted-foreground' },
    pending: { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500' },
    archived: { bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20', dot: 'bg-amber-500' },
    inactive: { bg: 'bg-muted text-muted-foreground border-border/50', dot: 'bg-muted-foreground' },
    suspended: { bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20', dot: 'bg-rose-500' },
};

export interface StatusBadgeProps {
    status: StatusType | string;
    showDot?: boolean;
}

export function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase() as StatusType;
    const style = statusStyles[normalizedStatus] || statusStyles.draft;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border",
            style.bg
        )}>
            {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />}
            {status}
        </span>
    );
}

// =============================================================================
// LEVEL BADGE
// =============================================================================

import { Sparkles, Zap, Flame } from "lucide-react";

export type LevelType = 'beginner' | 'intermediate' | 'advanced';

const levelConfig: Record<LevelType, { style: string; icon: ReactNode; label: string }> = {
    beginner: {
        style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: <Sparkles className="w-3 h-3" />,
        label: 'Beginner'
    },
    intermediate: {
        style: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
        icon: <Zap className="w-3 h-3" />,
        label: 'Intermediate'
    },
    advanced: {
        style: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        icon: <Flame className="w-3 h-3" />,
        label: 'Advanced'
    }
};

export interface LevelBadgeProps {
    level: LevelType | string;
}

export function LevelBadge({ level }: LevelBadgeProps) {
    const normalizedLevel = (level?.toLowerCase() || 'beginner') as LevelType;
    const config = levelConfig[normalizedLevel] || levelConfig.beginner;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
            config.style
        )}>
            {config.icon}
            {config.label}
        </span>
    );
}

// =============================================================================
// ROLE BADGE
// =============================================================================

export type RoleType = 'admin' | 'teacher' | 'moderator' | 'student';

const roleStyles: Record<RoleType, string> = {
    admin: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    teacher: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
    moderator: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    student: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export interface RoleBadgeProps {
    role: RoleType | string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
    const normalizedRole = (role?.toLowerCase() || 'student') as RoleType;
    const style = roleStyles[normalizedRole] || roleStyles.student;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border",
            style
        )}>
            {role}
        </span>
    );
}

// =============================================================================
// TABLE EMPTY STATE
// =============================================================================

export interface TableEmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
}

export function TableEmptyState({ icon: Icon, title, description, action }: TableEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            {Icon && (
                <div className="p-4 rounded-2xl bg-muted/50 mb-4">
                    <Icon className="w-8 h-8 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
            )}
            {action}
        </div>
    );
}

// =============================================================================
// TABLE LOADING STATE
// =============================================================================

export interface TableLoadingStateProps {
    rows?: number;
    columns?: number;
}

export function TableLoadingState({ rows = 5, columns = 6 }: TableLoadingStateProps) {
    return (
        <div className="animate-pulse">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex items-center px-6 py-4 border-b border-border/20">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className={cn(
                                "h-4 bg-muted/50 rounded",
                                colIndex === 0 ? "w-8 mr-6" : "flex-1 mx-2",
                                colIndex === 1 && "w-48"
                            )}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// =============================================================================
// SEARCH INPUT
// =============================================================================

import { Search } from "lucide-react";

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all text-sm placeholder:text-muted-foreground"
            />
        </div>
    );
}

// =============================================================================
// ACTION BUTTON
// =============================================================================

export interface ActionButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    icon?: ReactNode;
    className?: string;
    disabled?: boolean;
}

const buttonVariants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25",
    secondary: "bg-background border border-border/50 hover:bg-muted/50 text-foreground",
    ghost: "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/25",
};

export function ActionButton({
    children,
    onClick,
    variant = 'secondary',
    icon,
    className,
    disabled
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200",
                buttonVariants[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {icon}
            {children}
        </button>
    );
}
