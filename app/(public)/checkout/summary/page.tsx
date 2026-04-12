"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <div className="flex items-center gap-3">
                <span className={cn(
                    "text-xs sm:text-sm font-black tracking-wide transition-colors",
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
    }, [paymentID, transactionID, statusParam]);

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
                <h2 className="text-2xl font-bold mb-2">Finalizing Payment...</h2>
                <p className="text-muted-foreground animate-pulse max-w-xs mx-auto">
                    We're securely communicating with bKash to confirm your transaction details.
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

                    <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter leading-[1.1]">
                        {isSuccess ? (
                            <span className="bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Congratulations!</span>
                        ) : isPending ? (
                            <>
                                <span className="text-slate-900 dark:text-white">Submission </span>
                                <span className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">Received</span>
                            </>
                        ) : isCancelled ? (
                            <>
                                <span className="text-slate-900 dark:text-white">Transaction </span>
                                <span className="bg-linear-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">Cancelled</span>
                            </>
                        ) : (
                            <>
                                <span className="text-slate-900 dark:text-white">Payment </span>
                                <span className="bg-linear-to-r from-rose-500 via-red-600 to-rose-700 bg-clip-text text-transparent">Error</span>
                            </>
                        )}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-bold max-w-md mx-auto leading-relaxed">
                        {isSuccess ? "Your journey begins now. Access to your course has been activated instantly." : 
                         isPending ? "We've received your payment details. Our team will verify it within 1-6 hours." :
                         isCancelled ? "The payment was not completed. You can try again whenever you're ready." : 
                         result?.error || "We encountered an issue with your payment gateway. Please contact support."}
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
                                    className="object-cover opacity-80 group-hover/course:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <BadgeCheck className="w-4 h-4 text-emerald-400" />
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Enrolled Successfully</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                                            {course.title}
                                        </h3>
                                    </div>
                                    
                                    <div className="hidden sm:flex items-center gap-6 pb-1">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 backdrop-blur-md flex items-center justify-center border border-blue-500/20 mb-1">
                                                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col items-center leading-none">
                                                <span className="text-xs font-black text-white">{course.total_lessons ?? 0}</span>
                                                <span className="text-[8px] font-black text-white/50 uppercase tracking-tighter">Lessons</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center text-white">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 backdrop-blur-md flex items-center justify-center border border-blue-500/20 mb-1">
                                                <Users className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col items-center leading-none text-white">
                                                <span className="text-xs font-black text-white">{course.total_students ?? 0}</span>
                                                <span className="text-[8px] font-black text-white/50 uppercase tracking-tighter">Students</span>
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
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-1">Payment Details</h2>
                                <p className="text-[9px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">Transaction Verified</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] mb-1">Total Paid</p>
                                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-sm">
                                    ৳{result?.data?.transaction?.amount || result?.data?.bkashData?.amount || '0.00'}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-0">
                            {course?.title && (
                                <InfoRow label="Course Name" value={course.title} icon={BookOpen} />
                            )}
                            
                            {paymentID && <InfoRow label="Payment ID" value={paymentID} icon={Hash} copyable />}
                            
                            {(transaction?.payment_intent_id || result?.data?.bkashData?.trxID) ? (
                                <InfoRow label="bKash TRX ID" value={transaction?.payment_intent_id || result?.data?.bkashData?.trxID} icon={CreditCard} copyable />
                            ) : null}

                            <InfoRow label="Payment Status" value={result?.status || (isCancelled ? 'Cancelled' : 'Failed')} highlight icon={BadgeCheck} />
                            
                            <InfoRow 
                                label="Date & Time" 
                                value={mounted && transaction?.created_at ? new Date(transaction.created_at).toLocaleString() : (mounted ? new Date().toLocaleString() : 'Loading...')} 
                                icon={Calendar} 
                            />
                            
                            {(isSuccess || isPending) && txUser?.email && <InfoRow label="Account" value={txUser.email} icon={User} />}
                        </div>

                        {!isSuccess && result?.data?.bkashData?.statusMessage && (
                            <div className="mt-8 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10 flex gap-4 ring-1 ring-rose-500/20">
                                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                    <AlertCircle className="size-5 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1.5 leading-none">Gateway Status</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{result.data.bkashData.statusMessage}</p>
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
                                    <span className="text-xs font-black tracking-tight">{isSuccess ? "Start Learning" : "Go to Dashboard"}</span>
                                </PrimaryCTAButton>
                            ) : (
                                <PrimaryCTAButton 
                                    onClick={() => router.back()}
                                    className="min-w-[170px] h-10! rounded-xl! bg-primary shadow-rose-500/20 px-5"
                                >
                                    <span className="text-base text-white">Retry Payment</span>
                                </PrimaryCTAButton>
                            )}
                            
                            <SecondaryCTAButton 
                                onClick={() => router.push('/')}
                                className="min-w-[170px] h-10! rounded-xl! bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 px-5"
                            >
                                <div className="flex items-center justify-center gap-3">
                                        <Home className="size-4" />
                                    <span className="text-base font-bold text-slate-700 dark:text-white/90 tracking-tight">Back to Home</span>
                                </div>
                            </SecondaryCTAButton>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-8 border-t border-slate-300 dark:border-white/5 pt-6">
                            <a href="#" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    <MessageCircle className="size-3" />
                                </div>
                                Support
                            </a>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10" />
                            <a href="#" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all">
                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    <Receipt className="size-3" />
                                </div>
                                Invoices
                            </a>
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
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Certified Provider</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2.5 text-slate-900 dark:text-white">
                             <div className="h-8 flex items-center justify-center">
                                 <BadgeCheck className="size-7" strokeWidth={2} />
                             </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Verified Order</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/20">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Lock className="w-2.5 h-2.5 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-emerald-400 uppercase tracking-widest">
                            Transaction Securely Encrypted
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
