"use client";

import { motion, AnimatePresence } from "motion/react";
import { Star, Share2, X, Check as CheckIcon, Copy, X as XIcon } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { MappedCourse } from "@/types/mapped-course";
import { cn } from "@/lib/utils";

interface CourseModalsProps {
    course: MappedCourse;
    showLeadModal: boolean;
    setShowLeadModal: (show: boolean) => void;
    leadForm: { name: string; email: string; message: string };
    setLeadForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; message: string }>>;
    submitting: boolean;
    handleLeadSubmit: (e: React.FormEvent) => void;
    showReviewModal: boolean;
    setShowReviewModal: (show: boolean) => void;
    reviewForm: { rating: number; review_text: string };
    setReviewForm: React.Dispatch<React.SetStateAction<{ rating: number; review_text: string }>>;
    hoverRating: number;
    setHoverRating: (rating: number) => void;
    handleReviewSubmit: (e: React.FormEvent) => void;
    showShareModal: boolean;
    setShowShareModal: (show: boolean) => void;
    shareOptions: any[];
    handleCopyLink: () => void;
    linkCopied: boolean;
    shareUrl: string;
}

export default function CourseModals({
    course,
    showLeadModal,
    setShowLeadModal,
    leadForm,
    setLeadForm,
    submitting,
    handleLeadSubmit,
    showReviewModal,
    setShowReviewModal,
    reviewForm,
    setReviewForm,
    hoverRating,
    setHoverRating,
    handleReviewSubmit,
    showShareModal,
    setShowShareModal,
    shareOptions,
    handleCopyLink,
    linkCopied,
    shareUrl
}: CourseModalsProps) {
    return (
        <>
            <Dialog open={showLeadModal} onClose={() => setShowLeadModal(false)} size="md">
                <DialogHeader>
                    <DialogTitle>Ask a Question</DialogTitle>
                    <DialogDescription>
                        Fill out the form below and we'll get back to you as soon as possible.
                    </DialogDescription>
                    <DialogClose onClose={() => setShowLeadModal(false)} />
                </DialogHeader>
                <DialogBody>
                    <form id="lead-form" onSubmit={handleLeadSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <input
                                required
                                value={leadForm.name}
                                onChange={e => setLeadForm(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Email</label>
                            <input
                                required
                                type="email"
                                value={leadForm.email}
                                onChange={e => setLeadForm(p => ({ ...p, email: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Message</label>
                            <textarea
                                required
                                rows={4}
                                value={leadForm.message}
                                onChange={e => setLeadForm(p => ({ ...p, message: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="What would you like to know?"
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => setShowLeadModal(false)}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="lead-form"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Sending..." : "Send Message"}
                    </button>
                </DialogFooter>
            </Dialog>

            <Dialog open={showReviewModal} onClose={() => setShowReviewModal(false)} size="md">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with this course. Your feedback helps others.
                    </DialogDescription>
                    <DialogClose onClose={() => setShowReviewModal(false)} />
                </DialogHeader>
                <DialogBody>
                    <form id="review-form" onSubmit={handleReviewSubmit} className="space-y-6">
                        <div className="space-y-2 flex flex-col items-center">
                            <label className="text-sm font-medium text-muted-foreground">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setReviewForm(p => ({ ...p, rating: star }))}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={cn(
                                                "w-8 h-8 transition-colors",
                                                star <= (hoverRating || reviewForm.rating)
                                                    ? "fill-primary text-primary"
                                                    : "fill-muted text-muted-foreground"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">
                                {reviewForm.rating === 5 ? "Excellent!" :
                                    reviewForm.rating === 4 ? "Very Good" :
                                        reviewForm.rating === 3 ? "Average" :
                                            reviewForm.rating === 2 ? "Poor" : "Terrible"}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Review</label>
                            <textarea
                                required
                                rows={4}
                                value={reviewForm.review_text}
                                onChange={e => setReviewForm(p => ({ ...p, review_text: e.target.value }))}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Tell us what you liked or didn't like..."
                            />
                        </div>
                    </form>
                </DialogBody>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="review-form"
                        disabled={submitting}
                        className="px-4 py-2 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </DialogFooter>
            </Dialog>

            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                            className="w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-5 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <Share2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Share this course</h3>
                                        <p className="text-xs text-muted-foreground">Spread the knowledge with others</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowShareModal(false)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                >
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-5 space-y-5">
                                <div className="flex gap-4 p-4 bg-muted/30 rounded-xl border border-border/50">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 relative">
                                        <Image
                                            src={course.image || '/placeholder-course.jpg'}
                                            alt={course.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-foreground text-sm line-clamp-2">{course.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">by {course.instructor?.name || 'Instructor'}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Share on social media</p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {shareOptions.map((option) => (
                                            <button
                                                key={option.name}
                                                onClick={() => {
                                                    option.action();
                                                    setShowShareModal(false);
                                                }}
                                                className={cn(
                                                    "flex flex-col items-center gap-2 p-3 rounded-xl text-white transition-all duration-200 hover:scale-105 active:scale-95",
                                                    option.color
                                                )}
                                            >
                                                {option.icon}
                                                <span className="text-[10px] font-medium">{option.name.split(' ')[0]}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Or copy link</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 px-4 py-3 bg-muted/50 rounded-xl border border-border text-sm text-muted-foreground truncate">
                                            {shareUrl}
                                        </div>
                                        <button
                                            onClick={handleCopyLink}
                                            className={cn(
                                                "px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200",
                                                linkCopied
                                                    ? "bg-success text-success-foreground"
                                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                            )}
                                        >
                                            {linkCopied ? (
                                                <>
                                                    <CheckIcon className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copy
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
