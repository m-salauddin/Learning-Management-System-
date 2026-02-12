"use client";

import { motion, AnimatePresence } from "motion/react";
import { Info, PencilLine, DollarSign, Sparkles, Check, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

interface Step {
    n: number;
    icon: LucideIcon;
    color: string;
}

export const StepIndicator = ({ currentStep, setCurrentStep }: StepIndicatorProps) => {
    const steps: Step[] = [
        { n: 1, icon: Info, color: "#3b82f6" },
        { n: 2, icon: PencilLine, color: "#f59e0b" },
        { n: 3, icon: DollarSign, color: "#10b981" },
        { n: 4, icon: Sparkles, color: "#8b5cf6" }
    ];

    return (
        <div className="mb-12 md:mb-24 mt-6 md:mt-12 relative w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 select-none flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {steps.map((step, i) => (
                <div key={step.n} className={cn("flex items-center", i < steps.length - 1 ? "flex-1" : "")}>
                    {/* Node */}
                    <motion.button
                        type="button"
                        onClick={() => setCurrentStep(step.n)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-10 shrink-0"
                    >
                        <div
                            className={cn(
                                "w-9 h-9 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border sm:border-2 flex items-center justify-center transition-all duration-700 bg-slate-950",
                                currentStep === step.n
                                    ? "ring-4 ring-slate-950 opacity-100 shadow-2xl"
                                    : currentStep > step.n
                                        ? "opacity-100"
                                        : "border-white/10 opacity-40 hover:opacity-100"
                            )}
                            style={{
                                borderColor: currentStep >= step.n ? step.color : 'rgba(255,255,255,0.1)'
                            }}
                        >
                            {/* Number Badge */}
                            <div
                                className="absolute -top-1 -right-1 sm:top-0 sm:right-0 w-3.5 h-3.5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[7px] sm:text-[10px] font-black text-white/90 shadow-lg z-20"
                                style={{ backgroundColor: currentStep >= step.n ? step.color : '#1e293b' }}
                            >
                                {step.n}
                            </div>

                            <AnimatePresence mode="wait">
                                {currentStep > step.n ? (
                                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <Check className="w-4 h-4 sm:w-7 sm:h-7" style={{ color: step.color }} strokeWidth={4} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="icon" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                                        <step.icon
                                            className={cn("w-4 h-4 sm:w-7 sm:h-7", currentStep === step.n ? "" : "opacity-20")}
                                            style={{ color: currentStep === step.n ? step.color : "white" }}
                                            strokeWidth={currentStep === step.n ? 2 : 1.5}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.button>

                    {/* Connection Line segment (only if not last step) */}
                    {i < steps.length - 1 && (
                        <div className="flex-1 px-3 sm:px-4 md:px-6 relative pointer-events-none">
                            <div className="w-full relative">
                                {/* Line Background */}
                                <div className="absolute h-px inset-0 bg-white/10 rounded-full" />

                                {/* Terminal dots (Background) */}
                                <div className="absolute z-10 left-0 top-1/2 -translate-y-1/2 min-w-1.5 min-h-1.5 w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full border border-white/20 bg-slate-950 -translate-x-1/2" />
                                <div className="absolute z-10 right-0 top-1/2 -translate-y-1/2 min-w-1.5 min-h-1.5 w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full border border-white/20 bg-slate-950 translate-x-1/2" />

                                {/* Active Line (Minimal) */}
                                <motion.div
                                    initial={false}
                                    animate={{ scaleX: currentStep > step.n ? 1 : 0 }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className="absolute h-px inset-0 origin-left rounded-full"
                                    style={{ backgroundColor: step.color }}
                                />

                                {/* Active Terminal dots (Minimal) */}
                                <AnimatePresence>
                                    {currentStep > step.n && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full border-[1.5px] bg-slate-950 -translate-x-1/2 z-20"
                                                style={{ borderColor: step.color }}
                                            />
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1, transition: { delay: 0.7 } }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full border-[1.5px] bg-slate-950 translate-x-1/2 z-20"
                                                style={{ borderColor: step.color }}
                                            />
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
