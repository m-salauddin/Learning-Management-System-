"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Home, ArrowLeft, X, Send, AlertCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema for feedback
const feedbackSchema = z.object({
    message: z.string().min(10, "Please describe the issue in at least 10 characters."),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function NotFound() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
    });

    const onSubmit = async (data: FeedbackFormValues) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Feedback submitted:", data);
        setIsSubmitted(true);
        reset();
        setTimeout(() => {
            setIsSubmitted(false);
            setIsModalOpen(false);
        }, 2000);
    };

    return (
        <div
            className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4 font-space-grotesk overflow-hidden selection:bg-primary/30 transition-colors duration-300"
            suppressHydrationWarning
        >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-linear-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-linear-to-tr from-secondary/20 via-primary/10 to-transparent rounded-full blur-[120px]" />
            </div>

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
            />

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-2xl px-6"
            >
                {/* Header/Logo Area */}
                <div className="flex justify-center mb-12">
                    <div className="relative p-6 pr-10 rounded-3xl bg-white/10 dark:bg-black/20 border border-white/10 backdrop-blur-2xl shadow-2xl dark:shadow-black/50 overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
                        <Logo />
                    </div>
                </div>

                {/* 404 Typography */}
                <div className="relative text-center mb-12">
                    <h1 className="select-none text-[120px] sm:text-[180px] font-bold leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-black/5 to-transparent dark:from-white/10 dark:to-transparent">
                        404
                    </h1>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary font-jetbrains-mono text-sm font-medium backdrop-blur-sm shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Error: Page Missing
                        </motion.div>
                        <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                            Lost in the digital void?
                        </h2>
                    </div>
                </div>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed"
                >
                    The learning path you're looking for seems to have vanished. Let's get you back to your studies.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        href="/"
                        className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-primary p-px transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                        <span className="relative flex h-full w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground backdrop-blur-3xl transition-all">
                            <Home className="w-4 h-4" />
                            Return Home
                        </span>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-input bg-background hover:bg-muted/50 text-foreground font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </motion.div>

                {/* Footer Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-sm text-muted-foreground/80 hover:text-primary transition-colors border-b border-transparent hover:border-primary/50 pb-0.5 outline-none focus-visible:text-primary"
                    >
                        Report a broken link
                    </button>
                </motion.div>
            </motion.div>

            {/* Feedback Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6"
                        >
                            <div className="bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden text-card-foreground">
                                {/* Close Button */}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center text-center space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                            <Send className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-xl font-bold">Thank You!</h3>
                                        <p className="text-muted-foreground">
                                            We've received your report and will look into it shortly.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                                    <AlertCircle className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-bold">Broken Link Report</h3>
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                Tell us what went wrong so we can fix it.
                                            </p>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="message" className="text-sm font-medium text-foreground">
                                                    Describe the issue
                                                </label>
                                                <textarea
                                                    {...register("message")}
                                                    id="message"
                                                    rows={4}
                                                    className="w-full bg-muted/50 border border-input rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none"
                                                    placeholder="I was trying to access... when I saw this error."
                                                />
                                                {errors.message && (
                                                    <p className="text-destructive text-xs">{errors.message.message}</p>
                                                )}
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="flex-1 px-4 py-2.5 rounded-xl border border-input bg-background hover:bg-muted text-foreground text-sm font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Submit Report
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
