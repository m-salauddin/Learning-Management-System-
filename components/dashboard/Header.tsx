"use client";

import { usePathname } from "next/navigation";
import {
    Bell, Menu, Search, Layers, BookOpen, Users, Settings,
    FileText, Flag, Ticket, Tags, BarChart3, Award, DollarSign,
    GraduationCap, Plus, Edit, Hash, UserPlus, FilePlus, PlusCircle, LayoutDashboard, AlignLeft
} from "lucide-react";
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

export function Header({ onMobileMenuOpen }: { onMobileMenuOpen: () => void }) {
    const pathname = usePathname();
    const { user, isLoading } = useAppSelector((state) => state.auth);

    // Generate breadcrumbs from path
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

        // Handle 'new' segments specifically
        if (segment === "new" && index > 0) {
            const parent = pathSegments[index - 1];
            // Simple singularization: remove trailing 's' if present
            const parentSingular = parent.endsWith('s') ? parent.slice(0, -1) : parent;
            const entityName = parentSingular.charAt(0).toUpperCase() + parentSingular.slice(1);

            label = `Create ${entityName}`;

            // Context-aware icons for creation
            if (parent === "users") icon = UserPlus;
            else if (parent === "courses") icon = FilePlus;
            else icon = PlusCircle;
        }

        // Disable link for current page
        const isLast = index === pathSegments.length - 1;

        return {
            label,
            href: isLast ? undefined : href,
            icon,
            active: isLast
        };
    });

    return (
        <header className="h-20 px-6 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuOpen}
                    className="lg:hidden w-10 h-10 flex items-center justify-center -ml-2 text-muted-foreground hover:text-primary rounded-xl bg-muted/40 border border-white/5 hover:bg-muted/60 transition-all cursor-pointer shadow-sm group"
                >
                    <AlignLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                <Breadcrumbs
                    items={breadcrumbItems}
                    showHomeIcon={true}
                    rootLabel="Dashboard"
                    rootHref="/dashboard"
                    className="text-lg font-semibold"
                    rootIcon={LayoutDashboard}
                />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {isLoading ? (
                    <>
                        {/* Theme Toggle Skeleton */}
                        <Skeleton className="w-10 h-10 rounded-xl flex items-center justify-center">
                            <div className="w-5 h-5 rounded-md bg-muted-foreground/20" />
                        </Skeleton>

                        {/* Notification Skeleton */}
                        <Skeleton className="w-10 h-10 rounded-xl flex items-center justify-center">
                            <div className="w-5 h-5 rounded-md bg-muted-foreground/20" />
                        </Skeleton>

                        <AuthSkeleton />
                    </>
                ) : (
                    <>
                        <ThemeToggleCompact />
                        <NotificationPanel />
                        {user && <UserDropdown user={user} />}
                    </>
                )}
            </div>
        </header>
    );
}
