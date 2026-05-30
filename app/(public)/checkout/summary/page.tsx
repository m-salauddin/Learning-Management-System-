"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import { 
    CheckCircle2, 
    XCircle, 
    Loader2, 
    ArrowRight,
    Home,
    CreditCard,
    Receipt,
    Calendar,
    BadgeCheck,
    AlertCircle,
    Copy,
    X,
    MessageCircle,
    Hash,
    User,
    Lock,
    Zap,
    BookOpen,
    Clock,
    Users,
} from "lucide-react";
import { verifyBkashTransaction } from "@/lib/actions/bkash";
import { getTransactionById } from "@/lib/actions/payments";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PrimaryCTAButton, SecondaryCTAButton } from "@/components/ui/CTAButton";


function InfoRow({ label, value, icon: Icon, highlight = false, copyable = false }: { label: string, value: string, icon?: any, highlight?: boolean, copyable?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex justify-between items-center py-3.5 border-b border-slate-300 dark:border-white/5 last:border-0 group/row">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center transition-all group-hover/row:scale-110 group-hover/row:bg-primary/20">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                )}
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={cn(
                    "text-sm sm:text-base font-semibold tracking-wide transition-colors",
                    highlight ? "text-primary px-3 py-1 bg-primary/10 rounded-lg" : "text-slate-900 dark:text-white"
                )}>
                    {value}
                </span>
                {copyable && (
                    <button 
                        onClick={handleCopy}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-lg transition-all opacity-0 group-hover/row:opacity-100 backdrop-blur-md",
                            copied ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-primary/20 hover:text-primary border border-slate-300 dark:border-white/10"
                        )}
                    >
                        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                )}
            </div>
        </div>
    );
}

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

