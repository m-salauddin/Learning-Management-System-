"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { MessageCircle, Quote } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
    gradient: string;
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
    return (
        <motion.div
            variants={staggerItem}
            className={`group relative ${index === 1 ? "lg:-translate-y-8" : ""}`}
        >
            <div suppressHydrationWarning className={`relative h-full p-8 rounded-3xl backdrop-blur-xl border overflow-hidden transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl
                ${index === 1
                    ? "bg-card/70 dark:bg-card/50 border-primary/30"
                    : "bg-card/50 dark:bg-card/30 border-border/50 dark:border-white/10 group-hover:border-primary/30"
                }`}
            >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <div suppressHydrationWarning className="relative z-10">
                    <div suppressHydrationWarning className="relative mb-6">
                        <div
                            className={`w-12 h-12 rounded-2xl bg-linear-to-br ${testimonial.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                            <Quote className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                        "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4 border-t border-border/50 dark:border-white/10 pt-6">
                        <div className={`w-12 h-12 rounded-full bg-linear-to-br ${testimonial.gradient} p-[2px] group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300`}>
                            <div className="w-full h-full rounded-full bg-card overflow-hidden flex items-center justify-center text-sm font-bold">
                                {testimonial.avatar.startsWith('http') ? (
                                    <img 
                                        src={testimonial.avatar} 
                                        alt={testimonial.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    testimonial.avatar
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">{testimonial.name}</h4>
                            <p className="text-xs text-primary font-medium">{testimonial.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function TestimonialsSection() {
    const t = useTranslations("Testimonials");
    const testimonials = t.raw("testimonials") as Testimonial[];

    return (
        <section id="community" suppressHydrationWarning className="relative py-32 overflow-hidden bg-muted/20">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-gentle-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-gentle-pulse" />
            <div suppressHydrationWarning className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <Badge icon={MessageCircle} iconClassName="text-yellow-400" className="mb-6 shadow-sm">
                        {t("badge")}
                    </Badge>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        {t("title1")} <br />
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            {t("title2")}
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {t("description")}
                    </p>
                </motion.div>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
