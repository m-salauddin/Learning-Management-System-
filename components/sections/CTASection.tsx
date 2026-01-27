"use client";

import { motion } from "motion/react";
import { ArrowRight, Code2, Check } from "lucide-react";

export function CTASection() {
    return (
        <section className="relative py-32 overflow-hidden">
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="group relative overflow-hidden rounded-[3rem] bg-background border border-border shadow-2xl"
                >
                    {/* Animated Mesh Gradient Background - Contained */}
                    <div className="absolute inset-0 opacity-100 dark:opacity-40 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-linear-to-br from-primary via-background to-secondary animate-gradient-xy" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
                    </div>

                    {/* Grid Overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px",
                        }}
                    />

                    {/* Content & Glass Layers */}
                    <div className="relative z-10 px-8 py-24 md:py-32 text-center">
                        {/* Central Glowing Orb (Behind Text) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/30 rounded-full blur-[100px] pointer-events-none opacity-50 animate-gentle-pulse" />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/40 border border-white/10 text-foreground font-medium text-sm mb-8 backdrop-blur-md shadow-sm"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                            <span className="tracking-wide">Admissions Open for Winter 2026</span>
                        </motion.div>

                        <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground mb-8 leading-[0.9]">
                            Build What <br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_auto] animate-text-shimmer">
                                Matters.
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                            From your first line of code to your first day at a tech giant. We're with you every step of the journey.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-30">
                            <button className="relative px-8 py-3.5 rounded-xl bg-foreground text-background font-bold text-base hover:opacity-90 transition-all duration-300 shadow-lg shadow-foreground/5 hover:scale-[1.02] active:scale-[0.98]">
                                <span className="flex items-center gap-2">
                                    Get Started Now
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </button>

                            <button className="px-8 py-3.5 rounded-xl bg-transparent border border-foreground/10 text-foreground font-semibold text-base hover:bg-foreground/5 transition-all duration-300 hover:border-foreground/20">
                                Explore Structure
                            </button>
                        </div>

                        {/* Floating Glass Cards - CSS animation only */}
                        <div className="absolute top-20 left-10 xl:left-24 hidden xl:block pointer-events-none animate-float">
                            <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/20 shadow-xl w-48 -rotate-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Code2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="h-2 w-16 bg-foreground/10 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-foreground/10 rounded-full" />
                                    <div className="h-2 w-2/3 bg-foreground/10 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute top-20 right-10 xl:right-24 hidden xl:block pointer-events-none animate-float"
                            style={{ animationDelay: "1s" }}
                        >
                            <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/20 shadow-xl w-48 rotate-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <div className="h-2 w-12 bg-foreground/10 rounded-full mb-1" />
                                        <div className="h-2 w-8 bg-foreground/10 rounded-full" />
                                    </div>
                                </div>
                                <div className="text-xs font-mono text-foreground/60 text-center bg-foreground/5 rounded py-1">
                                    &gt; Offer Accepted
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
