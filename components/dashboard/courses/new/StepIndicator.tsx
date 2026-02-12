"use client";

import { motion, AnimatePresence } from "motion/react";
import { Info, PencilLine, DollarSign, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

export const StepIndicator = ({ currentStep, setCurrentStep }: StepIndicatorProps) => {
    const steps = [
        { n: 1, label: "Foundations", sub: "Basic details", icon: Info, color: "#3b82f6" },
        { n: 2, label: "Narratives", sub: "Course story", icon: PencilLine, color: "#f59e0b" },
        { n: 3, label: "Appearance", sub: "Price & media", icon: DollarSign, color: "#10b981" },
        { n: 4, label: "Finalization", sub: "Resources & FAQ", icon: Sparkles, color: "#8b5cf6" }
    ];

    return (
        <div className="mb-16 md:mb-24 mt-8 md:mt-12 relative w-full max-w-7xl mx-auto px-4 md:px-1 select-none flex items-center h-12 sm:h-20 lg:h-24 xl:h-28">
            {/* Connection Lines Container */}
            <div className="absolute inset-x-4 md:inset-x-12 top-1/2 -translate-y-1/2 h-[2px] px-[8%] sm:px-[10%] lg:px-[15%] xl:px-[5%] pointer-events-none z-0">
                <div className="relative w-full h-full flex items-center">
                    {[0, 1, 2].map((i) => {
                        const isCompleted = currentStep > i + 1;
                        const stepColor = steps[i].color;

                        return (
                            <div key={i} className="relative flex-1 h-px flex items-center mx-[30px] sm:mx-[40px] lg:mx-[48px] xl:mx-[55px]">
                                {/* Background Line */}
                                <div className="absolute inset-x-0 h-full bg-white/10 rounded-full" />

                                {/* background dots - at the ends of segment */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/10 bg-slate-950 z-10 -translate-x-1/2" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-white/10 bg-slate-950 z-10 translate-x-1/2" />

                                {/* Active Line (Glow) */}
                                <motion.div
                                    initial={false}
                                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className="absolute inset-0 origin-left rounded-full"
                                    style={{
                                        backgroundColor: stepColor,
                                        boxShadow: `0 0 15px ${stepColor}80`
                                    }}
                                />

                                {/* Active Terminal dots (Glow) - Synced with line movement */}
                                <AnimatePresence>
                                    {isCompleted && (
                                        <>
                                            {/* Starting (Head) Dot: Appears immediately, waits to disappear */}
                                            <motion.div
                                                key={`head-${i}`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0, transition: { delay: 0.7 } }}
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-[1.5px] bg-slate-950 -translate-x-1/2 z-20"
                                                style={{ borderColor: stepColor, boxShadow: `0 0 15px ${stepColor}` }}
                                            />
                                            {/* Ending (Foot) Dot: Waits to appear, disappears immediately */}
                                            <motion.div
                                                key={`foot-${i}`}
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1, transition: { delay: 0.7 } }}
                                                exit={{ scale: 0 }}
                                                className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-[1.5px] bg-slate-950 translate-x-1/2 z-20"
                                                style={{ borderColor: stepColor, boxShadow: `0 0 15px ${stepColor}` }}
                                            />
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Nodes */}
            <div className="relative z-10 flex justify-between items-center w-full px-[8%] sm:px-[10%] lg:px-[15%] xl:px-[5%]">
                {steps.map((step, i) => {
                    const isActive = currentStep === step.n;
                    const isCompleted = currentStep > step.n;

                    return (
                        <div key={step.n} className="relative flex items-center justify-center group">
                            {/* Node */}
                            <motion.button
                                type="button"
                                onClick={() => setCurrentStep(step.n)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative shrink-0"
                            >
                                <div
                                    className={cn(
                                        "w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full border sm:border-2 flex items-center justify-center transition-all duration-700 relative z-10 bg-slate-950",
                                        isActive
                                            ? "ring-2 sm:ring-4 ring-slate-950 shadow-2xl opacity-100"
                                            : isCompleted
                                                ? "opacity-100 shadow-xl"
                                                : "border-white/5 opacity-40 hover:opacity-100"
                                    )}
                                    style={{
                                        borderColor: isActive || isCompleted ? step.color : 'rgba(255,255,255,0.2)',
                                        boxShadow: (isActive || isCompleted) ? `0 0 25px ${step.color}40, inset 0 0 15px ${step.color}20` : 'none'
                                    }}
                                >
                                    {/* Step Number Badge */}
                                    <div
                                        className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] lg:text-xs font-black text-white/90 shadow-lg z-20"
                                        style={{ backgroundColor: isActive || isCompleted ? step.color : '#1e293b' }}
                                    >
                                        {step.n}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isActive ? (
                                            <motion.div
                                                key="active-icon"
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="flex items-center justify-center"
                                            >
                                                <step.icon
                                                    className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-9 xl:h-9"
                                                    style={{ color: step.color }}
                                                    strokeWidth={2}
                                                />
                                            </motion.div>
                                        ) : isCompleted ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="flex items-center justify-center"
                                            >
                                                <Check className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-9 xl:h-9" style={{ color: step.color }} strokeWidth={4} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="icon"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="flex items-center justify-center opacity-20"
                                            >
                                                <step.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" strokeWidth={1.5} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
