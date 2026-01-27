"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Target, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const MISSION_POINTS = [
    "Industry-aligned curriculum designed with top tech companies",
    "Hands-on projects that build real portfolio pieces",
    "Mentorship from senior engineers at leading companies",
    "Job placement assistance and career guidance"
];

export function AboutMissionSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-gentle-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-gentle-pulse" style={{ animationDelay: "1.5s" }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge icon={Target} className="mb-6">
                            Our Mission
                        </Badge>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                            Bridging the
                            <br />
                            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                Skills Gap
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Bangladesh has incredible untapped potential. Our mission is to bridge the gap between education and industry, creating a new generation of world-class developers who can compete on the global stage.
                        </p>
                        <div className="space-y-4">
                            {MISSION_POINTS.map((item, i) => (
                                <div key={i} className="flex items-start gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/30 transition-colors">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    </div>
                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="group relative p-8 lg:p-12 rounded-[2.5rem] bg-linear-to-br from-primary/10 via-card/80 to-card/80 dark:from-primary/15 dark:via-card/60 dark:to-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Rocket className="w-8 h-8 text-primary" />
                                </div>

                                <h3 className="text-2xl lg:text-3xl font-bold mb-4">Our Vision</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    To become South Asia's leading tech education platform, producing 1 million skilled developers by 2030 and putting Bangladesh on the global tech map.
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                                    <div>
                                        <p className="text-3xl font-bold text-primary">1M+</p>
                                        <p className="text-sm text-muted-foreground">Developers by 2030</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-secondary">5</p>
                                        <p className="text-sm text-muted-foreground">Countries Targeted</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
