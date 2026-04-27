"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, Target, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    link: string;
    setLink: (v: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    status: any;
}

export function SubmissionModal({ isOpen, onClose, link, setLink, onSubmit, isSubmitting, status }: SubmissionModalProps) {
    const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

    useEffect(() => {
        // Create a dedicated div for the portal to avoid hydration conflicts
        let el = document.getElementById('submission-modal-portal');
        if (!el) {
            el = document.createElement('div');
            el.id = 'submission-modal-portal';
            document.body.appendChild(el);
        }
        setPortalContainer(el);
        return () => {
            // Cleanup on unmount
            if (el && el.parentNode && !el.hasChildNodes()) {
                el.parentNode.removeChild(el);
            }
        };
    }, []);

    // Don't render anything until the portal container is ready (avoids hydration mismatch)
    if (!portalContainer) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/6 border border-primary/15 flex items-center justify-center">
                                    <LinkIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Submit Solution</h3>
                                    <p className="text-[10px] text-slate-400 font-medium">Provide your project URL</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <Target className="w-3 h-3 text-primary" /> Project URL
                                </label>
                                <input
                                    type="url" value={link} onChange={(e) => setLink(e.target.value)}
                                    placeholder="https://github.com/your-username/project"
                                    className="w-full h-12 bg-slate-50 dark:bg-white/4 border border-slate-200/80 dark:border-white/6 rounded-xl px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-400"
                                />
                            </div>

                            {status && (
                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-slate-200/60 dark:border-white/6 flex items-center justify-between">
                                    <div><span className="text-[9px] font-bold text-slate-400 uppercase block">Status</span><span className="text-xs font-semibold text-slate-700 dark:text-white capitalize">{status.status}</span></div>
                                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/4 text-[9px] font-bold text-slate-400 uppercase">{status.id?.substring(0, 6)}</span>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={onClose} className="flex-1 py-3 bg-slate-100 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-slate-600 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/6 transition-all">Cancel</button>
                                <button onClick={onSubmit} disabled={isSubmitting}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                    Submit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        portalContainer
    );
}
