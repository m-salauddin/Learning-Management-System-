"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    href?: string;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    isAnchor?: boolean; // true for same-page anchors (#courses), false for Next.js routing
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    hideIcon?: boolean;
}


export function PrimaryCTAButton({
    href,
    onClick,
    children,
    className,
    isAnchor = false,
    disabled = false,
    loading = false,
    type = "button",
    hideIcon = false,
}: Omit<CTAButtonProps, "variant">) {
    const buttonContent = (
        <>
            <span className="text-sm sm:text-lg font-bold text-primary-foreground">{loading ? "Processing..." : children}</span>
            {!hideIcon && (
                <div className="flex h-[26px] w-[26px] sm:h-7 sm:w-7 items-center justify-center rounded-full bg-background transition-transform duration-300 -rotate-45 group-hover/btn:rotate-0">
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
            )}
        </>
    );

    const buttonClasses = cn(
        "group/btn flex items-center justify-center gap-2.5 sm:gap-4 pl-6 sm:pl-10 pr-2 py-2 bg-[#0036F9] dark:bg-primary hover:bg-[#0036F9]/90 dark:hover:bg-primary/90 rounded-full transition-all duration-300 active:scale-95 cursor-pointer h-[34px] sm:h-11 disabled:opacity-70 disabled:cursor-not-allowed",
        className
    );

    if (onClick || type !== "button" || !href) {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled || loading}
                className={buttonClasses}
            >
                {buttonContent}
            </button>
        );
    }

    if (isAnchor) {
        return (
            <a href={href} className={buttonClasses}>
                {buttonContent}
            </a>
        );
    }

    return (
        <Link href={href} className={buttonClasses}>
            {buttonContent}
        </Link>
    );
}


export function SecondaryCTAButton({
    href,
    onClick,
    children,
    className,
    isAnchor = false,
    disabled = false,
    loading = false,
    type = "button",
}: Omit<CTAButtonProps, "variant">) {
    const buttonContent = (
        <>
            <span className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-black/10 dark:via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover/shimmer:translate-x-[250%] transition-transform duration-700 ease-in-out z-10" />
            <span className="text-sm sm:text-lg font-bold dark:text-white text-black group-hover/shimmer:text-primary transition-colors relative z-20">
                {loading ? "Processing..." : children}
            </span>
        </>
    );

    const buttonClasses = cn(
        "group/shimmer relative flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-2 sm:py-2.5 bg-card border border-border hover:border-slate-400 dark:hover:border-white/20 rounded-full transition-all duration-300 active:scale-95 cursor-pointer h-[34px] sm:h-11 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed",
        className
    );

    if (onClick || type !== "button" || !href) {
        return (
            <button
                type={type}
                onClick={onClick}
                disabled={disabled || loading}
                className={buttonClasses}
            >
                {buttonContent}
            </button>
        );
    }

    if (isAnchor) {
        return (
            <a href={href} className={buttonClasses}>
                {buttonContent}
            </a>
        );
    }

    return (
        <Link href={href} className={buttonClasses}>
            {buttonContent}
        </Link>
    );
}
