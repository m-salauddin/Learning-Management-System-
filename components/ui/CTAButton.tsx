"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    className?: string;
    isAnchor?: boolean; // true for same-page anchors (#courses), false for Next.js routing
}

/**
 * Primary CTA Button - Yellow/Primary colored with arrow icon
 * Used in Hero section and CTA section
 */
export function PrimaryCTAButton({
    href,
    children,
    className,
    isAnchor = false,
}: Omit<CTAButtonProps, "variant">) {
    const buttonContent = (
        <>
            <span className="text-lg font-bold text-primary-foreground">{children}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background transition-transform duration-300 -rotate-45 group-hover/btn:rotate-0">
                <ArrowRight className="h-5 w-5 text-primary" />
            </div>
        </>
    );

    const buttonClasses = cn(
        "group/btn flex items-center gap-3 pl-8 pr-2 py-2 bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 active:scale-95 cursor-pointer shadow-lg h-11 shadow-primary/25",
        className
    );

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

/**
 * Secondary CTA Button - Dark/Card colored with shimmer effect
 * Used in Hero section and CTA section
 */
export function SecondaryCTAButton({
    href,
    children,
    className,
    isAnchor = false,
}: Omit<CTAButtonProps, "variant">) {
    const buttonContent = (
        <>
            <span className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover/shimmer:translate-x-[250%] transition-transform duration-700 ease-in-out z-10" />
            <span className="text-lg font-bold dark:text-white text-black group-hover/shimmer:text-primary transition-colors relative z-20">
                {children}
            </span>
        </>
    );

    const buttonClasses = cn(
        "group/shimmer relative flex items-center gap-3 pl-8 bg-card pr-8 py-2.5 border border-border hover:border-white/20 rounded-full transition-all duration-300 active:scale-95 cursor-pointer h-11 shadow-lg overflow-hidden",
        className
    );

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
