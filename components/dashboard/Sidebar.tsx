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
            title: "System",
            icon: ShieldCheck,
            items: [
                { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
                { icon: User, label: "Profile", href: "/dashboard/profile" },
            ]
        },
        {
            title: "People",
            icon: Users,
            items: [
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
            ]
        },
        {
            title: "Growth",
            icon: Tags,
            items: [
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
            animate={{ width: isCollapsed ? 76 : 240 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/40 bg-background/50 backdrop-blur-3xl z-40"
        >
            <div className={cn(
                "h-20 flex items-center shrink-0 transition-all duration-300 px-6",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <Link href="/" className="shrink-0">
                    <Logo size="md" showText={!isCollapsed} />
                </Link>
            </div>

            <nav className={cn(
                "flex-1 space-y-6 mt-4 custom-scrollbar pb-8 overflow-x-hidden overflow-y-auto px-4",
                isCollapsed && "px-2"
            )}>
                {groups.map((group) => (
                    <div key={group.title} className="space-y-1.5">
                        {!isCollapsed && (
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 mb-2">
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
                                            "flex items-center gap-3 rounded-xl text-[13px] font-medium group relative transition-all duration-200",
                                            isCollapsed ? "p-2.5 justify-center" : "px-3 py-2",
                                            isActive
                                                ? "text-primary bg-primary/10 shadow-[inset_0_1px_1px_rgba(var(--primary),0.1)]"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "shrink-0 transition-all duration-300",
                                            isCollapsed ? "w-5 h-5" : "w-[18px] h-[18px]",
                                            isActive ? "text-primary scale-110" : "text-muted-foreground/70 group-hover:text-foreground"
                                        )} />

                                        {!isCollapsed && (
                                            <span className="whitespace-nowrap tracking-tight">
                                                {item.label}
                                            </span>
                                        )}

                                        {isActive && !isCollapsed && (
                                            <motion.div
                                                layoutId="active-indicator"
                                                className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        {isCollapsed && (
                                            <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover border border-border rounded-lg text-xs font-medium text-popover-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 shadow-xl">
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

            <div className="p-4 border-t border-border/40 shrink-0">
                <AnimatePresence mode="wait">
                    {!isCollapsed ? (
                        <motion.div
                            key="full-footer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-linear-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10 relative overflow-hidden group/card shadow-sm"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none" />
                            <h4 className="text-[13px] font-bold text-primary mb-0.5 relative z-10">
                                {role === 'admin' ? 'System Monitor' : 'Premium Access'}
                            </h4>
                            <p className="text-[11px] text-muted-foreground mb-3 relative z-10">
                                {role === 'admin' ? 'All services operational' : 'Unlock advanced features'}
                            </p>
                            <button className={cn(
                                "w-full py-2 text-[11px] font-bold rounded-lg transition-all cursor-pointer relative z-10",
                                role === 'admin'
                                    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
                            )}>
                                {role === 'admin' ? 'View Logs' : 'Upgrade Now'}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed-footer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex justify-center"
                        >
                            <div className={cn(
                                "w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300",
                                role === 'admin'
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 shadow-sm"
                                    : "bg-primary/10 border-primary/20 text-primary shadow-sm"
                            )}>
                                {role === 'admin' ? <ShieldCheck className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.aside>
    );
}

