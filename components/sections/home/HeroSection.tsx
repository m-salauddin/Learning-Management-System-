"use client";
import * as React from "react";
import { useInView } from "motion/react";
import { useTranslations } from "next-intl";
import {
    Users,
    Star,
    GraduationCap,
    Briefcase,
    Trophy,
    Check,
    Rocket,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";

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
    const t = useTranslations("Hero");
    const tc = useTranslations("Common");

    return (
        <section
            id="hero"
            suppressHydrationWarning
            className="relative w-full flex items-center justify-center pt-20 pb-16 border-b-4 border-red-500"
            style={{ height: '100vh', minHeight: '100vh', maxHeight: '100vh' }}
        >
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <div className="inline-flex mb-8 animate-fade-in-down">
                        <Badge icon={Rocket} className="px-6 py-2">
                            {t("badge")}
                        </Badge>
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight mb-10 animate-fade-in-up">
                        {t("title1")}
                        <br />
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-sm">
                            {t("title2")}
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground/80 mb-12 max-w-2xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {t("description")}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <PrimaryCTAButton href="#courses" isAnchor className="min-w-[200px]">
                            {tc("getStarted")}
                        </PrimaryCTAButton>
                        <SecondaryCTAButton href="/courses" className="min-w-[200px]">
                            {tc("exploreCourses")}
                        </SecondaryCTAButton>
                    </div>
                </div>
            </div>


            <div className="absolute top-[22%] left-[5%] xl:left-[8%] hidden md:block animate-float" style={{ animationDelay: '0s' }}>
                <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl flex items-center gap-4 group hover:border-primary/50 transition-colors duration-500">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold leading-none mb-1">200+</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("expertCourses")}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[12%] left-[5%] xl:left-[8%] hidden lg:block animate-float" style={{ animationDelay: '2s' }}>
                <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl flex items-center gap-4 group hover:border-warning/50 transition-colors duration-500">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning">
                        <Star className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                        <div className="flex items-center gap-0.5 mb-1">
                            <p className="text-2xl font-bold leading-none mr-2">4.9</p>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="w-3 h-3 text-warning fill-current" />
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">50,000+ Reviews</p>
                    </div>
                </div>
            </div>

            <div className="absolute top-[28%] right-[5%] xl:right-[8%] hidden md:block animate-float" style={{ animationDelay: '1s' }}>
                <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl flex items-center gap-4 group hover:border-secondary/50 transition-colors duration-500">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold leading-none mb-1">50K+</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("activeLearners")}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-[12%] right-[5%] xl:right-[8%] hidden lg:block animate-float" style={{ animationDelay: '3.5s' }}>
                <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-2xl flex flex-col gap-3 group hover:border-success/50 transition-colors duration-500 min-w-[160px]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <p className="text-xl font-bold">95%</p>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success w-[95%] rounded-full animate-pulse" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{t("jobPlacement")}</p>
                </div>
            </div>
        </section>
    );
}
