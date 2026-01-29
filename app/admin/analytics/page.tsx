"use client";

import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
                <BarChart3 className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground max-w-md">
                Detailed platform analytics and revenue reports will be available here soon.
            </p>
        </div>
    );
}
