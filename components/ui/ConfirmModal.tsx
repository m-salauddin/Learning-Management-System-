"use client";

import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertCircle, HelpCircle, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "primary";
    isLoading?: boolean;
    icon?: LucideIcon;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    isLoading = false,
    icon: Icon
}: ConfirmModalProps) {

    // Default icons based on variant
    const getIcon = () => {
        if (Icon) return Icon;
        switch (variant) {
            case "danger": return Trash2;
            case "warning": return AlertCircle;
            default: return HelpCircle;
        }
    };

    const DefaultIcon = getIcon();

    const variantStyles = {
        danger: {
            iconContainer: "bg-red-500/10 ring-red-500/5",
            icon: "text-red-500",
            confirmButton: "bg-red-500 shadow-red-500/25 hover:bg-red-600",
        },
        warning: {
            iconContainer: "bg-amber-500/10 ring-amber-500/5",
            icon: "text-amber-500",
            confirmButton: "bg-amber-500 shadow-amber-500/25 hover:bg-amber-600",
        },
        primary: {
            iconContainer: "bg-primary/10 ring-primary/5",
            icon: "text-primary",
            confirmButton: "bg-primary shadow-primary/25 hover:opacity-90",
        }
    };

    const styles = variantStyles[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-100 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background border border-border/50 rounded-[32px] shadow-2xl max-w-sm w-full p-8 text-center space-y-6"
                    >
                        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-8", styles.iconContainer)}>
                            <DefaultIcon className={cn("w-10 h-10", styles.icon)} />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {description}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-2xl border border-border font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-[0.98] transition-all text-sm"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={onConfirm}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-2xl text-white font-bold shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm",
                                    styles.confirmButton
                                )}
                            >
                                {isLoading ? "..." : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
