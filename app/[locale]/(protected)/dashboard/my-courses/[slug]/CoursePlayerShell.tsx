"use client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCoursePlayer } from "./CoursePlayerContext";
import { PlayerSidebar } from "./[lessonId]/components/PlayerSidebar";
import { PlayerHeader } from "./[lessonId]/components/PlayerHeader";
import { useToast } from "@/components/ui/toast";


export function CoursePlayerShell({ children }: { children: React.ReactNode }) {
    const {
        course, allLessons, lessonsWithStatus, lessonProgress, hasAccess,
        sidebarOpen, setSidebarOpen, isCinematic, setIsCinematic, isPending, currentLessonId,
    } = useCoursePlayer();
    const { error } = useToast();
    const pathname = usePathname();


    const isPlayerPage = pathname.split('/').length > 4; // /dashboard/my-courses/[slug]/[lessonId]

    if (!isPlayerPage) {
        return <>{children}</>;
    }


    const currentLessonForSidebar = allLessons.find((l: any) => l.id === currentLessonId) || {
        id: currentLessonId,
        module_id: '',
        title: '',
        lesson_type: currentLessonId.startsWith('assessments-') ? 'assessment_center' : 'lesson',
    };

    return (
        <div className={cn("flex h-screen overflow-hidden bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 selection:bg-primary/20", isCinematic && "sidebar-collapsed")}>

            {isPending && (
                <div className="fixed inset-0 z-50 bg-black/10 dark:bg-black/30 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            )}


            <PlayerSidebar
                course={course} currentLesson={currentLessonForSidebar} allLessons={allLessons}
                lessonProgress={lessonProgress} lessonsWithStatus={lessonsWithStatus}
                hasAccess={hasAccess} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
                isCinematic={isCinematic} onError={(msg) => error(msg)}
            />


            <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full">
                <PlayerHeader course={course} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isCinematic={isCinematic} setIsCinematic={setIsCinematic} />
                <div className="flex-1 overflow-y-auto overscroll-contain" style={{ contain: 'layout' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
