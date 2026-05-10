"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    gradient: string;
    bio: string;
}

export function AboutTeamSection() {
    const t = useTranslations("About.Team");

    const TEAM: TeamMember[] = [
        {
            name: t("members.shuvo.name"),
            role: t("members.shuvo.role"),
            avatar: "SR",
            gradient: "from-primary to-secondary",
            bio: t("members.shuvo.bio"),
        },
        {
            name: t("members.fatima.name"),
            role: t("members.fatima.role"),
            avatar: "FA",
            gradient: "from-violet-500 to-fuchsia-500",
            bio: t("members.fatima.bio"),
        },
        {
            name: t("members.tanvir.name"),
            role: t("members.tanvir.role"),
            avatar: "TH",
            gradient: "from-emerald-500 to-teal-500",
            bio: t("members.tanvir.bio"),
        },
        {
            name: t("members.nusrat.name"),
            role: t("members.nusrat.role"),
            avatar: "NJ",
            gradient: "from-orange-500 to-rose-500",
            bio: t("members.nusrat.bio"),
        },
    ];

    return (
        <section className="relative py-32 bg-muted/20 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-gentle-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-gentle-pulse" style={{ animationDelay: "1.5s" }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge icon={Users} className="mb-6">
                        {t("badge")}
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        {t("title1")}
                        <br />
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            {t("title2")}
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {TEAM.map((member, index) => (
                        <TeamCard key={index} member={member} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            variants={staggerItem}
            className="group relative rounded-3xl"
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight Border */}
            <motion.div
                className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            300px circle at ${mouseX}px ${mouseY}px,
                            var(--primary),
                            transparent 40%
                        )
                    `,
                }}
            />

            <div className="relative h-full p-6 rounded-3xl bg-card border border-border/50 dark:border-white/10 overflow-hidden text-center transition-colors duration-300">
                {/* Spotlight Background */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{
                        background: useMotionTemplate`
                            radial-gradient(
                                250px circle at ${mouseX}px ${mouseY}px,
                                color-mix(in srgb, var(--primary), transparent 90%),
                                transparent 80%
                            )
                        `,
                    }}
                />

                {/* Avatar Placeholder */}
                <div className={`relative w-20 h-20 rounded-full bg-linear-to-br ${member.gradient} p-[3px] mx-auto mb-5 shadow-xl`}>
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-xl font-bold relative z-10">
                        {member.avatar}
                    </div>
                </div>

                <h3 className="relative z-10 text-lg font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                    {member.name}
                </h3>
                <p className="relative z-10 text-sm text-primary font-medium mb-3">
                    {member.role}
                </p>
                <p className="relative z-10 text-sm text-muted-foreground">
                    {member.bio}
                </p>
            </div>
        </motion.div>
    );
}
