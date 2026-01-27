"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Rocket, BookOpen, TrendingUp, Globe, LucideIcon } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface TimelineItem {
    year: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

const TIMELINE: TimelineItem[] = [
    {
        year: "2026",
        title: "The Beginning",
        description: "SkillSyncBD was founded with a vision to transform tech education in Bangladesh.",
        icon: Rocket,
    },
    {
        year: "2026",
        title: "First Cohort",
        description: "Launched our first batch of courses with 500 students across 5 programs.",
        icon: BookOpen,
    },
    {
        year: "2026",
        title: "Growing Strong",
        description: "Expanded to 50,000+ learners with partnerships from leading tech companies.",
        icon: TrendingUp,
    },
    {
        year: "Future",
        title: "Global Vision",
        description: "Expanding across South Asia to make quality tech education accessible to all.",
        icon: Globe,
    },
];

export function AboutTimelineSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <Badge icon={Rocket} className="mb-6">
                        Our Journey
                    </Badge>
                    <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
                        The Road
                        <br />
                        <span className="bg-linear-to-r from-secondary to-primary bg-clip-text text-transparent">
                            We're Building
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        From a small idea to Bangladesh's leading tech education platform – and we're just getting started.
                    </p>
                </motion.div>

                {/* Timeline */}
                <TimelineContainer />
            </div>
        </section>
    );
}

function TimelineContainer() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    return (

        <div ref={containerRef} className="relative">
            {/* Timeline Line Base */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/50 hidden lg:block" />

            {/* Scroll Progress Line */}
            <motion.div
                className="absolute left-1/2 top-0 w-px bg-linear-to-b from-primary via-secondary to-primary hidden lg:block origin-top"
                style={{ height: "100%", scaleY: scrollYProgress, willChange: "transform" }}
            />


            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-12 lg:space-y-0"
            >
                {TIMELINE.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={staggerItem}
                        className={`relative lg:grid lg:grid-cols-2 lg:gap-8 ${index !== TIMELINE.length - 1 ? 'lg:pb-16' : ''}`}
                    >
                        {/* Content */}
                        <div className={`${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:col-start-2 lg:pl-12'}`}>
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -40 : 40,
                                    scale: 0.95
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                style={{ willChange: "opacity, transform" }}
                                className={`${index % 2 === 0 ? 'lg:ml-auto lg:mr-0' : ''} max-w-md`}
                            >
                                <div className="group relative rounded-2xl bg-card border border-border/50 shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
                                    {/* Top Side Glowing Border */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
                                    <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-primary/10 to-transparent" />

                                    {/* Card Content */}
                                    <div className="relative p-6 pt-8">
                                        {/* Header Row */}
                                        <div className={`flex items-center gap-4 mb-5 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                                            {/* Gradient Icon */}
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.1 + 0.2,
                                                    ease: "backOut"
                                                }}
                                                className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/20"
                                            >
                                                <item.icon className="w-6 h-6 text-white" />
                                            </motion.div>

                                            {/* Year Badge */}
                                            <div className={`flex flex-col ${index % 2 === 0 ? 'items-end' : 'items-start'}`}>
                                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Milestone</span>
                                                <span className="text-lg font-bold text-primary">{item.year}</span>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Center Dot - Now responsive to scroll using shared value */}
                        <TimelineDot index={index} total={TIMELINE.length} scrollYProgress={scrollYProgress} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

function TimelineDot({ index, total, scrollYProgress }: { index: number; total: number; scrollYProgress: any }) {
    // Calculate progress based on index approximately
    const progressStart = index / total;

    // Animate the dot when the scroll line passes it
    // Use opacity instead of booleans for smoother rendering
    const activeOpacity = useTransform(scrollYProgress, (value) => {
        // @ts-ignore
        return value > progressStart + 0.05 ? 1 : 0;
    });

    const scale = useTransform(scrollYProgress, (value) => {
        // @ts-ignore
        return value > progressStart + 0.05 ? 1.5 : 1;
    });

    return (
        <motion.div
            style={{ scale }}
            className="absolute left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-4 border-border hidden lg:block z-10 transition-colors duration-300"
        >
            <motion.div
                style={{ opacity: activeOpacity }}
                className="absolute inset-0 rounded-full bg-primary"
            />
        </motion.div>
    );
}
