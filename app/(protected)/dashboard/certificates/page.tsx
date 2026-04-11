"use client";
import { Award, GraduationCap } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";

export default function CertificatesPage() {
    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Certificates"
                description="View and download your earned certificates"
                icon={Award}
            />

            <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/10">
                <div className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-6">
                    <Award className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No certificates earned yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm font-medium">
                    Complete 100% of a course to earn your first official certificate. Keep learning!
                </p>
                <Link href="/dashboard/my-courses" className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-sm">
                    Go to My Courses
                </Link>
            </div>
        </div>
    );
}
