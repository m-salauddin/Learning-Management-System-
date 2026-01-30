import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Flag, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

export default async function ModeratorPanel() {
    const supabase = await createSupabaseServerClient();

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Moderator Dashboard 🛡️
                </h1>
                <p className="text-muted-foreground">
                    Review reports, manage content, and keep the community safe.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                            <Flag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Reports</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reviews to Check</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Flagged Content</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Resolved Today</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Moderation Queue</h3>
                <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-card/30">
                    <div className="p-4 bg-muted rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-500 opacity-70" />
                    </div>
                    <h4 className="text-lg font-semibold">All Clear!</h4>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        No pending reports or reviews at this time. Great job keeping the community safe!
                    </p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Recent Activity</h3>
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <p className="text-muted-foreground text-center text-sm">No recent moderation activity to display.</p>
                </div>
            </div>
        </div>
    );
}
