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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Common Questions
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Got Questions?</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
                        Everything you need to know about the course and the learning platform.
                    </p>
                </div>
            </div>
            <div className="max-w-4xl space-y-4">
                {faq.map((item, i) => (
                    <div
                        key={i}
                        className={cn(
                            "group overflow-hidden rounded-[2rem] border transition-all duration-300",
                            expandedFaq === i
                                ? "bg-slate-50 dark:bg-slate-900/40 border-primary/20 shadow-xl shadow-primary/5"
                                : "bg-slate-100/50 dark:bg-slate-900/10 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                        )}
                    >
                        <button
                            onClick={() => toggleFaq(i)}
                            className="w-full flex items-center gap-5 p-5 sm:p-6 text-left group/btn"
                        >
                            {}
                            <div className={cn(
                                "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-500",
                                expandedFaq === i
                                    ? "bg-primary text-primary-foreground scale-110 rotate-6 shadow-lg shadow-primary/20"
                                    : "bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-500 group-hover/btn:bg-slate-200 dark:group-hover/btn:bg-white/10 group-hover/btn:text-slate-700 dark:group-hover/btn:text-slate-300"
                            )}>
                                {i + 1 < 10 ? `0${i + 1}` : i + 1}
                            </div>
                            <h4 className={cn(
                                "flex-1 font-bold text-base sm:text-lg transition-colors",
                                expandedFaq === i
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-700 dark:text-slate-300 group-hover/btn:text-slate-900 dark:group-hover/btn:text-white"
                            )}>
                                {item.question.replace(/^\d+\.\s*/, '')}
                            </h4>
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                expandedFaq === i
                                    ? "rotate-180 bg-primary/20 text-primary"
                                    : "bg-slate-200/50 dark:bg-white/5 text-slate-400 dark:text-slate-600 group-hover/btn:bg-slate-200 dark:group-hover/btn:bg-white/10"
                            )}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </button>
                        <AnimatePresence>
                            {expandedFaq === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <div className="px-5 pb-6 sm:px-6 sm:pb-8 ml-15 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-200 dark:border-white/5">
                                        {item.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
