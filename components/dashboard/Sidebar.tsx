"use client";
import { useState, useEffect } from "react";
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
    ChevronDown,
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
export function Sidebar({ role, isCollapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const groups = NAV_GROUPS[role] || NAV_GROUPS.student;

    
    const [expandedGroup, setExpandedGroup] = useState<string | null>(() => {
        const activeGroup = groups.find(group => 
            group.items.some(item => 
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            )
        );
        return activeGroup ? activeGroup.title : groups[0]?.title || null;
    });

    const toggleGroup = (title: string) => {
        setExpandedGroup(prev => prev === title ? null : title);
    };

    
    useEffect(() => {
        const activeGroup = groups.find(group => 
            group.items.some(item => 
                pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            )
        );
        if (activeGroup) {
            setExpandedGroup(activeGroup.title);
        }
    }, [pathname, groups]);
    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 70 : 230 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} 
            className="hidden lg:flex flex-col h-screen sticky top-0 border-r border-border/80 bg-background/30 backdrop-blur-2xl z-40 overflow-visible"
        >
            <div className={cn(
                "h-20 flex items-center shrink-0 border-b border-border/80 transition-all duration-300 px-6",
                isCollapsed ? "justify-center" : "justify-start"
            )}>
                <Link href="/" className="shrink-0">
                    <Logo size="md" showText={!isCollapsed} />
                </Link>
            </div>
            <nav className={cn(
                "flex-1 space-y-0.5 mt-2 custom-scrollbar pb-4 overflow-x-hidden overflow-y-auto", 
                isCollapsed ? "px-2" : "px-3"
            )}>
                {groups.map((group, groupIndex) => {
                    const isExpanded = expandedGroup === group.title;
                    const hasActiveItem = group.items.some(item => 
                        pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                    );

                    return (
                        <div key={group.title} className="space-y-0.5">
                            {!isCollapsed ? (
                                <button
                                    onClick={() => toggleGroup(group.title)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-all duration-200 group/header mt-0.5",
                                        isExpanded || hasActiveItem ? "text-foreground" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/10"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
                                            hasActiveItem || isExpanded
                                                ? "bg-primary/15 border-primary/30 text-primary shadow-[0_0_20px_rgba(var(--primary),0.15)]" 
                                                : "bg-muted/20 border-border/60 group-hover/header:border-border text-muted-foreground/80 group-hover/header:text-foreground"
                                        )}>
                                            <group.icon className="w-4 h-4" />
                                        </div>
                                        <span className={cn(
                                            "text-[14.5px] font-bold tracking-tight transition-colors",
                                            hasActiveItem || isExpanded ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {group.title}
                                        </span>
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-3.5 h-3.5 transition-transform duration-300 text-muted-foreground/60 group-hover/header:text-foreground",
                                        isExpanded && "rotate-180"
                                    )} />
                                </button>
                            ) : (
                                <div className="flex justify-center py-3 mt-1">
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300",
                                        hasActiveItem 
                                            ? "bg-primary/10 border-primary/20 text-primary shadow-lg" 
                                            : "bg-muted/10 border-border/50 text-muted-foreground"
                                    )}>
                                        <group.icon className="w-4 h-4" />
                                    </div>
                                </div>
                            )}

                            <AnimatePresence initial={false}>
                                {(isExpanded || isCollapsed) && (
                                    <motion.div
                                        initial={isCollapsed ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                                        className="overflow-hidden relative"
                                    >
                                        {!isCollapsed && (
                                            <div className="absolute left-[30px] -top-1 bottom-3 w-[1.5px] bg-border/80" />
                                        )}
                                        
                                        <div className={cn(
                                            "space-y-0.5 mt-0",
                                            !isCollapsed && "pl-10"
                                        )}>
                                            {group.items.map((item) => {
                                                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center rounded-lg text-[14px] font-medium group relative transition-all duration-200",
                                                            isCollapsed ? "p-2 justify-center" : "px-3 py-1.5",
                                                            isActive
                                                                ? "text-primary font-bold"
                                                                : "text-muted-foreground/80 hover:text-foreground hover:bg-muted/20"
                                                        )}
                                                        title={isCollapsed ? item.label : ""}
                                                    >
                                                        {isActive && !isCollapsed && (
                                                            <div className="absolute -left-[12.25px] w-[6px] h-[6px] rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.9)] z-20" />
                                                        )}
                                                        
                                                        {isCollapsed ? (
                                                            <item.icon className={cn(
                                                                "w-[15px] h-[15px] transition-colors",
                                                                isActive ? "text-primary" : "text-muted-foreground"
                                                            )} />
                                                        ) : (
                                                            <span className="whitespace-nowrap tracking-tight">
                                                                {item.label}
                                                            </span>
                                                        )}

                                                        {isCollapsed && (
                                                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none translate-x-[-10px] group-hover:translate-x-0 shadow-2xl shadow-black/50">
                                                                {item.label}
                                                            </div>
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>
            <div className="p-2 border-t border-border/80 shrink-0 overflow-hidden">
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
                                <div className="bg-linear-to-br from-emerald-500/10 to-transparent p-3 rounded-2xl border border-emerald-500/10 relative overflow-hidden group/card shadow-inner">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                                    <div className="flex items-center gap-2 mb-1 whitespace-nowrap">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 relative z-10" strokeWidth={2} />
                                        <h4 className="text-[13px] font-bold text-emerald-500 relative z-10">System Normal</h4>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground mb-2 relative z-10 whitespace-nowrap">All services operational</p>
                                    <button className="w-full py-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors border border-emerald-500/20 relative z-10 cursor-pointer">
                                        View Logs
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-linear-to-br from-primary/10 to-transparent p-3 rounded-2xl border border-primary/10 relative overflow-hidden group/card shadow-inner">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
                                    <h4 className="text-[13px] font-bold text-primary mb-0.5 relative z-10 whitespace-nowrap">Upgrade Plan</h4>
                                    <p className="text-[11px] text-muted-foreground mb-2.5 relative z-10 whitespace-nowrap">Get access to premium courses</p>
                                    <button className="w-full py-1.5 text-[11px] font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 relative z-10 cursor-pointer">
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
