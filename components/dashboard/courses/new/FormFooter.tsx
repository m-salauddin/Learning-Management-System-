"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFooterProps {
    currentStep: number;
    totalSteps: number;
    prevStep: () => void;
    nextStep: () => void;
    isSubmitting: boolean;
}

export const FormFooter = ({
    currentStep,
    totalSteps,
    prevStep,
    nextStep,
    isSubmitting
}: FormFooterProps) => {
    return (
        <div className="mt-20 sticky bottom-6 z-50 px-4 md:px-0">
            <div className="max-w-4xl mx-auto p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] bg-slate-900/80 backdrop-blur-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex justify-between items-center">
                {currentStep > 1 ? (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 md:px-8 py-3.5 rounded-xl md:rounded-2xl border border-white/5 text-white/40 hover:text-white hover:bg-white/5 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center gap-2 group"
                    >
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline">Previous Phase</span>
                        <span className="sm:hidden">Back</span>
                    </button>
                ) : (
                    <Link
                        href="/dashboard/courses"
                        className="px-5 md:px-8 py-3.5 rounded-xl md:rounded-2xl text-white/30 hover:text-red-500 hover:bg-red-500/5 transition-all font-black text-[9px] md:text-[10px] uppercase tracking-widest"
                    >
                        Abandon
                    </Link>
                )}

                <div className="flex items-center gap-4">
                    {currentStep < totalSteps ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-8 md:px-12 py-3.5 md:py-4 rounded-[1.25rem] md:rounded-[1.5rem] bg-primary text-white font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 hover:opacity-90 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] group"
                        >
                            Proceed Next
                            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "px-10 md:px-14 py-3.5 md:py-4 rounded-[1.25rem] md:rounded-[1.5rem] text-white font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] flex items-center gap-3 transition-all active:scale-[0.98] shadow-2xl",
                                isSubmitting ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                            )}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Initialize
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
