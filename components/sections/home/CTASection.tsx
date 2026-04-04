"use client";
import { motion } from "motion/react";
import {
    Users,
    FolderKanban,
    Zap,
    ListChecks,
    Headphones,
    Award,
    Wrench,
    Building,
    Tag,
    Infinity,
} from "lucide-react";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";
import { Badge } from "@/components/ui/Badge";
export function CTASection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="py-32 relative group px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            {}
            <div className="relative p-8 md:p-16 lg:p-20 rounded-[3.5rem] bg-white dark:bg-[#020617] border border-border overflow-hidden shadow-2xl dark:shadow-black/50">
                {}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none opacity-50 transition-colors duration-1000 group-hover:bg-primary/15" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none opacity-50" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                <div className="space-y-8 mb-20 relative z-10 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <Badge icon={Zap}>
                            Why Choose Dokkho IT?
                        </Badge>
                    </motion.div>
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                            The Dokkho IT <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-400 to-secondary selection:text-white">Advantage</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed mx-auto font-medium">
                            Our structured learning path and career support are designed to transform you into a <span className="text-slate-900 dark:text-white">job-ready professional</span> with high market demand.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10 mb-20">
                    {[
                        { icon: Users, title: "Industry Expert", desc: "Mentor Guidelines", color: "#F05032" },
                        { icon: FolderKanban, title: "Real-life Projects", desc: "Practical Learning", color: "#2496ED" },
                        { icon: Zap, title: "Industry Relevant", desc: "Skills Development", color: "#3ECF8E" },
                        { icon: ListChecks, title: "Best Course", desc: "Outline Structure", color: "#7952B3" },
                        { icon: Headphones, title: "Career Path Based", desc: "Support Session", color: "#F7DF1E" },
                        { icon: Award, title: "Job Placement", desc: "Hands-on Support", color: "#F24E1E" },
                        { icon: Wrench, title: "Technical Support", desc: "Instant Assistance", color: "#FF6B6B" },
                        { icon: Building, title: "Internship & Job", desc: "Full Opportunities", color: "#3ECF8E" },
                        { icon: Tag, title: "Price Learning", desc: "Highly Affordable", color: "#3178C6" },
                        { icon: Infinity, title: "Lifetime Access", desc: "Learn At Your Pace", color: "#3ECF8E" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                            className="group/card relative flex flex-col p-7 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-border hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                        >
                            {}
                            <div
                                className="absolute -top-12 -right-12 w-24 h-24 blur-[60px] opacity-20 transition-all duration-700 group-hover/card:opacity-40 group-hover/card:scale-125"
                                style={{ backgroundColor: item.color }}
                            />
                            <div className="relative z-10 flex flex-col items-center text-center space-y-5">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover/card:scale-110 group-hover/card:rotate-6 bg-white dark:bg-transparent"
                                    style={{ backgroundColor: `${item.color}10`, border: `1.5px solid ${item.color}25` }}
                                >
                                    <item.icon className="w-6 h-6 transition-all duration-500 group-hover/card:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" style={{ color: item.color }} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-tight leading-snug group-hover/card:text-primary transition-colors">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-500 text-xs font-semibold leading-relaxed group-hover/card:text-slate-800 dark:group-hover/card:text-slate-300 transition-colors uppercase tracking-wider">{item.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {}
                <div className="relative z-10 flex flex-row flex-wrap gap-4 justify-center items-center">
                    <PrimaryCTAButton href="/courses">
                        Get Started
                    </PrimaryCTAButton>
                    <SecondaryCTAButton
                        href="/about"
                    >
                        Explore<span className="sm:inline hidden"> Structure</span>
                    </SecondaryCTAButton>
                </div>
            </div>
        </motion.section>
    );
}
