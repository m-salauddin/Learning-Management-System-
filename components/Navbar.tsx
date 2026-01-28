"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Search } from "lucide-react";
import { SearchCommand } from "@/components/ui/SearchCommand";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";



export function Navbar() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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


    return (
        <nav
            suppressHydrationWarning
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] lg:w-[80%] max-w-7xl"
        >
            <div className="isolate bg-white/60 dark:bg-slate-950/50 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-2xl px-8 py-4 shadow-xl shadow-black/5 dark:shadow-black/40">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" aria-label="Home">
                        <Logo />
                    </Link>

                    {/* Nav Links - Center */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { name: "Home", href: "/" },
                            { name: "Courses", href: "/courses" },
                            { name: "About", href: "/about" },
                        ].map((item) => {
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
                    <div className="flex items-center gap-3">
                        {/* Search Trigger */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted/80 transition-all duration-200 group min-w-[240px]"
                        >
                            <Search className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-muted-foreground text-sm">Search...</span>
                            <kbd className="hidden lg:inline-flex h-6 select-none items-center gap-1 rounded-lg border border-primary bg-primary px-2 font-mono text-[10px] font-medium text-primary-foreground ml-auto opacity-100 transition-colors">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center px-5 py-2.5 rounded-2xl text-sm font-bold text-foreground border border-border/50 bg-muted/50 hover:bg-muted/80 transition-all duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all duration-200 shadow-lg"
                        >
                            Register
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </nav>
    );
}