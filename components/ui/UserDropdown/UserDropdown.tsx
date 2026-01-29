"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    User,
    Settings,
    LogOut,
    ChevronDown,
    LayoutDashboard,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { signOut } from "@/app/auth/actions";
import { AuthUser, logout } from "@/lib/store/features/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { Modal } from "@/components/ui/Modal";

interface UserDropdownProps {
    user: AuthUser;
    onOpen?: () => void;
}

export function UserDropdown({ user, onOpen }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const toast = useToast();


    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOutClick = () => {
        setIsOpen(false);
        setShowLogoutConfirm(true);
    };

    const confirmLogout = async () => {
        setShowLogoutConfirm(false);
        const loadingToastId = toast.loading("Logging out...", "Please wait while we sign you out.");

        const result = await signOut();

        if (result?.error) {
            toast.dismiss(loadingToastId);
            toast.error("Logout Failed", result.error);
            return;
        }

        toast.dismiss(loadingToastId);
        toast.success("Logged Out", "You have been logged out successfully.");

        dispatch(logout());


        const protectedRoutes = ['/dashboard', '/profile', '/settings'];
        const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));

        if (isProtectedRoute) {
            router.push('/login');
        } else {
            router.refresh();
        }
    };


    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const displayName = user.fullName || user.email?.split("@")[0] || "User";
    const userRole = user.role;

    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setImageError(false);
        setImageLoaded(false);
    }, [user.avatarUrl]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    if (!isOpen && onOpen) {
                        onOpen();
                    }
                    setIsOpen(!isOpen);
                }}
                className="flex cursor-pointer items-center gap-2 sm:gap-3 pl-1 pr-1 sm:pl-1 sm:pr-4 py-1 rounded-full border border-border/50 bg-muted/50 hover:bg-muted/80 transition-all duration-200 group"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/20 transition-all overflow-hidden relative">
                    {user.avatarUrl && !imageError ? (
                        <>
                            {!imageLoaded && (
                                <div className="absolute inset-0 bg-muted animate-pulse" />
                            )}
                            <img
                                src={user.avatarUrl}
                                alt={displayName}
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => {
                                    setImageLoaded(true);
                                    setImageError(true);
                                }}
                            />
                        </>
                    ) : (
                        getInitials(displayName)
                    )}
                </div>
                <div className="flex-col items-start text-xs hidden min-[775px]:flex">
                    <span className="font-semibold max-w-[100px] truncate">{displayName}</span>
                    <span className="text-muted-foreground capitalize">{userRole}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-200 hidden sm:block ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-full right-0 lg:mt-6.5 mt-5 w-64 bg-white dark:bg-slate-950 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
                    >

                        <div className="px-4 py-3 mb-2 bg-muted/30 rounded-xl">
                            <p className="font-semibold text-sm truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>


                        <div className="flex flex-col gap-1">
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <Link
                                href="/dashboard/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors cursor-pointer"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>
                        </div>

                        <div className="h-px bg-border/50 my-2" />


                        <button
                            onClick={handleSignOutClick}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>


            <Modal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={confirmLogout}
                title="Sign out?"
                description="Are you sure you want to sign out of your account?"
                confirmText="Sign Out"
                variant="danger"
                icon={LogOut}
            />
        </div>
    );
}
