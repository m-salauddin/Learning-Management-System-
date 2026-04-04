"use client";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
interface DrawerProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    direction?: 'right' | 'bottom';
}
export function Drawer({ open, onClose, children, className, direction = 'right' }: DrawerProps) {
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
    const variants = {
        right: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
            container: "fixed inset-y-0 right-0 z-70 h-full w-full max-w-md sm:max-w-lg shadow-2xl"
        },
        bottom: {
            initial: { y: '100%' },
            animate: { y: 0 },
            exit: { y: '100%' },
            container: "fixed inset-x-0 bottom-0 z-70 w-full h-[80vh] shadow-2xl rounded-t-[2rem]"
        }
    };
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-60"
                    />
                    <motion.div
                        initial={variants[direction].initial}
                        animate={variants[direction].animate}
                        exit={variants[direction].exit}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className={cn(
                            "bg-card/95 backdrop-blur-2xl border-l border-white/10 dark:border-white/5 overflow-hidden flex flex-col",
                            variants[direction].container,
                            className
                        )}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
export function DrawerHeader({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("px-8 py-8 border-b border-border/40 space-y-2 shrink-0", className)}>
            {children}
        </div>
    );
}
export function DrawerTitle({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={cn("text-2xl font-black tracking-tight text-foreground italic uppercase", className)}>
            {children}
        </h2>
    );
}
export function DrawerDescription({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <p className={cn("text-sm text-muted-foreground font-medium", className)}>
            {children}
        </p>
    );
}
export function DrawerBody({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("flex-1 p-8 overflow-y-auto custom-scrollbar", className)}>
            {children}
        </div>
    );
}
export function DrawerFooter({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn("p-8 bg-muted/20 border-t border-border/40 flex flex-col gap-3 shrink-0", className)}>
            {children}
        </div>
    );
}
export function DrawerClose({ onClose }: { onClose: () => void }) {
    return (
        <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-xl hover:bg-muted font-medium transition-all text-muted-foreground z-10"
        >
            <X className="w-5 h-5" />
        </button>
    );
}
