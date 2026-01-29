"use client";

import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
                <Settings className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold">Admin Settings</h1>
            <p className="text-muted-foreground max-w-md">
                Configure global platform settings, payment gateways, and integrations.
            </p>
        </div>
    );
}
