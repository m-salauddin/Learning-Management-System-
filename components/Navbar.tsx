"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";



export function Navbar() {


    return (
        <nav
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl animate-fade-in-down"
        >
            <div className="navbar-glass border rounded-2xl px-8 py-4 shadow-2xl shadow-black/10 dark:shadow-black/40">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <Link href="/" aria-label="Home">
                        {/* If <Logo /> contains an <a> tag internally, remove this <Link> wrapper */}
                        <Logo />
                    </Link>

                    {/* Nav Links - Center */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/courses"
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
                        >
                            Courses
                        </Link>
                        <Link
                            href="/about"
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-200"
                        >
                            About
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center px-4 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-all duration-200"
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
        </nav>
    );
}