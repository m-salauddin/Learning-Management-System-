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
        <div className="mt-12 sticky bottom-6 z-50">
            <div className="max-w-xl mx-auto p-2 rounded-2xl bg-slate-900 border border-border/50 shadow-2xl flex justify-between items-center">
                {currentStep > 1 ? (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>
                ) : (
                    <Link
                        href="/dashboard/courses"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
                    >
                        Cancel
                    </Link>
                )}

                <div className="flex items-center gap-3">
                    {currentStep < totalSteps ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
                        >
                            Next Step
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "px-8 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all active:scale-95",
                                isSubmitting
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                            )}
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Create Course
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
