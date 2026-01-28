"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { forgotPassword } from "@/app/auth/actions";
import { useToast } from "@/components/ui/toast";


const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const toast = useToast();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            const result = await forgotPassword(data.email);
            if (result?.error) {
                let errorMessage = result.error;


                if (errorMessage.toLowerCase().includes("rate limit")) {
                    errorMessage = "Too many attempts. Please wait a minute before trying again.";
                }

                setError("root", {
                    type: "manual",
                    message: errorMessage
                });
                toast.error("Request Failed", errorMessage);
            } else {
                setIsSuccess(true);
                toast.success("Email Sent", "Check your inbox for the reset link.");
            }
        } catch (error) {
            const fallbackError = "Something went wrong. Please try again.";
            setError("root", {
                type: "manual",
                message: fallbackError
            });
            toast.error("Error", fallbackError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning>

            <main className="flex-1 flex items-center justify-center px-4 py-28">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="w-full max-w-md"
                >

                    <div className="bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl p-8 shadow-2xl">

                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
                            <p className="text-muted-foreground text-sm">
                                Enter your email to reset your password
                            </p>
                        </div>


                        {isSuccess ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-xl">Check your email</h3>
                                <p className="text-muted-foreground">
                                    We've sent a password reset link to your email address.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 mt-4"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        ) : (

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            {...register("email")}
                                            type="email"
                                            id="email"
                                            placeholder="name@example.com"
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border ${errors.email
                                                ? "border-destructive focus:ring-destructive"
                                                : "border-border/50 focus:ring-primary"
                                                } focus:outline-none focus:ring-2 transition-all duration-200`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-destructive text-xs mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>


                                {errors.root && (
                                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                        {errors.root.message}
                                    </div>
                                )}


                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>


                                <div className="text-center mt-6">
                                    <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
