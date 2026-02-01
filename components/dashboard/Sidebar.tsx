"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
    LayoutDashboard,
    BookOpen,
    Award,
    Settings,
    ShieldCheck,
    Users,
    DollarSign,
    FileText,
    Flag,
    Ticket,
    Tags,
    BarChart3,
    User,
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

const NAV_ITEMS: Record<UserRole, SidebarItem[]> = {
    student: [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: BookOpen, label: "My Courses", href: "/dashboard/my-courses" },
        { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
    ],
    teacher: [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: BookOpen, label: "Instructor Courses", href: "/dashboard/instructor-courses" },
        { icon: DollarSign, label: "Earnings", href: "/dashboard/earnings" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
    ],
    moderator: [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: Flag, label: "Reports", href: "/dashboard/reports" },
        { icon: FileText, label: "Reviews", href: "/dashboard/reviews" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
    ],
    admin: [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: Users, label: "User Management", href: "/dashboard/users" },
        { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
        { icon: Tags, label: "Discounts", href: "/dashboard/discounts" },
        { icon: Ticket, label: "Coupons", href: "/dashboard/coupons" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
    ],
};

interface SidebarProps {
    role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
    const pathname = usePathname();

    const navItems = NAV_ITEMS[role] || NAV_ITEMS.student;

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border/50 bg-background/30 backdrop-blur-2xl z-40">
            <div className="p-6">
                <Link href="/">
                    <Logo />
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-sidebar-pill"
                                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className={cn("w-5 h-5 relative z-10", isActive && "text-primary")} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-border/50">
                {role === 'admin' ? (
                    <div className="bg-linear-to-br from-emerald-500/10 to-transparent p-4 rounded-2xl border border-emerald-500/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative z-10" />
                            <h4 className="text-sm font-semibold text-emerald-500 relative z-10">System Normal</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3 relative z-10">All services operational</p>
                        <button className="w-full py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 relative z-10 cursor-pointer">
                            View Logs
                        </button>
                    </div>
                ) : (
                    <div className="bg-linear-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                        <h4 className="text-sm font-semibold text-primary mb-1 relative z-10">Upgrade Plan</h4>
                        <p className="text-xs text-muted-foreground mb-3 relative z-10">Get access to premium courses</p>
                        <button className="w-full py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 relative z-10 cursor-pointer">
                            Go Pro
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}
