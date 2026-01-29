"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
    LayoutDashboard,
    BookOpen,
    Award,
    Settings,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: BookOpen, label: "My Courses", href: "/dashboard/courses" },
    { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border/50 bg-background/30 backdrop-blur-2xl z-40">
            <div className="p-6">
                <Logo />
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
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
                <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                    <h4 className="text-sm font-semibold text-primary mb-1 relative z-10">Upgrade Plan</h4>
                    <p className="text-xs text-muted-foreground mb-3 relative z-10">Get access to premium courses</p>
                    <button className="w-full py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 relative z-10 cursor-pointer">
                        Go Pro
                    </button>
                </div>
            </div>
        </aside>
    );
}
