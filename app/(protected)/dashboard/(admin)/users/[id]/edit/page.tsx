"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import {
    User, Mail, Shield, Loader2,
    Award, Settings, Activity, AlertCircle, Lock, Users
} from "lucide-react";
import { updateUser, getUserById, changeUserPassword } from "@/lib/actions/users";
import { UserRole, UserStatus, ExtendedUser } from "@/types/user";
import { useToast } from "@/components/ui/toast";
import { userUpdateSchema, userPasswordSchema } from "@/lib/validations/user";
import { ZodError } from "zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id as string;
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "student" as UserRole,
        status: "active" as UserStatus
    });
    const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
    const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
    const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);
    const [isPasswordSubmitted, setIsPasswordSubmitted] = useState(false);
    useEffect(() => {
        if (isProfileSubmitted) {
            const timer = setTimeout(() => {
                const result = userUpdateSchema.safeParse(formData);
                if (!result.success) {
                    const newErrors: Record<string, string> = {};
                    result.error.issues.forEach((issue) => {
                        if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                    });
                    setProfileErrors(newErrors);
                } else {
                    setProfileErrors({});
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [formData, isProfileSubmitted]);
    useEffect(() => {
        if (isPasswordSubmitted) {
            const timer = setTimeout(() => {
                const result = userPasswordSchema.safeParse({ password: newPassword });
                if (!result.success) {
                    const newErrors: Record<string, string> = {};
                    result.error.issues.forEach((issue) => {
                        if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                    });
                    setPasswordErrors(newErrors);
                } else {
                    setPasswordErrors({});
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [newPassword, isPasswordSubmitted]);
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;
            setIsLoading(true);
            const result = await getUserById(userId);
            if (!result.error && result.user) {
                const userData = result.user;
                setUser(userData);
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    role: (userData.role as UserRole) || "student",
                    status: (userData.status as UserStatus) || "active"
                });
            } else {
                toast.error("Error", "Failed to fetch user details");
                router.push("/dashboard/users");
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [userId, router, toast]);
    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProfileSubmitted(true);
        setProfileErrors({});
        if (!userId) return;
        setIsUpdating(true);
        try {
            userUpdateSchema.parse(formData);
            const result = await updateUser(userId, formData);
            if (result.user) {
                toast.success("User updated", "User details have been updated successfully");
                router.push("/dashboard/users");
                router.refresh();
            } else {
                toast.error("Error", result.error || "Failed to update user");
            }
        } catch (error: any) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                });
                setProfileErrors(newErrors);
            } else {
                toast.error("Error", "An unexpected error occurred");
            }
        } finally {
            setIsUpdating(false);
        }
    };
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordSubmitted(true);
        setPasswordErrors({});
        if (!userId || !newPassword) return;
        setIsChangingPassword(true);
        try {
            userPasswordSchema.parse({ password: newPassword });
            const result = await changeUserPassword(userId, newPassword);
            if (result.success) {
                toast.success("Password updated", "User password has been changed successfully");
                setNewPassword("");
            } else {
                toast.error("Error", result.error || "Failed to update password");
            }
        } catch (error: any) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((issue) => {
                    if (issue.path[0]) newErrors[issue.path[0] as string] = issue.message;
                });
                setPasswordErrors(newErrors);
            } else {
                toast.error("Error", "An unexpected error occurred");
            }
        } finally {
            setIsChangingPassword(false);
        }
    };
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading user profile...</p>
            </div>
        );
    }
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
            {}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
                <p className="text-muted-foreground mt-1">Update profile information, access role, and account status.</p>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateUser} className="space-y-6">
                        <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-lg">
                                <User className="w-5 h-5 text-primary" />
                                Profile Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        Full Name
                                    </label>
                                    <div className="space-y-1">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground placeholder:text-input-dark-text focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                                profileErrors.name && "border-rose-500/50 focus:border-rose-500 ring-rose-500/10"
                                            )}
                                            placeholder="John Doe"
                                        />
                                        {profileErrors.name && (
                                            <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {profileErrors.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        Email Address
                                    </label>
                                    <div className="space-y-1">
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground placeholder:text-input-dark-text focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                                profileErrors.email && "border-rose-500/50 focus:border-rose-500 ring-rose-500/10"
                                            )}
                                            placeholder="john@example.com"
                                        />
                                        {profileErrors.email && (
                                            <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {profileErrors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        Account Role
                                    </label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(val) => setFormData({ ...formData, role: val as UserRole })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="teacher">Teacher</SelectItem>
                                            <SelectItem value="moderator">Moderator</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                        Account Status
                                    </label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(val) => setFormData({ ...formData, status: val as UserStatus })}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20"
                                >
                                    {isUpdating && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Save Profile Changes
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
                    {}
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-6">
                            <h3 className="font-bold flex items-center gap-2 text-lg text-amber-500">
                                <Lock className="w-5 h-5" />
                                Security Settings
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">
                                        New Password
                                    </label>
                                    <div className="space-y-1">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={cn(
                                                "w-full px-4 py-3 rounded-xl bg-input-dark border border-input-dark-border text-foreground placeholder:text-input-dark-text focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all",
                                                passwordErrors.password && "border-rose-500/50 focus:border-rose-500 ring-rose-500/10"
                                            )}
                                            placeholder="Enter at least 6 characters"
                                        />
                                        {passwordErrors.password && (
                                            <p className="text-[11px] text-rose-500 font-medium ml-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {passwordErrors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 mt-2">
                                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                        <p className="text-[11px] text-amber-500/90 leading-relaxed">
                                            Updating the password will take effect immediately. The user will need to use the new password on their next sign-in.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isChangingPassword || !newPassword}
                                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 font-bold shadow-lg shadow-amber-500/20"
                                >
                                    {isChangingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {}
                <div className="space-y-6">
                    <div className="p-6 rounded-3xl border border-border/50 bg-muted/20 space-y-6">
                        <div className="text-center space-y-4">
                            <div className="relative inline-block">
                                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-3xl border-2 border-primary/10 overflow-hidden shadow-2xl mx-auto">
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        (user?.name?.[0] || 'U').toUpperCase()
                                    )}
                                </div>
                                <div className={cn(
                                    "absolute bottom-0 right-1 w-6 h-6 rounded-full border-[3px] border-card flex items-center justify-center",
                                    user?.status === 'active' ? "bg-emerald-500" : "bg-slate-500"
                                )} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{user?.name}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-border/40">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">User ID</span>
                                <span className="font-mono text-xs opacity-60">#{userId.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Joined</span>
                                <span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Courses</span>
                                <span className="font-bold text-primary">{user?.courses_enrolled?.length || 0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 rounded-3xl border border-border/50 bg-rose-500/5 space-y-3">
                        <h3 className="font-bold text-sm text-rose-500">Admin Actions</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Need to permanently remove this user? You can do so from the main user management list.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
