"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ToastItem, ToastType } from "@/components/ui/toast/toast-item";

// Toast Types
export type ToastVariant = "success" | "error" | "warning" | "info" | "loading";

export interface ToastData {
    id: string;
    title: string;
    description?: string;
    variant: ToastVariant;
}

interface ToastContextType {
    toast: (data: Omit<ToastData, "id">) => string;
    dismiss: (id: string) => void;
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
    loading: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const addToast = useCallback((data: Omit<ToastData, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { ...data, id }]);
        return id;
    }, []);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((title: string, description?: string) => {
        return addToast({ title, description, variant: "success" });
    }, [addToast]);

    const error = useCallback((title: string, description?: string) => {
        return addToast({ title, description, variant: "error" });
    }, [addToast]);

    const warning = useCallback((title: string, description?: string) => {
        return addToast({ title, description, variant: "warning" });
    }, [addToast]);

    const info = useCallback((title: string, description?: string) => {
        return addToast({ title, description, variant: "info" });
    }, [addToast]);

    const loading = useCallback((title: string, description?: string) => {
        return addToast({ title, description, variant: "loading" });
    }, [addToast]);

    const [isHovered, setIsHovered] = useState(false);

    return (
        <ToastContext.Provider value={{ toast: addToast, dismiss, success, error, warning, info, loading }}>
            {children}
            <div
                className="fixed bottom-6 right-6 z-100 flex flex-col items-end pointer-events-auto w-[420px]"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {toasts.slice(-3).map((t, index, arr) => {
                        // Reverse index for stacking (0 is front/bottom-most visual)
                        const reverseIndex = arr.length - 1 - index;
                        const isVisible = reverseIndex < 3;

                        // Stacking logic
                        const offset = 15; // spacing between stacked cards
                        const scale = 1 - reverseIndex * 0.05;
                        const y = isHovered
                            ? -(reverseIndex * (100 + 15)) + "%" // Expand upwards with gap
                            : -(reverseIndex * offset); // Collapse

                        if (!isVisible) return null;

                        return (
                            <motion.div
                                key={t.id}
                                layout
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    y,
                                    scale: isHovered ? 1 : scale,
                                    zIndex: toasts.length - reverseIndex,
                                }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute bottom-0 right-0 w-full"
                                style={{ transformOrigin: "bottom center" }}
                            >
                                <ToastItem
                                    id={t.id}
                                    title={t.title}
                                    description={t.description}
                                    variant={t.variant}
                                    onDismiss={() => dismiss(t.id)}
                                    paused={isHovered}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
