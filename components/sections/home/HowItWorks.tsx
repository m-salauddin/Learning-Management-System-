"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { UserPlus, MousePointerClick, PlayCircle, LayoutDashboard, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const steps = [
    {
        id: 1,
        title: "Create an account",
        details: [
            "Visit our registration page",
            "Fill in your personal details",
            "Verify your email address",
            "Complete your student profile"
        ],
        icon: UserPlus
    },
    {
        id: 2,
        title: "Select course/career path",
        details: [
            "Browse our extensive course catalog",
            "Filter by your interest or skill level",
            "Read course curriculum and reviews",
            "Choose a path that aligns with your goals"
        ],
        icon: MousePointerClick
    },
    {
        id: 3,
        title: "Enroll in the course",
        details: [
            "Add your chosen course to cart",
            "Proceed to secure checkout",
            "Select your preferred payment method",
            "Get instant access to learning materials"
        ],
        icon: PlayCircle
    },
    {
        id: 4,
        title: "Open course dashboard",
        details: [
            "Access your personalized dashboard",
            "View video lessons and assignments",
            "Participate in quizzes and tests",
            "Track your progress and earn certificates"
        ],
        icon: LayoutDashboard
    }
];



const smoothEasing = [0.16, 1, 0.3, 1] as const; // Premium smooth decelerate

const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: smoothEasing }
    }
};

const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1
        }
    }
};

