"use client";

import * as React from "react";
import { useInView } from "motion/react";
import {
    Users,
    Star,
    GraduationCap,
    Briefcase,
    Trophy,
    Check,
    ArrowRight,
    Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Animated Stat Card Component with Counter
function AnimatedStatCard({
    icon: Icon,
    end,
    suffix = "",
    label,
    color,
    bgColor,
    decimals = 0,
}: {
    icon: React.ElementType;
    end: number;
    suffix?: string;
    label: string;
    color: string;
    bgColor: string;
    decimals?: number;
}) {
    const [count, setCount] = React.useState(0);
    const ref = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    React.useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = start + (end - start) * easeOutQuart;

            setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.floor(current));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, decimals]);

    return (
        <div ref={ref} className="text-center">
            <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center mx-auto mb-2`}>
                <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold tracking-tight">
                {count.toLocaleString()}{suffix}
            </p>
            <p className="text-muted-foreground text-xs mt-1">{label}</p>
        </div>
    );
}

export function HeroSection() {
    return (
        <section id="hero" className="relative min-h-screen overflow-visible pt-32 pb-20">
            {/* Background Layers */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Mesh - optimized blur */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-2xl translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-secondary/15 via-primary/10 to-transparent rounded-full blur-2xl -translate-x-1/4 translate-y-1/4" />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <div className="text-center lg:text-left animate-fade-in-up">
                        {/* Badge */}
                        <div className="inline-flex mb-8">
                            <Badge icon={Rocket}>
                                Start Your Learning Journey on 2026
                            </Badge>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                            Build What
                            <br />
                            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                Matters.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            From your first line of code to your first day at a tech giant. We’re with you every step of the journey.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-row flex-wrap gap-4 justify-center lg:justify-start mb-12">
                            <Button size="responsive" className="group">
                                Get Started Now
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform ml-2" />
                            </Button>
                            <Button variant="premium" size="responsive">
                                Explore Structure
                            </Button>
                        </div>

                        {/* Social Proof */}
                        <div className="flex items-center gap-6 justify-center lg:justify-start">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-2 border-background flex items-center justify-center text-xs font-medium"
                                    >
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <strong className="text-foreground">50,000+</strong> learners joined
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right - Stats Cards */}
                    <div className="relative mt-12 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {/* Top Badge */}
                        <div className="flex justify-end mb-4">
                            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-linear-to-r from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/20">
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold">Top Rated</p>
                                    <p className="text-white/90 text-sm">BD Platform</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Stats Card */}
                        {/* Main Stats Card */}
                        <div className="lg:p-5 lg:rounded-3xl lg:bg-card/80 lg:border lg:border-border lg:shadow-2xl">
                            <div className="grid grid-cols-2 gap-3 lg:gap-0">
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4 lg:border-r lg:border-b lg:border-border/50">
                                    <AnimatedStatCard
                                        icon={GraduationCap}
                                        end={200}
                                        suffix="+"
                                        label="Expert Courses"
                                        color="text-primary"
                                        bgColor="bg-primary/10"
                                    />
                                </div>
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4 lg:border-b lg:border-border/50">
                                    <AnimatedStatCard
                                        icon={Users}
                                        end={50}
                                        suffix="K+"
                                        label="Active Learners"
                                        color="text-secondary"
                                        bgColor="bg-secondary/10"
                                    />
                                </div>
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4 lg:border-r lg:border-border/50">
                                    <AnimatedStatCard
                                        icon={Briefcase}
                                        end={95}
                                        suffix="%"
                                        label="Job Placement"
                                        color="text-success"
                                        bgColor="bg-success/10"
                                    />
                                </div>
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4">
                                    <AnimatedStatCard
                                        icon={Star}
                                        end={4.9}
                                        suffix=""
                                        label="Average Rating"
                                        color="text-warning"
                                        bgColor="bg-warning/10"
                                        decimals={1}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bottom Badge */}
                        <div className="flex justify-start mt-4">
                            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-card border border-border shadow-xl">
                                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-success" />
                                </div>
                                <div>
                                    <p className="font-semibold">Certificate Verified</p>
                                    <p className="text-muted-foreground text-sm">Industry recognized</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
