"use client";

import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, Rocket } from "lucide-react";
import { CourseFAQ } from "@/types/course-page";
import { cn } from "@/lib/utils";

interface CourseFAQProps {
    faq: CourseFAQ[];
    expandedFaq: number | null;
    toggleFaq: (idx: number) => void;
    setShowLeadModal: (show: boolean) => void;
}

export default function CourseFAQSection({
    faq,
    expandedFaq,
    toggleFaq,
    setShowLeadModal
}: CourseFAQProps) {
    if (!faq || faq.length === 0) return null;

    return (
        <div className="mt-12 sm:mt-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Common Questions
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white">Got Questions?</h2>
                    <p className="text-slate-400 text-sm sm:text-base max-w-xl">
                        Everything you need to know about the course and the learning platform.
                    </p>
                </div>
            </div>

            <div className="max-w-3xl space-y-4">
                {faq.map((item, i) => (
                    <div key={i} className="group overflow-hidden rounded-3xl bg-slate-900/10 border border-white/5 hover:border-white/10 transition-all duration-300">
                        <button
                            onClick={() => toggleFaq(i)}
                            className="w-full flex items-center justify-between p-6 sm:p-7 text-left group/btn"
                        >
                            <h4 className="font-bold text-slate-200 group-hover/btn:text-white transition-colors">{item.question}</h4>
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 transition-all duration-300",
                                expandedFaq === i ? "rotate-180 bg-primary/20 text-primary" : "text-slate-600"
                            )}>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </button>
                        <AnimatePresence>
                            {expandedFaq === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="px-6 pb-7 text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                {/* Question CTA */}
                <div className="pt-8">
                    <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-primary/10 to-transparent border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8 group">
                        <div className="space-y-2 text-center sm:text-left">
                            <h3 className="text-xl font-bold text-white">Still have questions?</h3>
                            <p className="text-slate-400 text-sm max-w-xs">Can't find what you're looking for? Reach out to our support team.</p>
                        </div>
                        <button
                            onClick={() => setShowLeadModal(true)}
                            className="px-8 py-3 rounded-2xl bg-white text-slate-950 text-sm font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                        >
                            <Rocket className="w-4 h-4" />
                            Ask Anything
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
