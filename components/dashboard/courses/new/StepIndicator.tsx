"use client";
import { motion, AnimatePresence } from "motion/react";
import { Info, PencilLine, MonitorPlay, Rocket, Check, LucideIcon } from "lucide-react";
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
        { n: 3, icon: MonitorPlay, color: "#10b981" },
        { n: 4, icon: Rocket, color: "#8b5cf6" }
    ];
    return (
        <div className="mb-8 md:mb-16 mt-4 md:mt-8 relative w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 select-none flex items-center justify-between h-12 sm:h-16 lg:h-20">
            {steps.map((step, i) => (
                <div key={step.n} className={cn("flex items-center", i < steps.length - 1 ? "flex-1" : "")}>
                    <motion.button
                        type="button"
                        onClick={() => setCurrentStep(step.n)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative z-10 shrink-0"
                    >
                        <div
                            className={cn(
                                "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl border sm:border-2 flex items-center justify-center transition-all duration-700 bg-white dark:bg-slate-950",
                                currentStep === step.n
                                    ? "ring-4 ring-white dark:ring-slate-950 opacity-100 shadow-2xl"
                                    : currentStep > step.n
                                        ? "opacity-100"
                                        : "border-slate-200 dark:border-white/10 opacity-40 hover:opacity-100"
                            )}
                            style={{
                                borderColor: currentStep >= step.n ? step.color : 'rgba(255,255,255,0.1)'
                            }}
                        >
                            <div
                                className="absolute -top-1 -right-1 sm:top-0 sm:right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-lg flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white/90 shadow-lg z-20"
                                style={{ backgroundColor: currentStep >= step.n ? step.color : '#cbd5e1' }}
                            >
                                {step.n}
                            </div>
                            <motion.div key="icon" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                                <step.icon
                                    className={cn(
                                        "w-5 h-5 sm:w-6 sm:h-6",
                                        currentStep >= step.n ? "opacity-100" : "opacity-20 text-slate-500 dark:text-white"
                                    )}
                                    style={currentStep >= step.n ? { color: step.color } : undefined}
                                    strokeWidth={currentStep >= step.n ? 2 : 1.5}
                                />
                            </motion.div>
                        </div>
                    </motion.button>
                    {i < steps.length - 1 && (
                        <div className="flex-1 px-2.5 sm:px-4 md:px-6 relative pointer-events-none">
                            <div className="w-full h-4 relative flex items-center">
                                <div className="w-full h-px bg-slate-200 dark:bg-white/10 rounded-full shrink-0" />
                                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 z-10" />
                                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full border border-slate-200 dark:border-white/20 bg-white dark:bg-slate-950 z-10" />
                                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px pointer-events-none overflow-hidden rounded-full">
                                    <motion.div
                                        initial={false}
                                        animate={{ scaleX: currentStep > step.n ? 1 : 0 }}
                                        transition={{ duration: 0.8, ease: "circOut" }}
                                        className="w-full h-full origin-left"
                                        style={{ backgroundColor: step.color }}
                                    />
                                </div>
                                <AnimatePresence>
                                    {currentStep > step.n && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full border-[1.5px] bg-white dark:bg-slate-950 z-20"
                                                style={{ borderColor: step.color }}
                                            />
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1, transition: { delay: 0.7 } }}
                                                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full border-[1.5px] bg-white dark:bg-slate-950 z-20"
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
