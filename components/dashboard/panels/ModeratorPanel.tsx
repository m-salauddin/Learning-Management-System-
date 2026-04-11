"use client";
import { Flag, MessageSquare, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/ui/DashboardCard";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface ModeratorPanelProps {
    stats: any;
}

export default function ModeratorPanel({ stats }: ModeratorPanelProps) {
    const pendingReports = stats?.pending_reports || 0;
    const reviewsToCheck = stats?.reviews_to_check || 0;
    const flaggedContent = stats?.flagged_content || 0;
    const resolvedToday = stats?.resolved_today || 0;

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Moderator Dashboard"
                description="Review reports, manage content, and keep the community safe."
                icon={ShieldAlert}
            />

            <DashboardGrid cols={4}>
                <StatsCard
                    title="Pending Reports"
                    value={pendingReports}
                    icon={Flag}
                    description="Awaiting review"
                    className="border-red-500/20"
                />
                <StatsCard
                    title="Reviews to Check"
                    value={reviewsToCheck}
                    icon={MessageSquare}
                    description="User feedback"
                    className="border-amber-500/20"
                />
                <StatsCard
                    title="Flagged Content"
                    value={flaggedContent}
                    icon={AlertTriangle}
                    description="Automated flags"
                    className="border-orange-500/20"
                />
                <StatsCard
                    title="Resolved Today"
                    value={resolvedToday}
                    icon={CheckCircle}
                    description="Actions taken"
                    className="border-emerald-500/20"
                />
            </DashboardGrid>

            <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-primary" />
                    Moderation Queue
                </h3>
                
                {pendingReports === 0 && reviewsToCheck === 0 ? (
                    <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] flex flex-col items-center justify-center text-center bg-slate-50/50 dark:bg-slate-900/10">
                        <div className="p-4 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 mb-6">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">All Clear!</h4>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm font-medium">
                            No pending reports or reviews at this time. Great job keeping the community safe!
                        </p>
                    </div>
                ) : (
                    <DashboardCard title="Active Items" description="Items requiring immediate attention">
                        <p className="text-slate-500 text-sm font-medium py-10 text-center italic">
                            Queue visualization system is being optimized for high-density review.
                        </p>
                    </DashboardCard>
                )}
            </div>

            <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Recent Activity</h3>
                <DashboardCard>
                    <p className="text-slate-500 text-center text-sm font-medium py-4 uppercase tracking-widest opacity-60">
                        No recent moderation activity logged.
                    </p>
                </DashboardCard>
            </div>
        </div>
    );
}
