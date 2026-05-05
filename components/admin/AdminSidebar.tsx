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
        <aside className="hidden lg:flex flex-col w-[260px] h-screen sticky top-0 border-r border-border/40 bg-background/50 backdrop-blur-3xl z-40">
            <div className="h-20 flex items-center px-6 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <Logo size="md" />
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black border border-primary/20 uppercase tracking-widest shadow-sm">
                        Admin
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 mt-4 custom-scrollbar overflow-y-auto">
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 mb-3">
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
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                                    isActive
                                        ? "text-primary bg-primary/10 shadow-[inset_0_1px_1px_rgba(var(--primary),0.1)]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-[18px] h-[18px] shrink-0 transition-all duration-300",
                                    isActive ? "text-primary scale-110" : "text-muted-foreground/70 group-hover:text-foreground"
                                )} />
                                
                                <span className="relative z-10 whitespace-nowrap tracking-tight">{item.label}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator-admin"
                                        className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-border/40">
                <div className="bg-linear-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10 relative overflow-hidden group hover:border-primary/20 transition-all shadow-sm">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-2xl rounded-full -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/20 transition-all" />
                    <h4 className="text-[13px] font-bold text-primary mb-0.5 relative z-10 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        Admin Mode
                    </h4>
                    <p className="text-[11px] text-muted-foreground relative z-10">System-wide control enabled.</p>
                </div>
            </div>
        </aside>
    );
}

