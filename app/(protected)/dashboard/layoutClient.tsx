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
    
    
    
    const pathSegments = pathname.split("/").filter(Boolean);
    const isPlayerPage = pathSegments.length >= 4 && pathSegments[1] === "my-courses";

    if (isPlayerPage) {
        return (
            <div className="min-h-screen bg-background w-full">
                <main className="w-full min-h-screen">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            {}
            <Sidebar role={role} isCollapsed={isSidebarCollapsed} />
            {/* Main Content Area */}
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

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-72 bg-background/95 backdrop-blur-2xl border-r border-border/40 z-[60] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="h-20 px-6 flex items-center justify-between border-b border-border/10">
                                <Logo size="md" />
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-muted/20 border border-border/10 text-muted-foreground hover:text-primary transition-all cursor-pointer shadow-sm group"
                                >
                                    <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                            
                            <nav className="flex-1 px-4 space-y-6 mt-6 overflow-y-auto custom-scrollbar pb-8">
                                {groups.map((group) => (
                                    <div key={group.title} className="space-y-1.5">
                                        <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/50 mb-2">
                                            {group.title}
                                        </h3>
                                        
                                        <div className="space-y-0.5">
                                            {group.items.map((item) => {
                                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative",
                                                            isActive
                                                                ? "text-primary bg-primary/10"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                                                        )}
                                                    >
                                                        <item.icon className={cn(
                                                            "w-[18px] h-[18px] transition-all",
                                                            isActive ? "text-primary scale-110" : "text-muted-foreground/70"
                                                        )} />
                                                        <span className="font-bold tracking-tight">{item.label}</span>
                                                        
                                                        {isActive && (
                                                            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                                                        )}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </nav>
                            
                            <div className="p-4 border-t border-border/10">
                                <div className="bg-linear-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10 relative overflow-hidden shadow-sm">
                                    <h4 className="text-[13px] font-bold text-primary mb-0.5 relative z-10">Premium App</h4>
                                    <p className="text-[11px] text-muted-foreground relative z-10">Best learning experience on mobile.</p>
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}