const contentTransitionVariants = {
    initial: { opacity: 0, y: -20, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: { opacity: 0, y: 20, filter: "blur(10px)" }
};

export function HowItWorks() {
    const [activeStepId, setActiveStepId] = useState(1);
    const shouldReduceMotion = useReducedMotion();

    const activeStep = steps.find(s => s.id === activeStepId) || steps[0];

    return (
        <section className="py-24 relative overflow-hidden bg-background">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header Section - Moved to Top */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex mb-4">
                        <Badge icon={PlayCircle}>
                            How it works
                        </Badge>
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                        Start your journey in
                        <br />
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            4 simple steps
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Follow our professional roadmap to master new skills and accelerate your career with expert-led training.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">

                    {/* Left Side - Dynamic Instruction Content */}
                    <div className="relative group lg:sticky lg:top-32 h-fit">
                        {/* Content Container with Premium Glass Effect */}
                        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-card/30 backdrop-blur-3xl  p-8 md:p-12 flex flex-col min-h-[560px] isolation-auto">
                            {/* Glass Sheen Effect */}
                            <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />

                            {/* Animated Content Switching */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep.id}
                                    variants={shouldReduceMotion ? undefined : contentTransitionVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5, ease: smoothEasing }}
                                    className="flex flex-col h-full"
                                >
                                    {/* Icon & Title Header */}
                                    <div className="flex items-center gap-6 mb-10 relative">
                                        <div className="relative group/icon">
                                            <div className="absolute inset-0 bg-primary/40 blur-xl scale-75 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                                            <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-2xl backdrop-blur-md">
                                                <activeStep.icon className="w-8 h-8" />
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-foreground transition-all duration-500">
                                                {activeStep.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-8 h-px bg-primary/40" />
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Phased Progress 0{activeStep.id}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Instructions List */}
                                    <div className="space-y-3 grow">
                                        {activeStep.details.map((detail, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1 + idx * 0.1, duration: 0.4, ease: smoothEasing }}
                                                className="group flex items-start gap-4 p-4 rounded-xl border bg-background/50 hover:bg-background/80 border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                                            >
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 text-background transition-all duration-300">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                <span className="text-sm sm:text-base text-foreground/80 font-medium leading-relaxed group-hover:text-foreground transition-colors">
                                                    {detail}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Bottom CTA with Custom Separator */}
                                    <div className="mt-auto pt-10 relative">
                                        {/* Gradient Separator */}
                                        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border/60 to-transparent opacity-50" />

                                        <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5  border border-primary/10">
                                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
                                                <span className="text-primary font-bold">Ready to start?</span>
                                            </div>
                                            <div className="flex -space-x-3 transition-all duration-500 hover:-space-x-1">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background ring-2 ring-border/20 overflow-hidden bg-muted transition-transform hover:scale-110 hover:z-20">
                                                        <Image src={`https://i.pravatar.cc/100?img=${15 + i}`} alt="user" width={32} height={32} className="object-cover" />
                                                    </div>
                                                ))}
                                                <div className="w-8 h-8 rounded-full border-2 border-background ring-2 ring-border/20 bg-muted flex items-center justify-center text-[10px] font-bold text-foreground z-10">
                                                    +5k
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Background decoration inside card */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10 mix-blend-screen" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 -z-10" />
                        </div>


                        {/* Ambient Background Glow */}
                        <div className="absolute -z-40 -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] opacity-30 pointer-events-none" />
                    </div>

                    {/* Right Side - Interactive Steps List */}
                    <div className="relative pt-4">
                        <motion.div
                            className="relative pl-2"
                            variants={shouldReduceMotion ? undefined : staggerContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {steps.map((step, index) => {
                                const isActive = activeStepId === step.id;
                                const isLastStep = index === steps.length - 1;

                                return (
                                    <div key={step.id} className={`relative flex items-center gap-6 group/step ${isLastStep ? "" : "pb-10"}`}>
                                        {/* Connector Line with Gap */}
                                        {!isLastStep && (
                                            <div className="absolute left-7 top-19.5 bottom-6 h-16 w-px -translate-x-1/2 rounded-full bg-border transition-colors duration-500" />
                                        )}

                                        {/* Horizontal Connector Line to Card */}
                                        <div className="absolute left-15 top-11 h-px w-4 bg-border transition-colors duration-500" />

                                        {/* Timeline Indicator */}
                                        <button
                                            onClick={() => setActiveStepId(step.id)}
                                            className={`relative z-10 shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-lg font-black border transition-all duration-700 outline-none
                                                ${isActive
                                                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_40px_-5px_var(--primary)]"
                                                    : "bg-background/20 text-muted-foreground border-border backdrop-blur-xl group-hover/step:border-primary/40 group-hover/step:text-foreground group-hover/step:bg-background/40"
                                                }
                                            `}
                                        >
                                            {/* Concentric Aura for Active State */}
                                            {isActive && (
                                                <div className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-20" />
                                            )}
                                            {isActive && (
                                                <div className="absolute -inset-2 rounded-full border border-primary/20 animate-pulse" />
                                            )}

                                            <AnimatePresence mode="wait">
                                                {isActive ? (
                                                    <motion.div
                                                        key="check"
                                                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                        exit={{ scale: 0.5, opacity: 0, rotate: 45 }}
                                                        transition={{ duration: 0.4, ease: smoothEasing }}
                                                    >
                                                        <Check className="w-6 h-6 stroke-[3]" />
                                                    </motion.div>
                                                ) : (
                                                    <motion.span
                                                        key="number"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="font-black"
                                                    >
                                                        {step.id}
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </button>

                                        {/* Content Card - Premium Look */}
                                        <motion.button
                                            onClick={() => setActiveStepId(step.id)}
                                            className={`flex-1 flex items-center gap-5 p-5 rounded-2xl border transition-all duration-500 text-left outline-none relative overflow-hidden
                                                ${isActive
                                                    ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5"
                                                    : "bg-surface/50 border-border/50 hover:bg-surface"
                                                }
                                            `}
                                        >
                                            {/* Active Glow Effect */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-primary/5 blur-xl -z-10" />
                                            )}

                                            {/* Icon Box */}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500
                                                ${isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "dark:bg-card bg-border/15 text-muted-foreground"
                                                }
                                            `}>
                                                <step.icon className="w-5 h-5" />
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex flex-col">
                                                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1 transition-colors duration-500
                                                    ${isActive ? "text-primary" : "text-muted-foreground"}
                                                `}>
                                                    Step 0{step.id}
                                                </span>
                                                <h3 className={`font-bold text-base sm:text-lg leading-tight transition-colors duration-500
                                                    ${isActive ? "text-foreground" : "text-muted-foreground group-hover/step:text-foreground"}
                                                `}>
                                                    {step.title}
                                                </h3>
                                            </div>
                                        </motion.button>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
