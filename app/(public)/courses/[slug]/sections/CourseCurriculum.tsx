"use client";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Layers, PlayCircle, Clock, ChevronDown, Lock as LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MappedCourse } from "@/types/mapped-course";
import { CoursePageData } from "@/types/course-page";
interface CourseCurriculumProps {
    course: MappedCourse;
    pageData?: CoursePageData;
    showAllModules: boolean;
    setShowAllModules: (show: boolean) => void;
    expandedModules: number[];
    toggleModule: (idx: number) => void;
    filteredModules: any[];
    displayedModules: any[];
    totalSections: number;
    totalLectures: number;
}
export default function CourseCurriculum({
    course,
    pageData,
    showAllModules,
    setShowAllModules,
    expandedModules,
    toggleModule,
    filteredModules,
    displayedModules,
    totalSections,
    totalLectures
}: CourseCurriculumProps) {
    return (
        <div className="mt-12 sm:mt-16 space-y-6">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-widest">
                        < BookOpen className="w-3.5 h-3.5" />
                        Knowledge Path
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors">Systematic Learning</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl transition-colors">
                        A structured curriculum designed to build your skills from ground up to professional mastery.
                    </p>
                </div>
            {}
            <div className="flex flex-wrap items-center gap-6 p-6 rounded-[2rem] bg-slate-100 dark:bg-slate-900/40 border border-slate-300 dark:border-white/10 transition-colors shadow-none">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-transparent flex items-center justify-center transition-all">
                        <Layers className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Modules</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{totalSections}</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-white/10 hidden sm:block transition-colors" />
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-transparent flex items-center justify-center transition-all">
                        <PlayCircle className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase">Lectures</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white transition-colors">{totalLectures}</p>
                    </div>
                </div>
            </div>
            {}
            <div className="space-y-4">
                {displayedModules.map((module, idx) => (
                    <div key={idx} className="group overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-900/20 border border-slate-300 dark:border-white/10 hover:border-primary/20 dark:hover:border-white/20 transition-all duration-300 shadow-none">
                        <button
                            onClick={() => toggleModule(idx)}
                            className="w-full flex items-center justify-between p-6 sm:p-8 text-left group/btn"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex flex-col items-center justify-center shrink-0 border border-slate-300 dark:border-white/5 group-hover/btn:border-primary/30 transition-all">
                                    <span className="text-[9px] font-black text-slate-500 uppercase">Mod</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white transition-colors">{String(idx + 1).padStart(2, '0')}</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white group-hover/btn:text-primary transition-colors">{module.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{module.lessons?.length || 0} Lessons</span>
                                    </div>
                                </div>
                            </div>
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 border border-slate-300 dark:border-transparent transition-all duration-500",
                                expandedModules.includes(idx) ? "rotate-180 bg-primary/20 text-primary border-primary/20" : "text-slate-400 dark:text-slate-500"
                            )}>
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </button>
                        <AnimatePresence>
                            {expandedModules.includes(idx) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                >
                                    <div className="px-6 pb-8 space-y-3">
                                        {module.lessons?.map((lesson: any, lIdx: number) => (
                                            <div key={lIdx} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/5 group/lesson hover:border-primary/20 dark:hover:border-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-transparent flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover/lesson:text-primary transition-colors">
                                                        <PlayCircle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover/lesson:text-primary dark:group-hover/lesson:text-white transition-colors">{lesson.title}</p>
                                                        <p className="text-[10px] font-heavy text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-1">Lesson {String(lIdx + 1).padStart(2, '0')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {!pageData?.isEnrolled && (
                                                        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/5">
                                                            <LockIcon className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Locked</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
            {filteredModules.length > 6 && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => setShowAllModules(!showAllModules)}
                        className="px-8 py-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/5 text-sm text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all font-black uppercase tracking-widest"
                    >
                        {showAllModules ? 'Show Less' : `View All ${filteredModules.length} Modules`}
                    </button>
                </div>
            )}
        </div>
    );
}
