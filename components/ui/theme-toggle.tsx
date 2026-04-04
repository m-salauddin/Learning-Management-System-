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
            <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
            </div>
        )
    }
    const themes = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ]
    const activeIndex = themes.findIndex(t => t.value === theme)
    return (
        <div className="relative flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
            {}
            <motion.div
                className="absolute left-1 top-1 w-8 h-8 bg-primary rounded-full z-0 shadow-sm"
                initial={false}
                animate={{ x: activeIndex * 36 }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
            {themes.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                        "relative z-10 flex cursor-pointer items-center justify-center w-8 h-8 rounded-full",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "transition-all duration-300",
                        theme === value ? "text-primary-foreground" : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                    )}
                    aria-label={`Switch to ${label} theme`}
                >
                    <Icon className="relative z-10 w-4 h-4" />
                </button>
            ))}
        </div>
    )
}
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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 bg-muted/50 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-muted-foreground/20" />
            </div>
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
                    key={theme}
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                >
                    {theme === "system" ? (
                        <Monitor className="w-5 h-5" />
                    ) : theme === "dark" ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}
