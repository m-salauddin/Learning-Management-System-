"use client";

import { Star, MessageCircle, Quote, Calendar, Hash } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { ReviewWithUser, RatingBreakdown } from "@/types/course-page";
import { cn } from "@/lib/utils";

interface CourseReviewsProps {
    reviews: ReviewWithUser[];
    ratingBreakdown: RatingBreakdown;
    showAllReviews: boolean;
    setShowAllReviews: (show: boolean) => void;
    setShowReviewModal: (show: boolean) => void;
}

export default function CourseReviews({
    reviews,
    ratingBreakdown,
    showAllReviews,
    setShowAllReviews,
    setShowReviewModal
}: CourseReviewsProps) {
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

    return (
        <div className="mt-12 sm:mt-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-slate-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest transition-colors">
                        <MessageCircle className="w-3.5 h-3.5" />
                        Wall of Love
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors">Students Experiences</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl transition-colors">
                        Real stories from real people who have transformed their careers through our courses.
                    </p>
                </div>

            </div>

            {/* Rating Summary Sections - Now at the Top */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Score Card */}
                <div className="p-10 rounded-[2.5rem] bg-card/40 border border-slate-300 dark:border-white/10 space-y-6 text-center flex flex-col items-center justify-center transition-all duration-500">
                    <div className="text-[5rem] font-black text-slate-900 dark:text-white tracking-tighter leading-none drop-shadow-2xl">
                        {ratingBreakdown.average || 4.8}
                    </div>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={cn(
                                    "w-7 h-7 transition-all",
                                    s <= Math.round(ratingBreakdown.average || 5)
                                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                                        : "text-slate-700/50"
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        {ratingBreakdown.total || 0} TOTAL REVIEWS
                    </p>
                </div>

                {/* Distribution Card */}
                <div className="p-10 rounded-[2.5rem] bg-card/70 border border-slate-300 dark:border-white/10 space-y-5 flex flex-col justify-center transition-all">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 opacity-50">Rating Breakdown</p>
                    <div className="space-y-4">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = ratingBreakdown.distribution?.[stars as keyof typeof ratingBreakdown.distribution] || 0;
                            const percentage = ratingBreakdown.total ? (count / ratingBreakdown.total) * 100 : 0;
                            return (
                                <div key={stars} className="flex items-center gap-5 group/bar px-2">
                                    <div className="flex items-center gap-2 w-10">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{stars}</span>
                                        <Star className="w-3.5 h-3.5 fill-slate-200 dark:fill-slate-700 text-slate-200 dark:text-slate-700 group-hover/bar:fill-amber-400 group-hover/bar:text-amber-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${percentage}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: "circOut" }}
                                            className="h-full bg-linear-to-r from-amber-400 via-amber-400/80 to-purple-500/80 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.2)]"
                                        />
                                    </div>
                                    <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 w-12 text-right group-hover/bar:text-slate-900 dark:group-hover/bar:text-slate-300 transition-colors">
                                        {Math.round(percentage)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-8">
                {reviews.length > 0 ? (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            {displayedReviews.map((review, i) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    key={review.id}
                                    className={cn(
                                        "group p-8 rounded-[2.5rem] bg-card/30 border transition-all duration-500 relative flex flex-col h-full",
                                        "border-slate-300 dark:border-white/10",
                                    )}
                                >
                                    <div className="absolute top-6 right-8 opacity-10 dark:opacity-5 group-hover:opacity-70 dark:group-hover:opacity-70  transition-opacity">
                                        <Quote className="w-10 h-10 text-primary rotate-180" />
                                    </div>

                                    <div className="relative z-10 flex-1 space-y-6">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={cn(
                                                        "w-3.5 h-3.5",
                                                        s <= review.rating
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "text-slate-200 dark:text-slate-800"
                                                    )}
                                                />
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium line-clamp-4 italic">
                                                "{review.review_text}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-8 mt-auto relative z-10">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden transition-all duration-500 relative bg-primary/8 dark:bg-slate-900 shadow-inner block shrink-0">
                                            {review.user?.avatar_url ? (
                                                <Image
                                                    src={review.user.avatar_url}
                                                    alt={review.user.name || 'User'}
                                                    width={48}
                                                    height={48}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-primary/80 font-black text-lg uppercase bg-primary-8 dark:bg-slate-800/50">
                                                    {(review.user?.name || 'U').charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight truncate group-hover:text-primary 
                                            dark:group-hover:text-primary transition-colors">
                                                {review.user?.name || 'Anonymous User'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/5">
                                                    <Hash className="w-2.5 h-2.5 text-sky-400/80" />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    Batch 01
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {reviews.length > 6 && (
                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    className="px-8 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all font-black uppercase tracking-widest"
                                >
                                    {showAllReviews ? 'Show Less' : `Explore All ${reviews.length} Stories`}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-center space-y-4 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">No reviews yet</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs transition-colors">Be the first to share your experience with this course and help others.</p>
                        </div>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest hover:scale-105 transition-all"
                        >
                            Submit First Review
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}
