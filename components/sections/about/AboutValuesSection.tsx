"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Heart, Lightbulb, Code2, Users, LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface ValueItem {
    icon: LucideIcon;
    title: string;
    description: string;
    gradient: string;
}

const VALUES: ValueItem[] = [
    {
        icon: Lightbulb,
        title: "Innovation First",
        description: "We constantly push boundaries to deliver cutting-edge learning experiences that prepare you for tomorrow's challenges.",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        icon: Heart,
        title: "Student-Centric",
        description: "Every feature, every course, every decision is made with our learners' success as the primary focus.",
        gradient: "from-rose-500 to-pink-600",
    },
    {
        icon: Code2,
        title: "Practical Learning",
        description: "Learn by building real projects. Our hands-on approach ensures you're job-ready from day one.",
        gradient: "from-cyan-500 to-blue-600",
    },
    {
        icon: Users,
        title: "Community Driven",
        description: "Join a thriving community of 50,000+ developers who support, mentor, and grow together.",
        gradient: "from-violet-500 to-purple-600",
    },
];

export function AboutValuesSection() {
    return (
        <section className="relative py-32 bg-muted/20 overflow-hidden">
            {/* Ambient Lights */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px] animate-gentle-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[100px] animate-gentle-pulse" style={{ animationDelay: "2s" }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge icon={Heart} iconClassName="text-rose-500" className="mb-6">
                        What Drives Us
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        Our Core
                        <br />
                        <span className="bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            Values
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        These principles guide everything we do, from course design to community building.
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {VALUES.map((value, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            className="group relative"
                        >
                            <div className="relative h-full p-6 rounded-3xl bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 hover:border-primary/30 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl overflow-hidden">
                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${value.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <value.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
