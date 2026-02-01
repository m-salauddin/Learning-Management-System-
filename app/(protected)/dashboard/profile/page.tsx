"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useState, useRef, useEffect } from "react";
import { Save, Lock, User, Key, Shield, Camera, Loader2, Globe, MapPin, Phone as PhoneIcon, Mail, Calendar, Award, BookOpen, Trophy, Verified, Edit3, ChevronRight, Sparkles, GraduationCap, CheckCircle2, Clock, UserCheck } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, getUserById } from "@/lib/actions/users";
import { ExtendedUser } from "@/types/user";
import { setUser } from "@/lib/store/features/auth/authSlice";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
    const { user: authUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        phone: "",
        location: "",
        website: ""
    });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const supabase = createClient();

    const hasChanges = userProfile && (
        formData.name.trim() !== (userProfile.name || "").trim() ||
        formData.bio.trim() !== (userProfile.bio || "").trim() ||
        formData.phone.trim() !== (userProfile.phone || "").trim() ||
        formData.location.trim() !== (userProfile.location || "").trim() ||
        formData.website.trim() !== (userProfile.website || "").trim()
    );

    useEffect(() => {
        if (authUser?.id) {
            fetchUserProfile(authUser.id);
        }
    }, [authUser?.id]);

    const fetchUserProfile = async (id: string) => {
        const result = await getUserById(id);
        if (result.user) {
            setUserProfile(result.user);
            setFormData({
                name: result.user.name || "",
                bio: result.user.bio || "",
                phone: result.user.phone || "",
                location: result.user.location || "",
                website: result.user.website || ""
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || "",
                bio: userProfile.bio || "",
                phone: userProfile.phone || "",
                location: userProfile.location || "",
                website: userProfile.website || ""
            });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userProfile) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large", "Image must be less than 5MB");
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error("Invalid file", "Please upload an image file");
            return;
        }

        const oldAvatarUrl = userProfile.avatar_url;

        try {
            setIsUploading(true);
            const fileExt = file.name.split('.').pop();
            const filePath = `${userProfile.id}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const result = await updateProfile({ avatar_url: publicUrl });

            if (result.user) {
                if (oldAvatarUrl && oldAvatarUrl.includes('/storage/v1/object/public/avatars/')) {
                    const filename = oldAvatarUrl.split('/avatars/').pop();
                    if (filename) {
                        await supabase.storage.from('avatars').remove([filename]);
                    }
                }

                setUserProfile(result.user);
                dispatch(setUser({
                    id: result.user.id,
                    email: result.user.email,
                    fullName: result.user.name,
                    role: result.user.role,
                    avatarUrl: result.user.avatar_url,
                    coursesEnrolled: result.user.courses_enrolled || [],
                    providers: result.user.providers || [],
                }));
                toast.success("Avatar updated", "Your profile picture has been updated.");
            } else {
                throw new Error(result.error || 'Failed to update profile');
            }

        } catch (error: any) {
            console.error(error);
            toast.error("Upload failed", error.message || "Could not upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await updateProfile(formData);

        if (result.user) {
            setUserProfile(result.user);
            dispatch(setUser({
                id: result.user.id,
                email: result.user.email,
                fullName: result.user.name,
                role: result.user.role,
                avatarUrl: result.user.avatar_url,
                coursesEnrolled: result.user.courses_enrolled || [],
                providers: result.user.providers || [],
            }));
            toast.success("Profile Updated", "Your changes have been saved successfully.");
        } else {
            toast.error("Update failed", result.error || "Could not update profile");
        }

        setIsLoading(false);
    };

    const getRoleBadge = (role: string) => {
        const styles: Record<string, { bg: string; text: string; icon: typeof Shield }> = {
            admin: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-500", icon: Shield },
            teacher: { bg: "bg-violet-500/10 border-violet-500/20", text: "text-violet-500", icon: GraduationCap },
            moderator: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-500", icon: Key },
            student: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-500", icon: BookOpen },
        };
        return styles[role] || styles.student;
    };

    if (!userProfile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-muted-foreground text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    const roleBadge = getRoleBadge(userProfile.role || 'student');
    const RoleIcon = roleBadge.icon;

    const stats = [
        { label: 'Enrolled', value: userProfile.courses_enrolled?.length || 0, icon: BookOpen, bg: 'bg-blue-500/10', color: 'text-blue-500', border: 'border-blue-500/20' },
        { label: 'Completed', value: userProfile.completed_courses || 0, icon: Trophy, bg: 'bg-emerald-500/10', color: 'text-emerald-500', border: 'border-emerald-500/20' },
        { label: 'Certificates', value: userProfile.certificates_earned || 0, icon: Award, bg: 'bg-amber-500/10', color: 'text-amber-500', border: 'border-amber-500/20' },
    ];

    const profileCompletion = Math.round(
        (
            (userProfile.name ? 1 : 0) +
            (userProfile.bio ? 1 : 0) +
            (userProfile.avatar_url ? 1 : 0) +
            (userProfile.phone ? 1 : 0) +
            (userProfile.location ? 1 : 0)
        ) / 5 * 100
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full pb-8 font-sans space-y-6"
        >
            {/* Hero Header Card */}
            <div className="rounded-xl md:rounded-2xl border border-border/50 bg-card shadow-lg overflow-hidden">
                <div className="p-4 md:p-6 lg:p-8">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-6 xl:gap-12">
                        {/* Left Section: Avatar + Info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="relative group shrink-0">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-border/50 shadow-lg">
                                    {userProfile.avatar_url ? (
                                        <img
                                            src={userProfile.avatar_url}
                                            alt={userProfile.name}
                                            className={cn("w-full h-full object-cover", isUploading && "opacity-40")}
                                        />
                                    ) : (
                                        <div className={cn("w-full h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-foreground/70 text-3xl font-bold", isUploading && "opacity-40")}>
                                            {(userProfile.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                                    </div>
                                )}
                                {!isUploading && (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-all cursor-pointer hover:scale-105 border-2 border-background"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 min-w-0 text-center sm:text-left space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
                                        {userProfile.name}
                                    </h1>
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border self-center sm:self-auto shrink-0",
                                        roleBadge.bg, roleBadge.text
                                    )}>
                                        <RoleIcon className="w-3.5 h-3.5" />
                                        {(userProfile.role || 'student').charAt(0).toUpperCase() + (userProfile.role || 'student').slice(1)}
                                    </div>
                                </div>

                                {userProfile.bio && (
                                    <p className="text-foreground/60 text-sm line-clamp-2 max-w-xl mx-auto sm:mx-0">
                                        {userProfile.bio}
                                    </p>
                                )}

                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    {/* Row 1 */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs">
                                            <Mail className="w-3.5 h-3.5 shrink-0" />
                                            <span className="truncate max-w-[200px]">{userProfile.email}</span>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>Active</span>
                                        </div>
                                    </div>
                                    {/* Row 2 */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Joined {new Date(userProfile.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 text-muted-foreground text-xs">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Row - Right side on large screens */}
                        <div className="flex flex-wrap xl:flex-nowrap gap-3 w-full xl:w-auto min-w-fit justify-center">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={cn(
                                        "flex-1 xl:flex-none min-w-[120px] w-full xl:w-32 p-4 rounded-xl border text-center transition-all hover:scale-[1.02] cursor-default flex flex-col items-center justify-center gap-1",
                                        stat.bg, stat.border
                                    )}
                                >
                                    <stat.icon className={cn("w-5 h-5 mb-1", stat.color)} />
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-1 p-1 rounded-xl bg-muted/30 border border-border/40 w-full sm:w-fit">
                {[
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'security', label: 'Security', icon: Lock },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as 'profile' | 'security')}
                        className={cn(
                            "relative flex items-center justify-center px-6 py-2 rounded-lg text-sm font-medium transition-colors flex-1 sm:flex-none outline-none",
                            activeTab === tab.id
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute inset-0 bg-background rounded-lg shadow-md border border-border/30"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col xl:flex-row gap-6 items-start"
                    >
                        {/* Sidebar Cards - Right side fixed width */}
                        <div className="w-full xl:w-[350px] space-y-6 order-1 xl:order-2 shrink-0">
                            {/* Connected Accounts */}
                            <div className="p-5 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-lg">
                                <h4 className="font-semibold mb-4 flex items-center gap-3 text-base">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <Key className="w-4 h-4" />
                                    </div>
                                    Connected Accounts
                                </h4>
                                <div className="space-y-3">
                                    {(userProfile.providers || ['password']).map((provider) => (
                                        <div key={provider} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className={cn(
                                                    "w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-inset ring-border/10",
                                                    provider === 'google' ? 'bg-white' :
                                                        provider === 'github' ? 'bg-[#181717] text-white' :
                                                            'bg-primary/10 text-primary'
                                                )}>
                                                    {provider === 'google' && <FcGoogle className="w-5 h-5" />}
                                                    {provider === 'github' && <FaGithub className="w-5 h-5" />}
                                                    {provider === 'password' && <Mail className="w-5 h-5" />}
                                                </div>
                                                <span className="text-sm font-medium capitalize truncate">
                                                    {provider === 'password' ? 'Email' : provider}
                                                </span>
                                            </div>
                                            <span className="text-xs text-emerald-500 font-medium shrink-0 ml-auto">Connected</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Profile Completion */}
                            <div className="p-5 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-lg">
                                <h4 className="font-semibold mb-4 flex items-center gap-3 text-base">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <UserCheck className="w-4 h-4" />
                                    </div>
                                    Profile Completion
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Complete</span>
                                        <span className="font-semibold">{profileCompletion}%</span>
                                    </div>
                                    <div className="h-2.5 rounded-full bg-muted/50 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${profileCompletion}%` }}
                                            className="h-full rounded-full bg-linear-to-r from-primary to-primary/70"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="flex-1 w-full order-2 xl:order-1 min-w-0">
                            <div className="p-6 lg:p-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-lg">
                                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/40">
                                    <div>
                                        <h3 className="text-lg font-semibold flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Edit3 className="w-5 h-5" />
                                            </div>
                                            Edit Profile
                                        </h3>
                                        <p className="text-xs text-muted-foreground mt-1">Update your personal information</p>
                                    </div>
                                </div>

                                <form className="space-y-5" onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                                        {/* Full Name */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-foreground/80 mb-3">Full Name</label>
                                            <input
                                                name="name"
                                                type="text"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 rounded-lg bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-foreground/80 mb-3">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    defaultValue={userProfile.email || ""}
                                                    disabled
                                                    className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground outline-none text-sm cursor-not-allowed opacity-70"
                                                />
                                                <Verified className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-foreground/80 mb-3">Phone Number</label>
                                            <div className="relative">
                                                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    name="phone"
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+880 1XXX XXXXXX"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium text-foreground/80 mb-3">Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    name="location"
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="Dhaka, Bangladesh"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Website - Full width */}
                                        <div className="sm:col-span-2 space-y-3">
                                            <label className="block text-sm font-medium text-foreground/80 mb-3">Website</label>
                                            <div className="relative">
                                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <input
                                                    name="website"
                                                    type="url"
                                                    value={formData.website}
                                                    onChange={handleInputChange}
                                                    placeholder="https://yourwebsite.com"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground/80">Bio</label>
                                        <textarea
                                            name="bio"
                                            rows={4}
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="Tell us a bit about yourself..."
                                            className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm resize-none"
                                        />
                                        <p className="text-xs text-muted-foreground">{formData.bio.trim().length}/500 characters</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <AnimatePresence>
                                        {hasChanges && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={handleCancel}
                                                    className="w-full sm:w-auto px-6 py-2.5 border border-border/50 text-foreground font-medium rounded-lg hover:bg-muted/50 transition-all text-sm"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full max-w-2xl"
                    >
                        <div className="p-4 md:p-6 lg:p-8 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl shadow-lg space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-border/40">
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        Security Settings
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">Manage your account security</p>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-all gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                                        <Key className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Password</p>
                                        <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center w-full sm:w-auto gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 sm:py-0 bg-background/50 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-none border-border/50">
                                    Change
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Two-Factor */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-all gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Two-Factor Authentication</p>
                                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center w-full sm:w-auto gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 sm:py-0 bg-background/50 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-none border-border/50">
                                    Enable
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Active Sessions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-primary/30 transition-all gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Active Sessions</p>
                                        <p className="text-xs text-muted-foreground">Manage your logged-in devices</p>
                                    </div>
                                </div>
                                <button className="flex items-center justify-center w-full sm:w-auto gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 sm:py-0 bg-background/50 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-none border-border/50">
                                    View All
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="pt-4 border-t border-border/40">
                                <h4 className="text-sm font-semibold text-red-500 mb-3">Danger Zone</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20 gap-3">
                                    <div>
                                        <p className="font-medium text-red-500">Delete Account</p>
                                        <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                                    </div>
                                    <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
