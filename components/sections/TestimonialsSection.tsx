"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatar: string;
    gradient: string;
}

const TESTIMONIALS: Testimonial[] = [
    {
        quote: "I was stuck in tutorials for years. SkillSyncBD gave me the roadmap and mentorship I needed to actually build things. I landed my first remote job in 3 months!",
        name: "Rafiq Ahmed",
        role: "Software Engineer @ Pathao",
        avatar: "RA",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        quote: "The depth of the cloud computing course is insane. I went from knowing nothing about AWS to deploying scalable microservices. Worth every penny.",
        name: "Fatima Khan",
        role: "DevOps Engineer @ Grameenphone",
        avatar: "FK",
        gradient: "from-violet-500 to-fuchsia-500",
    },
    {
        quote: "It's not just a course, it's a family. The community support is unmatched. Whenever I faced a bug, someone was there to help. Truly life-changing.",
        name: "Tanvir Hassan",
        role: "Frontend Dev @ bKash",
        avatar: "TH",
        gradient: "from-emerald-500 to-teal-500",
    },
];

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
    return (
        <motion.div
            variants={staggerItem}
            whileHover={{ y: -5 }}
            className={`relative p-8 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 group
        ${index === 1 ? "bg-background/60 md:-translate-y-8" : "bg-background/40 hover:bg-background/60"}
      `}
        >
            {/* Glow Effect on Hover */}
            <div
                className={`absolute inset-0 rounded-3xl bg-linear-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
            />

            <div className="relative z-10">
                {/* Quote Icon */}
                <div
                    className={`w-12 h-12 rounded-2xl bg-linear-to-br ${testimonial.gradient} bg-opacity-10 flex items-center justify-center mb-6`}
                >
                    <Quote className="w-6 h-6 text-white" />
                </div>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    "{testimonial.quote}"
                </p>

                <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                    <div className={`w-12 h-12 rounded-full bg-linear-to-br ${testimonial.gradient} p-[2px]`}>
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-sm font-bold">
                            {testimonial.avatar}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                        <p className="text-xs text-primary font-medium">{testimonial.role}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function TestimonialsSection() {
    return (
        <section id="community" className="relative py-32 overflow-hidden bg-muted/20">
            {/* Ambient Lights */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-gentle-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen opacity-30 animate-gentle-pulse" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border shadow-sm mb-6">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">Trusted by 50,000+ Developers</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                        Don't just take our <br />
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            word for it.
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join the community that's redefining the tech landscape in Bangladesh. Real stories from real developers.
                    </p>
                </motion.div>

                {/* Testimonial Grid */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
                >
                    {TESTIMONIALS.map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
