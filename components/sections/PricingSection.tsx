"use client";

import { motion } from "motion/react";
import { Sparkles, Check } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface PricingPlan {
    name: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for exploring",
        features: ["5 free courses", "Community access", "Basic projects", "Email support"],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Pro",
        price: "৳999/mo",
        description: "Best for serious learners",
        features: ["All 200+ courses", "Live mentorship", "Premium projects", "Certificate", "Priority support", "Job preparation"],
        cta: "Start Pro Trial",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For teams & companies",
        features: ["Unlimited seats", "Custom curriculum", "Dedicated manager", "API access", "Analytics dashboard"],
        cta: "Contact Sales",
        popular: false,
    },
];

function PricingCard({ plan }: { plan: PricingPlan }) {
    return (
        <motion.div
            variants={staggerItem}
            className={`relative p-8 rounded-3xl border ${plan.popular
                    ? "bg-linear-to-b from-primary/10 to-card border-primary/50 shadow-xl shadow-primary/10"
                    : "bg-card border-border"
                }`}
        >
            {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    Most Popular
                </div>
            )}
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="text-4xl font-bold">{plan.price}</div>
            </div>
            <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className={`w-5 h-5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`} />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                className={`w-full py-3 rounded-xl font-medium transition-all ${plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted hover:bg-muted/80"
                    }`}
            >
                {plan.cta}
            </button>
        </motion.div>
    );
}

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                        <Sparkles className="w-4 h-4" />
                        Simple Pricing
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                        Invest in your future
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Choose a plan that fits your learning goals
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                    {PRICING_PLANS.map((plan, index) => (
                        <PricingCard key={index} plan={plan} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
