"use client";
import { createContext, useContext, useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import type { Database } from "@/types/supabase";

type LessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert'];

interface CoursePlayerContextType {
    course: any;
    userId: string;
    enrollmentId?: string;
    hasAccess: boolean;
    allLessons: any[];
    lessonsWithStatus: { id: string; isCompleted: boolean; isLocked: boolean }[];
    lessonProgress: Record<string, boolean>;
    currentLessonId: string;
    nextLesson: any;
    prevLesson: any;
    sidebarOpen: boolean;
    setSidebarOpen: (v: boolean) => void;
    isCinematic: boolean;
    setIsCinematic: (v: boolean) => void;
    isPending: boolean;
    navigate: (path: string) => void;
    handleCompleteAndNext: () => Promise<void>;
    markLessonComplete: (lessonId: string) => Promise<void>;
}

const CoursePlayerContext = createContext<CoursePlayerContextType | null>(null);

export function useCoursePlayer() {
    const ctx = useContext(CoursePlayerContext);
    if (!ctx) throw new Error("useCoursePlayer must be used within CoursePlayerProvider");
    return ctx;
}

interface ProviderProps {
    course: any;
    userId: string;
    enrollmentId?: string;
    hasAccess: boolean;
    children: React.ReactNode;
}

export function CoursePlayerProvider({ course, userId, enrollmentId, hasAccess, children }: ProviderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();
    const { success, error } = useToast();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isCinematic, setIsCinematic] = useState(false);
    const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});


    const currentLessonId = useMemo(() => {
        const segments = pathname.split('/');
        return segments[segments.length - 1] || '';
    }, [pathname]);


    const allLessons = useMemo(() => {
        const milestones = course.milestones || [];
        const modules = course.modules || [];
        const structural = milestones.length > 0 ? milestones : [{ id: 'default', title: "Curriculum", modules }];
        const result: any[] = [];
        structural.forEach((ms: any) => {
            (ms.modules || []).forEach((mod: any) => {
                const lessons = (mod.lessons || []).filter((l: any) => l.lesson_type !== 'quiz');
                lessons.filter((l: any) => l.lesson_type !== 'assignment').forEach((lesson: any) => result.push(lesson));
                const hasQuizzes = (mod.quizzes || []).length > 0;
                if (hasQuizzes) {
                    result.push({
                        id: `assessments-${mod.id}`,
                        module_id: mod.id,
                        title: 'Module Assessment',
                        lesson_type: 'assessment_center',
                        is_free_preview: false,
                        _virtual: true,
                    });
                }
                lessons.filter((l: any) => l.lesson_type === 'assignment').forEach((lesson: any) => result.push(lesson));
            });
        });
        return result;
    }, [course.milestones, course.modules]);


    const lessonsWithStatus = useMemo(() => {
        return allLessons.map((lesson: any, i: number) => {
            const done = lessonProgress[lesson.id] || false;
            if (i === 0 || lesson.is_free_preview) {
                return { id: lesson.id, isCompleted: done, isLocked: false };
            }
            const allPrevDone = allLessons.slice(0, i).every((prev: any) => lessonProgress[prev.id]);
            return { id: lesson.id, isCompleted: done, isLocked: !allPrevDone };
        });
    }, [allLessons, lessonProgress]);

    const currentIndex = allLessons.findIndex((l: any) => l.id === currentLessonId);
    const nextLesson = allLessons[currentIndex + 1];
    const prevLesson = allLessons[currentIndex - 1];


    const navigate = useCallback((path: string) => {
        startTransition(() => { router.push(path); });
    }, [router]);


    useEffect(() => {
        if (!userId || !enrollmentId) return;
        const fetchProgress = async () => {
            const { data } = await supabase.from('lesson_progress').select('lesson_id, is_completed').eq('enrollment_id', enrollmentId).eq('user_id', userId);
            const p: Record<string, boolean> = {};
            if (data) data.forEach((d: any) => { p[d.lesson_id] = d.is_completed; });

            const { data: quizSubs } = await supabase.from('quiz_submissions').select('lesson_id').eq('user_id', userId);
            if (quizSubs) quizSubs.forEach((qs: any) => {
                if (qs.lesson_id && !p[qs.lesson_id]) p[qs.lesson_id] = true;
            });

            setLessonProgress(p);
        };
        fetchProgress();
        const channel = supabase.channel('lesson_progress_changes').on('postgres_changes', { event: '*', schema: 'public', table: 'lesson_progress', filter: `user_id=eq.${userId}` }, (payload: any) => {
            if (payload.new?.enrollment_id === enrollmentId) setLessonProgress(prev => ({ ...prev, [payload.new.lesson_id]: payload.new.is_completed }));
        }).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [userId, enrollmentId]);


    const markLessonComplete = useCallback(async (lessonId: string) => {
        if (!enrollmentId) return;
        const progressData: LessonProgressInsert = {
            user_id: userId, lesson_id: lessonId, enrollment_id: enrollmentId,
            is_completed: true, completed_at: new Date().toISOString(), updated_at: new Date().toISOString()
        };
        await (supabase.from('lesson_progress') as any).upsert(progressData, { onConflict: 'user_id,lesson_id' });
        setLessonProgress(prev => ({ ...prev, [lessonId]: true }));
    }, [userId, enrollmentId, supabase]);


    const handleCompleteAndNext = useCallback(async () => {
        if (!enrollmentId) {
            nextLesson ? navigate(`/dashboard/my-courses/${course.slug}/${nextLesson.id}`) : navigate(`/courses/${course.slug}`);
            return;
        }
        const alreadyDone = lessonProgress[currentLessonId] || false;
        try {
            await markLessonComplete(currentLessonId);
            if (!alreadyDone) success("Lesson Complete!");
            if (nextLesson) navigate(`/dashboard/my-courses/${course.slug}/${nextLesson.id}`);
            else { navigate(`/courses/${course.slug}`); if (!alreadyDone) success("Course Complete!"); }
        } catch { nextLesson && navigate(`/dashboard/my-courses/${course.slug}/${nextLesson.id}`); }
    }, [currentLessonId, enrollmentId, lessonProgress, nextLesson, course.slug, navigate, markLessonComplete, success]);

    const value: CoursePlayerContextType = {
        course, userId, enrollmentId, hasAccess,
        allLessons, lessonsWithStatus, lessonProgress,
        currentLessonId, nextLesson, prevLesson,
        sidebarOpen, setSidebarOpen, isCinematic, setIsCinematic,
        isPending, navigate, handleCompleteAndNext, markLessonComplete,
    };

    return (
        <CoursePlayerContext.Provider value={value}>
            {children}
        </CoursePlayerContext.Provider>
    );
}
