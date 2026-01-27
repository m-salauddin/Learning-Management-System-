"use client";

import * as React from "react";
import { motion } from "motion/react";
import { GraduationCap, Users, Briefcase, Star, LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatItem {
    icon: LucideIcon;
    value: number;
    suffix: string;
    label: string;
    color: string;
    decimals?: number;
}

const STATS: StatItem[] = [
    { icon: GraduationCap, value: 200, suffix: "+", label: "Expert Courses", color: "primary" },
    { icon: Users, value: 50, suffix: "K+", label: "Active Learners", color: "secondary" },
    { icon: Briefcase, value: 95, suffix: "%", label: "Job Placement Rate", color: "success" },
    { icon: Star, value: 4.9, suffix: "", label: "Average Rating", color: "warning", decimals: 1 },
];

export function AboutStatsSection() {
    return (
        <section className="relative py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            className="group relative"
                        >
                            <div className="relative p-6 rounded-3xl bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 hover:border-primary/30 transition-all duration-500 text-center group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden">
                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`w-7 h-7 text-${stat.color}`} />
                                </div>
                                <p className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                                </p>
                                <p className="text-muted-foreground text-sm">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
