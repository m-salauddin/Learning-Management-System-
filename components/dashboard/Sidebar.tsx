"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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
    Layers,
    BarChart3,
    User,
    PanelLeftClose,
    PanelLeftOpen,
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
        { icon: Users, label: "Users", href: "/dashboard/users" },
        { icon: BookOpen, label: "Courses", href: "/dashboard/courses" },
        { icon: GraduationCap, label: "Enrollments", href: "/dashboard/enrollments" },
        { icon: Layers, label: "Categories", href: "/dashboard/categories" },
        { icon: Tags, label: "Discounts", href: "/dashboard/discounts" },
        { icon: Ticket, label: "Coupons", href: "/dashboard/coupons" },
        { icon: User, label: "Profile", href: "/dashboard/profile" },
    ],
};
interface SidebarProps {
    role: UserRole;
    isCollapsed?: boolean;
    onToggle?: () => void;
}
export function Sidebar({ role, isCollapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const navItems = NAV_ITEMS[role] || NAV_ITEMS.student;
    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, restDelta: 0.5 }}
            className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/50 bg-background/30 backdrop-blur-2xl z-40 overflow-visible"
        >
            <div className={cn(
                "h-20 flex items-center shrink-0 border-b border-border/50 transition-all duration-300 px-6",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <Link href="/" className="shrink-0">
                    <Logo size="sm" showText={!isCollapsed} />
                </Link>
            </div>
            <nav className={cn(
                "flex-1 space-y-2 mt-4 px-4 custom-scrollbar",
                isCollapsed ? "px-3 overflow-visible" : "px-4 overflow-x-hidden overflow-y-auto"
            )}>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center rounded-xl text-sm font-medium group relative",
                                isCollapsed ? "p-3" : "px-4 py-3",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                            title={isCollapsed ? item.label : ""}
                        >
                            {}
                            {isActive && (
                                <motion.div
                                    layoutId="active-sidebar-pill-idk-remove-me"
                                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <motion.div
                                layout
                                className={cn(
                                    "relative z-10 flex items-center",
                                    isCollapsed ? "justify-center w-full" : "gap-3"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 shrink-0 transition-colors duration-200",
                                    isActive && "text-primary"
                                )} />
                                <AnimatePresence mode="wait">
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10, width: 0 }}
                                            animate={{ opacity: 1, x: 0, width: "auto" }}
                                            exit={{ opacity: 0, x: -10, width: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="whitespace-nowrap overflow-hidden"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            {isCollapsed && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 border border-white/10 rounded-md text-[10px] text-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-4 border-t border-border/50 shrink-0 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                    {!isCollapsed ? (
                        <motion.div
                            key="full-footer"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full overflow-hidden"
                        >
                            {role === 'admin' ? (
                                <div className="bg-linear-to-br from-emerald-500/10 to-transparent p-4 rounded-2xl border border-emerald-500/10 relative overflow-hidden group/card shadow-inner">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                                    <div className="flex items-center gap-2 mb-2 whitespace-nowrap">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative z-10" />
                                        <h4 className="text-sm font-bold text-emerald-500 relative z-10">System Normal</h4>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3 relative z-10 whitespace-nowrap">All services operational</p>
                                    <button className="w-full py-2 text-xs font-semibold bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 relative z-10 cursor-pointer">
                                        View Logs
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-linear-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10 relative overflow-hidden group/card shadow-inner">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                                    <h4 className="text-sm font-bold text-primary mb-1 relative z-10 whitespace-nowrap">Upgrade Plan</h4>
                                    <p className="text-xs text-muted-foreground mb-3 relative z-10 whitespace-nowrap">Get access to premium courses</p>
                                    <button className="w-full py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 relative z-10 cursor-pointer">
                                        Go Pro
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="collapsed-footer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="flex justify-center w-full py-2"
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center border transition-colors",
                                role === 'admin'
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    : "bg-primary/10 border-primary/20 text-primary"
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
