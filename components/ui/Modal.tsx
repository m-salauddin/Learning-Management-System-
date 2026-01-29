"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
    description?: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    icon?: React.ElementType;
    showFooter?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    description,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    icon: Icon = AlertCircle,
    showFooter = true,
}: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const variantStyles = {
        danger: {
            iconBg: "bg-destructive/10",
            iconColor: "text-destructive",
            buttonBg: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        },
        warning: {
            iconBg: "bg-yellow-500/10",
            iconColor: "text-yellow-500",
            buttonBg: "bg-yellow-500 text-white hover:bg-yellow-600",
        },
        info: {
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            buttonBg: "bg-blue-500 text-white hover:bg-blue-600",
        },
    };

    const styles = variantStyles[variant];

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-sm bg-background border border-border rounded-2xl shadow-xl overflow-hidden"
                    >
                        <div className="p-6 text-center">
                            {title && (
                                <>
                                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4", styles.iconBg, styles.iconColor)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                                </>
                            )}

                            {description && (
                                <p className="text-muted-foreground text-sm mb-6">
                                    {description}
                                </p>
                            )}

                            {children}

                            {showFooter && onConfirm && (
                                <div className="grid grid-cols-2 gap-3 mt-6">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2.5 rounded-xl border border-border/50 hover:bg-muted/50 font-medium transition-colors text-sm cursor-pointer"
                                    >
                                        {cancelText}
                                    </button>
                                    <button
                                        onClick={onConfirm}
                                        className={cn("px-4 py-2.5 rounded-xl font-medium transition-colors text-sm cursor-pointer", styles.buttonBg)}
                                    >
                                        {confirmText}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
