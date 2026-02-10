"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
    User, Mail, Lock, Shield, Loader2,
    Award, Settings, UserPlus, Users
} from "lucide-react";
import { createUser } from "@/lib/actions/users";
import { UserRole } from "@/types/user";
import { useToast } from "@/components/ui/toast";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AddUserPage() {
    const router = useRouter();
    const toast = useToast();
    const [isCreating, setIsCreating] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student" as UserRole
    });

    const breadcrumbItems = [
        { label: "Users", href: "/dashboard/users", icon: Users },
        { label: "Add New User", active: true, icon: UserPlus }
    ];

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userData.name || !userData.email || !userData.password) {
            toast.error("Missing fields", "Please fill in all fields");
            return;
        }

        setIsCreating(true);
        const result = await createUser(userData);
        setIsCreating(false);

        if (result.success) {
            toast.success("User created", "New user has been added successfully");
            router.push("/dashboard/users");
            router.refresh();
        } else {
            toast.error("Error", result.error || "Failed to create user");
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            {/* Breadcrumbs */}
            <Breadcrumbs
                items={breadcrumbItems}
                showHomeIcon={true}
                rootLabel="Dashboard"
                rootHref="/dashboard"
                className="mb-6"
            />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
                <p className="text-muted-foreground mt-1">Create a new user account with specific role and permissions.</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Main Form */}
                <form onSubmit={handleCreateUser} className="space-y-6">
                    <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={userData.name}
                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground placeholder:text-input-dark-text focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground placeholder:text-input-dark-text focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-muted-foreground" />
                                    Initial Password
                                </label>
                                <input
                                    type="password"
                                    value={userData.password}
                                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground placeholder:text-input-dark-text focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                    Account Role
                                </label>
                                <Select
                                    value={userData.role}
                                    onValueChange={(val) => setUserData({ ...userData, role: val as UserRole })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-blue-500" />
                                                Student
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="teacher">
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-violet-500" />
                                                Teacher
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="moderator">
                                            <div className="flex items-center gap-2">
                                                <Settings className="w-4 h-4 text-amber-500" />
                                                Moderator
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            <div className="flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-rose-500" />
                                                Admin
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="flex-1 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20"
                            >
                                {isCreating && <Loader2 className="w-5 h-5 animate-spin" />}
                                <UserPlus className="w-5 h-5" />
                                Create User Account
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3.5 rounded-2xl border border-border/50 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>

                {/* Role Permissions Information Cards */}
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2 text-lg px-1">
                        <Shield className="w-5 h-5 text-primary" />
                        Role Permissions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Student */}
                        <div className="p-5 rounded-3xl border border-border/50 bg-card/30 hover:bg-muted/20 transition-all space-y-2 group">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                <p className="font-bold text-foreground">Student</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Regular access to courses and learning materials.
                            </p>
                        </div>
                        {/* Teacher */}
                        <div className="p-5 rounded-3xl border border-border/50 bg-card/30 hover:bg-muted/20 transition-all space-y-2 group">
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
                                <p className="font-bold text-foreground">Teacher</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Can create courses, manage lessons, and interact with students.
                            </p>
                        </div>
                        {/* Moderator */}
                        <div className="p-5 rounded-3xl border border-border/50 bg-card/30 hover:bg-muted/20 transition-all space-y-2 group">
                            <div className="flex items-center gap-2">
                                <Settings className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                <p className="font-bold text-foreground">Moderator</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Can manage content, reviews, and community discussions.
                            </p>
                        </div>
                        {/* Admin */}
                        <div className="p-5 rounded-3xl border border-border/50 bg-card/30 hover:bg-muted/20 transition-all space-y-2 group">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                                <p className="font-bold text-foreground">Admin</p>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Full system access, including financial settings and site configuration.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Security Tip */}
                <div className="p-4 rounded-2xl border border-border/50 bg-primary/5 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div className="space-y-1">
                        <h3 className="font-bold text-sm text-foreground">Security Tip</h3>
                        <p className="text-xs text-muted-foreground">
                            Ensure the password is at least 6 characters long. The user can change their password later from their profile settings.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
