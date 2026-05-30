"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { Course } from "@/types/lms";
import {
    ShieldCheck,
    CheckCircle2,
    Loader2,
    Info,
    Zap,
    ArrowLeft,
    Sparkles,
    Lock,
    ChevronRight,
    Copy,
    X,
    CreditCard,
    BookOpen,
    Tag,
    Receipt,
    GraduationCap,
    Play,
    Users,
    Radio,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogFooter,
    DialogClose
} from "@/components/ui/Dialog";
import { validateCoupon, createTransaction } from "@/lib/actions/payments";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { initiateBkashPayment } from "@/lib/actions/bkash";

interface CheckoutClientProps {
    course: Course;
    user: any;
    bkashEnabled: boolean;
    manualMethods: {
        bkash?: string;
        nagad?: string;
        upay?: string;
        rocket?: string;
    };
}

type PaymentProvider = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'card' | 'bkash_auto' | null;

const staggerContainer = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const
        },
    },
};

export default function CheckoutClient({ course, user, bkashEnabled, manualMethods }: CheckoutClientProps) {
    const t = useTranslations("Checkout");
    const router = useRouter();
    const { success, error, info, loading } = useToast();

    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(null);
    const [couponCode, setCouponCode] = useState("");
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [transactionId, setTransactionId] = useState("");
    const [senderNumber, setSenderNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);

    // Dynamically calculate available gateways from DB
    const availableGateways = useMemo(() => {
        const gates = [];

        if (bkashEnabled) {
            gates.push({
                id: 'bkash_auto',
                name: 'bKash',
                subtitle: t("payment.autoPortal"),
                icon: <Image src="/payment-icons/bKash.svg" alt="bKash" width={40} height={40} style={{ width: 40, height: 40 }} className="transition-transform duration-500" unoptimized />,
                color: '#D12053',
            });
        }

        if (course.stripe_enabled) {
            gates.push({
                id: 'card',
                name: 'Stripe',
                subtitle: t("payment.instant"),
                icon: <div className="text-white font-semibold italic text-sm tracking-tighter">stripe</div>,
                color: '#4F46E5',
            });
        }

        const manuals = [
            { id: 'bkash', name: 'bKash', filename: 'bKash.svg', color: '#D12053' },
            { id: 'nagad', name: 'Nagad', filename: 'nagad.svg', color: '#F7941D' },
            { id: 'rocket', name: 'Rocket', filename: 'rocket.svg', color: '#8F3B96' },
            { id: 'upay', name: 'Upay', filename: 'upay.svg', color: '#FBC02D' },
        ];

        manuals.forEach(m => {
            if (manualMethods && (manualMethods as any)[m.id]) {
                gates.push({
                    id: m.id,
                    name: m.name,
                    subtitle: t("payment.manualVerify"),
                    icon: <Image src={`/payment-icons/${m.filename}`} alt={m.name} width={40} height={40} style={{ width: 40, height: 40 }} className="transition-transform duration-500" unoptimized />,
                    color: m.color,
                });
            }
        });

        return gates;
    }, [bkashEnabled, manualMethods, course.stripe_enabled, t]);

    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.discount_type === 'percentage') {
            return (course.price * appliedCoupon.discount_value) / 100;
        }
        return appliedCoupon.discount_value;
    }, [appliedCoupon, course.price]);

    const finalPrice = Math.max(0, (course.discount_price || course.price) - discountAmount);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsApplyingCoupon(true);
        try {
            const res = await validateCoupon(couponCode, course.id);
            if (res.valid) {
                setAppliedCoupon(res);
                success(t("coupon.success"));
            } else {
                error(res.error || t("coupon.error"));
                setAppliedCoupon(null);
            }
        } catch (err) {
            error(t("errors.generic"));
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleCheckout = async () => {
        if (!selectedProvider) return error(t("errors.selectMethod"));
        if (!termsAccepted) return error(t("errors.acceptTerms"));

        const isManual = ['bkash', 'nagad', 'rocket', 'upay'].includes(selectedProvider);
        if (isManual) {
            setShowManualModal(true);
            return;
        }

        setIsSubmitting(true);
        try {
            if (selectedProvider === 'bkash_auto') {
                loading(t("summary.processing"));
                const res = await initiateBkashPayment(course.id, appliedCoupon?.code);
                if (!res.success || !res.data) {
                    throw new Error(res.error || t("errors.generic"));
                }
                // Redirect user to bKash
                window.location.href = res.data.bkashURL;
                return; // Prevent resetting isSubmitting as we are redirecting
            }

            // Manual Payment Logic
            const txRes = await createTransaction({
                course_id: course.id,
                coupon_code: appliedCoupon?.code || undefined,
                payment_provider: 'manual',
                payment_intent_id: transactionId,
                payment_method: selectedProvider || 'unknown',
            });

            if (!txRes.success) throw new Error(txRes.error);

            success(t("summary.processing"));
            router.push('/dashboard/my-courses');
        } catch (err: any) {
            error(err.message || t("errors.generic"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!senderNumber.trim()) return error(t("errors.phoneRequired"));
        if (!transactionId.trim()) return error(t("errors.txnRequired"));

        setIsSubmitting(true);
        try {
            const txRes = await createTransaction({
                course_id: course.id,
                coupon_code: appliedCoupon?.code || undefined,
                payment_provider: 'manual',
                payment_intent_id: transactionId,
                payment_method: `${selectedProvider} (${senderNumber})`,
            });

            if (!txRes.success) throw new Error(txRes.error);

            success(t("manual.verifying"));
            setShowManualModal(false);
            router.push(`/checkout/summary?transaction_id=${txRes.data?.transaction_id}`);
        } catch (err: any) {
            error(err.message || t("errors.generic"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const metrics = useMemo(() => [
        { label: t("details.lessons"), value: course.total_lessons || 0, icon: BookOpen, visible: true },
        { label: t("details.students"), value: course.total_students || 0, icon: Users, visible: true },
    ].filter(m => m.visible), [course, t]);

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20 relative overflow-hidden">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-linear-to-br from-primary/15 via-accent/10 to-transparent rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-linear-to-tr from-secondary/15 via-primary/10 to-transparent rounded-full blur-3xl -translate-x-1/4 translate-y-1/4" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-20 pt-32 pb-24">

                {/* ── Page Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    className="mb-10"
                >
                    <Breadcrumbs
                        rootHref="/"
                        rootLabel={t("breadcrumbs.home")}
                        className="mb-6"
                        items={[
                            { label: t("breadcrumbs.courses"), href: "/courses", icon: BookOpen },
                            { label: course.title, href: `/courses/${course.slug}`, icon: GraduationCap },
                            { label: t("breadcrumbs.checkout"), active: true, icon: ShieldCheck }
                        ]}
                    />

                    <div className="inline-flex mb-4">
                        <Badge icon={ShieldCheck}>
                            {t("badge")}
                        </Badge>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-3">
                        {t("title1")}{" "}
                        <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            {t("title2")}
                        </span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        {t("description", { course: course.title })}
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                >
                    {/* ── LEFT COLUMN ── */}
                    <div className="lg:col-span-8 space-y-6">

                        <motion.div
                            variants={staggerItem}
                            className="group relative p-6 bg-white/80 dark:bg-slate-950 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/30"
                        >
                            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 relative z-10">
                                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10">
                                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                </div>
                                {t("details.title")}
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                {/* glow blob */}
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-700 pointer-events-none" />

                                {/* Thumbnail */}
                                <div className="relative w-full sm:w-48 aspect-video rounded-2xl overflow-hidden shrink-0 border border-white/20">
                                    <Image
                                        src={course.thumbnail_url || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, 192px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {/* Gradient Fade */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                                    {/* Play Button */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                                        onClick={() => setShowVideoModal(true)}
                                    >
                                        <div className="w-12 h-12 rounded-full  backdrop-blur-md flex items-center justify-center border border-primary/40 group-hover/play:scale-110  transition-all duration-500 ">
                                            <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 space-y-4 relative z-10">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={cn(
                                            "px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                                            course.level === 'beginner' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                                                course.level === 'intermediate' ? "bg-blue-500/10 border-blue-500/30 text-blue-400" :
                                                    "bg-primary/10 border-primary/30 text-primary"
                                        )}>
                                            {course.level || 'All Levels'}
                                        </span>

                                        <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-secondary/10 border-secondary/30 text-secondary flex items-center gap-1.5">
                                            {course.course_type === 'live' ? <Radio className="size-2.5" /> : <Play className="size-2.5" />}
                                            {course.course_type === 'live' ? 'Live Class' : 'Recorded'}
                                        </span>

                                        {course.batch_no && (
                                            <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-accent/10 border-accent/20 text-accent">
                                                Batch {course.batch_no}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                                        {course.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-6">
                                        {course.rating > 0 && (
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Sparkles key={i} className={cn(
                                                            "w-3 h-3",
                                                            i < Math.floor(course.rating) ? "text-primary fill-primary" : "text-muted-foreground"
                                                        )} />
                                                    ))}
                                                    <span className="text-xs font-bold text-foreground ml-1">{course.rating}</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t("details.rating")}</span>
                                            </div>
                                        )}

                                        {metrics.map((m, i) => (
                                            <div key={i} className="flex flex-col gap-0.5">
                                                <div className="flex items-center gap-1.5 text-foreground">
                                                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center border border-primary/10">
                                                        <m.icon className="w-2.5 h-2.5 text-primary" />
                                                    </div>
                                                    <span className="text-xs font-bold">{m.value}</span>
                                                </div>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{m.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Selection Card */}
                        <motion.div
                            variants={staggerItem}
                            className="group relative p-6 bg-white/80 dark:bg-card/20 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/30"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/15 transition-all duration-700 pointer-events-none" />

                            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 relative z-10">
                                <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                                </div>
                                {t("payment.title")}
                            </h3>

                            <div className={cn(
                                "grid gap-3 sm:gap-4 relative z-10",
                                availableGateways.length > 2
                                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                                    : "grid-cols-1 sm:grid-cols-2"
                            )}>
                                {availableGateways.map((gate) => (
                                    <motion.div
                                        key={gate.id}
                                        layout
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => setSelectedProvider(gate.id as any)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                setSelectedProvider(gate.id as any);
                                            }
                                        }}
                                        className={cn(
                                            "relative flex items-center p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2.2rem] transition-all duration-500 gap-4 sm:gap-5 group/card cursor-pointer border-2",
                                            selectedProvider === gate.id
                                                ? "scale-[1.02] bg-white/10 dark:bg-white/5 border-dashed"
                                                : "bg-white/5 backdrop-blur-md border-border/30 dark:border-border/20 hover:bg-white/10 dark:hover:bg-white/5 hover:border-primary/20"
                                        )}
                                        style={selectedProvider === gate.id ? {
                                            backgroundColor: `${gate.color}15`,
                                            borderColor: gate.color,
                                        } as any : {}}
                                    >
                                        <div
                                            className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-2xl sm:rounded-3xl flex items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover/card:scale-110"
                                            style={{
                                                background: `linear-gradient(135deg, ${gate.color}, ${gate.color}dd)`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent opacity-30" />
                                            <div className="relative z-10 w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center invert brightness-0">
                                                {gate.icon ? (
                                                    gate.icon
                                                ) : (
                                                    <span className="text-xl sm:text-2xl font-semibold text-white">
                                                        {gate.name.slice(0, 1)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Method Text */}
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
                                                <p className="text-sm sm:text-base font-bold text-foreground tracking-tight truncate">
                                                    {gate.name}
                                                </p>
                                                {gate.id === 'bkash_auto' && (
                                                    <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-semibold uppercase tracking-widest shrink-0">
                                                        {t("payment.instant")}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground font-semibold leading-tight opacity-80 line-clamp-1">
                                                {gate.subtitle}
                                            </p>
                                        </div>

                                        {/* Selection indicator */}
                                        <div className="shrink-0 relative z-10">
                                            <div className={cn(
                                                "w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                                selectedProvider === gate.id
                                                    ? "border-transparent"
                                                    : "border-muted-foreground/30"
                                            )}
                                                style={{
                                                    backgroundColor: selectedProvider === gate.id ? gate.color : 'transparent'
                                                }}>
                                                <AnimatePresence>
                                                    {selectedProvider === gate.id && (
                                                        <motion.div
                                                            initial={{ scale: 0, rotate: -45 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: -45 }}
                                                            className="flex items-center justify-center"
                                                        >
                                                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white/20" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* ── RIGHT COLUMN — Summary ── */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                        {/* ── Coupon Section ── */}
                        <motion.div
                            variants={staggerItem}
                            className="group relative p-6 bg-white/80 dark:bg-card/20 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/30"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 relative z-10">
                                <div className="w-7 h-7 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/10">
                                    <Tag className="w-3.5 h-3.5 text-secondary" />
                                </div>
                                {t("coupon.title")}
                            </h3>

                            <div className="relative z-10">
                                <AnimatePresence mode="wait">
                                    {appliedCoupon ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.97 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.97 }}
                                            className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between"
                                        >
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">{t("coupon.applied")}</p>
                                                <p className="text-sm font-bold text-foreground font-mono">{appliedCoupon.code}</p>
                                            </div>
                                            <button
                                                onClick={() => setAppliedCoupon(null)}
                                                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                placeholder={t("coupon.placeholder")}
                                                className="flex-1 bg-background/60 border border-border/80 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isApplyingCoupon || !couponCode}
                                                className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                {isApplyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : t("coupon.button")}
                                            </button>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                        <motion.div
                            variants={staggerItem}
                            className="group relative bg-white/80 dark:bg-card/20 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/30"
                        >
                            {/* glow */}
                            <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none opacity-60 group-hover:bg-primary/15 transition-colors duration-700" />

                            {/* Header */}
                            <div className="p-6 border-b border-border/50 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                                        <Receipt className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground">{t("summary.title")}</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 relative z-10">
                                {/* Price breakdown */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t("summary.originalPrice")}</span>
                                        <span className="line-through text-muted-foreground/60">৳{course.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">{t("summary.afterDiscount")}</span>
                                        <span className="font-semibold text-foreground">৳{course.discount_price?.toLocaleString() || course.price.toLocaleString()}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-between items-center text-sm text-emerald-500 font-semibold"
                                        >
                                            <span className="flex items-center gap-1.5">
                                                <Tag className="w-3 h-3" />
                                                {t("summary.couponDiscount")}
                                            </span>
                                            <span>-৳{((course.discount_price || course.price) - finalPrice).toLocaleString()}</span>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="pt-4 border-t border-border/60">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-foreground">{t("summary.totalPayable")}</span>
                                        <span className="text-4xl font-semibold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                                            ৳{finalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Terms + CTA */}
                                <div className="pt-4 space-y-4">
                                    <div className="flex items-start gap-3 cursor-pointer group/terms">
                                        <AnimatedCheckbox
                                            id="terms"
                                            checked={termsAccepted}
                                            onChange={(checked) => setTermsAccepted(checked)}
                                            label={t("summary.terms")}
                                            className="group-hover/terms:text-foreground transition-colors"
                                        />
                                    </div>

                                    {/* Pay button — mimics PrimaryCTAButton style */}
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isSubmitting || !termsAccepted || !selectedProvider}
                                        className="group/btn w-full flex items-center justify-center gap-3 pl-6 pr-3 py-3 bg-primary hover:bg-primary/90 rounded-full transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                                    >
                                        <span className="text-sm font-bold text-primary-foreground">
                                            {isSubmitting ? t("summary.processing") : t("summary.button")}
                                        </span>
                                        {isSubmitting ? (
                                            <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
                                        ) : (
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-background transition-transform duration-300 -rotate-45 group-hover/btn:rotate-0">
                                                <ChevronRight className="h-4 w-4 text-primary" />
                                            </div>
                                        )}
                                    </button>

                                    {/* Security badge */}
                                    <div className="flex items-center justify-center gap-2 pt-1">
                                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <Lock className="w-2.5 h-2.5 text-emerald-500" />
                                        </div>
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                            {t("summary.security")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Manual Payment Modal */}
            <Dialog open={showManualModal} onClose={() => setShowManualModal(false)} size="md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                            <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        {t("manual.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("manual.description")}
                    </DialogDescription>
                    <DialogClose onClose={() => setShowManualModal(false)} />
                </DialogHeader>

                <DialogBody>
                    <div className="space-y-6">
                        {/* Summary Info */}
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">{t("manual.totalAmount")}</span>
                                <span className="font-semibold text-primary text-lg">৳{finalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm pt-2 border-t border-primary/10">
                                <span className="text-muted-foreground">{t("manual.providerNumber", { provider: selectedProvider?.toUpperCase() || '' })}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-foreground">
                                        {((manualMethods as any)[selectedProvider || ''] || '').startsWith('0')
                                            ? (manualMethods as any)[selectedProvider || '']
                                            : `0${(manualMethods as any)[selectedProvider || '']}`}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const num = (manualMethods as any)[selectedProvider || ''] || '';
                                            const formatted = num.startsWith('0') ? num : `0${num}`;
                                            navigator.clipboard.writeText(formatted);
                                            success(t("manual.copied"));
                                        }}
                                        className="p-1 px-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs uppercase font-semibold transition-all"
                                    >
                                        {t("manual.copy")}
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic text-center">
                                {t("manual.note")}
                            </p>
                        </div>

                        <form id="manual-payment-form" onSubmit={handleManualSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">{t("manual.phoneLabel")}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <input
                                        required
                                        type="tel"
                                        placeholder={t("manual.phonePlaceholder")}
                                        value={senderNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                                            setSenderNumber(val);
                                        }}
                                        className="w-full bg-muted/50 dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{t("manual.phoneHint")}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground">{t("manual.txnLabel")}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        placeholder={t("manual.txnPlaceholder")}
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                                        className="w-full bg-muted/50 dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-mono uppercase"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">{t("manual.txnHint")}</p>
                            </div>
                        </form>
                    </div>
                </DialogBody>

                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => setShowManualModal(false)}
                        className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t("manual.cancel")}
                    </button>
                    <button
                        type="submit"
                        form="manual-payment-form"
                        disabled={isSubmitting}
                        className="flex-1 sm:flex-none px-8 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-xl hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("manual.verifying")}
                            </>
                        ) : (
                            t("manual.submit")
                        )}
                    </button>
                </DialogFooter>
            </Dialog>

            {/* Video Modal */}
            <Dialog open={showVideoModal} onClose={() => setShowVideoModal(false)} size="xl">
                <DialogHeader className="border-none absolute top-4 right-4 z-50 p-0">
                    <DialogTitle className="sr-only">Course Preview</DialogTitle>
                    <button
                        onClick={() => setShowVideoModal(false)}
                        className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <DialogBody className="p-0 bg-black aspect-video flex items-center justify-center overflow-hidden">
                    {course.preview_video_url ? (
                        <iframe
                            src={course.preview_video_url}
                            className="w-full h-full"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        />
                    ) : (
                        <div className="text-white text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                                <Play className="w-8 h-8 text-white/40" />
                            </div>
                            <p className="text-sm font-medium text-white/60">No preview video available</p>
                        </div>
                    )}
                </DialogBody>
            </Dialog>
        </div>
    );
}
