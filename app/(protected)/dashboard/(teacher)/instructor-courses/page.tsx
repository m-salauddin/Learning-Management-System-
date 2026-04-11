import { GraduationCap, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import Link from "next/link";

export default function InstructorCoursesPage() {
    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Instructor Courses"
                description="Manage and track your published course protocols"
                icon={GraduationCap}
                actions={
                    <Link 
                        href="/dashboard/courses/new" 
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Course
                    </Link>
                }
            />
            
            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/10">
                <div className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-6">
                    <GraduationCap className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Active Management Enabled</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium">
                    You can manage your courses from here. Detailed view and statistics for each course are being integrated.
                </p>
                <Link href="/dashboard" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
                    Return to Overview
                </Link>
            </div>
        </div>
    );
}
