"use client";

import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
    align?: 'left' | 'right';
}

export function Dropdown({ trigger, children, className, align = 'right' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <div onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={cn(
                            "absolute z-50 mt-2 min-w-56 rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl shadow-black/10 overflow-hidden p-1",
                            align === 'right' ? 'right-0' : 'left-0',
                            className
                        )}
                    >
                        <div className="py-1" onClick={() => setIsOpen(false)}>
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface DropdownItemProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    icon?: ReactNode;
    destructive?: boolean;
}

export function DropdownItem({ children, onClick, className, icon, destructive }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full px-3 py-2 text-left text-sm flex items-center gap-3 rounded-lg",
                "hover:bg-primary/10 transition-colors cursor-pointer",
                destructive ? "text-red-500 hover:bg-red-500/10" : "text-foreground",
                className
            )}
        >
            {icon && <span className="w-4 h-4">{icon}</span>}
            {children}
        </button>
    );
}

export function DropdownSeparator() {
    return <div className="my-1 h-px bg-border/50" />;
}

export function DropdownLabel({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}>
            {children}
        </div>
    );
}
