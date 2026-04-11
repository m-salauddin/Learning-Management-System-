"use client";
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { motion, AnimatePresence } from "motion/react";
import { X, LayoutDashboard, BookOpen, Award, Settings, ShieldCheck, Users, DollarSign, FileText, Flag, Ticket, Tags, BarChart3, GraduationCap, Layers, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
interface DashboardLayoutClientProps {
    children: React.ReactNode;
    role: UserRole;
}
import { useAppSelector } from "@/lib/store/hooks";
export function DashboardLayoutClient({ children, role: serverRole }: DashboardLayoutClientProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    const { user } = useAppSelector((state) => state.auth);
    const role = user?.role || serverRole;
    const groups = NAV_GROUPS[role] || NAV_GROUPS.student;
    return (
        <div className="flex min-h-screen bg-background">
            {}
            <Sidebar role={role} isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            {}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
                    isSidebarCollapsed={isSidebarCollapsed}
                    onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto dashboard-scrollbar">
                    {children}
                </main>
            </div>
            {}
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
                            className="fixed inset-y-0 left-0 w-60 bg-background border-r border-border/80 z-50 lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
                                <Logo size="md" />
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/40 border border-white/5 text-muted-foreground hover:text-primary transition-all cursor-pointer shadow-sm group"
                                >
                                    <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto custom-scrollbar">
                                {groups.map((group, groupIndex) => (
                                    <div key={group.title} className="space-y-1">
                                        <div className={cn(
                                            "space-y-1 mt-2 mb-1",
                                            groupIndex === 0 && "mt-0"
                                        )}>
                                            {groupIndex > 0 && (
                                                <div className="h-px bg-white/8 mx-2 mb-2" />
                                            )}
                                            <div className="flex items-center gap-2 px-4">
                                                <group.icon className="w-2.5 h-2.5 text-muted-foreground opacity-30" strokeWidth={2} />
                                                <span className="text-[9px] font-black uppercase text-muted-foreground/40 block">
                                                    {group.title}
                                                </span>
                                            </div>
                                        </div>
                                        {group.items.map((item) => {
                                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={cn(
                                                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                                                        isActive
                                                            ? "text-primary bg-primary/10"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    <item.icon className={cn("w-[18px] h-[18px]", isActive && "text-primary")} />
                                                    <span className="font-bold tracking-tight">{item.label}</span>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-border/80">
                                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <h4 className="text-sm font-semibold text-primary mb-1">Mobile Access</h4>
                                    <p className="text-xs text-muted-foreground">Download our app for better experience.</p>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
