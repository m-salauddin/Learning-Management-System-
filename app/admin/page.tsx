"use client";

import { StatsCard } from "@/components/dashboard/StatsCard";
import { Users, DollarSign, BookOpen, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Overview</h1>
                <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value="12,345"
                    icon={Users}
                    trend="12% vs last month"
                    trendUp={true}
                    delay={0.1}
                />
                <StatsCard
                    title="Total Revenue"
                    value="$45,231"
                    icon={DollarSign}
                    trend="8% vs last month"
                    trendUp={true}
                    delay={0.2}
                />
                <StatsCard
                    title="Active Courses"
                    value="24"
                    icon={BookOpen}
                    delay={0.3}
                />
                <StatsCard
                    title="Active Learners"
                    value="573"
                    icon={Activity}
                    trend="24 active now"
                    trendUp={true}
                    delay={0.4}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users Mock */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Recent Registrations</h3>
                        <button className="text-xs text-primary hover:underline">View All</button>
                    </div>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                                        JD
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium group-hover:text-primary transition-colors">John Doe {i}</p>
                                        <p className="text-xs text-muted-foreground">student{i}@example.com</p>
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{i * 2} mins ago</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* System Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl"
                >
                    <h3 className="font-semibold mb-6">System Health</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Server Load</span>
                                <span className="text-sm text-emerald-500 font-medium">24%</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "24%" }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Memory Usage</span>
                                <span className="text-sm text-yellow-500 font-medium">62%</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "62%" }}
                                    transition={{ duration: 1, delay: 0.9 }}
                                    className="bg-yellow-500 h-full rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Storage</span>
                                <span className="text-sm text-blue-500 font-medium">45%</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "45%" }}
                                    transition={{ duration: 1, delay: 1.0 }}
                                    className="bg-blue-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
