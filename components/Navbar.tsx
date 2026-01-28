"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Search, Menu, X } from "lucide-react";
import { SearchCommand } from "@/components/ui/SearchCommand";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle, ThemeToggleCompact } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";



const navItems = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
];

const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
        <Link
            href="/login"
            className={cn(
                "flex items-center px-5 py-2.5 rounded-2xl text-sm font-bold text-foreground border border-border/50 bg-muted/50 hover:bg-muted/80 transition-all duration-200",
                isMobile ? "justify-center py-3" : ""
            )}
        >
            Login
        </Link>
        <Link
            href="/register"
            className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-200 shadow-lg",
                isMobile && "justify-center py-3"
            )}
        >
            Register
            <ArrowRight className="w-4 h-4" />
        </Link>
    </>
);

export function Navbar() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu or search is open
    useEffect(() => {
        if (isMobileMenuOpen || isSearchOpen) {
            document.body.classList.add("nav-open");
        } else {
            document.body.classList.remove("nav-open");
        }
        return () => {
            document.body.classList.remove("nav-open");
        };
    }, [isMobileMenuOpen, isSearchOpen]);


    return (
        <nav
            suppressHydrationWarning
            className="fixed top-4 left-0 right-0 mx-auto z-50 w-[95%] max-w-7xl"
        >
            <div className="isolate bg-white/60 dark:bg-slate-950/50 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-2xl px-3 sm:px-4 xl:px-8 py-3 xl:py-4 shadow-xl shadow-black/5 dark:shadow-black/40">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" aria-label="Home" className="shrink-0">
                        <Logo className="scale-90 origin-left sm:scale-100" />
                    </Link>

                    {/* Nav Links - Center (Desktop) */}
                    <div className="hidden xl:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="relative px-4 py-2 text-sm font-bold transition-colors duration-200"
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className={`relative z-10 ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-2 xl:gap-3">
                        {/* Search Trigger (Desktop) */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all duration-200 group min-w-[240px]"
                        >
                            <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-muted-foreground text-sm">Search...</span>
                            <kbd className="hidden lg:inline-flex h-6 select-none items-center gap-1 rounded-lg border border-primary bg-primary px-2 font-mono text-[10px] font-medium text-primary-foreground ml-auto opacity-100 transition-colors">
                                <span className="xs">⌘</span>K
                            </kbd>
                        </button>

                        {/* Search Trigger (Mobile) */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden min-[376px]:flex xl:hidden items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/80 cursor-pointer"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>
                        <div className="sm:hidden">
                            <ThemeToggleCompact />
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden min-[711px]:flex items-center gap-3">
                            <AuthButtons />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="xl:hidden flex items-center justify-center w-10 h-10 text-muted-foreground hover:text-foreground transition-colors rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/80 cursor-pointer"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
                        />
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute top-full right-0 mt-2 w-72 p-4 bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl origin-top-right flex flex-col gap-4 overflow-hidden"
                        >
                            {/* Mobile Nav Links */}
                            <div className="flex flex-col gap-2">
                                {/* Mobile Search for small screens */}
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="max-[375px]:flex hidden items-center gap-3 w-full px-4 py-3 mb-2 rounded-xl text-sm font-bold text-muted-foreground border border-border/50 bg-muted/50 hover:bg-muted/80 transition-all"
                                >
                                    <Search className="w-5 h-5" />
                                    <span>Search...</span>
                                </button>

                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                }`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Mobile Auth Buttons */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-border/50">
                                <AuthButtons isMobile />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}