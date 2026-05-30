"use client";
import Link from "next/link";
import {
    ShieldCheck, Tags, Ticket, Users, ArrowRight, BookOpen, 
    TrendingUp, DollarSign, Activity, GraduationCap,
    Clock, Globe, Zap, Target, Award, RefreshCw, Filter,
    Download, ChevronRight, Sparkles, Settings
} from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { RevenueChart } from "@/components/dashboard/charts/RevenueChart";
import { UserDistributionChart } from "@/components/dashboard/charts/UserDistributionChart";
import { EnrollmentTrendChart } from "@/components/dashboard/charts/EnrollmentTrendChart";
import { CoursePerformanceChart } from "@/components/dashboard/charts/CoursePerformanceChart";
import { ActivityHeatmap } from "@/components/dashboard/charts/ActivityHeatmap";
import { RevenueBreakdownChart } from "@/components/dashboard/charts/RevenueBreakdownChart";
import { PlatformHealthChart } from "@/components/dashboard/charts/PlatformHealthChart";
import { TopCoursesTable } from "@/components/dashboard/tables/TopCoursesTable";
import { RecentActivityFeed } from "@/components/dashboard/widgets/RecentActivityFeed";
import { PendingActionsWidget } from "@/components/dashboard/widgets/PendingActionsWidget";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/ui/DashboardCard";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { getAdminDashboardTrends, getTopPerformingCourses, getRecentActivity } from "@/lib/actions/admin-dashboard";
import { DynamicTrendsChart } from "@/components/dashboard/charts/DynamicTrendsChart";
import { DynamicPieChart } from "@/components/dashboard/charts/DynamicPieChart";
import { DynamicLineChart } from "@/components/dashboard/charts/DynamicLineChart";

interface AdminStats {
    total_users: number;
    total_courses: number;
    total_revenue: number;
    active_enrollments: number;
    total_enrollments: number;
}

