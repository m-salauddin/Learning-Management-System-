"use client";

import { Award } from "lucide-react";
import Link from "next/link";

export default function CertificatesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Certificates</h1>
                <p className="text-muted-foreground text-sm">View and download your earned certificates</p>
            </div>

            <div className="flex flex-col items-center justify-center py-24 text-center border rounded-2xl border-dashed border-border/50 bg-card/30">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                    <Award className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-lg font-semibold">No certificates earned yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6 mt-1 text-sm">
                    Complete 100% of a course to earn your first official certificate. Keep learning!
                </p>
                <Link href="/dashboard/courses" className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                    Go to My Courses
                </Link>
            </div>
        </div>
    );
}
