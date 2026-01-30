"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { fadeInUp } from "@/lib/motion";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { signup, signInWithGoogle, signInWithGithub } from "@/app/auth/actions";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/features/auth/authSlice";
import { useToast } from "@/components/ui/toast";


const registerSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms and conditions",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;


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

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const toast = useToast();

    const {
        register,
        handleSubmit,
        watch,
        control,
        setError,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            agreeToTerms: false,
        },
    });

    const password = watch("password", "");
    const passwordStrength = getPasswordStrength(password);

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        const loadingToastId = toast.loading("Creating Account...", "Please wait while we set up your account.");
        try {
            const result = await signup(data);
            if (result?.error) {
                toast.dismiss(loadingToastId);
                let errorMessage = result.error;
                if (errorMessage.toLowerCase().includes("rate limit")) {
                    errorMessage = "Too many attempts. Please wait a minute.";
                }
                toast.error("Registration Failed", errorMessage);
            } else if (result?.session && result?.user) {
                toast.dismiss(loadingToastId);
                toast.success("Welcome to DokkhotaIT!", `Account created for ${result.user.user_metadata?.full_name || result.user.email}`);

                // Removed manual dispatch to rely on AuthListener
                router.push('/');
                router.refresh();
            } else {
                toast.dismiss(loadingToastId);
                setIsSuccess(true);
            }
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error("An error occurred", "Something went wrong. Please try again.");
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

                    <div className="bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">

                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-4">
                                <Logo />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                            <p className="text-muted-foreground text-sm">
                                Start your learning journey today
                            </p>
                        </div>


                        {isSuccess ? (
                            <div className="text-center py-8 space-y-4">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-xl">Check your email</h3>
                                <p className="text-muted-foreground">
                                    We've sent a verification link to <span className="font-medium text-foreground">{watch("email")}</span>.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 mt-4"
                                >
                                    Go to Sign In <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                    <div className="space-y-2">
                                        <label htmlFor="fullName" className="block text-sm font-medium">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                {...register("fullName")}
                                                type="text"
                                                id="fullName"
                                                placeholder="John Doe"
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border ${errors.fullName
                                                    ? "border-destructive focus:ring-destructive"
                                                    : "border-border/50 focus:ring-primary"
                                                    } focus:outline-none focus:ring-2 transition-all duration-200`}
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <p className="text-destructive text-xs mt-1">
                                                {errors.fullName.message}
                                            </p>
                                        )}
                                    </div>


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


                                    <div className="space-y-2">
                                        <label htmlFor="password" className="block text-sm font-medium">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                {...register("password")}
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                placeholder="Create a strong password"
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


                                    <div className="space-y-2">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <input
                                                {...register("confirmPassword")}
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                placeholder="Confirm your password"
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


                                    <div className="space-y-1">
                                        <Controller
                                            name="agreeToTerms"
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <AnimatedCheckbox
                                                    id="agreeToTerms"
                                                    checked={value}
                                                    onChange={onChange}
                                                    label={
                                                        <span>
                                                            I agree to the{" "}
                                                            <Link href="/terms" className="text-primary hover:underline">
                                                                Terms of Service
                                                            </Link>{" "}
                                                            and{" "}
                                                            <Link href="/privacy" className="text-primary hover:underline">
                                                                Privacy Policy
                                                            </Link>
                                                        </span>
                                                    }
                                                />
                                            )}
                                        />
                                        {errors.agreeToTerms && (
                                            <p className="text-destructive text-xs ml-8">
                                                {errors.agreeToTerms.message}
                                            </p>
                                        )}
                                    </div>




                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>


                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border/50" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-2 text-muted-foreground">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>


                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={async () => {
                                            const loadingToastId = toast.loading("Redirecting...", "Please wait while we redirect you to Google.");
                                            const result = await signInWithGoogle();
                                            if (result?.error) {
                                                toast.dismiss(loadingToastId);
                                                toast.error("Google Login Failed", result.error);
                                            }
                                        }}
                                        type="button"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Google
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const loadingToastId = toast.loading("Redirecting...", "Please wait while we redirect you to GitHub.");
                                            const result = await signInWithGithub();
                                            if (result?.error) {
                                                toast.dismiss(loadingToastId);
                                                toast.error("GitHub Login Failed", result.error);
                                            }
                                        }}
                                        type="button"
                                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        GitHub
                                    </button>
                                </div>


                                <p className="text-center text-sm text-muted-foreground mt-6">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-primary font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </main>

        </div>
    );
}
