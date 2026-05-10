"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Sparkles, Zap, Globe, Star, Award } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import { FloatingCard } from "./FloatingCard";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";

export function AboutHeroSection() {
    const t = useTranslations("About.Hero");
    return (
        <section
            className="relative w-full flex items-center justify-center overflow-hidden"
            style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-linear-to-br from-primary/20 via-accent/15 to-transparent rounded-full blur-3xl translate-x-1/4 -translate-y-1/4 animate-gentle-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-secondary/20 via-primary/15 to-transparent rounded-full blur-3xl -translate-x-1/4 translate-y-1/4 animate-gentle-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] animate-gentle-pulse" style={{ animationDelay: "2s" }} />

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
                        {t("badge")}
                    </Badge>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-8 leading-[0.95]">
                        {t("title1")}
                        <br />
                        <span className="relative inline-block bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-size-[200%_auto] animate-text-shimmer">
                            {t("title2")}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                        {t("description")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryCTAButton href="/courses">
                            {t("exploreCourses")}
                        </PrimaryCTAButton>
                        <SecondaryCTAButton href="/register">
                            {t("joinCommunity")}
                        </SecondaryCTAButton>
                    </div>
                </motion.div>
            </div>

            <FloatingCard
                icon={Zap}
                title={t("fastTrack")}
                subtitle={t("fasterLearning")}
                glowColor="primary"
                position="top-left"
                showStatusDot
            />

            <FloatingCard
                icon={Globe}
                title={t("learnersCount")}
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
                    <span className="text-[10px] text-success font-medium">{t("weeklyJoined")}</span>
                </div>
            </FloatingCard>

            <FloatingCard
                icon={Star}
                title={t("rating")}
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
                <p className="text-[11px] text-muted-foreground">{t("reviews", { count: 2847 })}</p>
            </FloatingCard>

            <FloatingCard
                icon={Award}
                title={t("placement", { percent: 95 })}
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
