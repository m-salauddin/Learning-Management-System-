"use client";

import { motion } from "motion/react";
import { Sparkles, BookOpen, Check, Code2, Users, Trophy, Target } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

const FEATURE_ITEMS = [
    { icon: Code2, title: "Hands-On Projects", description: "Build real applications for your portfolio", color: "secondary" },
    { icon: Users, title: "Community Support", description: "Join 50,000+ active learners", color: "accent" },
    { icon: Trophy, title: "Job Placement", description: "95% placement rate within 6 months", color: "success" },
    { icon: Target, title: "Skill Tracking", description: "GitHub-style learning streaks", color: "warning" },
] as const;

const COURSE_FEATURES = ["Video Lessons", "Live Sessions", "Projects", "Mentorship"] as const;

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-muted/30" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Why Choose Us
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                        Everything you need to
                        <br />
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            succeed in tech
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From zero to hero with our comprehensive learning ecosystem
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {/* Large Feature Card */}
                    <motion.div
                        variants={staggerItem}
                        className="lg:col-span-2 lg:row-span-2 group relative"
                    >
                        <div className="relative h-full p-8 rounded-3xl bg-linear-to-br from-primary/5 via-card/80 to-card/80 dark:from-primary/10 dark:via-card/60 dark:to-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 overflow-hidden group-hover:border-primary/30 transition-all duration-500">
                            {/* Animated background orb */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-700" />

                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                                    <BookOpen className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Expert-Led Courses</h3>
                                <p className="text-muted-foreground text-lg mb-6 max-w-md">
                                    Learn from industry professionals with real-world experience at Google, Meta, Amazon, and local tech giants.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {COURSE_FEATURES.map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-sm group/item">
                                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center group-hover/item:bg-primary/30 transition-colors">
                                                <Check className="w-3 h-3 text-primary" />
                                            </div>
                                            <span className="group-hover/item:text-foreground transition-colors">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Regular Feature Cards */}
                    {FEATURE_ITEMS.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            className="group relative h-full"
                        >
                            <div className="relative h-full p-6 rounded-3xl bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 hover:border-primary/30 transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 overflow-hidden">
                                {/* Shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                </div>

                                {/* Icon */}
                                <div
                                    className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-${feature.color}`}
                                >
                                    <feature.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
