"use client";
import { useState, useEffect } from "react";
import { Play, CheckCircle2, HelpCircle, Trophy, ChevronRight, Clock, Target, RotateCcw, BarChart3, Lock, X, Eye, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizViewProps {
    currentLesson: any;
    quiz: any;
    asset: any;
    userId: string;
    supabase: any;
    enrollmentId?: string;
    onCompleteAndNext: () => void;
}

export function QuizView({ currentLesson, quiz, asset, userId, supabase, enrollmentId, onCompleteAndNext }: QuizViewProps) {
    const [status, setStatus] = useState<'idle' | 'active' | 'finished' | 'review'>('idle');
    const [showRules, setShowRules] = useState(false);
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState<{ score: number; total: number } | null>(null);
    const [loading, setLoading] = useState(true);

    const questions = (quiz?.questions as any) || (currentLesson as any).quiz_data || (asset?.resources as any)?.questions || (asset?.content as any)?.questions || [
        { question: "What is the primary benefit of SSR in Next.js?", options: ["Faster Initial Page Loads", "Smaller Bundles", "Optimized SEO", "All of the above"], correct: "All of the above" },
        { question: "Which hook for client-side navigation in App Router?", options: ["useRouter", "usePathname", "useParams", "useNavigation"], correct: "useRouter" },
        { question: "What does 'use client' signify?", options: ["Runs on device only", "Marks for CSR", "Enables Hooks", "All of the above"], correct: "All of the above" }
    ];

    // Load existing submission on mount
    useEffect(() => {
        if (currentLesson.lesson_type !== 'quiz' || !userId) { setLoading(false); return; }
        (async () => {
            try {
                const { data } = await supabase
                    .from('quiz_submissions')
                    .select('score, total_questions, answers_json')
                    .eq('lesson_id', currentLesson.id)
                    .eq('user_id', userId)
                    .maybeSingle();
                if (data) {
                    setResult({ score: data.score, total: data.total_questions });
                    try {
                        const parsed = typeof data.answers_json === 'string' ? JSON.parse(data.answers_json) : (data.answers_json || {});
                        setSavedAnswers(parsed);
                    } catch { setSavedAnswers({}); }
                    setStatus('finished');
                }
            } catch { }
            setLoading(false);
        })();
    }, [currentLesson.id, userId]);

    useEffect(() => {
        if (status === 'active' && timeLeft > 0) {
            const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
            return () => clearInterval(t);
        } else if (timeLeft === 0 && status === 'active') { finish(); }
    }, [status, timeLeft]);

    const finish = async () => {
        let score = 0;
        questions.forEach((q: any, i: number) => { if (answers[i] === q.correct) score++; });
        setResult({ score, total: questions.length });
        setSavedAnswers(answers);
        setStatus('finished');
        try {
            await supabase.from('quiz_submissions').upsert({
                user_id: userId,
                lesson_id: currentLesson.id,
                score,
                total_questions: questions.length,
                percentage: Math.round((score / questions.length) * 100),
                answers_json: JSON.stringify(answers),
            }, { onConflict: 'user_id,lesson_id' });
        } catch { }
        // Mark lesson as completed in lesson_progress to unlock next lessons
        if (enrollmentId) {
            try {
                await supabase.from('lesson_progress').upsert({
                    user_id: userId,
                    lesson_id: currentLesson.id,
                    enrollment_id: enrollmentId,
                    is_completed: true,
                    completed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'user_id,lesson_id' });
                // Also mark the assessment center for this module as completed
                if (currentLesson.module_id) {
                    await supabase.from('lesson_progress').upsert({
                        user_id: userId,
                        lesson_id: `assessments-${currentLesson.module_id}`,
                        enrollment_id: enrollmentId,
                        is_completed: true,
                        completed_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'user_id,lesson_id' });
                }
            } catch { }
        }
    };

    const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const timerTotal = questions.length * 120;
    const timerPct = timerTotal > 0 ? (timeLeft / timerTotal) * 100 : 100;
    const isUrgent = timeLeft < 60;

    if (currentLesson.lesson_type !== 'quiz') return null;
    if (loading) return <div className="bg-white dark:bg-[#060a14] rounded-2xl border border-slate-200/80 dark:border-white/6 p-16 flex items-center justify-center"><div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

    return (
        <>
            <div className="bg-white dark:bg-[#060a14] rounded-2xl border border-slate-200/80 dark:border-white/6 overflow-hidden shadow-sm">

                {/* ─── IDLE ─── */}
                {status === 'idle' && (
                    <div className="flex flex-col items-center justify-center p-12 text-center space-y-8">
                        <div className="w-20 h-20 rounded-2xl bg-primary/6 border border-primary/15 flex items-center justify-center">
                            <HelpCircle className="w-9 h-9 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{currentLesson.title || "Quiz"}</h2>
                            <p className="text-slate-500 text-sm">Test your understanding of this section.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                            {[
                                { icon: HelpCircle, val: String(questions.length), label: "Questions" },
                                { icon: Clock, val: `${questions.length * 2}`, label: "Minutes" },
                                { icon: Target, val: "80%", label: "Pass Mark" },
                            ].map((s, i) => (
                                <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6 text-center">
                                    <s.icon className="w-4 h-4 text-primary mx-auto mb-2" />
                                    <p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{s.val}</p>
                                    <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2 w-full max-w-sm">
                            <button onClick={() => { setTimeLeft(questions.length * 120); setStatus('active'); }}
                                className="flex-1 py-3.5 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Play className="w-3.5 h-3.5" /> Start Quiz
                            </button>
                            <button onClick={() => setShowRules(true)}
                                className="py-3.5 px-4 bg-slate-100 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-slate-600 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/6 transition-all">
                                Rules
                            </button>
                        </div>
                    </div>
                )}

                {/* ─── ACTIVE ─── */}
                {status === 'active' && (
                    <div className="flex flex-col">
                        <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-[9px] font-bold text-primary uppercase">Live</span>
                                <span className="text-[10px] font-semibold text-slate-500">Question {qIdx + 1} of {questions.length}</span>
                            </div>
                            <div className={cn("px-3 py-1.5 rounded-lg flex items-center gap-2 border", isUrgent ? "bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20" : "bg-slate-100 dark:bg-white/4 border-slate-200/60 dark:border-white/6")}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", isUrgent ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
                                <span className={cn("text-[11px] font-bold font-mono tabular-nums", isUrgent ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-white")}>{fmt(timeLeft)}</span>
                            </div>
                        </div>
                        <div className="h-[2px] w-full bg-slate-100 dark:bg-white/4">
                            <motion.div className={cn("h-full", isUrgent ? "bg-red-500" : "bg-primary")} animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }} />
                        </div>
                        {/* Progress dots */}
                        <div className="px-6 pt-4 flex gap-[3px] flex-wrap">
                            {questions.map((_: any, i: number) => (
                                <button key={i} onClick={() => setQIdx(i)}
                                    className={cn("w-2 h-2 rounded-full transition-all cursor-pointer hover:scale-125",
                                        i === qIdx ? "bg-primary scale-125" : answers[i] !== undefined ? "bg-primary/40" : "bg-slate-200 dark:bg-white/6"
                                    )} />
                            ))}
                        </div>
                        <div className="p-6 lg:p-10 space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div key={qIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.15 }} className="space-y-6">
                                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug">{questions[qIdx]?.question}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        {(questions[qIdx]?.options || []).map((opt: string, i: number) => (
                                            <button key={i} onClick={() => setAnswers(p => ({ ...p, [qIdx]: opt }))}
                                                className={cn("p-4 rounded-xl border transition-all text-left flex items-center justify-between group/opt",
                                                    answers[qIdx] === opt
                                                        ? "bg-primary/6 border-primary/25 text-slate-900 dark:text-white"
                                                        : "bg-slate-50 dark:bg-white/2 border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/2"
                                                )}>
                                                <span className="text-[13px] font-medium">{opt}</span>
                                                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-4",
                                                    answers[qIdx] === opt ? "border-primary bg-primary" : "border-slate-300 dark:border-white/15"
                                                )}>
                                                    {answers[qIdx] === opt && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <button onClick={() => setQIdx(p => Math.max(0, p - 1))} disabled={qIdx === 0}
                                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white font-bold text-[10px] uppercase tracking-wider disabled:opacity-20 transition-all">Back</button>
                            <span className="text-[9px] font-semibold text-slate-400 tabular-nums">{Object.keys(answers).length}/{questions.length} answered</span>
                            {qIdx === questions.length - 1 ? (
                                <button onClick={finish} disabled={answers[qIdx] === undefined} className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Finish
                                </button>
                            ) : (
                                <button onClick={() => setQIdx(p => p + 1)} disabled={answers[qIdx] === undefined} className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed">
                                    Next <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── FINISHED (Summary) ─── */}
                {status === 'finished' && result && (
                    <div className="p-8 lg:p-10">
                        <div className="flex flex-col items-center text-center space-y-8">
                            <div className={cn("w-20 h-20 rounded-2xl border flex items-center justify-center",
                                result.score / result.total >= 0.8
                                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                                    : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20"
                            )}>
                                {result.score / result.total >= 0.8
                                    ? <Trophy className="w-9 h-9 text-emerald-500" />
                                    : <X className="w-9 h-9 text-red-500" />}
                            </div>
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                                    {result.score / result.total >= 0.8 ? "Quiz Passed!" : "Quiz Not Passed"}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    {result.score / result.total >= 0.8
                                        ? "Great work! You've demonstrated strong understanding."
                                        : "You scored below the 80% pass mark."}
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Score</p>
                                    <p className={cn("text-2xl font-bold tabular-nums", result.score / result.total >= 0.8 ? "text-emerald-500" : "text-red-500")}>
                                        {Math.round((result.score / (result.total || 1)) * 100)}%
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Correct</p>
                                    <p className="text-2xl font-bold text-emerald-500 tabular-nums">{result.score}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Wrong</p>
                                    <p className="text-2xl font-bold text-red-500 tabular-nums">{result.total - result.score}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full max-w-md">
                                <button onClick={() => { setQIdx(0); setStatus('review'); }}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-slate-700 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/4 transition-all flex items-center justify-center gap-2">
                                    <Eye className="w-3.5 h-3.5" /> Review Answers
                                </button>
                                <button onClick={onCompleteAndNext}
                                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/15">
                                    Continue <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── REVIEW MODE ─── */}
                {status === 'review' && (
                    <div className="flex flex-col">
                        <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-md bg-violet-100 dark:bg-violet-500/10 text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase">Review</span>
                                <span className="text-[10px] font-semibold text-slate-500">Question {qIdx + 1} of {questions.length}</span>
                            </div>
                            <button onClick={() => setStatus('finished')}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-[10px] font-bold text-slate-600 dark:text-white uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/4 transition-all">
                                Back to Summary
                            </button>
                        </div>
                        {/* Colored dots showing correct/wrong */}
                        <div className="px-6 pt-4 flex gap-[3px] flex-wrap">
                            {questions.map((q: any, i: number) => {
                                const userAns = savedAnswers[i];
                                const isCorrect = userAns === q.correct;
                                return (
                                    <button key={i} onClick={() => setQIdx(i)}
                                        className={cn("w-2.5 h-2.5 rounded-full transition-all cursor-pointer hover:scale-125",
                                            i === qIdx ? "scale-150 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#060a14]" : "",
                                            isCorrect ? "bg-emerald-500 ring-emerald-500" : userAns ? "bg-red-500 ring-red-500" : "bg-slate-300 dark:bg-white/10 ring-slate-300"
                                        )} />
                                );
                            })}
                        </div>
                        <div className="p-6 lg:p-10 space-y-6">
                            <AnimatePresence mode="wait">
                                <motion.div key={qIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.15 }} className="space-y-6">
                                    <div className="flex items-start gap-3">
                                        {savedAnswers[qIdx] === questions[qIdx]?.correct
                                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                                            : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />}
                                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug">{questions[qIdx]?.question}</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        {(questions[qIdx]?.options || []).map((opt: string, i: number) => {
                                            const isCorrect = opt === questions[qIdx]?.correct;
                                            const isUserAnswer = opt === savedAnswers[qIdx];
                                            const isWrong = isUserAnswer && !isCorrect;
                                            return (
                                                <div key={i} className={cn("p-4 rounded-xl border text-left flex items-center justify-between",
                                                    isCorrect ? "bg-emerald-50 dark:bg-emerald-500/6 border-emerald-300 dark:border-emerald-500/25"
                                                        : isWrong ? "bg-red-50 dark:bg-red-500/6 border-red-300 dark:border-red-500/25"
                                                            : "bg-slate-50 dark:bg-white/2 border-slate-200/60 dark:border-white/6"
                                                )}>
                                                    <span className={cn("text-[13px] font-medium",
                                                        isCorrect ? "text-emerald-700 dark:text-emerald-400"
                                                            : isWrong ? "text-red-700 dark:text-red-400"
                                                                : "text-slate-500"
                                                    )}>{opt}</span>
                                                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                                                    {isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <button onClick={() => setQIdx(p => Math.max(0, p - 1))} disabled={qIdx === 0}
                                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white font-bold text-[10px] uppercase disabled:opacity-20 transition-all">Back</button>
                            <span className="text-[9px] font-semibold text-slate-400">{result ? `${result.score}/${result.total} correct` : ''}</span>
                            {qIdx < questions.length - 1 ? (
                                <button onClick={() => setQIdx(p => p + 1)}
                                    className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-[10px] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">
                                    Next <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            ) : (
                                <button onClick={() => setStatus('finished')}
                                    className="px-6 py-2.5 bg-slate-700 dark:bg-white/10 text-white rounded-lg font-bold text-[10px] uppercase hover:opacity-90 active:scale-95 transition-all">
                                    Done
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Rules modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-200 flex items-center justify-center p-4" onClick={() => setShowRules(false)}>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="relative w-full max-w-sm bg-white dark:bg-[#0a0f1e] border border-slate-200/80 dark:border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-bold text-slate-900 dark:text-white">Quiz Rules</h2>
                                <button onClick={() => setShowRules(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="space-y-1.5">
                                {[
                                    { icon: Clock, rule: `${questions.length * 2} minutes`, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                                    { icon: Target, rule: "80% to pass", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                                    { icon: RotateCcw, rule: "Free navigation", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                                    { icon: BarChart3, rule: "Instant results", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10" },
                                    { icon: Lock, rule: "One attempt", color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/3 border border-slate-200/60 dark:border-white/6">
                                        <div className={`w-6 h-6 rounded-md ${item.bg} flex items-center justify-center`}><item.icon className={`w-3 h-3 ${item.color}`} /></div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{item.rule}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
