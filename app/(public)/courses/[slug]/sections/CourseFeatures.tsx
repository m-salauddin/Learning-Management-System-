"use client";
import { Layout, BookOpen, Building, FolderKanban, Award } from "lucide-react";
import { cn } from "@/lib/utils";
interface CourseFeaturesProps {
    totalLectures: number;
    projectCount: number;
}
export default function CourseFeatures({ totalLectures, projectCount }: CourseFeaturesProps) {
    const features = [
        { icon: Layout, label: 'ACCESS', value: 'Lifetime', color: 'emerald' },
        { icon: BookOpen, label: 'SYLLABUS', value: `${totalLectures || 0}+ Lessons`, color: 'blue' },
        { icon: Building, label: 'CAREER', value: 'Job Placement', color: 'purple' },
        { icon: FolderKanban, label: 'HANDS-ON', value: projectCount > 0 ? `${projectCount} Real World Projects` : 'Real Projects', color: 'amber' },
        { icon: Award, label: 'CREDENTIALS', value: 'Verified Certificate', color: 'rose' }
    ];
    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {features.map((item, i) => (
                <div key={i} className="group relative p-6 rounded-[2rem] bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-primary/20 dark:hover:border-white/10 transition-all duration-500 overflow-hidden shadow-sm dark:shadow-none">
                    <div className={cn("absolute top-0 right-0 w-16 h-16 opacity-10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2", `bg-${item.color}-500`)} />
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-white/5 shadow-sm dark:shadow-none group-hover:scale-110 transition-transform duration-500",
                            item.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                                item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                                    item.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                                        item.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                                            'text-rose-600 dark:text-rose-400'
                        )}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
