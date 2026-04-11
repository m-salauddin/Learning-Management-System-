"use client";
import Link from "next/link";
import {
    ShieldCheck, Tags, Ticket, Users, ArrowRight, BookOpen, 
    TrendingUp, DollarSign, Activity, GraduationCap,
    Clock, Globe, Zap, Target, Award, RefreshCw, Filter,
    Download, ChevronRight, Sparkles
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

export default function AdminPanel() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_courses: 0,
        total_revenue: 0,
        active_enrollments: 0,
        total_enrollments: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
                if (error) {
                    console.error('Error fetching admin stats:', error);
                    const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
                    const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
                    setStats(prev => ({ ...prev, total_users: userCount || 0, total_courses: courseCount || 0 }));
                } else if (data) {
                    setStats(data);
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
                />
                <StatsCard
                    title="Total Courses"
                    value={stats.total_courses || 0}
                    trend="5%"
                    trendUp={true}
                    icon={BookOpen}
                    description="Published courses"
                />
                <StatsCard
                    title="Total Revenue"
                    value={`৳${totalRevenue.toLocaleString()}`}
                    trend="24%"
                    trendUp={true}
                    icon={DollarSign}
                    description="This month"
                />
                <StatsCard
                    title="Active Students"
                    value={activeStudents}
                    trend="8%"
                    trendUp={true}
                    icon={GraduationCap}
                    description="Currently learning"
                />
            </DashboardGrid>

            {/* Secondary Stats */}
            <DashboardGrid cols={4}>
                <div className="p-5 rounded-2xl bg-linear-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Completion Rate</span>
                    </div>
                    <p className="text-2xl font-black">{completionRate}%</p>
                </div>
                <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Avg. Rating</span>
                    </div>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400">⭐ {avgRating}</p>
                </div>
                <div className="p-5 rounded-2xl bg-linear-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Countries</span>
                    </div>
                    <p className="text-2xl font-black">12</p>
                </div>
                <div className="p-5 rounded-2xl bg-linear-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Certificates</span>
                    </div>
                    <p className="text-2xl font-black">892</p>
                </div>
            </DashboardGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Revenue Overview" 
                    icon={DollarSign}
                    className="lg:col-span-2"
                    action={
                        <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                            Details <ChevronRight className="w-3 h-3" />
                        </button>
                    }
                >
                    <RevenueChart />
                </DashboardCard>
                <DashboardCard title="User Distribution" icon={Users}>
                    <UserDistributionChart />
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DashboardCard 
                    title="Enrollment Trends" 
                    icon={TrendingUp}
                    action={
                        <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-black uppercase tracking-widest">
                            +23% this month
                        </span>
                    }
                >
                    <EnrollmentTrendChart />
                </DashboardCard>
                <DashboardCard title="Top Performing Courses" icon={BookOpen}>
                    <CoursePerformanceChart />
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard 
                    title="Platform Activity" 
                    icon={Activity}
                    className="lg:col-span-2"
                    description="Last 12 weeks"
                >
                    <ActivityHeatmap />
                </DashboardCard>
                <DashboardCard title="Platform Health" icon={Sparkles}>
                    <PlatformHealthChart />
                </DashboardCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DashboardCard title="Revenue Sources" icon={DollarSign}>
                    <RevenueBreakdownChart />
                </DashboardCard>
                <DashboardCard 
                    title="Pending Actions" 
                    icon={Clock}
                    className="lg:col-span-2"
                    action={
                        <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 font-black uppercase tracking-widest">
                            4 items
                        </span>
                    }
                >
                    <PendingActionsWidget />
                </DashboardCard>
            </div>

            <DashboardCard 
                title="Top Performing Courses" 
                icon={BookOpen}
                action={
                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <Link href="/dashboard/courses" className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                            View All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                }
            >
                <TopCoursesTable />
            </DashboardCard>

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
                    <RecentActivityFeed />
                </DashboardCard>
                <DashboardCard title="Quick Access" icon={Zap}>
                    <div className="space-y-3">
                        {[
                            { title: "User Management", icon: Users, href: "/dashboard/users", color: "orange" },
                            { title: "Manage Courses", icon: BookOpen, href: "/dashboard/courses", color: "purple" },
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
