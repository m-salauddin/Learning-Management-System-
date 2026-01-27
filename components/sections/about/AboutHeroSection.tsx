"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Globe, Star, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { FloatingCard } from "./FloatingCard";

export function AboutHeroSection() {
    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-32 pb-20">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-linear-to-br from-primary/20 via-accent/15 to-transparent rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 animate-gentle-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-secondary/20 via-primary/15 to-transparent rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 animate-gentle-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-gentle-pulse" style={{ animationDelay: "2s" }} />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                >
                    <Badge variant="default" className="mb-8 backdrop-blur-md shadow-sm">
                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                        Launched in 2026
                    </Badge>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 leading-[0.95]">
                        Empowering the
                        <br />
                        <span className="relative inline-block bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-size-[200%_auto] animate-text-shimmer">
                            Next Generation
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        We're on a mission to transform tech education in Bangladesh, making world-class learning accessible to every aspiring developer.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/courses"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-0.5 shadow-xl shadow-foreground/10"
                        >
                            Explore Courses
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-card hover:bg-card/80 font-bold text-lg border border-border/50 text-foreground transition-all duration-300"
                        >
                            Join Community
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Floating Cards */}
            <FloatingCard
                icon={Zap}
                title="Fast Track"
                subtitle="3x Faster Learning"
                glowColor="primary"
                position="top-left"
                showStatusDot
            />

            <FloatingCard
                icon={Globe}
                title="50K+ Learners"
                glowColor="secondary"
                position="top-right"
                animationDelay="1.5s"
            >
                <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex -space-x-1">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-linear-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 border border-card" />
                        ))}
                    </div>
                    <span className="text-[10px] text-success font-medium">+2.5k this week</span>
                </div>
            </FloatingCard>

            <FloatingCard
                icon={Star}
                title="4.9"
                glowColor="warning"
                position="bottom-left"
                animationDelay="2.5s"
            >
                <div className="flex items-center gap-1">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-warning fill-warning" />
                        ))}
                    </div>
                </div>
                <p className="text-[11px] text-muted-foreground">2,847 Reviews</p>
            </FloatingCard>

            <FloatingCard
                icon={Award}
                title="95% Placement"
                glowColor="success"
                position="bottom-right"
                animationDelay="3.5s"
            >
                <div className="mt-1 w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-[95%] rounded-full bg-linear-to-r from-success to-emerald-400" />
                </div>
            </FloatingCard>
        </section>
    );
}
