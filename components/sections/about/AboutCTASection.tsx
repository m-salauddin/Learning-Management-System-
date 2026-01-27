"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, Code2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function AboutCTASection() {
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
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-100 dark:opacity-40 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-linear-to-br from-primary via-background to-secondary animate-gradient-xy" />
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" />
                    </div>

                    {/* Grid Overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px",
                        }}
                    />

                    {/* Content */}
                    <div className="relative z-10 px-8 py-20 md:py-28 text-center">
                        {/* Glowing Orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] bg-primary/30 rounded-full blur-[80px] pointer-events-none opacity-50 animate-gentle-pulse" />

                        <Badge variant="default" className="mb-8 backdrop-blur-md shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse mr-2" />
                            <span className="tracking-wide">Join 50,000+ Learners</span>
                        </Badge>

                        <h2 className="relative text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground mb-6 leading-[0.95]">
                            Ready to Start
                            <br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_auto] animate-text-shimmer">
                                Your Journey?
                            </span>
                        </h2>

                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join Bangladesh's most ambitious community of developers. Your success story starts here.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-bold text-lg hover:opacity-90 transition-all duration-300 shadow-xl shadow-foreground/10 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/courses"
                                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-transparent border border-foreground/10 text-foreground font-semibold text-lg hover:bg-foreground/5 transition-all duration-300 hover:border-foreground/20"
                            >
                                Browse Courses
                            </Link>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div className="absolute top-16 left-8 xl:left-20 hidden xl:block pointer-events-none animate-float">
                        <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/20 shadow-xl w-40 -rotate-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <Code2 className="w-4 h-4 text-primary" />
                                </div>
                                <div className="h-2 w-16 bg-foreground/10 rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-16 right-8 xl:right-20 hidden xl:block pointer-events-none animate-float" style={{ animationDelay: "1s" }}>
                        <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-xl border border-white/20 shadow-xl w-44 rotate-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Certified</p>
                                    <p className="text-[10px] text-muted-foreground">Developer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
