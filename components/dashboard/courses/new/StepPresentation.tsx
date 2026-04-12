"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
    DollarSign, Video, Image as ImageIcon, Upload, X, Loader2, 
    AlertCircle, Tag, MonitorPlay, Facebook, MessageCircle, 
    Users, Plus, Trash2, Percent, Clock, Calendar, Pencil,
    CreditCard, Wallet, Smartphone
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";
import { StepHeader } from "./StepHeader";
import { DateTimePicker } from "@/components/ui/date-time-picker";
interface StepPresentationProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    thumbnailPreview: string | null;
    isDragging: boolean;
    isUploadingThumbnail: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeThumbnail: () => void;
    errors: Record<string, string>;
}
export const StepPresentation = ({
    formData,
    setFormData,
    thumbnailPreview,
    isDragging,
    isUploadingThumbnail,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    removeThumbnail,
    errors
}: StepPresentationProps) => {
    const [couponInput, setCouponInput] = useState<{ 
        code: string; 
        discount_percentage: number | string; 
        expires_at?: string 
    }>({
        code: "",
        discount_percentage: "100",
        expires_at: undefined
    });

    const [showCouponForm, setShowCouponForm] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const addCoupon = () => {
        const discountVal = Number(couponInput.discount_percentage);
        if (couponInput.code && discountVal > 0) {
            setFormData(prev => {
                const updatedCoupons = [...(prev.coupons || [])];
                if (editIndex !== null) {
                    updatedCoupons[editIndex] = { ...couponInput, discount_percentage: discountVal };
                } else {
                    updatedCoupons.push({ ...couponInput, discount_percentage: discountVal });
                }
                return { ...prev, coupons: updatedCoupons };
            });
            setCouponInput({
                code: "",
                discount_percentage: "100",
                expires_at: undefined
            });
            setEditIndex(null);
            setShowCouponForm(false);
        }
    };

    const startEditingCoupon = (index: number) => {
        const coupon = formData.coupons![index];
        setCouponInput({
            code: coupon.code,
            discount_percentage: String(coupon.discount_percentage),
            expires_at: coupon.expires_at
        });
        setEditIndex(index);
        setShowCouponForm(true);
    };

    const removeCoupon = (index: number) => {
        setFormData(prev => ({
            ...prev,
            coupons: prev.coupons?.filter((_, i) => i !== index)
        }));
    };

    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
        >
            {}
            <StepHeader
                phase="03"
                title="Presentation"
                highlight="Presentation"
                description="Establish the visual identity and financial value."
                icon={MonitorPlay}
                color="emerald"
            />
            <div className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                            <DollarSign className="w-4.5 h-4.5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-emerald-400">Investment & Value</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Define the financial value and pricing tiers for your students.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group/price">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Tag className="w-4 h-4 text-muted-foreground group-focus-within/price:text-emerald-400 transition-colors" />
                                    Regular Price
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                                    <input
                                        type="number"
                                        value={formData.price === 0 ? "" : formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value === "" ? 0 : Number(e.target.value) }))}
                                        className={cn(inputClasses, "pl-10 h-11 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20", errors.price && "border-red-500/50 focus:border-red-500")}
                                        placeholder="0"
                                    />
                                    {errors.price && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.price}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 group/discount">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <DollarSign className="w-4 h-4 text-muted-foreground group-focus-within/discount:text-emerald-400 transition-colors" />
                                    Discount Price <span className="text-[9px] font-normal lowercase opacity-50 ml-1">(Optional)</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                                    <input
                                        type="number"
                                        value={formData.discount_price === null ? "" : formData.discount_price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value === "" ? null : Number(e.target.value) }))}
                                        className={cn(inputClasses, "pl-10 h-11 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20", errors.discount_price && "border-red-500/50 focus:border-red-500")}
                                        placeholder="0"
                                    />
                                    {errors.discount_price && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.discount_price}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                            <ImageIcon className="w-4.5 h-4.5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-emerald-400">Visual Identity</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Establish the course's visual presence and trailer video.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-12 lg:col-span-12 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-7 space-y-4 group/thumbnail">
                                        <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                            <ImageIcon className="w-4 h-4 text-muted-foreground group-focus-within/thumbnail:text-emerald-400 transition-colors" />
                                            Course Thumbnail <span className="text-[9px] font-normal lowercase opacity-50 ml-1">(1280x720 recommended)</span>
                                        </label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            className={cn(
                                                "relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group/upload",
                                                isDragging ? "border-emerald-500 bg-emerald-500/10" : (errors.thumbnail_url ? "border-red-500/30 bg-red-500/5" : "border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 hover:border-emerald-500/30 hover:bg-emerald-500/5")
                                            )}
                                        >
                                            {(formData.thumbnail_url || thumbnailPreview) ? (
                                                <>
                                                    <Image 
                                                        src={thumbnailPreview || formData.thumbnail_url || ""} 
                                                        alt="Thumbnail" 
                                                        fill 
                                                        unoptimized
                                                        className="object-cover transition-transform duration-500 group-hover/upload:scale-105" 
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                                        <div className="p-3 rounded-full bg-white/20 text-white shadow-xl transform scale-90 group-hover/upload:scale-100 transition-transform"><Upload className="w-6 h-6" /></div>
                                                        <div onClick={(e) => { e.stopPropagation(); removeThumbnail(); }} className="p-3 rounded-full bg-red-500/40 text-white shadow-xl transform scale-90 group-hover/upload:scale-100 transition-transform"><X className="w-6 h-6" /></div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                                                    <div className="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover/upload:scale-110 transition-transform">
                                                        <Upload className="w-7 h-7 text-emerald-500/40" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-slate-700 dark:text-white uppercase tracking-wider">Drop Cover Asset</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">Recommended size: 16:9 aspect ratio</p>
                                                    </div>
                                                </div>
                                            )}
                                            {isUploadingThumbnail && (
                                                <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                                                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        {errors.thumbnail_url && (
                                            <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 px-2">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                                {errors.thumbnail_url}
                                            </p>
                                        )}
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image}
                            <div className="space-y-4">
                                {!formData.coupons?.length ? (
                                    <div className="py-14 sm:py-20 flex flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-white/5 text-slate-400/50 transition-colors hover:border-emerald-500/20 group/empty">
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover/empty:scale-110 transition-transform">
                                            <Tag className="w-8 h-8 text-emerald-500/40" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-center px-6">No Promotional Hooks Found</p>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
                                        <div className="grid grid-cols-[1fr_80px_1fr_80px] bg-muted/30 border-b border-border/80 px-5 py-3 items-center gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Coupon Code</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center">Benefit</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Expiration</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Actions</span>
                                        </div>
                                        <div className="divide-y divide-border/40">
                                            <AnimatePresence mode="popLayout">
                                                {formData.coupons.map((coupon, i) => (
                                                    <motion.div
                                                        key={coupon.code}
                                                        layout
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.98 }}
                                                        className="grid grid-cols-[1fr_80px_1fr_80px] px-5 py-3 hover:bg-muted/30 transition-all items-center gap-4 group/cp"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover/cp:scale-110 transition-transform">
                                                                <Tag className="w-4 h-4 text-emerald-500" />
                                                            </div>
                                                            <span className="text-[12px] font-black uppercase tracking-[0.1em] text-foreground truncate">
                                                                {coupon.code}
                                                            </span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                                                                {coupon.discount_percentage}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/40" />
                                                            <span className="text-[11px] font-medium text-muted-foreground truncate">
                                                                {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Lifetime'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover/cp:opacity-100 transition-opacity">
                                                            <button
                                                                type="button" 
                                                                onClick={() => startEditingCoupon(i)} 
                                                                className="w-7 h-7 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-all flex items-center justify-center active:scale-90"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                type="button" 
                                                                onClick={() => removeCoupon(i)} 
                                                                className="w-7 h-7 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center active:scale-90"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                            <Users className="w-4.5 h-4.5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-emerald-400">Community & Support</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Connect students with your dedicated social learning spaces.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-6 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2 group/fb">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <Facebook className="w-4 h-4 text-muted-foreground group-focus-within/fb:text-emerald-400 transition-colors" />
                                    Facebook Community
                                </label>
                                <div className="space-y-1">
                                    <input
                                        type="url"
                                        value={formData.community_facebook_url || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, community_facebook_url: e.target.value }))}
                                        placeholder="https://facebook.com/groups/..."
                                        className={cn(inputClasses, "h-11 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 bg-white dark:bg-slate-950", errors.community_facebook_url && "border-red-500/50 focus:border-red-500")}
                                    />
                                    {errors.community_facebook_url && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.community_facebook_url}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 group/wa">
                                <label className={cn(labelClasses, "mb-1.5 scale-95 origin-left text-slate-600 dark:text-slate-300")}>
                                    <MessageCircle className="w-4 h-4 text-muted-foreground group-focus-within/wa:text-emerald-400 transition-colors" />
                                    WhatsApp Group
                                </label>
                                <div className="space-y-1">
                                    <input
                                        type="url"
                                        value={formData.community_whatsapp_url || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, community_whatsapp_url: e.target.value }))}
                                        placeholder="https://chat.whatsapp.com/..."
                                        className={cn(inputClasses, "h-11 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 bg-white dark:bg-slate-950", errors.community_whatsapp_url && "border-red-500/50 focus:border-red-500")}
                                    />
                                    {errors.community_whatsapp_url && (
                                        <p className="text-[10px] text-red-500 font-bold ml-1 flex items-center gap-1.5 mt-1.5">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            {errors.community_whatsapp_url}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 px-1.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]">
                            <CreditCard className="w-4.5 h-4.5 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-[12px] font-black uppercase tracking-[0.15em] text-emerald-400">Payment Architecture</h3>
                            <p className="text-[9px] font-medium text-slate-500 dark:text-white/30 tracking-tight">Configure automated gateways and manual mobile banking channels.</p>
                        </div>
                    </div>
                    <div className="p-5 md:p-6 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl shadow-lg dark:shadow-2xl space-y-8 transition-all hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-white/10 group/section">
                        {}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-slate-950 border border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)] relative overflow-hidden group/auto">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] translate-x-8 -translate-y-8 rotate-12">
                                <Wallet className="w-48 h-48 text-emerald-500" />
                            </div>
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-[#e2136e] flex items-center justify-center p-3 group-hover/auto:scale-105 transition-transform shadow-[0_4px_15px_-5px_rgba(226,19,110,0.3)] border border-white/10">
                                    <Image src="/payment-icons/bKash.svg" alt="bKash" width={40} height={40} className="object-contain brightness-0 invert" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-[12px] font-black uppercase tracking-wider text-white">Direct bKash Integration</h4>
                                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-tighter border border-emerald-500/20">Official API</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-tight max-w-[280px]">Automate student registration with instant payment verification via bKash gateway.</p>
                                </div>
                            </div>
                            <div className="relative z-10 flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Gateway Status</p>
                                    <span className={cn("text-[10px] font-black uppercase tracking-widest", formData.bkash_automatic_enabled ? "text-emerald-400" : "text-slate-600")}>
                                        {formData.bkash_automatic_enabled ? "Active" : "Offline"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, bkash_automatic_enabled: !prev.bkash_automatic_enabled }))}
                                    className={cn(
                                        "w-14 h-7 rounded-full transition-all relative flex items-center px-1.5 border",
                                        formData.bkash_automatic_enabled 
                                            ? "bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_-5px_rgba(16,185,129,0.5)]" 
                                            : "bg-slate-800 border-white/10"
                                    )}
                                >
                                    <motion.div
                                        animate={{ x: formData.bkash_automatic_enabled ? 28 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        className={cn("w-4 h-4 rounded-full shadow-lg", formData.bkash_automatic_enabled ? "bg-emerald-400" : "bg-slate-600")}
                                    />
                                </button>
                            </div>
                        </div>

                        {}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-2.5">
                                    <Smartphone className="w-4 h-4 text-emerald-500/60" />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Manual Settlement Channels</h4>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Live Acceptance</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {[
                                    { id: 'bkash', name: 'bKash', icon: '/payment-icons/bKash.svg', color: '#e2136e', desc: 'Personal/Merchant' },
                                    { id: 'nagad', name: 'Nagad', icon: '/payment-icons/nagad.svg', color: '#f7941d', desc: 'Personal Only' },
                                    { id: 'upay', name: 'Upay', icon: '/payment-icons/upay.svg', color: '#fed430', desc: 'Agent/Personal' },
                                    { id: 'rocket', name: 'Rocket', icon: '/payment-icons/rocket.svg', color: '#8c3494', desc: 'DBBL Account' }
                                ].map((method) => {
                                    const value = (formData.manual_payment_methods as any)?.[method.id] || "";
                                    const isActive = value.length > 5;

                                    return (
                                        <div key={method.id} className="p-5 rounded-2xl bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 space-y-5 hover:border-emerald-500/30 transition-all group/method relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] translate-x-16 -translate-y-16 pointer-events-none transition-transform group-hover/method:scale-110">
                                                <Image src={method.icon} alt="" width={128} height={128} />
                                            </div>
                                            
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div 
                                                        className="w-12 h-12 rounded-xl flex items-center justify-center p-2.5 shadow-sm border border-white/10"
                                                        style={{ backgroundColor: method.color }}
                                                    >
                                                        <Image src={method.icon} alt={method.name} width={28} height={28} className="object-contain brightness-0 invert" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[12px] font-black uppercase tracking-wider text-slate-900 dark:text-white block">{method.name}</span>
                                                        <span className="text-[9px] font-medium text-slate-400 tracking-tight">{method.desc}</span>
                                                    </div>
                                                </div>
                                                <div className={cn(
                                                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border transition-colors",
                                                    isActive 
                                                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                                        : "bg-slate-100 dark:bg-white/5 text-slate-400 border-transparent"
                                                )}>
                                                    {isActive ? "Connected" : "Inactive"}
                                                </div>
                                            </div>

                                            <div className="relative group/in z-10">
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 pl-4 pointer-events-none">
                                                    <span className="text-[11px] font-black text-emerald-500/60 tracking-tighter">+880</span>
                                                    <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={value}
                                                    onChange={(e) => {
                                                        const numValue = e.target.value.replace(/\D/g, "").slice(0, 10);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            manual_payment_methods: {
                                                                ...(prev.manual_payment_methods || {}),
                                                                [method.id]: numValue
                                                            }
                                                        }));
                                                    }}
                                                    placeholder="1XXXXXXXXX"
                                                    className={cn(inputClasses, "pl-16 h-11 text-[13px] font-bold tracking-[0.2em] placeholder:text-[11px] placeholder:tracking-widest placeholder:opacity-20 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all bg-white dark:bg-slate-900", isActive && "border-emerald-500/30")}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
