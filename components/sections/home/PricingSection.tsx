"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Tag, Check, Crown } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
}

function PricingCard({ plan }: { plan: PricingPlan }) {
    const t = useTranslations("Pricing");
    return (
        <motion.div
            variants={staggerItem}
            className={`group relative ${plan.popular ? "pt-4" : ""}`}
        >
            {plan.popular && (
                <div suppressHydrationWarning className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <Badge icon={Crown} className="bg-linear-to-r from-primary via-secondary to-accent text-primary-foreground font-semibold shadow-lg px-5 py-1.5 border-none whitespace-nowrap">
                        {t("popular")}
                    </Badge>
                </div>
            )}
            <div suppressHydrationWarning className={`relative h-fit p-8 rounded-3xl backdrop-blur-xl border overflow-hidden transition-all duration-500 group-hover:-translate-y-1 ${plan.popular
                ? "bg-linear-to-b from-primary/10 via-card/90 to-card/90 dark:from-primary/20 dark:via-card/80 dark:to-card/80 border-primary/50 shadow-xl"
                : "bg-card/80 dark:bg-card/50 border-border/50 dark:border-white/10 group-hover:border-primary/30 group-hover:shadow-xl"
                }`}
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <div suppressHydrationWarning className="relative z-10 text-center mb-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                    <div suppressHydrationWarning className={`text-4xl font-black ${plan.popular
                        ? "bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                        : ""}`}
                    >
                        {plan.price}
                    </div>
                </div>
                <ul className="relative z-10 space-y-4 mb-8">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm group/item">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular
                                ? "bg-primary/20 group-hover/item:bg-primary/30"
                                : "bg-muted group-hover/item:bg-primary/20"} transition-colors duration-300`}
                            >
                                <Check className={`w-3 h-3 ${plan.popular ? "text-primary" : "text-muted-foreground group-hover/item:text-primary"} transition-colors duration-300`} />
                            </div>
                            <span className="group-hover/item:text-foreground transition-colors duration-300">{feature}</span>
                        </li>
                    ))}
                </ul>
                <button
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted hover:bg-primary/10 hover:text-primary"
                        }`}
                >
                    {plan.cta}
                </button>
            </div>
        </motion.div>
    );
}

export function PricingSection() {
    const t = useTranslations("Pricing");

    const PRICING_PLANS: PricingPlan[] = [
        {
            name: t("plans.free.name"),
            price: t("plans.free.price"),
            description: t("plans.free.desc"),
            features: [
                t("features.allCourses"),
                t("features.community"),
                t("features.support")
            ],
            cta: t("getStarted"),
            popular: false,
        },
        {
            name: t("plans.pro.name"),
            price: t("plans.pro.price"),
            description: t("plans.pro.desc"),
            features: [
                t("features.allCourses"),
                t("features.community"),
                t("features.support"),
                t("features.certification"),
                t("features.mentorship")
            ],
            cta: t("getStarted"),
            popular: true,
        },
        {
            name: t("plans.enterprise.name"),
            price: t("plans.enterprise.price"),
            description: t("plans.enterprise.desc"),
            features: [
                t("features.allCourses"),
                t("features.community"),
                t("features.support"),
                t("features.certification"),
                t("features.mentorship"),
                t("features.jobPlacement"),
                t("features.projects")
            ],
            cta: t("getStarted"),
            popular: false,
        },
    ];

    return (
        <section id="pricing" suppressHydrationWarning className="py-24 relative overflow-hidden">
            <div suppressHydrationWarning className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />
            <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <Badge icon={Tag} className="mb-4">
                        {t("badge")}
                    </Badge>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                        {t("title1")} {t("title2")}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center"
                >
                    {PRICING_PLANS.map((plan, index) => (
                        <PricingCard key={index} plan={plan} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
