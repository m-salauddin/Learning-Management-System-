"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Settings,
    BarChart3,
    Shield,
    Tags,
    Ticket
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: Tags, label: "Discounts", href: "/admin/discounts" },
    { icon: Ticket, label: "Coupons", href: "/admin/coupons" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-border/50 bg-background/30 backdrop-blur-2xl z-40">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <Logo />
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase tracking-wider shadow-sm">
                        Admin
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {sidebarItems.map((item) => {
                    const isActive = item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname === item.href || pathname.startsWith(item.href + "/");
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
                                    layoutId="active-admin-sidebar"
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
                <div className="bg-linear-to-br from-red-500/5 to-transparent p-4 rounded-2xl border border-red-500/10 relative overflow-hidden group hover:border-red-500/20 transition-colors">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none group-hover:bg-red-500/20 transition-all" />
                    <h4 className="text-sm font-semibold text-red-500 mb-1 relative z-10 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin Access
                    </h4>
                    <p className="text-xs text-muted-foreground relative z-10">You have full control over the platform.</p>
                </div>
            </div>
        </aside>
    );
}
