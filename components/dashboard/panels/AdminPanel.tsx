import Link from "next/link";
import { ShieldCheck, Tags, Ticket, Users, ArrowRight, BookOpen, BarChart3 } from "lucide-react";

export default async function AdminPanel() {
    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Admin Dashboard 🔐
                </h1>
                <p className="text-muted-foreground">
                    Manage your platform settings, users, and content.
                </p>
            </div>

            {/* Quick Access Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Link href="/dashboard/discounts" className="group">
                    <div className="h-full p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                                <Tags className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Discounts</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Manage automatic course discounts and sales campaigns.</p>
                        <div className="flex items-center text-sm font-medium text-blue-500">
                            Manage Discounts <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/coupons" className="group">
                    <div className="h-full p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <Ticket className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Coupons</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Create and manage coupon codes for promotions.</p>
                        <div className="flex items-center text-sm font-medium text-emerald-500">
                            Manage Coupons <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/users" className="group">
                    <div className="h-full p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Users</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Manage user roles, permissions, and accounts.</p>
                        <div className="flex items-center text-sm font-medium text-orange-500">
                            Manage Users <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/courses" className="group">
                    <div className="h-full p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Courses</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">Review and manage all courses on the platform.</p>
                        <div className="flex items-center text-sm font-medium text-purple-500">
                            Manage Courses <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/analytics" className="group">
                    <div className="h-full p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">Analytics</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">View platform metrics and performance insights.</p>
                        <div className="flex items-center text-sm font-medium text-cyan-500">
                            View Analytics <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
