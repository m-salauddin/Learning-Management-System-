"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { useState } from "react";
import { Save, Lock, User, Key, Shield } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function SettingsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    // Mock handler
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Profile Updated", "Your changes have been saved successfully.");
        }, 1500);
    };

    return (
        <div className="max-w-3xl space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground text-sm">Manage your profile and account preferences</p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-border/50 pb-4">
                    <User className="w-5 h-5 text-primary" />
                    Profile Information
                </h3>

                <form className="space-y-6" onSubmit={handleUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">Full Name</label>
                            <input
                                type="text"
                                defaultValue={user?.fullName || ""}
                                className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">Email Address</label>
                            <input
                                type="email"
                                defaultValue={user?.email || ""}
                                disabled
                                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-muted-foreground outline-none text-sm cursor-not-allowed"
                            />
                            <p className="text-[10px] text-muted-foreground">Email address cannot be changed</p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium text-foreground/80">Bio</label>
                        <textarea
                            rows={3}
                            placeholder="Tell us a bit about yourself..."
                            className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm resize-none"
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                        <Key className="w-5 h-5 text-primary" />
                        Password & Security
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                        Ensure your account is secure by updating your password regularly.
                    </p>
                    <button className="w-full px-4 py-2.5 text-sm font-medium border border-border bg-background/50 rounded-xl hover:bg-muted/50 hover:border-foreground/20 transition-all cursor-pointer">
                        Change Password
                    </button>
                </div>

                <div className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        Privacy
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">
                        Manage what information is visible to other users on the platform.
                    </p>
                    <button className="w-full px-4 py-2.5 text-sm font-medium border border-border bg-background/50 rounded-xl hover:bg-muted/50 hover:border-foreground/20 transition-all cursor-pointer">
                        Privacy Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
