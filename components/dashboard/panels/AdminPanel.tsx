"use client";

import Link from "next/link";
import {
    ShieldCheck, Tags, Ticket, Users, ArrowRight, BookOpen, BarChart3,
    TrendingUp, TrendingDown, DollarSign, Activity, GraduationCap,
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
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 100 }
    }
};

// Quick stat card component
function QuickStatCard({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    iconBg,
    iconColor,
    subtitle
}: {
    title: string;
    value: string | number;
    change: number;
    changeType: "up" | "down";
    icon: any;
    iconBg: string;
    iconColor: string;
    subtitle?: string;
}) {
    return (
        <div className="group relative p-5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative">
                <div className="flex justify-between items-start mb-3">
                    <div className={cn("p-2.5 rounded-xl", iconBg, "group-hover:scale-110 transition-transform duration-300")}>
                        <Icon className={cn("w-5 h-5", iconColor)} />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                        changeType === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                        {changeType === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change}%
                    </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
                <h3 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </h3>
                {subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
}

// Section header component
function SectionHeader({ title, icon: Icon, action }: { title: string; icon?: any; action?: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                {Icon && <Icon className="w-5 h-5 text-primary" />}
                {title}
            </h3>
            {action}
        </div>
    );
}

export default function AdminPanel() {
    const [stats, setStats] = useState({ userCount: 0, courseCount: 0 });
    const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
            const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true });
            setStats({ userCount: userCount || 0, courseCount: courseCount || 0 });
        };
        fetchData();
    }, []);

    // Demo stats (replace with real data)
    const totalRevenue = 245000;
    const activeStudents = Math.max(Math.floor(stats.userCount * 0.8), 156);
    const completionRate = 78;
    const avgRating = 4.7;

    return (
        <motion.div
            className="space-y-6 pb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 shadow-lg shadow-primary/10">
                        <ShieldCheck className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Welcome back! Here&apos;s what&apos;s happening with your platform.
                        </p>
                    </div>
                </div>

                {/* Period Selector & Actions */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-muted/50 rounded-xl p-1">
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
                    <button className="p-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors">
                        <Download className="w-4 h-4 text-primary" />
                    </button>
                </div>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStatCard
                    title="Total Users"
                    value={stats.userCount || 1234}
                    change={12}
                    changeType="up"
                    icon={Users}
                    iconBg="bg-orange-500/10"
                    iconColor="text-orange-500"
                    subtitle="Active accounts"
                />
                <QuickStatCard
                    title="Total Courses"
                    value={stats.courseCount || 48}
                    change={5}
                    changeType="up"
                    icon={BookOpen}
                    iconBg="bg-purple-500/10"
                    iconColor="text-purple-500"
                    subtitle="Published courses"
                />
                <QuickStatCard
                    title="Total Revenue"
                    value={`৳${totalRevenue.toLocaleString()}`}
                    change={24}
                    changeType="up"
                    icon={DollarSign}
                    iconBg="bg-emerald-500/10"
                    iconColor="text-emerald-500"
                    subtitle="This month"
                />
                <QuickStatCard
                    title="Active Students"
                    value={activeStudents}
                    change={8}
                    changeType="up"
                    icon={GraduationCap}
                    iconBg="bg-blue-500/10"
                    iconColor="text-blue-500"
                    subtitle="Currently learning"
                />
            </motion.div>

            {/* Secondary Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-linear-to-br from-violet-500/10 to-purple-500/5 border border-violet-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-medium text-muted-foreground">Completion Rate</span>
                    </div>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-medium text-muted-foreground">Avg. Rating</span>
                    </div>
                    <p className="text-2xl font-bold">⭐ {avgRating}</p>
                </div>
                <div className="p-4 rounded-2xl bg-linear-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs font-medium text-muted-foreground">Countries</span>
                    </div>
                    <p className="text-2xl font-bold">12</p>
                </div>
                <div className="p-4 rounded-2xl bg-linear-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-medium text-muted-foreground">Certificates</span>
                    </div>
                    <p className="text-2xl font-bold">892</p>
                </div>
            </motion.div>

            {/* Charts Section - Bento Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart - Takes 2 columns */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader
                        title="Revenue Overview"
                        icon={DollarSign}
                        action={
                            <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                View Details <ChevronRight className="w-3 h-3" />
                            </button>
                        }
                    />
                    <RevenueChart />
                </div>

                {/* User Distribution - 1 column */}
                <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader title="User Distribution" icon={Users} />
                    <UserDistributionChart />
                </div>
            </motion.div>

            {/* Enrollment Trends & Course Performance */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader
                        title="Enrollment Trends"
                        icon={TrendingUp}
                        action={
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-medium">
                                +23% this month
                            </span>
                        }
                    />
                    <EnrollmentTrendChart />
                </div>

                <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader title="Top Performing Courses" icon={BookOpen} />
                    <CoursePerformanceChart />
                </div>
            </motion.div>

            {/* Activity Heatmap & Platform Health */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader
                        title="Platform Activity"
                        icon={Activity}
                        action={<span className="text-xs text-muted-foreground">Last 12 weeks</span>}
                    />
                    <ActivityHeatmap />
                </div>

                <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader title="Platform Health" icon={Sparkles} />
                    <PlatformHealthChart />
                </div>
            </motion.div>

            {/* Revenue Breakdown & Pending Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader title="Revenue Sources" icon={DollarSign} />
                    <RevenueBreakdownChart />
                </div>

                <div className="lg:col-span-2 p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader
                        title="Pending Actions"
                        icon={Clock}
                        action={
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                                4 items
                            </span>
                        }
                    />
                    <PendingActionsWidget />
                </div>
            </motion.div>

            {/* Top Courses Table */}
            <motion.div variants={itemVariants} className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                <SectionHeader
                    title="Top Performing Courses"
                    icon={BookOpen}
                    action={
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <Link href="/dashboard/courses" className="text-xs text-primary hover:underline flex items-center gap-1">
                                View All <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    }
                />
                <TopCoursesTable />
            </motion.div>

            {/* Recent Activity & Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity Feed */}
                <div className="lg:col-span-2 p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader
                        title="Recent Activity"
                        icon={Activity}
                        action={
                            <button className="text-xs text-primary hover:underline flex items-center gap-1">
                                View All <ChevronRight className="w-3 h-3" />
                            </button>
                        }
                    />
                    <RecentActivityFeed />
                </div>

                {/* Quick Management Links */}
                <div className="p-6 rounded-3xl bg-card/50 backdrop-blur-xl border border-border/50">
                    <SectionHeader title="Quick Access" icon={Zap} />
                    <div className="space-y-3">
                        {[
                            { title: "User Management", icon: Users, href: "/dashboard/users", color: "orange" },
                            { title: "Manage Courses", icon: BookOpen, href: "/dashboard/courses", color: "purple" },
                            { title: "Discounts", icon: Tags, href: "/dashboard/discounts", color: "blue" },
                            { title: "Coupons", icon: Ticket, href: "/dashboard/coupons", color: "emerald" },
                            { title: "Analytics", icon: BarChart3, href: "/dashboard/analytics", color: "cyan" },
                        ].map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        item.color === "orange" && "bg-orange-500/10 text-orange-500",
                                        item.color === "purple" && "bg-purple-500/10 text-purple-500",
                                        item.color === "blue" && "bg-blue-500/10 text-blue-500",
                                        item.color === "emerald" && "bg-emerald-500/10 text-emerald-500",
                                        item.color === "cyan" && "bg-cyan-500/10 text-cyan-500",
                                    )}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium text-sm">{item.title}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
