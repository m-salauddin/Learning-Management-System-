"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { motion, AnimatePresence } from "motion/react";
import { X, LayoutDashboard, Users, BookOpen, Settings, BarChart3 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { user, isLoading } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.replace("/login");
            } else if (user.role !== "admin") {
                router.replace("/dashboard");
            }
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== "admin") {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Verifying admin privileges...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border/50 z-50 lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Logo />
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold border border-red-500/20 uppercase">Admin</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 space-y-2 mt-4">
                                {sidebarItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                                                isActive
                                                    ? "text-primary bg-primary/10"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                                            <span>{item.label}</span>
                                        </Link>
                                    )
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
