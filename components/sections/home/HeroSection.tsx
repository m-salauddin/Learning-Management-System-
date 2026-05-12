"use client";
import * as React from "react";
import { useInView, motion } from "motion/react";
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
        <div ref={ref} className="text-center p-4">
            <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <p className="text-2xl font-bold tracking-tight bg-linear-to-b from-foreground to-foreground/70 bg-clip-text">
                {count.toLocaleString()}{suffix}
            </p>
            <p className="text-muted-foreground text-xs font-medium mt-1 uppercase tracking-wider">{label}</p>
        </div>
    );
}

export type HeroStat = {
    label: string;
    value: number;
    suffix: string;
};

export function HeroSection({ avatars = [], stats = [], totalLearners = "50,000+" }: { avatars?: string[], stats?: HeroStat[], totalLearners?: string }) {
    const t = useTranslations("Hero");
    const tc = useTranslations("Common");

    // Default stats if none provided
    const defaultStats: HeroStat[] = [
        { label: t("activeLearners"), value: 200, suffix: "+" },
        { label: t("expertCourses"), value: 50, suffix: "+" },
        { label: t("mentors"), value: 15, suffix: "+" },
        { label: t("averageRating"), value: 4.9, suffix: "" }
    ];

    const displayStats = stats && stats.length > 0 ? stats : defaultStats;

    const displayAvatars = React.useMemo(() => {
        const fallbacks = [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=256&h=256&auto=format&fit=crop"
        ];
        
        // Merge provided avatars with fallbacks to ensure we always have 5
        const combined = [...avatars, ...fallbacks].slice(0, 5);
        return combined;
    }, [avatars]);

    return (
        <section id="hero" suppressHydrationWarning className="relative min-h-screen flex items-center overflow-visible pt-32 pb-20">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-linear-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-2xl translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-linear-to-tr from-secondary/15 via-primary/10 to-transparent rounded-full blur-2xl -translate-x-1/4 translate-y-1/4" />
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
                    <div className="text-center lg:text-left animate-fade-in-up">
                        <div className="inline-flex mb-8">
                            <Badge icon={Rocket}>
                                {t("badge")}
                            </Badge>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
                            {t("title1")}
                            <br />
                            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                {t("title2")}
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {t("description")}
                        </p>
                        <div className="flex flex-row flex-wrap gap-4 justify-center lg:justify-start mb-12">
                            <PrimaryCTAButton href="#courses" isAnchor>
                                {tc("getStarted")}
                            </PrimaryCTAButton>
                            <SecondaryCTAButton href="/courses">
                                {tc("exploreCourses")}
                            </SecondaryCTAButton>
                        </div>
                        <div suppressHydrationWarning className="flex items-center gap-6 justify-center lg:justify-start">
                            <div suppressHydrationWarning className="flex -space-x-3">
                                {displayAvatars.map((url, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        suppressHydrationWarning
                                        className="w-10 h-10 rounded-full border-2 border-background overflow-hidden shadow-sm hover:scale-110 transition-transform cursor-pointer relative z-10 bg-slate-100 dark:bg-slate-800"
                                    >
                                        <img 
                                            src={url} 
                                            alt={`Learner ${i + 1}`} 
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </motion.div>
                                ))}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: 1, 
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ 
                                        opacity: { delay: 1.1 },
                                        scale: { 
                                            delay: 1.1,
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary shadow-sm relative z-20 cursor-default"
                                >
                                    {totalLearners}
                                </motion.div>
                            </div>
                            <div suppressHydrationWarning className="text-left">
                                <div suppressHydrationWarning className="flex items-center gap-1 mb-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1.2 + i * 0.1, type: "spring", stiffness: 200 }}
                                            className="relative"
                                        >
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                        </motion.div>
                                    ))}
                                </div>
                                <motion.p 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.8 }}
                                    className="text-sm text-muted-foreground"
                                >
                                    <strong className="text-foreground">{t("learnersJoined", { count: totalLearners })}</strong>
                                </motion.p>
                            </div>
                        </div>
                    </div>
                        <motion.div 
                            suppressHydrationWarning 
                            className="relative mt-12 lg:mt-0 animate-fade-in-up" 
                            style={{ animationDelay: '0.2s' }}
                        >
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                suppressHydrationWarning 
                                className="flex justify-end mb-4"
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-linear-to-r from-primary via-accent to-secondary dark:from-primary dark:via-secondary dark:to-accent text-white dark:text-slate-950 shadow-lg shadow-primary/20 backdrop-blur-sm">
                                    <div className="w-10 h-10 rounded-xl bg-white/20 dark:bg-black/10 flex items-center justify-center">
                                        <Trophy className="w-5 h-5 text-white dark:text-slate-950" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{t("topRated")}</p>
                                        <p className="text-white/90 dark:text-slate-950/80 font-medium text-sm">{t("bdPlatform")}</p>
                                    </div>
                                </div>
                            </motion.div>
                        <div className="lg:p-5 lg:rounded-3xl lg:bg-card/80 lg:border lg:border-border lg:shadow-2xl">
                            <div className="grid grid-cols-2 gap-3 lg:gap-0">
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4 lg:border-r lg:border-b lg:border-border/50">
                                    <AnimatedStatCard
                                        icon={GraduationCap}
                                        end={displayStats[0]?.value ?? 200}
                                        suffix={displayStats[0]?.suffix ?? "+"}
                                        label={displayStats[0]?.label ?? t("activeLearners")}
                                        color="text-primary"
                                        bgColor="bg-primary/10"
                                    />
                                </div>
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4 lg:border-b lg:border-border/50">
                                    <AnimatedStatCard
                                        icon={Users}
                                        end={displayStats[1]?.value ?? 50}
                                        suffix={displayStats[1]?.suffix ?? "+"}
                                        label={displayStats[1]?.label ?? t("expertCourses")}
                                        color="text-secondary"
                                        bgColor="bg-secondary/10"
                                    />
                                </div>
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4 lg:border-r lg:border-border/50">
                                    <AnimatedStatCard
                                        icon={Briefcase}
                                        end={displayStats[2]?.value ?? 15}
                                        suffix={displayStats[2]?.suffix ?? "+"}
                                        label={displayStats[2]?.label ?? t("mentors")}
                                        color="text-success"
                                        bgColor="bg-success/10"
                                    />
                                </div>
                                <div className="bg-card/50 lg:bg-transparent border border-border/50 lg:border-0 rounded-2xl lg:rounded-none p-4">
                                    <AnimatedStatCard
                                        icon={Star}
                                        end={displayStats[3]?.value ?? 4.9}
                                        suffix={displayStats[3]?.suffix ?? ""}
                                        label={displayStats[3]?.label ?? t("averageRating")}
                                        color="text-warning"
                                        bgColor="bg-warning/10"
                                        decimals={(displayStats[3]?.value ?? 4.9) % 1 !== 0 ? 1 : 0}
                                    />
                                </div>
                            </div>
                        </div>
                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="flex justify-start mt-4"
                            >
                                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-xl hover:shadow-2xl transition-all">
                                    <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                                        <Check className="w-5 h-5 text-success" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">{t("certificateVerified")}</p>
                                        <p className="text-muted-foreground text-sm">{t("industryRecognized")}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                </div>
            </div>
        </section>
    );
}