export default function AdminPanel() {
    const [stats, setStats] = useState<AdminStats>({
        total_users: 0,
        total_courses: 0,
        total_revenue: 0,
        active_enrollments: 0,
        total_enrollments: 0
    });
    const [trendData, setTrendData] = useState<{
        userGrowth: { month: string; value: number }[];
        enrollmentGrowth: { month: string; value: number }[];
        revenueGrowth: { month: string; value: number }[];
        categoryDistribution: { name: string; value: number }[];
    } | null>(null);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                const [statsRes, trendsRes, topCoursesRes, recentActivityRes] = await Promise.all([
                    supabase.rpc('get_admin_dashboard_stats'),
                    getAdminDashboardTrends(),
                    getTopPerformingCourses(),
                    getRecentActivity()
                ]);

                if (statsRes.error) {
                    console.error('Error fetching admin stats:', statsRes.error);
                    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
                    const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
                    setStats(prev => ({ ...prev, total_users: userCount || 0, total_courses: courseCount || 0 }));
                } else if (statsRes.data) {
                    setStats(statsRes.data as unknown as AdminStats);
                }

                if (trendsRes.success && trendsRes.data) {
                    setTrendData(trendsRes.data as any);
                }

                if (topCoursesRes.success && topCoursesRes.data) {
                    setTopCourses(topCoursesRes.data);
                }

                if (recentActivityRes.success && recentActivityRes.data) {
                    setRecentActivity(recentActivityRes.data);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalRevenue = stats.total_revenue || 0;
    const activeStudents = stats.active_enrollments || 0;
    const completionRate = stats.total_enrollments > 0
        ? Math.round(((stats.total_enrollments - stats.active_enrollments) / stats.total_enrollments) * 100)
        : 78;
    const avgRating = 4.8;

    return (
        <div className="space-y-6 pb-10">
            <PageHeader
                title="Admin Dashboard"
                description="Welcome back! Here's what's happening with your platform."
                icon={ShieldCheck}
                actions={
                    <>
                        <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/50">
                            {(["7d", "30d", "90d", "1y"] as const).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                        selectedPeriod === period
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {period === "7d" ? "7 Days" : period === "30d" ? "30 Days" : period === "90d" ? "90 Days" : "1 Year"}
                                </button>
                            ))}
                        </div>
                        <button className="p-2.5 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                            <Download className="w-4 h-4 text-primary" />
                        </button>
                    </>
                }
            />

            <DashboardGrid cols={4}>
                <StatsCard
                    title="Total Users"
                    value={stats.total_users || 0}
                    trend="12%"
                    trendUp={true}
                    icon={Users}
                    description="Active accounts"
                    variant="blue"
                />
                <StatsCard
                    title="Total Courses"
                    value={stats.total_courses || 0}
                    trend="5%"
                    trendUp={true}
                    icon={BookOpen}
                    description="Published courses"
                    variant="indigo"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`৳${totalRevenue.toLocaleString()}`}
                    trend="24%"
                    trendUp={true}
                    icon={DollarSign}
                    description="This month"
                    variant="amber"
                />
                <StatsCard
                    title="Active Students"
                    value={activeStudents}
                    trend="8%"
                    trendUp={true}
                    icon={GraduationCap}
                    description="Currently learning"
                    variant="emerald"
                />
            </DashboardGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Revenue Overview" 
                    icon={DollarSign}
                    className="lg:col-span-3"
                    action={
                        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                            Details <ChevronRight className="w-3 h-3" />
                        </button>
                    }
                >
                    {trendData ? (
                        <DynamicTrendsChart data={trendData.revenueGrowth} color="#3b82f6" title="Revenue" prefix="৳" />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading revenue data...</div>
                    )}
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard title="Enrollment Growth" icon={TrendingUp}>
                    {trendData ? (
                        <DynamicTrendsChart data={trendData.enrollmentGrowth} color="#10b981" title="Enrollments" />
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading trend...</div>
                    )}
                </DashboardCard>

                <DashboardCard title="User Acquisition" icon={Users}>
                    {trendData ? (
                        <DynamicLineChart data={trendData.userGrowth} color="#8b5cf6" />
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading trend...</div>
                    )}
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard title="Category Distribution" icon={ShieldCheck}>
                    <DynamicPieChart data={trendData?.categoryDistribution || []} />
                </DashboardCard>
                <DashboardCard 
                    title="Course Analytics" 
                    icon={BookOpen}
                    className="lg:col-span-2"
                    action={
                        <Link href="/dashboard/courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                            View All <ChevronRight className="w-3 h-3" />
                        </Link>
                    }
                >
                    <TopCoursesTable isLoading={loading} courses={topCourses} />
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Recent Activity" 
                    icon={Activity}
                    className="lg:col-span-2"
                    action={
                        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                            View All <ChevronRight className="w-3 h-3" />
                        </button>
                    }
                >
                    <RecentActivityFeed activities={recentActivity} />
                </DashboardCard>
                <DashboardCard title="Quick Access" icon={Zap}>
                    <div className="space-y-3">
                        {[
                            { title: "User Management", icon: Users, href: "/dashboard/users", color: "orange" },
                            { title: "Manage Courses", icon: BookOpen, href: "/dashboard/courses", color: "purple" },
                            { title: "Site Settings", icon: Settings, href: "/dashboard/settings", color: "rose" },
                            { title: "Discounts", icon: Tags, href: "/dashboard/discounts", color: "blue" },
                            { title: "Coupons", icon: Ticket, href: "/dashboard/coupons", color: "emerald" },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2.5 rounded-xl border",
                                        item.color === "orange" && "bg-orange-500/10 text-orange-500 border-orange-500/20",
                                        item.color === "purple" && "bg-purple-500/10 text-purple-500 border-purple-500/20",
                                        item.color === "blue" && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                                        item.color === "emerald" && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                                    )}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{item.title}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all" />
                            </Link>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}
