"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Users } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface TeamMember {
    name: string;
    role: string;
    avatar: string;
    gradient: string;
    bio: string;
}

const TEAM: TeamMember[] = [
    {
        name: "Shuvo Rahman",
        role: "Founder & CEO",
        avatar: "SR",
        gradient: "from-primary to-secondary",
        bio: "Former Google engineer with a passion for democratizing tech education.",
    },
    {
        name: "Fatima Ahmed",
        role: "Head of Curriculum",
        avatar: "FA",
        gradient: "from-violet-500 to-fuchsia-500",
        bio: "10+ years of experience in instructional design and EdTech.",
    },
    {
        name: "Tanvir Hassan",
        role: "CTO",
        avatar: "TH",
        gradient: "from-emerald-500 to-teal-500",
        bio: "Full-stack architect building the future of online learning.",
    },
    {
        name: "Nusrat Jahan",
        role: "Head of Community",
        avatar: "NJ",
        gradient: "from-orange-500 to-rose-500",
        bio: "Building bridges between learners, mentors, and industry leaders.",
    },
];

export function AboutTeamSection() {
    return (
        <section className="relative py-32 bg-muted/20 overflow-hidden">
            {/* Ambient Lights */}
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
                        The Team
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        Meet the
                        <br />
                        <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                            Dreamers
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        A passionate team of educators, engineers, and dreamers united by a common goal.
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
            {/* Dynamic Border Glow (Behind) */}
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
                {/* Cursor Follow Glow - Inner (Smaller Size) */}
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

                {/* Avatar */}
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
