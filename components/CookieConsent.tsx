"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie } from "lucide-react";
import Link from "next/link";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const cookieConsent = localStorage.getItem("cookieConsent");
        if (!cookieConsent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookieConsent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookieConsent", "declined");
        setIsVisible(false);
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-100"
                >
                    <div className="max-w-3xl mx-auto">
                        <div className="relative bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                            {/* Subtle gradient accent */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    {/* Icon */}
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Cookie className="w-5 h-5 text-primary" />
                                    </div>

                                    {/* Content */}
                                    <div className="grow min-w-0">
                                        <p className="text-sm text-foreground/90 leading-relaxed">
                                            We use cookies to improve your experience on our site. By continuing to browse, you agree to our{" "}
                                            <Link href="/privacy" className="text-primary font-medium hover:underline">
                                                Privacy Policy
                                            </Link>
                                            .
                                        </p>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                                        <button
                                            onClick={handleDecline}
                                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium bg-muted border border-border text-foreground hover:bg-muted/80 transition-all duration-200 cursor-pointer"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={handleAccept}
                                            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 cursor-pointer"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
