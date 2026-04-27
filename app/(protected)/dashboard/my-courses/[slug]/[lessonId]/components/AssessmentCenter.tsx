"use client";
import { useState, useEffect, useMemo } from "react";
import { Play, CheckCircle2, HelpCircle, Trophy, ChevronRight, Clock, Target, ShieldCheck, X, BarChart3, RotateCcw, Eye, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AssessmentCenterProps {
    currentLesson: any; course: any; userId: string; supabase: any; enrollmentId?: string; onCompleteAndNext: () => void;
}

export function AssessmentCenter({ currentLesson, course, userId, supabase, enrollmentId, onCompleteAndNext }: AssessmentCenterProps) {
    const [status, setStatus] = useState<'idle' | 'active' | 'finished' | 'review'>('idle');
    const [qIdx, setQIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [result, setResult] = useState<{ score: number; total: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [savedAnswers, setSavedAnswers] = useState<Record<number, string>>({});

    const { allQuestions, quizCount, totalTime } = useMemo(() => {
        if (currentLesson.lesson_type !== 'assessment_center') return { allQuestions: [], quizCount: 0, totalTime: 0 };
        const mod = (course.modules || []).find((m: any) => m.id === currentLesson.module_id);
        const quizzes = mod?.quizzes || [];
        const flat: { question: string; options: string[]; correct: string; quizTitle: string; quizIdx: number }[] = [];
        quizzes.forEach((q: any, qi: number) => {
            let parsed: any[] = [];
            try { parsed = typeof q.questions === 'string' ? JSON.parse(q.questions) : (q.questions || []); } catch { parsed = []; }
            parsed.forEach((p: any) => flat.push({ question: p.question, options: p.options || [], correct: p.correct, quizTitle: q.title || `Quiz ${qi + 1}`, quizIdx: qi }));
        });
        return { allQuestions: flat, quizCount: quizzes.length, totalTime: Math.max(quizzes.length * 2 * 60, 120) };
    }, [currentLesson, course.modules]);

    // Check for existing submission on mount
    useEffect(() => {
        if (currentLesson.lesson_type !== 'assessment_center' || !userId) { setLoading(false); return; }
        (async () => {
            try {
                const { data } = await supabase.from('quiz_submissions').select('score, total_questions, answers_json').eq('lesson_id', currentLesson.id).eq('user_id', userId).maybeSingle();
                if (data) {
                    setResult({ score: data.score, total: data.total_questions });
                    try { const parsed = typeof data.answers_json === 'string' ? JSON.parse(data.answers_json) : (data.answers_json || {}); setSavedAnswers(parsed); } catch { setSavedAnswers({}); }
                    setStatus('finished');
                }
            } catch { }
            setLoading(false);
        })();
    }, [currentLesson.id, userId]);

    useEffect(() => {
        if (status === 'active' && timeLeft > 0) { const t = setInterval(() => setTimeLeft(p => p - 1), 1000); return () => clearInterval(t); }
        else if (timeLeft === 0 && status === 'active') finish();
    }, [status, timeLeft]);

    const start = () => { setQIdx(0); setAnswers({}); setResult(null); setTimeLeft(totalTime); setStatus('active'); };

    const finish = async () => {
        let score = 0;
        allQuestions.forEach((q, i) => { if (answers[i] === q.correct) score++; });
        setResult({ score, total: allQuestions.length }); setSavedAnswers(answers); setStatus('finished');
        try {
            await supabase.from('quiz_submissions').upsert({
                user_id: userId, lesson_id: currentLesson.id, score, total_questions: allQuestions.length,
                percentage: Math.round((score / allQuestions.length) * 100), answers_json: JSON.stringify(answers)
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
            } catch { }
        }
    };

    const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const timerPct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 100;
    const isUrgent = timeLeft < 60;

    if (currentLesson.lesson_type !== 'assessment_center') return null;
    if (loading) return <div className="bg-white dark:bg-[#060a14] rounded-2xl border border-slate-200/80 dark:border-white/6 p-16 flex items-center justify-center"><div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" /></div>;

    const moduleName = course.modules?.find((m: any) => m.id === currentLesson.module_id)?.title || "Assessment";

    return (
        <div className="bg-white dark:bg-[#060a14] rounded-2xl border border-slate-200/80 dark:border-white/6 overflow-hidden shadow-sm">
            <div className="max-w-3xl mx-auto w-full">

                {/* ─── IDLE ─── */}
                {status === 'idle' && (
                    <div className="p-8 lg:p-10 space-y-8">
                        <div className="flex items-start gap-4 pb-6 border-b border-slate-200/60 dark:border-white/4">
                            <div className="w-12 h-12 rounded-xl bg-primary/6 border border-primary/15 flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                            <div><p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Module Assessment</p><h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{moduleName}</h2></div>
                        </div>
                        {allQuestions.length > 0 ? (<>
                            <div className="grid grid-cols-3 gap-3">
                                {[{ icon: HelpCircle, val: String(allQuestions.length), label: "Questions" }, { icon: Clock, val: String(Math.round(totalTime / 60)), label: "Minutes" }, { icon: Target, val: "80%", label: "Pass Mark" }].map((s, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6 text-center">
                                        <s.icon className="w-4 h-4 text-primary mx-auto mb-2" /><p className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{s.val}</p><p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-2">
                                {[`${quizCount} quizzes × 2 min = ${Math.round(totalTime / 60)} min total`, "One attempt only — no retries", "Review your answers after submission", "Results shown immediately"].map((t, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/40 dark:border-white/4">
                                        <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" /><span className="text-[11px] text-slate-500 font-medium">{t}</span>
                                    </div>
                                ))}
                            </div>
                            <button onClick={start} className="w-full py-4 bg-primary text-white rounded-xl font-bold text-[11px] uppercase tracking-wider hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-sm shadow-primary/15"><Play className="w-4 h-4" /> Begin Assessment</button>
                        </>) : (<div className="py-16 text-center text-slate-400"><HelpCircle className="w-8 h-8 mx-auto mb-3 opacity-30" /><p className="text-sm">No quizzes available yet.</p></div>)}
                    </div>
                )}

                {/* ─── ACTIVE ─── */}
                {status === 'active' && (
                    <div className="flex flex-col">
                        <div className="px-6 py-3.5 border-b border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-md bg-primary/10 text-[9px] font-bold text-primary uppercase">Live</span>
                                <span className="text-[10px] font-semibold text-slate-500">Question {qIdx + 1} of {allQuestions.length}</span>
                                {allQuestions[qIdx] && <span className="hidden sm:inline-flex text-[9px] font-medium text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/4">{allQuestions[qIdx].quizTitle}</span>}
                            </div>
                            <div className={cn("px-3 py-1.5 rounded-lg flex items-center gap-2 border", isUrgent ? "bg-red-50 dark:bg-red-500/10 border-red-200/60 dark:border-red-500/20" : "bg-slate-100 dark:bg-white/4 border-slate-200/60 dark:border-white/6")}>
                                <div className={cn("w-1.5 h-1.5 rounded-full", isUrgent ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
                                <span className={cn("text-[11px] font-bold font-mono tabular-nums", isUrgent ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-white")}>{fmt(timeLeft)}</span>
                            </div>
                        </div>
                        <div className="h-[2px] w-full bg-slate-100 dark:bg-white/4"><motion.div className={cn("h-full", isUrgent ? "bg-red-500" : "bg-primary")} animate={{ width: `${timerPct}%` }} transition={{ duration: 0.5 }} /></div>
                        <div className="px-6 pt-4 flex gap-[3px] flex-wrap">
                            {allQuestions.map((_, i) => (<button key={i} onClick={() => setQIdx(i)} className={cn("w-2 h-2 rounded-full transition-all cursor-pointer hover:scale-125", i === qIdx ? "bg-primary scale-125" : answers[i] !== undefined ? "bg-primary/40" : "bg-slate-200 dark:bg-white/6")} />))}
                        </div>
                        <div className="p-6 lg:p-10 space-y-6">
                            <AnimatePresence mode="wait"><motion.div key={qIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.15 }} className="space-y-6">
                                <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug">{allQuestions[qIdx]?.question}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {(allQuestions[qIdx]?.options || []).map((opt: string, i: number) => (
                                        <button key={i} onClick={() => setAnswers(p => ({ ...p, [qIdx]: opt }))} className={cn("p-4 rounded-xl border transition-all text-left flex items-center justify-between group/opt", answers[qIdx] === opt ? "bg-primary/6 border-primary/25 text-slate-900 dark:text-white" : "bg-slate-50 dark:bg-white/2 border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/2")}>
                                            <span className="text-[13px] font-medium">{opt}</span>
                                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-4", answers[qIdx] === opt ? "border-primary bg-primary" : "border-slate-300 dark:border-white/15")}>{answers[qIdx] === opt && <CheckCircle2 className="w-3 h-3 text-white" />}</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div></AnimatePresence>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <button onClick={() => setQIdx(p => Math.max(0, p - 1))} disabled={qIdx === 0} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white font-bold text-[10px] uppercase tracking-wider disabled:opacity-20 transition-all">Back</button>
                            <span className="text-[9px] font-semibold text-slate-400 tabular-nums">{Object.keys(answers).length}/{allQuestions.length} answered</span>
                            {qIdx === allQuestions.length - 1 ? (
                                <button onClick={finish} disabled={answers[qIdx] === undefined} className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"><CheckCircle2 className="w-3.5 h-3.5" /> Finish</button>
                            ) : (
                                <button onClick={() => setQIdx(p => p + 1)} disabled={answers[qIdx] === undefined} className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed">Next <ChevronRight className="w-3.5 h-3.5" /></button>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── FINISHED (Summary) ─── */}
                {status === 'finished' && result && (
                    <div className="p-8 lg:p-10">
                        <div className="flex flex-col items-center text-center space-y-8">
                            <div className={cn("w-20 h-20 rounded-2xl border flex items-center justify-center", result.score / result.total >= 0.8 ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20")}>
                                {result.score / result.total >= 0.8 ? <Trophy className="w-9 h-9 text-emerald-500" /> : <X className="w-9 h-9 text-red-500" />}
                            </div>
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">{result.score / result.total >= 0.8 ? "Assessment Passed!" : "Assessment Not Passed"}</h2>
                                <p className="text-sm text-slate-500 mt-1">{result.score / result.total >= 0.8 ? "Great work! You've demonstrated strong understanding." : "You scored below the 80% pass mark."}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6"><p className="text-[9px] font-bold text-slate-400 uppercase">Score</p><p className={cn("text-2xl font-bold tabular-nums", result.score / result.total >= 0.8 ? "text-emerald-500" : "text-red-500")}>{Math.round((result.score / (result.total || 1)) * 100)}%</p></div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6"><p className="text-[9px] font-bold text-slate-400 uppercase">Correct</p><p className="text-2xl font-bold text-emerald-500 tabular-nums">{result.score}</p></div>
                                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/2 border border-slate-200/60 dark:border-white/6"><p className="text-[9px] font-bold text-slate-400 uppercase">Wrong</p><p className="text-2xl font-bold text-red-500 tabular-nums">{result.total - result.score}</p></div>
                            </div>
                            <div className="flex gap-3 w-full max-w-md">
                                <button onClick={() => { setQIdx(0); setStatus('review'); }} className="flex-1 py-3 bg-slate-100 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-slate-700 dark:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/4 transition-all flex items-center justify-center gap-2"><Eye className="w-3.5 h-3.5" /> Review Answers</button>
                                <button onClick={onCompleteAndNext} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary/15">Continue <ChevronRight className="w-3.5 h-3.5" /></button>
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
                                <span className="text-[10px] font-semibold text-slate-500">Question {qIdx + 1} of {allQuestions.length}</span>
                            </div>
                            <button onClick={() => setStatus('finished')} className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/4 border border-slate-200/60 dark:border-white/6 text-[10px] font-bold text-slate-600 dark:text-white uppercase tracking-wider hover:bg-slate-200 dark:hover:bg-white/4 transition-all">Back to Summary</button>
                        </div>
                        <div className="px-6 pt-4 flex gap-[3px] flex-wrap">
                            {allQuestions.map((q, i) => {
                                const userAns = savedAnswers[i];
                                const isCorrect = userAns === q.correct;
                                return <button key={i} onClick={() => setQIdx(i)} className={cn("w-2.5 h-2.5 rounded-full transition-all cursor-pointer hover:scale-125", i === qIdx ? "scale-150 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-[#060a14]" : "", isCorrect ? "bg-emerald-500 ring-emerald-500" : userAns ? "bg-red-500 ring-red-500" : "bg-slate-300 dark:bg-white/10 ring-slate-300")} />;
                            })}
                        </div>
                        <div className="p-6 lg:p-10 space-y-6">
                            <AnimatePresence mode="wait"><motion.div key={qIdx} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.15 }} className="space-y-6">
                                <div className="flex items-start gap-3">
                                    {savedAnswers[qIdx] === allQuestions[qIdx]?.correct ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />}
                                    <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug">{allQuestions[qIdx]?.question}</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {(allQuestions[qIdx]?.options || []).map((opt: string, i: number) => {
                                        const isCorrect = opt === allQuestions[qIdx]?.correct;
                                        const isUserAnswer = opt === savedAnswers[qIdx];
                                        const isWrong = isUserAnswer && !isCorrect;
                                        return (
                                            <div key={i} className={cn("p-4 rounded-xl border text-left flex items-center justify-between",
                                                isCorrect ? "bg-emerald-50 dark:bg-emerald-500/6 border-emerald-300 dark:border-emerald-500/25" : isWrong ? "bg-red-50 dark:bg-red-500/6 border-red-300 dark:border-red-500/25" : "bg-slate-50 dark:bg-white/2 border-slate-200/60 dark:border-white/6")}>
                                                <span className={cn("text-[13px] font-medium", isCorrect ? "text-emerald-700 dark:text-emerald-400" : isWrong ? "text-red-700 dark:text-red-400" : "text-slate-500")}>{opt}</span>
                                                {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                                                {isWrong && <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />}
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div></AnimatePresence>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-200/60 dark:border-white/4 flex items-center justify-between bg-slate-50 dark:bg-white/2">
                            <button onClick={() => setQIdx(p => Math.max(0, p - 1))} disabled={qIdx === 0} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white font-bold text-[10px] uppercase disabled:opacity-20 transition-all">Back</button>
                            <span className="text-[9px] font-semibold text-slate-400">{result ? `${result.score}/${result.total} correct` : ''}</span>
                            {qIdx < allQuestions.length - 1 ? (
                                <button onClick={() => setQIdx(p => p + 1)} className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-[10px] uppercase hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5">Next <ChevronRight className="w-3.5 h-3.5" /></button>
                            ) : (
                                <button onClick={() => setStatus('finished')} className="px-6 py-2.5 bg-slate-700 dark:bg-white/10 text-white rounded-lg font-bold text-[10px] uppercase hover:opacity-90 active:scale-95 transition-all">Done</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
