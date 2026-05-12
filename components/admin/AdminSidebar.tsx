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
        <aside className="hidden lg:flex flex-col w-[232px] h-screen sticky top-0 border-r border-border/80 bg-background/60 backdrop-blur-2xl z-40">
            <div className="h-14 flex items-center px-4 transition-all duration-300 border-b border-border/80">
                <div className="flex items-center gap-2.5">
                    <Logo size="md" />
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black border border-primary/20 uppercase tracking-widest">
                        Admin
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-3 mt-4 scrollbar-hide overflow-y-auto pb-6">
                <h3 className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/50 mb-2">
                    Management
                </h3>
                
                <div className="space-y-0.5">
                    {sidebarItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname === item.href || pathname.startsWith(item.href + "/");
                            
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12.5px] font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "text-primary bg-primary/8 font-semibold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="admin-sidebar-active"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                    />
                                )}

                                <item.icon className={cn(
                                    "w-4 h-4 shrink-0 transition-colors duration-200",
                                    isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                                )} strokeWidth={isActive ? 2.2 : 1.8} />
                                
                                <span className="whitespace-nowrap tracking-[-0.01em]">{item.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </aside>
    );
}

