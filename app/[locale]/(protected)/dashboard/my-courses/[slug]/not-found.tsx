import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function CourseNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-slate-400" />
            </div>
            <div className="space-y-1.5">
                <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200">
                    Course Not Found
                </h2>
                <p className="text-[12px] text-slate-500 dark:text-slate-400 max-w-sm">
                    This course doesn&apos;t exist or you may not be enrolled in it.
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/my-courses"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    My Courses
                </Link>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Browse Courses
                </Link>
            </div>
        </div>
    );
}
