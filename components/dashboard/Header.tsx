"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
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

    // Parse breadcrumb
    const pathSegments = pathname?.split("/").filter(Boolean) || [];
    const title = pathSegments[pathSegments.length - 1];
    const formattedTitle = title === "dashboard" ? "Overview" : title.charAt(0).toUpperCase() + title.slice(1).replace(/-/g, " ");

    return (
        <header className="h-20 px-6 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMobileMenuOpen}
                    className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                    <Menu className="w-6 h-6" />
                </button>

                <h2 className="text-xl font-bold capitalize text-foreground/90 tracking-tight">
                    {formattedTitle}
                </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {isLoading ? (
                    <>
                        {/* Search Skeleton */}
                        <Skeleton className="hidden md:flex h-10 w-64 rounded-xl items-center px-4">
                            <div className="h-4 w-4 rounded-full bg-muted-foreground/20 mr-3" />
                            <div className="h-3 w-24 bg-muted-foreground/20 rounded-md" />
                        </Skeleton>

                        <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block" />

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
                        <div className="hidden md:flex items-center px-3 py-2 rounded-xl bg-muted/30 border border-white/5 focus-within:ring-2 focus-within:ring-primary/20 transition-all w-64">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-foreground placeholder:text-muted-foreground"
                            />
                        </div>

                        <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block" />

                        <ThemeToggleCompact />

                        <NotificationPanel />

                        {user && <UserDropdown user={user} />}
                    </>
                )}
            </div>
        </header>
    );
}

