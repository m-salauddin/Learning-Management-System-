'use client';

import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ className = "", showText = true, size = "md" }: LogoProps) => {
    const sizeConfig = {
        sm: { icon: 36, text: "text-lg", gap: "gap-2" },
        md: { icon: 44, text: "text-xl", gap: "gap-2.5" },
        lg: { icon: 56, text: "text-2xl", gap: "gap-3" },
        xl: { icon: 72, text: "text-3xl", gap: "gap-4" }
    };

    const config = sizeConfig[size];
    const uniqueId = React.useId();
    const gradId = `premiumGradient-${uniqueId}`;
    const gradDarkId = `premiumGradientDark-${uniqueId}`;
    const shineId = `metallicShine-${uniqueId}`;
    const depthId = `innerDepth-${uniqueId}`;
    const shadowId = `logoShadow-${uniqueId}`;
    const clipId = `roundedSquare-${uniqueId}`;

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
                    aria-label="SkillSyncBD Logo"
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

                    {/* S Lettermark */}
                    <g clipPath={`url(#${clipId})`}>
                        <path
                            d="M42 22C42 22 38 16 30 16C22 16 18 20 18 25C18 30 23 33 30 34C37 35 46 38 46 44C46 50 40 54 30 54C22 54 18 48 18 48"
                            stroke="white"
                            strokeWidth="5"
                            strokeLinecap="round"
                            fill="none"
                        />

                        {/* Sync indicators */}
                        <g>
                            <circle cx="46" cy="18" r="6" fill="white" fillOpacity="0.2" />
                            <path d="M44 18L48 14M48 14L48 18M48 14L44 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                            <circle cx="18" cy="52" r="6" fill="white" fillOpacity="0.2" />
                            <path d="M20 52L16 56M16 56L16 52M16 56L20 56" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                    </g>
                </svg>

                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg -z-10 scale-110 opacity-50" />
            </div>

            {/* Typography */}
            {showText && (
                <div className="flex flex-col">
                    <div className={`${config.text} font-bold tracking-tight leading-none flex items-baseline`}>
                        <span className="text-foreground">Skill</span>
                        <span className="bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent dark:from-primary dark:via-secondary dark:to-accent">
                            Sync
                        </span>
                        <span className="ml-1.5 text-[0.5em] font-black tracking-wider text-white bg-linear-to-r from-primary to-accent dark:from-primary dark:to-secondary px-1.5 py-0.5 rounded-md shadow-sm">
                            BD
                        </span>
                    </div>
                    <p className="text-[0.55em] text-muted-foreground tracking-[0.2em] uppercase font-medium mt-0.5 opacity-70">
                        Level Up Your Career
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
            aria-label="SkillSyncBD"
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
                d="M42 22C42 22 38 16 30 16C22 16 18 20 18 25C18 30 23 33 30 34C37 35 46 38 46 44C46 50 40 54 30 54C22 54 18 48 18 48"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />

            <circle cx="46" cy="18" r="5" fill="white" fillOpacity="0.25" />
            <path d="M44 18L48 14M48 14V18M48 14H44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

            <circle cx="18" cy="52" r="5" fill="white" fillOpacity="0.25" />
            <path d="M20 52L16 56M16 56V52M16 56H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
};
