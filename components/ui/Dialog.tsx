"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Dialog({ open, onClose, children, className, size = 'md' }: DialogProps) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-7xl'
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    
                    {/* Dialog */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className={cn(
                                "relative w-full bg-card border border-border/50 rounded-2xl shadow-2xl",
                                sizeClasses[size],
                                className
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 py-4 border-b border-border/50", className)}>
            {children}
        </div>
    );
}

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={cn("text-xl font-bold text-foreground", className)}>
            {children}
        </h2>
    );
}

export function DialogDescription({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cn("text-sm text-muted-foreground mt-1", className)}>
            {children}
        </p>
    );
}

export function DialogBody({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 py-4", className)}>
            {children}
        </div>
    );
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("px-6 py-4 border-t border-border/50 flex items-center justify-end gap-3", className)}>
            {children}
        </div>
    );
}

export function DialogClose({ onClose }: { onClose: () => void }) {
    return (
        <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
            <X className="w-5 h-5" />
        </button>
    );
}
