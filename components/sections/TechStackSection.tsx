"use client";

import * as React from "react";
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiNodedotjs,
    SiSpring,
    SiPython,
    SiAmazonwebservices,
    SiDocker,
    SiPostgresql,
    SiMongodb,
    SiTailwindcss,
    SiGit,
} from "react-icons/si";

const TECH_STACK = [
    { name: "React", icon: SiReact, color: "text-cyan-400" },
    { name: "Next.js", icon: SiNextdotjs, color: "text-foreground" },
    { name: "TypeScript", icon: SiTypescript, color: "text-blue-500" },
    { name: "Node.js", icon: SiNodedotjs, color: "text-green-500" },
    { name: "Spring Boot", icon: SiSpring, color: "text-green-400" },
    { name: "Python", icon: SiPython, color: "text-yellow-400" },
    { name: "AWS", icon: SiAmazonwebservices, color: "text-orange-400" },
    { name: "Docker", icon: SiDocker, color: "text-blue-400" },
    { name: "PostgreSQL", icon: SiPostgresql, color: "text-sky-400" },
    { name: "MongoDB", icon: SiMongodb, color: "text-green-500" },
    { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400" },
    { name: "Git", icon: SiGit, color: "text-orange-500" },
] as const;

interface TechMarqueeProps {
    direction?: "left" | "right";
}

export function TechMarquee({ direction = "left" }: TechMarqueeProps) {
    return (
        <div className={`marquee-track ${direction === "right" ? "marquee-track-reverse" : ""}`}>
            {/* Duplicate items for seamless loop */}
            {[...TECH_STACK, ...TECH_STACK].map((tech, index) => (
                <div
                    key={`${tech.name}-${index}`}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card/80 border border-border hover:border-primary/40 transition-colors duration-200 shrink-0"
                >
                    <tech.icon className={`w-5 h-5 ${tech.color}`} />
                    <span className="font-medium whitespace-nowrap">{tech.name}</span>
                </div>
            ))}
        </div>
    );
}

export function TechStackSection() {
    return (
        <section className="relative py-16 border-y border-border/50">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="text-center">
                    <p className="text-sm font-medium text-primary mb-2 tracking-wider uppercase">
                        Industry-Ready Skills
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                        Master the Technologies That Matter
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Learn the most in-demand technologies used by top companies worldwide. Our curriculum is constantly updated to match industry needs.
                    </p>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative">
                {/* First Marquee Row */}
                <div className="marquee-container mb-4">
                    <TechMarquee direction="left" />
                </div>

                {/* Second Marquee Row */}
                <div className="marquee-container">
                    <TechMarquee direction="right" />
                </div>
            </div>
        </section>
    );
}
