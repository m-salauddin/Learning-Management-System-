"use client";

import React, { useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { motion } from "motion/react";
import { useToast } from "@/components/ui/toast";
import { fadeInUp } from "@/lib/motion";


function AuthCodeErrorContent() {
    const searchParams = useSearchParams();
    const toast = useToast();
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");
    const error_code = searchParams.get("error_code");

    const hasShownToast = useRef(false);

    useEffect(() => {
        if ((error || error_description) && !hasShownToast.current) {
            hasShownToast.current = true;
            toast.error(
                "Authentication Error",
                error_description || "We couldn't sign you in. Please try again."
            );
        }
    }, [toast, error, error_description]);

    return (
        <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning>
            <Navbar />

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-28">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="w-full max-w-md"
                >
                    {/* Card */}
                    <div className="bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Authentication Failed</h1>
                            <p className="text-muted-foreground text-sm">
                                We encountered an issue while signing you in.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6">

                            {/* Error Icon */}
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                                <AlertCircle className="w-8 h-8" />
                            </div>

                            {/* Error Details */}
                            {(error || error_description) && (
                                <div className="w-full bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-sm text-left">
                                    {error_code && <p className="font-mono text-xs text-muted-foreground mb-1">Code: {error_code}</p>}
                                    <p className="text-foreground/90">{error_description || error || "Unknown error occurred"}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-3 w-full">
                                <Link
                                    href="/login"
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted hover:border-border text-foreground font-medium transition-all duration-200"
                                >
                                    <Home className="w-4 h-4" />
                                    Go Home
                                </Link>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

export default function AuthCodeError() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <AuthCodeErrorContent />
        </React.Suspense>
    );
}
