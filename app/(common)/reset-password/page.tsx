"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { updatePassword } from "@/app/auth/actions";

// Validation schema
const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function getPasswordStrength(password: string): { strength: number; label: string; color: string } {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: "Weak", color: "bg-destructive" };
    if (strength <= 3) return { strength, label: "Medium", color: "bg-yellow-500" };
    if (strength <= 4) return { strength, label: "Strong", color: "bg-primary" };
    return { strength, label: "Very Strong", color: "bg-green-500" };
}

export default function ResetPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password", "");
    const passwordStrength = getPasswordStrength(password);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        try {
            const result = await updatePassword(data.password);
            if (result?.error) {
                setError("root", {
                    type: "manual",
                    message: result.error
                });
            }
            // updatePassword redirects on success, so we don't need to do anything here
        } catch (error) {
            setError("root", {
                type: "manual",
                message: "Something went wrong. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning>
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
                            <h1 className="text-2xl font-bold mb-2">Set New Password</h1>
                            <p className="text-muted-foreground text-sm">
                                Create a strong password for your account
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter new password"
                                        className={`w-full pl-10 pr-12 py-3 rounded-xl bg-muted/50 border ${errors.password
                                            ? "border-destructive focus:ring-destructive"
                                            : "border-border/50 focus:ring-primary"
                                            } focus:outline-none focus:ring-2 transition-all duration-200`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                {password && (
                                    <div className="space-y-1">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-colors ${level <= passwordStrength.strength
                                                        ? passwordStrength.color
                                                        : "bg-muted"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Password strength: <span className="font-medium">{passwordStrength.label}</span>
                                        </p>
                                    </div>
                                )}
                                {errors.password && (
                                    <p className="text-destructive text-xs mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        {...register("confirmPassword")}
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="Confirm new password"
                                        className={`w-full pl-10 pr-12 py-3 rounded-xl bg-muted/50 border ${errors.confirmPassword
                                            ? "border-destructive focus:ring-destructive"
                                            : "border-border/50 focus:ring-primary"
                                            } focus:outline-none focus:ring-2 transition-all duration-200`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-destructive text-xs mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-muted/30 rounded-xl p-3 space-y-1">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Password must contain:</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {[
                                        { label: "8+ characters", valid: password.length >= 8 },
                                        { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
                                        { label: "Lowercase letter", valid: /[a-z]/.test(password) },
                                        { label: "Number", valid: /[0-9]/.test(password) },
                                    ].map((req) => (
                                        <div key={req.label} className="flex items-center gap-1 text-xs">
                                            <CheckCircle2
                                                className={`w-3 h-3 ${req.valid ? "text-green-500" : "text-muted-foreground"
                                                    }`}
                                            />
                                            <span className={req.valid ? "text-foreground" : "text-muted-foreground"}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Root Error */}
                            {errors.root && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
                                    {errors.root.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        Update Password
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