function SummaryContent() {
    const t = useTranslations("CheckoutSummary");
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentID = searchParams.get("paymentID");
    const transactionID = searchParams.get("transaction_id");
    const statusParam = searchParams.get("status");
    const messageParam = searchParams.get("message");
    
    const [isLoading, setIsLoading] = useState(!!paymentID || !!transactionID);
    const [result, setResult] = useState<{ 
        status: string; 
        success: boolean; 
        error?: string;
        data?: any;
    } | null>(null);

    
    const getCourse = () => result?.data?.transaction?.course || result?.data?.course || null;
    const getUser = () => result?.data?.transaction?.user || result?.data?.user || null;
    const getTransaction = () => result?.data?.transaction || null;

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (paymentID) {
            handleVerify(paymentID);
        } else if (transactionID) {
            handleManualVerify(transactionID);
        } else if (statusParam === 'cancel' || statusParam === 'failure') {
            setResult({
                status: statusParam === 'cancel' ? 'Cancelled' : 'Failure',
                success: false,
                error: messageParam || (statusParam === 'cancel' ? "User cancelled the payment" : "Payment failed")
            });
            setIsLoading(false);
        }
    }, [paymentID, transactionID, statusParam, messageParam]);

    const handleVerify = async (id: string) => {
        try {
            const res = await verifyBkashTransaction(id);
            if (res.success && res.data) {
                setResult({ status: res.data.status, success: true, data: res.data });
            } else {
                setResult({ status: 'Error', success: false, error: res.error });
            }
        } catch (err: any) {
            setResult({ status: 'Error', success: false, error: "System verification error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualVerify = async (id: string) => {
        try {
            const res = await getTransactionById(id);
            if (res.success && res.data) {
                setResult({ 
                    status: res.data.status, 
                    success: true, 
                    data: { 
                        transaction: res.data, 
                        user: res.data.user 
                    } 
                });
            } else {
                setResult({ status: 'Error', success: false, error: res.error });
            }
        } catch (err: any) {
            setResult({ status: 'Error', success: false, error: "Verification error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-accent/20 rounded-[2.5rem] blur-xl opacity-50 transition-all duration-1000 group-hover:opacity-80 animate-pulse" />
                        <div className="relative size-32 bg-card border border-border/50 rounded-[2.5rem] flex items-center justify-center shadow-2xl overflow-hidden">
                            <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent" />
                            <Loader2 className="size-16 text-primary animate-spin" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{t("loading.title")}</h2>
                <p className="text-muted-foreground animate-pulse max-w-xs mx-auto">
                    {t("loading.description")}
                </p>
            </div>
        );
    }

    const isSuccess = result?.success && (result.status === 'Completed' || result.status === 'completed');
    const isPending = result?.success && (result.status === 'pending');
    const isCancelled = result?.status === 'Cancelled' || statusParam === 'cancel';
    const isError = !isSuccess && !isCancelled && !isPending;

    const course = getCourse();
    const txUser = getUser();
    const transaction = getTransaction();

    const handleDownloadReceipt = () => {
        if (!isSuccess) return;

        // 1. Create a high-res canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1500;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Work in 600x750 scaled coordinate space for razor-sharp text
        ctx.scale(2, 2);

        // Background
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 600, 750);

        // White card panel
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(30, 30, 540, 690, 24);
        } else {
            ctx.rect(30, 30, 540, 690);
        }
        ctx.fill();

        // Premium multi-stop gradient border stroke
        const grad = ctx.createLinearGradient(30, 30, 570, 720);
        grad.addColorStop(0, '#f43f5e'); // primary/rose-500
        grad.addColorStop(0.5, '#6366f1'); // violet-500
        grad.addColorStop(1, '#3b82f6'); // blue-500
        ctx.strokeStyle = grad;
        ctx.lineWidth = 3;
        ctx.stroke();

        // 1. Header logo
        ctx.font = 'bold 24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('DOKKHO IT', 60, 80);

        ctx.font = '500 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('LEARN FROM THE BEST', 60, 98);

        // Invoice title
        ctx.textAlign = 'right';
        ctx.font = 'bold 16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#6366f1';
        ctx.fillText('OFFICIAL RECEIPT', 540, 80);

        // Date
        const dateStr = transaction?.created_at 
            ? new Date(transaction.created_at).toLocaleString() 
            : new Date().toLocaleString();
        ctx.font = '500 11px system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Date: ${dateStr}`, 540, 98);

        // Divider
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, 120);
        ctx.lineTo(540, 120);
        ctx.stroke();

        // 2. Status badge
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(60, 140, 180, 36, 12);
        } else {
            ctx.rect(60, 140, 180, 36);
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.stroke();

        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillStyle = '#059669';
        ctx.fillText('✓  PAYMENT VERIFIED', 80, 162);

        // Amount Box
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(330, 140, 210, 80, 16);
        } else {
            ctx.rect(330, 140, 210, 80);
        }
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('TOTAL AMOUNT PAID', 435, 165);

        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        const amountVal = `৳${result?.data?.transaction?.amount || result?.data?.bkashData?.amount || '0.00'}`;
        ctx.fillText(amountVal, 435, 198);

        // Customer Details block
        ctx.textAlign = 'left';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('ISSUED TO:', 60, 210);

        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(txUser?.name || 'Valued Learner', 60, 230);

        ctx.font = '500 12px system-ui, sans-serif';
        ctx.fillStyle = '#475569';
        ctx.fillText(txUser?.email || '', 60, 248);

        // Modern Transaction Table
        ctx.fillStyle = '#fafbfe';
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(60, 280, 480, 280, 16);
        } else {
            ctx.rect(60, 280, 480, 280);
        }
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();

        // Table Header
        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText('Item Description', 80, 312);
        
        ctx.textAlign = 'right';
        ctx.fillText('Details', 520, 312);

        // Header line
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(80, 325);
        ctx.lineTo(520, 325);
        ctx.stroke();

        // Details mapping
        const rows = [
            { label: 'Course Title', value: course?.title || 'N/A' },
            { label: 'Course Base Price', value: course?.price ? `৳${course.price.toLocaleString()}` : 'N/A' },
            { label: 'Total Paid', value: amountVal },
            { label: 'Payment Method', value: paymentID ? 'bKash (Instant)' : 'Online Payment' },
            { label: 'Transaction ID (TrxID)', value: transaction?.payment_intent_id || result?.data?.bkashData?.trxID || transactionID || 'N/A' },
            { label: 'Payment ID', value: paymentID || 'N/A' },
        ];

        let yPos = 355;
        rows.forEach((row) => {
            ctx.textAlign = 'left';
            ctx.font = '500 12px system-ui, sans-serif';
            ctx.fillStyle = '#64748b';
            ctx.fillText(row.label, 80, yPos);

            ctx.textAlign = 'right';
            ctx.font = 'bold 12px system-ui, sans-serif';
            ctx.fillStyle = '#0f172a';

            // Wrap course name if it's too long
            if (row.label === 'Course Title' && row.value.length > 30) {
                const line = row.value.substring(0, 27) + '...';
                ctx.fillText(line, 520, yPos);
            } else {
                ctx.fillText(row.value, 520, yPos);
            }

            // Sub-divider line
            ctx.strokeStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.moveTo(80, yPos + 12);
            ctx.lineTo(520, yPos + 12);
            ctx.stroke();

            yPos += 36;
        });

        // 3. Seal and footer
        ctx.textAlign = 'center';
        ctx.font = '500 12px system-ui, sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('This is a verified electronic receipt issued by Dokkho IT.', 300, 595);

        ctx.font = 'bold 13px system-ui, sans-serif';
        ctx.fillStyle = '#6366f1';
        ctx.fillText('Thank you for choosing Dokkho IT! 🚀', 300, 620);

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(80, 650);
        ctx.lineTo(520, 650);
        ctx.stroke();

        ctx.font = 'bold 10px system-ui, sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('SECURE PAYMENT SYSTEM  |  DOKKHOIT.COM', 300, 675);

        // 4. Download Trigger
        const dataUrl = canvas.toDataURL('image/png');
        const trigger = document.createElement('a');
        trigger.download = `DokkhoIT_Receipt_${transaction?.payment_intent_id || result?.data?.bkashData?.trxID || 'Transaction'}.png`;
        trigger.href = dataUrl;
        trigger.click();
    };

    return (
        <div className="min-h-screen bg-background relative flex flex-col items-center pt-40 pb-16 px-6 overflow-hidden selection:bg-primary/20">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="w-full max-w-2xl relative z-10"
            >
                <motion.div variants={staggerItem} className="text-center mb-5">
                    <div className="inline-flex relative mb-3">
                        <div className={cn(
                            "size-20 rounded-[2rem] flex items-center justify-center relative z-10 border shadow-2xl backdrop-blur-3xl",
                            isSuccess ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                            isPending ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            isCancelled ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                            "bg-red-500/10 border-red-500/20 text-red-500"
                        )}>
                            {isSuccess ? <CheckCircle2 className="size-10" strokeWidth={1.5} /> : 
                             isPending ? <Clock className="size-10" strokeWidth={1.5} /> :
                             isCancelled ? <X className="size-10" strokeWidth={1.5} /> : 
                             <XCircle className="size-10" strokeWidth={1.5} />}
                        </div>
                        <div className={cn(
                            "absolute inset-0 blur-2xl opacity-40 rounded-full",
                            isSuccess ? "bg-emerald-500" : isCancelled ? "bg-amber-500" : "bg-red-500"
                        )} />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-semibold mb-2 tracking-tighter leading-[1.1]">
                        {isSuccess ? (
                            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{t("success.title")}</span>
                        ) : isPending ? (
                            <>
                                <span className="text-slate-900 dark:text-white">{t("pending.title1")} </span>
                                <span className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">{t("pending.title2")}</span>
                            </>
                        ) : isCancelled ? (
                            <>
                                <span className="text-slate-900 dark:text-white">{t("cancelled.title1")} </span>
                                <span className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">{t("cancelled.title2")}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-slate-900 dark:text-white">{t("error.title1")} </span>
                                <span className="bg-linear-to-r from-rose-500 via-red-600 to-rose-700 bg-clip-text text-transparent">{t("error.title2")}</span>
                            </>
                        )}
                    </h1>
                    <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
                        {isSuccess ? t("success.description") : 
                         isPending ? t("pending.description") :
                         isCancelled ? t("cancelled.description") : 
                         result?.error || t("error.description")}
                    </p>
                </motion.div>

                <motion.div variants={staggerItem} className="bg-white dark:bg-slate-900/60 border border-slate-300 dark:border-white/10 backdrop-blur-2xl rounded-[2rem] overflow-hidden shadow-2xl relative">
                    {(isSuccess || isPending) && course && (
                        <div className="p-3 pb-0">
                            <div className="relative aspect-video sm:aspect-21/9 bg-slate-950 overflow-hidden rounded-[1.8rem] group/course ring-1 ring-white/5">
                                <Image 
                                    src={course.thumbnail_url || "/placeholder-course.jpg"} 
                                    alt="Course" 
                                    fill 
                                    unoptimized
                                    className="object-cover opacity-80 group-hover/course:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BadgeCheck className="w-4 h-4 text-emerald-400" />
                                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">{t("success.badge")}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight leading-tight">
                                            {course.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="hidden sm:flex items-center gap-6 pb-1">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 backdrop-blur-md flex items-center justify-center border border-blue-500/20 mb-1">
                                                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col items-center leading-none">
                                                <span className="text-xs font-semibold text-white">{course.total_lessons ?? 0}</span>
                                                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-tighter">Lessons</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center text-white">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 backdrop-blur-md flex items-center justify-center border border-blue-500/20 mb-1">
                                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col items-center leading-none text-white">
                                                <span className="text-xs font-semibold text-white">{course.total_students ?? 0}</span>
                                                <span className="text-[10px] font-semibold text-white/50 uppercase tracking-tighter">Students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="p-5 sm:p-6 space-y-1">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight leading-none mb-1">{t("details.title")}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-widest">{t("details.verified")}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-primary font-semibold uppercase tracking-[0.15em] mb-1">{t("details.totalPaid")}</p>
                                <p className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">
                                    ৳{result?.data?.transaction?.amount || result?.data?.bkashData?.amount || '0.00'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-0">
                            {course?.title && (
                                <InfoRow label={t("details.courseName")} value={course.title} icon={BookOpen} />
                            )}
                            
                            {paymentID && <InfoRow label={t("details.paymentId")} value={paymentID} icon={Hash} copyable />}
                            
                            {(transaction?.payment_intent_id || result?.data?.bkashData?.trxID) ? (
                                <InfoRow label={t("details.bkashTrx")} value={transaction?.payment_intent_id || result?.data?.bkashData?.trxID} icon={CreditCard} copyable />
                            ) : null}

                            <InfoRow label={t("details.status")} value={result?.status || (isCancelled ? 'Cancelled' : 'Failed')} highlight icon={BadgeCheck} />
                            
                            <InfoRow 
                                label={t("details.dateTime")} 
                                value={mounted && transaction?.created_at ? new Date(transaction.created_at).toLocaleString() : (mounted ? new Date().toLocaleString() : 'Loading...')} 
                                icon={Calendar} 
                            />
                            
                            {(isSuccess || isPending) && txUser?.email && <InfoRow label={t("details.account")} value={txUser.email} icon={User} />}
                        </div>

                        {!isSuccess && result?.data?.bkashData?.statusMessage && (
                            <div className="mt-8 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10 flex gap-4 ring-1 ring-rose-500/20">
                                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                    <AlertCircle className="size-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1.5 leading-none">{t("details.gatewayStatus")}</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">{result.data.bkashData.statusMessage}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-300 dark:border-white/5 backdrop-blur-3xl">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            {isSuccess || isPending ? (
                                <PrimaryCTAButton 
                                    onClick={() => router.push(isSuccess ? '/dashboard/my-courses' : '/dashboard')}
                                    className="min-w-[170px] h-10! rounded-xl! relative overflow-hidden group/cta px-5"
                                >
                                    <span className="text-sm font-semibold tracking-tight">{isSuccess ? t("actions.start") : t("actions.dashboard")}</span>
                                </PrimaryCTAButton>
                            ) : (
                                <PrimaryCTAButton 
                                    onClick={() => router.back()}
                                    className="min-w-[170px] h-10! rounded-xl! bg-primary shadow-rose-500/20 px-5"
                                >
                                    <span className="text-base text-white font-semibold">{t("actions.retry")}</span>
                                </PrimaryCTAButton>
                            )}

                            {isSuccess && (
                                <SecondaryCTAButton 
                                    onClick={handleDownloadReceipt}
                                    className="min-w-[170px] h-10! rounded-xl! bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/30 px-5 text-emerald-600 dark:text-emerald-400 group/receipt"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Receipt className="size-4 group-hover/receipt:scale-110 transition-transform" />
                                        <span className="text-sm font-semibold tracking-tight">{t("actions.downloadReceipt")}</span>
                                    </div>
                                </SecondaryCTAButton>
                            )}
                            
                            <SecondaryCTAButton 
                                onClick={() => router.push('/')}
                                className="min-w-[170px] h-10! rounded-xl! bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 px-5"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <Home className="size-4" />
                                    <span className="text-base font-semibold text-slate-700 dark:text-white/90 tracking-tight">{t("actions.home")}</span>
                                </div>
                            </SecondaryCTAButton>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-8 border-t border-slate-300 dark:border-white/5 pt-6">
                            <a href="#" className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    <MessageCircle className="size-3" />
                                </div>
                                {t("actions.support")}
                            </a>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10" />
                            <button 
                                onClick={handleDownloadReceipt}
                                disabled={!isSuccess}
                                className="group flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500 hover:text-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-500"
                            >
                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    <Receipt className="size-3" />
                                </div>
                                {t("actions.invoices")}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={staggerItem} className="mt-10 flex flex-col items-center gap-6">
                    <div className="flex justify-center items-center gap-12 transition-opacity">
                        <div className="flex flex-col items-center gap-2.5 group">
                            <div className="h-8 flex items-center justify-center">
                                <img 
                                    src="/payment-icons/bKash.svg" 
                                    alt="bKash" 
                                    className="h-7 object-contain brightness-0 invert opacity-90" 
                                />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white">{t("footer.provider")}</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2.5 text-slate-900 dark:text-white">
                             <div className="h-8 flex items-center justify-center">
                                 <BadgeCheck className="size-7" strokeWidth={2} />
                             </div>
                            <span className="text-xs font-semibold uppercase tracking-widest">{t("footer.verified")}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Lock className="w-2.5 h-2.5 text-emerald-500" />
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-emerald-400 uppercase tracking-widest">
                            {t("footer.secure")}
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function PaymentSummaryPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        }>
            <SummaryContent />
        </Suspense>
    );
}
