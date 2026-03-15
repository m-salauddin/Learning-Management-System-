"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Layout, Play, Tag, ArrowRight, Share2 } from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

interface CourseSidebarProps {
    course: MappedCourse;
    timeLeft: { d: number, h: number, m: number, s: number } | null;
    formattedPrice: string;
    hasDiscount: boolean;
    originalPrice?: string;
    discountPercentage: number | null;
    showCouponInput: boolean;
    setShowCouponInput: (show: boolean) => void;
    couponCode: string;
    setCouponCode: (code: string) => void;
    isApplyingCoupon: boolean;
    handleApplyCoupon: (e: React.FormEvent) => void;
    handleEnroll: () => void;
    loading: boolean;
    setShowShareModal: (show: boolean) => void;
    setShowVideoModal: (show: boolean) => void;
}

export default function CourseSidebar({
    course,
    timeLeft,
    formattedPrice,
    hasDiscount,
    originalPrice,
    discountPercentage,
    showCouponInput,
    setShowCouponInput,
    couponCode,
    setCouponCode,
    isApplyingCoupon,
    handleApplyCoupon,
    handleEnroll,
    loading,
    setShowShareModal,
    setShowVideoModal
}: CourseSidebarProps) {
    return (
        <div className="lg:col-span-5 xl:col-span-4 lg:mt-0 order-first lg:order-0 z-20 space-y-4 sm:space-y-6">
            <div className="hidden lg:flex justify-end mb-4">
                <Breadcrumbs
                    rootLabel="Home"
                    items={[
                        { label: 'Courses', href: '/courses', icon: BookOpen },
                        { label: course.title, icon: Layout }
                    ]}
                />
            </div>

            <div className="relative overflow-hidden rounded-[2.5rem]! bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 backdrop-blur-2xl lg:sticky lg:top-[110px]">
                <div className="p-3 pb-0">
                    <div
                        onClick={() => setShowVideoModal(true)}
                        className="aspect-video relative group/preview cursor-pointer bg-slate-950 overflow-hidden rounded-[1.75rem] ring-1 ring-white/5"
                    >
                        <Image
                            src={course.image || '/placeholder-course.jpg'}
                            alt={course.title}
                            fill
                            className="object-cover opacity-90 group-hover/preview:scale-110 transition-all duration-700"
                            unoptimized
                        />

                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover/preview:bg-primary/40" />
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover/preview:scale-110 transition-transform duration-500 ring-1 ring-white/20 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-[#0036F9] dark:bg-primary flex items-center justify-center shadow-xl shadow-primary/40">
                                        <Play className="w-5 h-5 text-card fill-card ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Preview Text */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                            <span className="text-[10px] font-black text-white px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 uppercase tracking-widest">
                                Preview this course
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-6 space-y-6">
                    {/* Price Section */}
                    <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums drop-shadow-sm dark:drop-shadow-lg">
                                    {formattedPrice}
                                </span>
                                {hasDiscount && course.priceType !== "Free" && (
                                    <div className="flex flex-col">
                                        <span className="text-base text-slate-500 line-through decoration-slate-500/50 font-bold">
                                            {originalPrice}
                                        </span>
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                            {discountPercentage || 20}% SAVED
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {hasDiscount && course.discountExpiresAt && (
                            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </div>
                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                                    Discount Ends Soon
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Promo Code Toggle & Section */}
                    <div className="py-5 border-y border-slate-300 dark:border-white/5">
                        <AnimatePresence mode="wait">
                            {!showCouponInput ? (
                                <motion.button
                                    key="toggle"
                                    initial={{ opacity: 0, scale: 0.96, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96, y: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    onClick={() => setShowCouponInput(true)}
                                    className="group relative flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/3 border border-slate-300 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/8 hover:border-primary/30 transition-all duration-300"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                        <Tag className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none">Special Offer</span>
                                        <span className="text-xs font-bold text-slate-400 transition-colors">Apply Coupon Code</span>
                                    </div>
                                    <div className="ml-auto w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                                        <ArrowRight className="w-3.5 h-3.5 text-primary -rotate-45 group-hover:rotate-0 transition-all duration-500" />
                                    </div>
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="input-section"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className="space-y-4 px-4 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between px-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                                                <Tag className="w-2.5 h-2.5 text-primary" />
                                            </div>
                                            <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Promo Code</h4>
                                        </div>
                                        <button
                                            onClick={() => setShowCouponInput(false)}
                                            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-rose-400 transition-colors py-1 px-2 rounded-lg hover:bg-rose-400/10"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    <form onSubmit={handleApplyCoupon} className="relative group/form">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase().trim())}
                                                placeholder="ENTER CODE"
                                                className="w-full pl-5 pr-28 py-4 bg-slate-100 dark:bg-slate-950/50 border border-slate-400 dark:border-white/20 rounded-2xl text-sm font-black text-slate-900 dark:text-white focus:border-primary/50 outline-none transition-all uppercase placeholder:normal-case placeholder:text-slate-400 dark:placeholder:text-slate-600 placeholder:font-bold tracking-[0.2em]"
                                            />
                                            <AnimatePresence>
                                                {couponCode.trim().length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                                        className="absolute right-1.5 top-1.5 bottom-1.5 px-1"
                                                    >
                                                        <button
                                                            type="submit"
                                                            disabled={isApplyingCoupon}
                                                            className="h-full px-6 bg-[#0036F9] dark:bg-primary text-card text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                                        >
                                                            {isApplyingCoupon ? '...' : 'Apply'}
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </form>
                                    <p className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest text-center whitespace-nowrap">
                                        Enter a valid coupon to unlock extra savings
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <PrimaryCTAButton
                                onClick={handleEnroll}
                                loading={loading}
                                hideIcon
                                className="w-full! h-12! rounded-2xl! relative overflow-hidden group/enroll px-4 sm:px-6"
                            >
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                    <span className="text-xs font-black uppercase tracking-widest">Enroll</span>
                                    <div className="w-7 h-7 rounded-full bg-card flex items-center justify-center group-hover/enroll:scale-105 transition-transform shadow-lg shadow-black/10">
                                        <ArrowRight className="w-4 h-4 text-primary -rotate-45 group-hover/enroll:rotate-0 transition-transform" />
                                    </div>
                                </div>
                            </PrimaryCTAButton>

                            <SecondaryCTAButton
                                onClick={() => setShowShareModal(true)}
                                className="w-full! h-12! rounded-2xl! bg-card border border-border hover:border-slate-400 dark:hover:border-white/20 group/share px-4 sm:px-6"
                            >
                                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                                    <Share2 className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover/share:text-primary transition-colors" />
                                    <span className="text-xs uppercase font-bold tracking-widest text-slate-700 dark:text-slate-300 group-hover/share:text-slate-900 dark:group-hover:text-white">Share</span>
                                </div>
                            </SecondaryCTAButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
