"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    Bell, Menu, Search, Layers, BookOpen, Users, Settings,
    FileText, Flag, Ticket, Tags, BarChart3, Award, DollarSign,
    GraduationCap, Plus, Edit, Hash, UserPlus, FilePlus, PlusCircle, LayoutDashboard, AlignLeft,
    PanelLeftClose
} from "lucide-react";
import { motion } from "motion/react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { UserDropdown } from "@/components/ui/UserDropdown/UserDropdown";
import { useAppSelector } from "@/lib/store/hooks";
import { ThemeToggleCompact } from "@/components/ui/theme-toggle";
import { NotificationPanel } from "./NotificationPanel";
import { Skeleton } from "@/components/ui/skeleton";
const AuthSkeleton = () => (
    <Skeleton className="flex items-center gap-2 sm:gap-3 pl-1 pr-2 sm:pl-1 sm:pr-4 py-1.5 rounded-full">
        <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
        <div className="hidden md:flex flex-col gap-1">
            <div className="h-3 w-20 bg-muted-foreground/20 rounded-md" />
            <div className="h-2 w-12 bg-muted-foreground/20 rounded-md" />
        </div>
        <div className="w-4 h-4 rounded-full bg-muted-foreground/20 hidden sm:block" />
    </Skeleton>
);
interface HeaderProps {
    onMobileMenuOpen: () => void;
    isSidebarCollapsed: boolean;
    onSidebarToggle: () => void;
}
export function Header({ onMobileMenuOpen, isSidebarCollapsed, onSidebarToggle }: HeaderProps) {
    const pathname = usePathname();
    const { user, isLoading: authLoading } = useAppSelector((state) => state.auth);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const isLoading = !mounted || authLoading;
    const pathSegments = pathname?.split("/").filter(p => p !== "" && p !== "dashboard") || [];
    const breadcrumbItems = pathSegments.map((segment, index) => {
        const href = `/dashboard/${pathSegments.slice(0, index + 1).join("/")}`;
        const IconMap: Record<string, any> = {
            "courses": Layers,
            "my-courses": BookOpen,
            "instructor-courses": GraduationCap,
            "users": Users,
            "settings": Settings,
            "earnings": DollarSign,
            "reports": Flag,
            "reviews": FileText,
            "discounts": Tags,
            "coupons": Ticket,
            "analytics": BarChart3,
            "certificates": Award,
            "edit": Edit
        };
        let icon = IconMap[segment] || Hash;
        let label = segment.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
        if (segment === "new" && index > 0) {
            const parent = pathSegments[index - 1];
            const parentSingular = parent.endsWith('s') ? parent.slice(0, -1) : parent;
            const entityName = parentSingular.charAt(0).toUpperCase() + parentSingular.slice(1);
            label = `Create ${entityName}`;
            if (parent === "users") icon = UserPlus;
            else if (parent === "courses") icon = FilePlus;
            else icon = PlusCircle;
        }
        const isLast = index === pathSegments.length - 1;
        return {
            label,
            href: isLast ? undefined : href,
            icon,
            active: isLast
        };
    });
    return (
        <header className="h-14 px-4 flex items-center justify-between border-b border-border/80 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMobileMenuOpen}
                    className="lg:hidden w-8 h-8 flex items-center justify-center -ml-1 text-muted-foreground hover:text-primary rounded-lg bg-muted/40 border border-white/5 hover:bg-muted/60 transition-all cursor-pointer group"
                >
                    <AlignLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onSidebarToggle}
                    className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg bg-muted/40 border border-white/5 text-muted-foreground hover:text-primary transition-all cursor-pointer group hover:bg-muted/60"
                >
                    <motion.div
                        animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <PanelLeftClose className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </motion.div>
                </motion.button>
                <div className="bg-muted/30 backdrop-blur-md border border-white/5 px-2.5 py-0.5 rounded-md flex items-center">
                    <Breadcrumbs
                        items={breadcrumbItems}
                        showHomeIcon={true}
                        rootLabel="Dashboard"
                        rootHref="/dashboard"
                        className="text-sm font-medium"
                        rootIcon={LayoutDashboard}
                    />
                </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2.5">
                {isLoading ? (
                    <>
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <AuthSkeleton />
                    </>
                ) : (
                    <>
                        {}

                        <ThemeToggleCompact />
                        <NotificationPanel />
                        {user && <UserDropdown user={user} />}
                    </>
                )}
            </div>
        </header>
    );
}
