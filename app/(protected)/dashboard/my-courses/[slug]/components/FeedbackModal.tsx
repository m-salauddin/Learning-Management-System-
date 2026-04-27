"use client";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Props {
    isOpen: boolean;
    module: any;
    rating: number;
    hoverRating: number;
    feedbackText: string;
    onClose: () => void;
    onRatingChange: (r: number) => void;
    onHoverChange: (r: number) => void;
    onTextChange: (t: string) => void;
    onSubmit: () => void;
}

export function FeedbackModal({ isOpen, module, rating, hoverRating, feedbackText, onClose, onRatingChange, onHoverChange, onTextChange, onSubmit }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/6 w-full max-w-sm rounded-2xl shadow-2xl relative z-10 overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/6">
                            <div>
                                <h3 className="text-[14px] font-bold text-slate-900 dark:text-white">Module Feedback</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{module?.title}</p>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-5 space-y-5">
                            <div className="text-center space-y-2.5">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Rate your experience</p>
                                <div className="flex items-center justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} onMouseEnter={() => onHoverChange(star)} onMouseLeave={() => onHoverChange(0)} onClick={() => onRatingChange(star)}
                                            className="transition-transform active:scale-90 hover:scale-110 cursor-pointer">
                                            <Star className={cn("w-7 h-7 transition-colors", (hoverRating || rating) >= star ? "text-yellow-500 fill-yellow-500" : "text-slate-200 dark:text-slate-700")} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Your thoughts</label>
                                <textarea value={feedbackText} onChange={(e) => onTextChange(e.target.value)} placeholder="What did you learn? Any suggestions?"
                                    className="w-full h-24 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/6 rounded-xl p-3.5 text-[12px] text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 outline-none transition-all placeholder:text-slate-400 resize-none" />
                            </div>
                            <button onClick={onSubmit}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-[12px] font-bold hover:brightness-110 transition-all shadow-sm shadow-primary/20 cursor-pointer">
                                Submit Feedback
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
