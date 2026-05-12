"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    LayoutDashboard,
    BookOpen,
    Award,
    ShieldCheck,
    Users,
    DollarSign,
    FileText,
    Flag,
    Ticket,
    Tags,
    Layers,
    User,
    GraduationCap,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/dashboard";
import type { LucideIcon } from "lucide-react";

interface SidebarItem {
    icon: LucideIcon;
    label: string;
    href: string;
}

interface SidebarGroup {
    title: string;
    icon: LucideIcon;
    items: SidebarItem[];
}

const NAV_GROUPS: Record<UserRole, SidebarGroup[]> = {
    student: [
        {
            title: "General",
            icon: ShieldCheck,
            items: [
                { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
                { icon: User, label: "Profile", href: "/dashboard/profile" },
            ]
        },
        {
            title: "Learning",
            icon: GraduationCap,
            items: [
                { icon: BookOpen, label: "My Courses", href: "/dashboard/my-courses" },
                { icon: GraduationCap, label: "Enrollments", href: "/dashboard/enrollments" },
                { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
            ]
        }
    ],
    teacher: [
        {
            title: "General",
            icon: ShieldCheck,
            items: [
                { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
                { icon: User, label: "Profile", href: "/dashboard/profile" },
            ]
        },
        {
            title: "Management",
            icon: Layers,
            items: [
                { icon: BookOpen, label: "Instructor Courses", href: "/dashboard/instructor-courses" },
                { icon: GraduationCap, label: "Enrollments", href: "/dashboard/enrollments" },
                { icon: DollarSign, label: "Earnings", href: "/dashboard/earnings" },
            ]
        }
    ],
    moderator: [
        {
            title: "General",
            icon: ShieldCheck,
            items: [
                { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
                { icon: User, label: "Profile", href: "/dashboard/profile" },
            ]
        },
        {
            title: "Content",
            icon: FileText,
            items: [
                { icon: Flag, label: "Reports", href: "/dashboard/reports" },
                { icon: FileText, label: "Reviews", href: "/dashboard/reviews" },
            ]
        }
    ],
    admin: [
        {
            title: "Management",
            icon: ShieldCheck,
            items: [
                { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
                { icon: User, label: "Profile", href: "/dashboard/profile" },
                { icon: Users, label: "Users", href: "/dashboard/users" },
                { icon: GraduationCap, label: "Enrollments", href: "/dashboard/enrollments" },
            ]
        },
        {
            title: "Catalog",
            icon: BookOpen,
            items: [
                { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
                { icon: Layers, label: "Categories", href: "/dashboard/categories" },
                { icon: Tags, label: "Discounts", href: "/dashboard/discounts" },
                { icon: Ticket, label: "Coupons", href: "/dashboard/coupons" },
            ]
        },
        {
            title: "Personal",
            icon: GraduationCap,
            items: [
                { icon: BookOpen, label: "My Courses", href: "/dashboard/my-courses" },
            ]
        }
    ],
};

const SYSTEM_INFO = {
    version: "v1.2.4-stable",
    status: "Online",
    usage: 84, // 84% storage
};

interface SidebarProps {
    role: UserRole;
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export function Sidebar({ role, isCollapsed = false }: SidebarProps) {
    const pathname = usePathname();
    const groups = NAV_GROUPS[role] || NAV_GROUPS.student;

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 64 : 232 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/80 bg-background/60 backdrop-blur-2xl z-40"
        >
            <div className="h-14 flex items-center shrink-0 transition-all duration-300 px-4 border-b border-border/80">
                <Link href="/" className="shrink-0">
                    <Logo size="md" showText={!isCollapsed} />
                </Link>
            </div>

            <nav className="flex-1 space-y-5 mt-4 scrollbar-hide pb-6 overflow-x-hidden overflow-y-auto px-3">
                {groups.map((group) => (
                    <div key={group.title}>
                        {!isCollapsed && (
                            <h3 className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50 mb-2">
                                {group.title}
                            </h3>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2.5 rounded-lg text-[12.5px] font-medium group relative transition-all duration-200 px-3 py-[7px]",
                                            isActive
                                                ? "text-primary bg-primary/8 font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                            />
                                        )}

                                        <item.icon className={cn(
                                            "shrink-0 w-[16px] h-[16px] transition-colors duration-200",
                                            isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                                        )} strokeWidth={isActive ? 2.2 : 1.8} />

                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="whitespace-nowrap tracking-[-0.01em]"
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}

                                        {isCollapsed && (
                                            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-popover border border-border/60 rounded-md text-[11px] font-medium text-popover-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none translate-x-[-8px] group-hover:translate-x-0 shadow-lg">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* System Info Section */}
            <div className="shrink-0 border-t border-border/80 px-3 py-3">
                {!isCollapsed ? (
                    <div className="bg-primary/5 rounded-xl p-3 border border-primary/10 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                <span className="text-[11px] font-semibold text-foreground/80">{SYSTEM_INFO.status}</span>
                            </div>
                            <span className="text-[10px] font-medium text-muted-foreground bg-primary/10 px-1.5 py-0.5 rounded-md">
                                {SYSTEM_INFO.version}
                            </span>
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-medium">
                                <span className="text-muted-foreground">Storage Usage</span>
                                <span className="text-foreground/70">{SYSTEM_INFO.usage}%</span>
                            </div>
                            <div className="h-1 w-full bg-background/50 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${SYSTEM_INFO.usage}%` }}
                                    className="h-full bg-primary" 
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="group relative flex items-center justify-center py-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-help">
                            <div className="relative">
                                <ShieldCheck className="w-4 h-4" />
                                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary border border-background" />
                            </div>
                        </div>
                        
                        {/* Collapsed Tooltip */}
                        <div className="absolute left-full ml-3 px-3 py-2 bg-popover border border-border/60 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none translate-x-[-8px] group-hover:translate-x-0 w-48">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between border-b border-border/30 pb-1.5 mb-1.5">
                                    <span className="text-[11px] font-bold">System Status</span>
                                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{SYSTEM_INFO.status}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-muted-foreground">Version</span>
                                    <span className="font-medium">{SYSTEM_INFO.version}</span>
                                </div>
                                <div className="flex justify-between text-[10px]">
                                    <span className="text-muted-foreground">Storage</span>
                                    <span className="font-medium">{SYSTEM_INFO.usage}% full</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
