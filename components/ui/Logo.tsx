'use client';

import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
    textClassName?: string;
}

export const Logo = ({ className = "", showText = true, size = "md", textClassName = "" }: LogoProps) => {
    const sizeConfig = {
        sm: { icon: 36, text: "text-lg", gap: "gap-2" },
        md: { icon: 44, text: "text-xl", gap: "gap-2.5" },
        lg: { icon: 56, text: "text-2xl", gap: "gap-3" },
        xl: { icon: 72, text: "text-3xl", gap: "gap-4" }
    };

    const config = sizeConfig[size];
    // Static IDs to avoid hydration mismatch (useId generates different IDs on server vs client)
    const gradId = 'logo-premiumGradient';
    const gradDarkId = 'logo-premiumGradientDark';
    const shineId = 'logo-metallicShine';
    const depthId = 'logo-innerDepth';
    const shadowId = 'logo-shadow';
    const clipId = 'logo-roundedSquare';

    return (
        <div className={`flex items-center ${config.gap} ${className}`}>
            {/* Logo Icon */}
            <div className="relative transition-transform duration-200 hover:scale-105 active:scale-95">
                <svg
                    width={config.icon}
                    height={config.icon}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                    aria-label="DokkhotaIT Logo"
                >
                    <defs>
                        {/* Premium Multi-stop Gradient */}
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0036F9" />
                            <stop offset="35%" stopColor="#4F46E5" />
                            <stop offset="65%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>

                        {/* Dark mode gradient */}
                        <linearGradient id={gradDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FCB900" />
                            <stop offset="40%" stopColor="#F59E0B" />
                            <stop offset="70%" stopColor="#22D3EE" />
                            <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>

                        {/* Metallic Shine */}
                        <linearGradient id={shineId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="white" stopOpacity="0" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
                        </linearGradient>

                        {/* Inner depth gradient */}
                        <radialGradient id={depthId} cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                            <stop offset="60%" stopColor="white" stopOpacity="0" />
                            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                        </radialGradient>

                        {/* Optimized shadow - single layer */}
                        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#4F46E5" floodOpacity="0.3" />
                        </filter>

                        <clipPath id={clipId}>
                            <rect x="4" y="4" width="56" height="56" rx="16" />
                        </clipPath>
                    </defs>

                    {/* Main Shape */}
                    <g filter={`url(#${shadowId})`}>
                        {/* Light Mode Base */}
                        <rect
                            x="4" y="4"
                            width="56" height="56"
                            rx="16"
                            fill={`url(#${gradId})`}
                            className="dark:hidden"
                        />
                        {/* Dark Mode Base */}
                        <rect
                            x="4" y="4"
                            width="56" height="56"
                            rx="16"
                            fill={`url(#${gradDarkId})`}
                            className="hidden dark:block"
                        />
                        <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${depthId})`} />
                        <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${shineId})`} />
                    </g>

                    {/* D Lettermark */}
                    <g clipPath={`url(#${clipId})`}>
                        <path
                            d="M24 16V48M24 16H32C42 16 46 22 46 32C46 42 42 48 32 48H24"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            className="stroke-white dark:stroke-slate-950"
                        />
                        {/* Tech accents */}
                        <circle cx="24" cy="16" r="3" fillOpacity="0.3" className="fill-white dark:fill-slate-950" />
                        <circle cx="24" cy="48" r="3" fillOpacity="0.3" className="fill-white dark:fill-slate-950" />
                        <circle cx="46" cy="32" r="4" fillOpacity="0.3" className="fill-white dark:fill-slate-950" />
                    </g>
                </svg>

                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg -z-10 scale-110 opacity-50" />
            </div>

            {/* Typography */}
            {showText && (
                <div className={`flex flex-col ${textClassName}`}>
                    <div className={`${config.text} font-bold tracking-tight leading-none flex items-baseline`}>
                        <span className="bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent dark:from-primary dark:via-secondary dark:to-accent">
                            Dokkhota
                        </span>
                        <span className="ml-1 text-[0.5em] font-black tracking-wider text-white dark:text-slate-950 bg-linear-to-r from-primary to-accent dark:from-primary dark:to-secondary px-1.5 py-0.5 rounded-md shadow-sm">
                            IT
                        </span>
                    </div>
                    <p className="text-[0.45em] text-muted-foreground tracking-[0.2em] uppercase font-medium mt-1 opacity-80">
                        Empowering Future
                    </p>
                </div>
            )}
        </div>
    );
};

// Lightweight Icon-only version
export const LogoIcon = ({ size = 40, className = "" }: { size?: number; className?: string }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 hover:scale-105 ${className}`}
            aria-label="DokkhotaIT"
        >
            <defs>
                <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0036F9" />
                    <stop offset="35%" stopColor="#4F46E5" />
                    <stop offset="65%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="iconGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCB900" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#22D3EE" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="iconShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                </linearGradient>
                <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#4F46E5" floodOpacity="0.35" />
                </filter>
            </defs>

            <g filter="url(#iconShadow)">
                <rect x="4" y="4" width="56" height="56" rx="16" className="fill-[url(#iconGrad)] dark:fill-[url(#iconGradDark)]" />
                <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#iconShine)" />
            </g>

            <path
                d="M24 16V48M24 16H32C42 16 46 22 46 32C46 42 42 48 32 48H24"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                className="stroke-white dark:stroke-slate-950"
            />

            <circle cx="46" cy="32" r="4" fillOpacity="0.25" className="fill-white dark:fill-slate-950" />
            <circle cx="24" cy="16" r="3" fillOpacity="0.25" className="fill-white dark:fill-slate-950" />
            <circle cx="24" cy="48" r="3" fillOpacity="0.25" className="fill-white dark:fill-slate-950" />
        </svg>
    );
};
