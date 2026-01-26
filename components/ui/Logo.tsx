'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

    return (
        <div className={`flex items-center ${config.gap} ${className}`}>
            {/* Premium Logo Mark */}
            <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                <svg
                    width={config.icon}
                    height={config.icon}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                >
                    <defs>
                        {/* Premium Multi-stop Gradient */}
                        <linearGradient id="premiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0036F9" />
                            <stop offset="35%" stopColor="#4F46E5" />
                            <stop offset="65%" stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#A855F7" />
                        </linearGradient>

                        {/* Dark mode gradient */}
                        <linearGradient id="premiumGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FCB900" />
                            <stop offset="40%" stopColor="#F59E0B" />
                            <stop offset="70%" stopColor="#22D3EE" />
                            <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>

                        {/* Metallic Shine */}
                        <linearGradient id="metallicShine" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="white" stopOpacity="0" />
                            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
                        </linearGradient>

                        {/* Inner Shadow for depth */}
                        <radialGradient id="innerDepth" cx="30%" cy="30%" r="70%" fx="20%" fy="20%">
                            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
                            <stop offset="60%" stopColor="white" stopOpacity="0" />
                            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
                        </radialGradient>

                        {/* Premium Shadow */}
                        <filter id="premiumShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#4F46E5" floodOpacity="0.35" />
                            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#0036F9" floodOpacity="0.2" />
                        </filter>

                        {/* Clip path for rounded square */}
                        <clipPath id="roundedSquare">
                            <rect x="4" y="4" width="56" height="56" rx="16" />
                        </clipPath>
                    </defs>

                    {/* Main Container - Rounded Square */}
                    <g filter="url(#premiumShadow)">
                        {/* Base Shape */}
                        <rect
                            x="4" y="4"
                            width="56" height="56"
                            rx="16"
                            className="fill-[url(#premiumGradient)] dark:fill-[url(#premiumGradientDark)]"
                        />

                        {/* Depth Layer */}
                        <rect
                            x="4" y="4"
                            width="56" height="56"
                            rx="16"
                            fill="url(#innerDepth)"
                        />

                        {/* Shine Overlay */}
                        <rect
                            x="4" y="4"
                            width="56" height="56"
                            rx="16"
                            fill="url(#metallicShine)"
                        />
                    </g>

                    {/* Premium "S" Lettermark - Geometric & Bold */}
                    <g clipPath="url(#roundedSquare)">
                        {/* Main S - Upper curve */}
                        <motion.path
                            d="M42 22C42 22 38 16 30 16C22 16 18 20 18 25C18 30 23 33 30 34"
                            stroke="white"
                            strokeWidth="5"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />

                        {/* Main S - Lower curve */}
                        <motion.path
                            d="M30 34C37 35 46 38 46 44C46 50 40 54 30 54C22 54 18 48 18 48"
                            stroke="white"
                            strokeWidth="5"
                            strokeLinecap="round"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
                        />

                        {/* Sync Arrow - Top Right */}
                        <motion.g
                            initial={{ opacity: 0, x: -3 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, duration: 0.4 }}
                        >
                            <circle cx="46" cy="18" r="6" fill="white" fillOpacity="0.2" />
                            <path
                                d="M44 18L48 14M48 14L48 18M48 14L44 14"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.g>

                        {/* Sync Arrow - Bottom Left */}
                        <motion.g
                            initial={{ opacity: 0, x: 3 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4, duration: 0.4 }}
                        >
                            <circle cx="18" cy="52" r="6" fill="white" fillOpacity="0.2" />
                            <path
                                d="M20 52L16 56M16 56L16 52M16 56L20 56"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </motion.g>
                    </g>

                    {/* Animated Pulse Ring */}
                    <motion.rect
                        x="4" y="4"
                        width="56" height="56"
                        rx="16"
                        fill="none"
                        stroke="white"
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        initial={{ scale: 1, opacity: 0.3 }}
                        animate={{ scale: 1.08, opacity: 0 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        style={{ transformOrigin: 'center' }}
                    />
                </svg>

                {/* Premium Ambient Glow */}
                <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/30 blur-xl -z-10"
                    style={{ transform: 'scale(1.2)' }}
                    animate={{
                        opacity: [0.4, 0.6, 0.4],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Premium Typography */}
            {showText && (
                <motion.div
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className={`${config.text} font-bold tracking-tight leading-none flex items-baseline`}>
                        <span className="text-foreground">Skill</span>
                        <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent dark:from-primary dark:via-secondary dark:to-accent">
                            Sync
                        </span>
                        <motion.span
                            className="ml-1.5 text-[0.5em] font-black tracking-wider text-white bg-gradient-to-r from-primary to-accent dark:from-primary dark:to-secondary px-1.5 py-0.5 rounded-md shadow-lg"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8, type: "spring", stiffness: 400 }}
                        >
                            BD
                        </motion.span>
                    </div>

                    {/* Tagline with animated underline */}
                    <motion.div
                        className="relative mt-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <p className="text-[0.55em] text-muted-foreground tracking-[0.2em] uppercase font-medium">
                            Level Up Your Career
                        </p>
                        <motion.div
                            className="absolute -bottom-0.5 left-0 h-[1px] bg-gradient-to-r from-primary/50 via-accent/30 to-transparent"
                            initial={{ width: 0 }}
                            animate={{ width: '70%' }}
                            transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

// Premium Icon Only Version
export const LogoIcon = ({ size = 40, className = "" }: { size?: number; className?: string }) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
                <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                </linearGradient>
                <filter id="iconShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#4F46E5" floodOpacity="0.4" />
                </filter>
            </defs>

            <g filter="url(#iconShadow)">
                <rect x="4" y="4" width="56" height="56" rx="16" className="fill-[url(#iconGrad)] dark:fill-[url(#iconGradDark)]" />
                <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#shine)" />
            </g>

            {/* S Shape */}
            <path
                d="M42 22C42 22 38 16 30 16C22 16 18 20 18 25C18 30 23 33 30 34C37 35 46 38 46 44C46 50 40 54 30 54C22 54 18 48 18 48"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
            />

            {/* Top sync indicator */}
            <circle cx="46" cy="18" r="5" fill="white" fillOpacity="0.25" />
            <path d="M44 18L48 14M48 14V18M48 14H44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

            {/* Bottom sync indicator */}
            <circle cx="18" cy="52" r="5" fill="white" fillOpacity="0.25" />
            <path d="M20 52L16 56M16 56V52M16 56H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </motion.svg>
    );
};
