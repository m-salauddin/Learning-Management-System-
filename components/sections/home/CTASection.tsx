"use client";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
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
    const t = useTranslations("CTA");
    const tc = useTranslations("Common");

    const advantages = [
        { icon: Users, title: t("advantages.industryExpert.title"), desc: t("advantages.industryExpert.desc"), color: "#F05032" },
        { icon: FolderKanban, title: t("advantages.realLifeProjects.title"), desc: t("advantages.realLifeProjects.desc"), color: "#2496ED" },
        { icon: Zap, title: t("advantages.industryRelevant.title"), desc: t("advantages.industryRelevant.desc"), color: "#3ECF8E" },
        { icon: ListChecks, title: t("advantages.bestCourse.title"), desc: t("advantages.bestCourse.desc"), color: "#7952B3" },
        { icon: Headphones, title: t("advantages.careerPath.title"), desc: t("advantages.careerPath.desc"), color: "#F7DF1E" },
        { icon: Award, title: t("advantages.jobPlacement.title"), desc: t("advantages.jobPlacement.desc"), color: "#F24E1E" },
        { icon: Wrench, title: t("advantages.technicalSupport.title"), desc: t("advantages.technicalSupport.desc"), color: "#FF6B6B" },
        { icon: Building, title: t("advantages.internship.title"), desc: t("advantages.internship.desc"), color: "#3ECF8E" },
        { icon: Tag, title: t("advantages.priceLearning.title"), desc: t("advantages.priceLearning.desc"), color: "#3178C6" },
        { icon: Infinity, title: t("advantages.lifetimeAccess.title"), desc: t("advantages.lifetimeAccess.desc"), color: "#3ECF8E" }
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="py-32 relative group px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <div className="relative p-8 md:p-16 lg:p-20 rounded-[3.5rem] bg-white dark:bg-[#020617] border border-border overflow-hidden shadow-2xl dark:shadow-black/50">
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
                            {t("badge")}
                        </Badge>
                    </motion.div>
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                            {t.rich("title", {
                                brand: (chunks) => <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-400 to-secondary selection:text-white">{chunks}</span>
                            })}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl leading-relaxed mx-auto font-medium">
                            {t.rich("description", {
                                professional: (chunks) => <span className="text-slate-900 dark:text-white">{chunks}</span>
                            })}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative z-10 mb-20">
                    {advantages.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 + 0.3, duration: 0.6 }}
                            className="group/card relative flex flex-col p-7 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-border hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                        >
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
                <div className="relative z-10 flex flex-row flex-wrap gap-4 justify-center items-center">
                    <PrimaryCTAButton href="/courses">
                        {tc("getStarted")}
                    </PrimaryCTAButton>
                    <SecondaryCTAButton
                        href="/about"
                    >
                        {tc("exploreCourses")}
                    </SecondaryCTAButton>
                </div>
            </div>
        </motion.section>
    );
}
