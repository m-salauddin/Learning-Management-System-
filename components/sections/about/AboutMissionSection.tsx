"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Target, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

export function AboutMissionSection() {
    const t = useTranslations("About.Mission");
    const MISSION_POINTS = t.raw("points") as string[];

    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-gentle-pulse" />
                <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] animate-gentle-pulse" style={{ animationDelay: "1.5s" }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Mission Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge icon={Target} className="mb-6">
                            {t("badge")}
                        </Badge>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                            {t("title1")}
                            <br />
                            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {t("title2")}
                            </span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            {t("description")}
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

                    {/* Vision Card Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="group relative p-8 lg:p-12 rounded-[2.5rem] bg-linear-to-br from-primary/10 via-card/80 to-card/80 dark:from-primary/15 dark:via-card/60 dark:to-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 overflow-hidden">
                            {/* Card Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700" />
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Rocket className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold mb-4">{t("vision.title")}</h3>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    {t("vision.description")}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
                                    <div>
                                        <p className="text-3xl font-bold text-primary">{t("vision.stat1")}</p>
                                        <p className="text-sm text-muted-foreground">{t("vision.stat1Label")}</p>
                                    </div>
                                    <div>
                                        <p className="text-3xl font-bold text-secondary">{t("vision.stat2")}</p>
                                        <p className="text-sm text-muted-foreground">{t("vision.stat2Label")}</p>
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
