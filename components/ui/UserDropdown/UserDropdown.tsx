"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
    User,
    Settings,
    LogOut,
    ChevronDown,
    LayoutDashboard,
    Bell
} from "lucide-react";
import { signOut } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/client";
import { AuthUser } from "@/lib/store/features/auth/authSlice";

interface UserDropdownProps {
    user: AuthUser;
}

export function UserDropdown({ user }: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
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

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border border-border/50 bg-background/50 hover:bg-muted/50 transition-all duration-200 group"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                    {getInitials(displayName)}
                </div>
                <div className="flex-col items-start text-xs hidden sm:flex">
                    <span className="font-semibold max-w-[100px] truncate">{displayName}</span>
                    <span className="text-muted-foreground capitalize">{userRole}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden z-50 p-2"
                    >
                        {/* User Info Header */}
                        <div className="px-4 py-3 mb-2 bg-muted/30 rounded-xl">
                            <p className="font-semibold text-sm truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>

                        {/* Menu Items */}
                        <div className="flex flex-col gap-1">
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/profile"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            <Link
                                href="/settings"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </Link>
                        </div>

                        <div className="h-px bg-border/50 my-2" />

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
