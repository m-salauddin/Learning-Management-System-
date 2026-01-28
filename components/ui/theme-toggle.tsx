"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="flex items-center gap-1 p-1 rounded-full bg-muted">
                <div className="w-8 h-8 rounded-full" />
                <div className="w-8 h-8 rounded-full" />
                <div className="w-8 h-8 rounded-full" />
            </div>
        )
    }

    const themes = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ]

    return (
        <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
            {themes.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                        "relative flex cursor-pointer items-center justify-center w-8 h-8 rounded-full transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        theme === value ? "text-primary-foreground" : "text-muted-foreground"
                    )}
                    aria-label={`Switch to ${label} theme`}
                >
                    {theme === value && (
                        <motion.div
                            layoutId="theme-toggle-bg"
                            className="absolute inset-0 bg-primary rounded-full shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                    )}
                    <Icon className="relative z-10 w-4 h-4" />
                </button>
            ))}
        </div>
    )
}

// Compact version for navbar
export function ThemeToggleCompact() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    const cycleTheme = () => {
        const themes = ["light", "dark", "system"]
        const currentIndex = themes.indexOf(theme || "system")
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
    }

    if (!mounted) {
        return (
            <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-muted">
                <div className="w-4 h-4" />
            </button>
        )
    }

    return (
        <button
            onClick={cycleTheme}
            className={cn(
                "flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 cursor-pointer",
                "bg-muted/50 hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={`Current theme: ${theme}. Click to cycle.`}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={resolvedTheme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    {resolvedTheme === "dark" ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}
