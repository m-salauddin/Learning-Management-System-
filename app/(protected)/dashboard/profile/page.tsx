"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useState, useRef, useEffect, useMemo } from "react";
import {
    Save, User, Camera, Loader2, Globe, MapPin, Phone as PhoneIcon,
    BookOpen, Trophy, Zap, CheckCircle2, Github, Lock, Eye, EyeOff,
    Shield, UserCircle, Key, Mail, AlertCircle, ShieldCheck, Facebook,
    Instagram, Twitter, Linkedin, MessageCircle, Link as LinkIcon, X, Plus, Trash2, Pencil, Settings
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, getUserById } from "@/lib/actions/users";
import { ExtendedUser } from "@/types/user";
import { setUser } from "@/lib/store/features/auth/authSlice";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmModal } from "@/components/ui";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { CustomLoading } from "@/components/ui/custom-loading";

const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

type TabValue = "profile" | "security";

const tabs: { value: TabValue; label: string; icon: React.ElementType; description: string }[] = [
    { value: "profile", label: "Profile", icon: UserCircle, description: "Your personal information" },
    { value: "security", label: "Security", icon: Shield, description: "Password & authentication" },
];

const SOCIAL_PLATFORMS = {
    github: {
        name: "GitHub",
        icon: Github,
        placeholder: "https://github.com/username",
        validation: /^https?:\/\/(www\.)?github\.com\/[\w-]+\/?$/,
        errorMessage: "Please enter a valid GitHub profile URL"
    },
    linkedin: {
        name: "LinkedIn",
        icon: Linkedin,
        placeholder: "https://linkedin.com/in/username",
        validation: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/,
        errorMessage: "Please enter a valid LinkedIn profile URL"
    },
    twitter: {
        name: "X (Twitter)",
        icon: X,
        placeholder: "https://twitter.com/username or https://x.com/username",
        validation: /^https?:\/\/(www\.)?(twitter|x)\.com\/[\w]+\/?$/,
        errorMessage: "Please enter a valid X/Twitter profile URL"
    },
    facebook: {
        name: "Facebook",
        icon: Facebook,
        placeholder: "https://facebook.com/username",
        validation: /^https?:\/\/(www\.)?(facebook|fb)\.com\/[\w.]+\/?$/,
        errorMessage: "Please enter a valid Facebook profile URL"
    },
    instagram: {
        name: "Instagram",
        icon: Instagram,
        placeholder: "https://instagram.com/username",
        validation: /^https?:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/,
        errorMessage: "Please enter a valid Instagram profile URL"
    },
    whatsapp: {
        name: "WhatsApp",
        icon: MessageCircle,
        placeholder: "https://wa.me/1234567890",
        validation: /^https?:\/\/(www\.)?wa\.me\/[\d]+\/?$/,
        errorMessage: "Please enter a valid WhatsApp link"
    },
    other: {
        name: "Other Link",
        icon: LinkIcon,
        placeholder: "https://yourwebsite.com",
        validation: /^https?:\/\/.+\..+$/,
        errorMessage: "Please enter a valid URL starting with http:// or https://"
    }
} as const;

type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;

export default function ProfilePage() {
    const { user: authUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabValue>("profile");
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        phone: "",
        location: "",
        website: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

    const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
    const [showAddLinkDialog, setShowAddLinkDialog] = useState(false);
    const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>("github");
    const [linkUrl, setLinkUrl] = useState("");
    const [linkError, setLinkError] = useState("");

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [linkToDeleteIndex, setLinkToDeleteIndex] = useState<number | null>(null);
    const [isAutoSaving, setIsAutoSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();
    const supabase = createClient();

    const hasChanges = userProfile && (
        selectedImageFile !== null ||
        formData.name.trim() !== (userProfile.name || "").trim() ||
        formData.bio.trim() !== (userProfile.bio || "").trim() ||
        formData.phone.trim() !== (userProfile.phone || "").trim() ||
        formData.location.trim() !== (userProfile.location || "").trim() ||
        formData.website.trim() !== (userProfile.website || "").trim()
    );

    const completionPercentage = useMemo(() => {
        if (!userProfile) return 0;
        const fields = [
            userProfile.name,
            userProfile.email,
            userProfile.bio,
            userProfile.phone,
            userProfile.location,
            userProfile.avatar_url,
        ];
        const filled = fields.filter(val => val && val.toString().trim().length > 0).length;
        return Math.round((filled / fields.length) * 100);
    }, [userProfile]);

    const passwordStrength = useMemo(() => {
        const password = passwordData.newPassword;
        if (!password) return { score: 0, label: "", color: "" };

        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

        if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
        if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
        if (score <= 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
        if (score <= 4) return { score: 4, label: "Strong", color: "bg-emerald-500" };
        return { score: 5, label: "Excellent", color: "bg-emerald-600" };
    }, [passwordData.newPassword]);

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
            setSocialLinks(result.user.social_links || []);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setPasswordErrors([]);
    };

    const handleCancel = () => {
        if (selectedImageFile) {
            setSelectedImageFile(null);
            setPreviewUrl(null);
            toast.warning("Changes cancelled", "Image selection and profile changes have been discarded.");
        } else if (hasChanges) {
            toast.warning("Changes cancelled", "Profile changes have been discarded.");
        }

        if (userProfile) {
            setFormData({
                name: userProfile.name || "",
                bio: userProfile.bio || "",
                phone: userProfile.phone || "",
                location: userProfile.location || "",
                website: userProfile.website || ""
            });
            setSocialLinks(userProfile.social_links || []);
        }
    };

    const saveSocialLinks = async (updatedLinks: any[]) => {
        if (!userProfile) return;

        setIsAutoSaving(true);

        const toastId = toast.loading("Syncing links...", "Saving your social profiles automatically.");

        try {
            const result = await updateProfile({
                social_links: updatedLinks
            });

            if (result.user) {
                setUserProfile(result.user);
                setSocialLinks(result.user.social_links || []);

                dispatch(setUser({
                    ...authUser,
                    id: result.user.id,
                    email: result.user.email,
                    fullName: result.user.name,
                    role: result.user.role,
                    avatarUrl: result.user.avatar_url,
                    coursesEnrolled: result.user.courses_enrolled || [],
                    providers: result.user.providers || [],
                }) as any);

                toast.dismiss(toastId);
                toast.success("Links updated", "Your social links have been saved.");
                return true;
            } else {
                throw new Error(result.error || "Could not update social links");
            }
        } catch (error: any) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error("Auto-save failed", error.message || "Failed to update social links.");

            setSocialLinks(userProfile.social_links || []);
            return false;
        } finally {
            setIsAutoSaving(false);
        }
    };
    const openAddLinkDialog = () => {
        if (socialLinks.length >= 3) {
            toast.error("Maximum links reached", "You can only add up to 3 social links.");
            return;
        }
        setEditingLinkIndex(null);
        setShowAddLinkDialog(true);
        setLinkUrl("");
        setLinkError("");
        setSelectedPlatform("github");
    };

    const openEditLinkDialog = (index: number) => {
        const link = socialLinks[index];
        setEditingLinkIndex(index);
        setSelectedPlatform(link.platform as SocialPlatform);
        setLinkUrl(link.url);
        setLinkError("");
        setShowAddLinkDialog(true);
    };

    const handleAddLink = async () => {
        const platform = SOCIAL_PLATFORMS[selectedPlatform];

        if (!linkUrl.trim()) {
            setLinkError("Please enter a URL");
            return;
        }

        if (!platform.validation.test(linkUrl)) {
            setLinkError(platform.errorMessage);
            return;
        }

        const isDuplicate = socialLinks.some((link, idx) =>
            link.platform === selectedPlatform && idx !== editingLinkIndex
        );

        if (isDuplicate) {
            setLinkError(`You've already added a ${platform.name} link. Remove it first to add a new one.`);
            return;
        }

        let updatedLinks;
        if (editingLinkIndex !== null) {

            updatedLinks = [...socialLinks];
            updatedLinks[editingLinkIndex] = { platform: selectedPlatform, url: linkUrl };
        } else {

            updatedLinks = [...socialLinks, { platform: selectedPlatform, url: linkUrl }];
        }

        setShowAddLinkDialog(false);
        setLinkUrl("");
        setLinkError("");
        setEditingLinkIndex(null);

        await saveSocialLinks(updatedLinks);
    };

    const handleRemoveLink = (index: number) => {
        setLinkToDeleteIndex(index);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteLink = async () => {
        if (linkToDeleteIndex === null) return;

        const updatedLinks = socialLinks.filter((_, i) => i !== linkToDeleteIndex);

        setShowDeleteConfirm(false);
        setLinkToDeleteIndex(null);

        await saveSocialLinks(updatedLinks);
    };

    const handleLinkUrlChange = (value: string) => {
        setLinkUrl(value);
        setLinkError("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 300 * 1024) {
            toast.error("File too large", "Image must be less than 300KB");
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error("Invalid file", "Please upload an image file");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setSelectedImageFile(file);

        e.target.value = '';

        toast.success("Image selected", "Click 'Save Changes' to upload and update your profile.");
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>, overrideSocialLinks?: any[]) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        const loadingToastId = toast.loading("Saving changes...", "Please wait while we update your profile.");

        const cleanedData = Object.entries(formData).reduce((acc, [key, value]) => {
            acc[key as keyof typeof formData] = typeof value === 'string' ? value.trim() : value;
            return acc;
        }, {} as typeof formData);

        if (cleanedData.bio.length > 0 && cleanedData.bio.length < 100) {
            toast.dismiss(loadingToastId);
            toast.error("Bio too short", "Please write at least 100 characters about yourself.");
            setIsLoading(false);
            return;
        }

        try {
            let finalData = { ...cleanedData, social_links: overrideSocialLinks || socialLinks } as any;

            if (selectedImageFile && userProfile) {
                const fileExt = selectedImageFile.name.split('.').pop();
                const filePath = `${userProfile.id}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, selectedImageFile);

                if (uploadError) {
                    if (uploadError.message?.includes("bucket") || uploadError.message?.includes("Bucket not found")) {
                        throw new Error("The 'avatars' storage bucket was not found. Please run the storage setup script.");
                    }
                    throw uploadError;
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                finalData.avatar_url = publicUrl;
            }

            const result = await updateProfile(finalData);

            if (result.user) {

                if (selectedImageFile && userProfile?.avatar_url && userProfile.avatar_url.includes('/storage/v1/object/public/avatars/')) {
                    const filename = userProfile.avatar_url.split('/avatars/').pop();
                    if (filename && (!result.user.avatar_url || !result.user.avatar_url.includes(filename))) {
                        await supabase.storage.from('avatars').remove([filename]);
                    }
                }

                setUserProfile(result.user);

                setFormData({
                    name: result.user.name || "",
                    bio: result.user.bio || "",
                    phone: result.user.phone || "",
                    location: result.user.location || "",
                    website: result.user.website || ""
                });
                setSocialLinks(result.user.social_links || []);

                dispatch(setUser({
                    id: result.user.id,
                    email: result.user.email,
                    fullName: result.user.name,
                    role: result.user.role,
                    avatarUrl: result.user.avatar_url,
                    coursesEnrolled: result.user.courses_enrolled || [],
                    providers: result.user.providers || [],
                }));

                setSelectedImageFile(null);
                setPreviewUrl(null);

                toast.dismiss(loadingToastId);
                toast.success("Profile Updated", "Your changes have been saved successfully.");
            } else {
                throw new Error(result.error || "Could not update profile");
            }
        } catch (error: any) {
            console.error(error);
            toast.dismiss(loadingToastId);
            toast.error("Update failed", error.message || "Something went wrong saving your profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPasswordErrors([]);

        const errors: string[] = [];
        if (passwordData.newPassword.length < 8) {
            errors.push("Password must be at least 8 characters");
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.push("Passwords do not match");
        }
        if (!passwordData.currentPassword) {
            errors.push("Current password is required");
        }

        if (errors.length > 0) {
            setPasswordErrors(errors);
            return;
        }

        setIsChangingPassword(true);

        try {

            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userProfile?.email || "",
                password: passwordData.currentPassword
            });

            if (signInError) {
                setPasswordErrors(["Current password is incorrect"]);
                setIsChangingPassword(false);
                return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (updateError) {
                setPasswordErrors([updateError.message]);
            } else {
                toast.success("Password Updated", "Your password has been changed successfully.");
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error: any) {
            setPasswordErrors([error.message || "Failed to update password"]);
        } finally {
            setIsChangingPassword(false);
        }
    };

    const isProviderConnected = (provider: string) => {
        return (userProfile?.providers as string[] | undefined)?.includes(provider);
    };

    const hasPasswordAuth = isProviderConnected('email') || isProviderConnected('password');

    if (!userProfile) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[70vh] w-full bg-background/50 backdrop-blur-sm rounded-3xl border border-border/40 my-4 shadow-inner">
                <CustomLoading size="xl" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pb-20">
            <div className="space-y-8">
                <PageHeader
                    title="Account Settings"
                    description="Manage your profile, security, and preferences"
                    icon={Settings}
                    actions={
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 dark:bg-muted/30 border border-slate-200 dark:border-white/10"
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary/20 bg-muted">
                                    {(previewUrl || userProfile.avatar_url) ? (
                                        <img
                                            src={previewUrl || userProfile.avatar_url || ""}
                                            alt={userProfile.name || ""}
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary text-lg font-bold">
                                            {(userProfile.name?.[0] || 'U').toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background flex items-center justify-center">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                </div>
                            </div>

                            <div className="hidden sm:block">
                                <p className="text-xs font-black uppercase tracking-tight text-foreground">{userProfile.name}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{userProfile.role}</p>
                            </div>
                        </motion.div>
                    }
                />


                {}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/30 border border-border/50 w-fit"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.value;
                        return (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    "relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSettingsTab"
                                        className="absolute inset-0 bg-background border border-border rounded-xl shadow-sm"
                                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2.5">
                                    <span className={cn(
                                        "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                                        isActive
                                            ? "bg-foreground/10 text-primary"
                                            : "bg-muted/50 text-muted-foreground"
                                    )}>
                                        <Icon className="w-4 h-4" />
                                    </span>
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {}
                <AnimatePresence mode="wait">
                    {}
                    {activeTab === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                        >
                            {}
                            <div className="space-y-6">
                                {}
                                <Card className="overflow-hidden bg-muted/30 border-border/50">
                                    <CardContent className="pt-8 pb-6">
                                        <div className="flex flex-col items-center">
                                            <div className="relative group mb-6">
                                                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-border bg-muted">
                                                    {(previewUrl || userProfile.avatar_url) ? (
                                                        <img
                                                            src={previewUrl || userProfile.avatar_url || ""}
                                                            alt={userProfile.name || ""}
                                                            referrerPolicy="no-referrer"
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-bold">
                                                            {(userProfile.name?.[0] || 'U').toUpperCase()}
                                                        </div>
                                                    )}
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm rounded-xl">
                                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={isUploading}
                                                    className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform cursor-pointer disabled:opacity-50"
                                                >
                                                    <Camera className="w-4 h-4" />
                                                </button>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-muted/30 border-border/50">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Trophy className="w-4 h-4 text-primary" />
                                            </div>
                                            Statistics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-muted-foreground">Courses</span>
                                            </div>
                                            <span className="text-lg font-bold">{userProfile.courses_enrolled?.length || 0}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <Trophy className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-muted-foreground">Achievements</span>
                                            </div>
                                            <span className="text-lg font-bold">14</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                                    <Zap className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-medium text-muted-foreground">Streak</span>
                                            </div>
                                            <span className="text-lg font-bold">3 Days</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {}
                                <Card className="bg-muted/30 border-border/50">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-base flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                            </div>
                                            Profile Completion
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-end justify-between">
                                                <span className="text-3xl font-black text-primary">{completionPercentage}%</span>
                                                <span className="text-xs font-medium text-muted-foreground">
                                                    {completionPercentage === 100 ? "Complete!" : "Keep going"}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${completionPercentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="h-full bg-linear-to-r from-primary/80 to-primary rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {}
                            <div className="xl:col-span-2">
                                <Card className="bg-muted/30 border-border/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <User className="w-5 h-5 text-primary" />
                                            </div>
                                            Personal Information
                                        </CardTitle>
                                        <CardDescription>
                                            Update your personal details and public profile
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between h-6">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                                                    </div>
                                                    <div className="relative">
                                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            name="name"
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter your full name"
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between h-6">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                                                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                                                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                                                        </span>
                                                    </div>
                                                    <div className="relative">
                                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            type="email"
                                                            value={userProfile.email || ""}
                                                            disabled
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/20 border border-border text-sm text-muted-foreground cursor-not-allowed"
                                                        />
                                                    </div>
                                                </div>

                                                {}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between h-6">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                                                    </div>
                                                    <div className="relative">
                                                        <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            name="phone"
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={handleInputChange}
                                                            placeholder="Enter your phone number"
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between h-6">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</label>
                                                    </div>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            name="location"
                                                            type="text"
                                                            value={formData.location}
                                                            onChange={handleInputChange}
                                                            placeholder="City, Country"
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {}
                                                <div className="md:col-span-2 space-y-2">
                                                    <div className="flex items-center justify-between h-6">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Portfolio / Website</label>
                                                    </div>
                                                    <div className="relative">
                                                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <input
                                                            name="website"
                                                            type="url"
                                                            value={formData.website}
                                                            onChange={handleInputChange}
                                                            placeholder="https://your-portfolio.com"
                                                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                {}
                                                <div className="md:col-span-2 space-y-2">
                                                    <div className="flex items-center justify-between h-6">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About Me</label>
                                                        <span className={cn(
                                                            "text-xs font-medium transition-colors",
                                                            formData.bio.length > 0 && formData.bio.length < 100 ? "text-red-500" : "text-muted-foreground"
                                                        )}>
                                                            {formData.bio.length}/500 {formData.bio.length < 100 && "(Min 100)"}
                                                        </span>
                                                    </div>
                                                    <textarea
                                                        name="bio"
                                                        rows={4}
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                        maxLength={500}
                                                        placeholder="Tell us a bit about yourself, your goals, and what you're learning..."
                                                        className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm resize-none"
                                                    />
                                                </div>

                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>

                                {}
                                <Card className="mt-6 bg-muted/30 border-border/50">
                                    <CardContent className="p-6 md:p-8">
                                        <div className="space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                            <Globe className="w-5 h-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-sm font-bold text-foreground">Social Links</h3>
                                                            <p className="text-xs text-muted-foreground mt-0.5">Manage your online presence. Auto-saved.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={openAddLinkDialog}
                                                    disabled={socialLinks.length >= 3 || isLoading || isAutoSaving}
                                                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                                                >
                                                    {isAutoSaving ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-4 h-4" />
                                                            Add Link {socialLinks.length > 0 && `(${socialLinks.length}/3)`}
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {}
                                            {socialLinks.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {socialLinks.map((link, index) => {
                                                        const platform = SOCIAL_PLATFORMS[link.platform as SocialPlatform];
                                                        const Icon = platform?.icon || LinkIcon;
                                                        return (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-muted/40 transition-all group relative overflow-hidden"
                                                            >
                                                                <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border flex items-center justify-center shrink-0 shadow-sm">
                                                                    <Icon className="w-6 h-6 text-primary opacity-70" />
                                                                </div>
                                                                <div className="flex-1 min-w-0 pr-16">
                                                                    <p className="text-sm font-bold text-foreground">{platform?.name || link.platform}</p>
                                                                    <p className="text-xs text-muted-foreground truncate font-medium">{link.url}</p>
                                                                </div>
                                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openEditLinkDialog(index)}
                                                                        className="p-2 rounded-lg bg-muted/30 border border-border hover:border-primary hover:text-primary transition-all shadow-sm"
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveLink(index)}
                                                                        className="p-2 rounded-lg bg-muted/30 border border-border hover:border-destructive hover:text-destructive transition-all shadow-sm"
                                                                        title="Remove"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="p-12 rounded-2xl bg-muted/30 border border-dashed border-border text-center">
                                                    <div className="w-16 h-16 rounded-full bg-muted/30 border border-border flex items-center justify-center mx-auto mb-4 shadow-inner">
                                                        <LinkIcon className="w-8 h-8 text-muted-foreground opacity-30" />
                                                    </div>
                                                    <h4 className="text-sm font-bold text-foreground">No links yet</h4>
                                                    <p className="text-xs text-muted-foreground mt-1 max-w-[220px] mx-auto">Add your social media profiles to help others connect with you</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {}
                    {activeTab === "security" && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
                        >
                            {}
                            <Card className="bg-muted/30 border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-primary" />
                                        </div>
                                        Connected Accounts
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your login methods
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {isProviderConnected('google') && (
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm border border-border">
                                                    <GoogleIcon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Google</p>
                                                    <p className="text-xs text-muted-foreground">Connected</p>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    )}
                                    {isProviderConnected('github') && (
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-[#24292e] text-white flex items-center justify-center shadow-sm">
                                                    <Github className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">GitHub</p>
                                                    <p className="text-xs text-muted-foreground">Connected</p>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    )}
                                    {hasPasswordAuth && (
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                    <Lock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">Email & Password</p>
                                                    <p className="text-xs text-muted-foreground">Primary method</p>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                    )}
                                    {!isProviderConnected('google') && !isProviderConnected('github') && !hasPasswordAuth && (
                                        <p className="text-sm text-muted-foreground italic">No connected accounts found.</p>
                                    )}
                                </CardContent>
                            </Card>

                            {}
                            <div className="xl:col-span-2">
                                <Card className="bg-muted/30 border-border/50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Key className="w-5 h-5 text-primary" />
                                            </div>
                                            Change Password
                                        </CardTitle>
                                        <CardDescription>
                                            Update your password to keep your account secure
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {!hasPasswordAuth ? (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                                                    <Lock className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-semibold text-foreground mb-2">Password Not Available</h3>
                                                <p className="text-sm text-muted-foreground max-w-sm">
                                                    You signed up using a social provider (Google/GitHub).
                                                    Password login is only available for email-based accounts.
                                                </p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                                {}
                                                {passwordErrors.length > 0 && (
                                                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                                        <div className="flex items-start gap-3">
                                                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                                            <div className="space-y-1">
                                                                {passwordErrors.map((error, index) => (
                                                                    <p key={index} className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {}
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            <input
                                                                name="currentPassword"
                                                                type={showCurrentPassword ? "text" : "password"}
                                                                value={passwordData.currentPassword}
                                                                onChange={handlePasswordChange}
                                                                placeholder="Enter your current password"
                                                                className="w-full pl-11 pr-12 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
                                                        <div className="relative">
                                                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            <input
                                                                name="newPassword"
                                                                type={showNewPassword ? "text" : "password"}
                                                                value={passwordData.newPassword}
                                                                onChange={handlePasswordChange}
                                                                placeholder="Enter new password"
                                                                className="w-full pl-11 pr-12 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                        {}
                                                        {passwordData.newPassword && (
                                                            <div className="space-y-2">
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((level) => (
                                                                        <div
                                                                            key={level}
                                                                            className={cn(
                                                                                "h-1.5 flex-1 rounded-full transition-colors",
                                                                                level <= passwordStrength.score ? passwordStrength.color : "bg-muted"
                                                                            )}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <p className={cn(
                                                                    "text-xs font-medium",
                                                                    passwordStrength.score <= 2 ? "text-red-500" :
                                                                        passwordStrength.score <= 3 ? "text-yellow-500" : "text-emerald-500"
                                                                )}>
                                                                    {passwordStrength.label}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
                                                        <div className="relative">
                                                            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                            <input
                                                                name="confirmPassword"
                                                                type={showConfirmPassword ? "text" : "password"}
                                                                value={passwordData.confirmPassword}
                                                                onChange={handlePasswordChange}
                                                                placeholder="Confirm new password"
                                                                className="w-full pl-11 pr-12 py-3 rounded-xl bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                            >
                                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                        {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                                            <p className="text-xs text-red-500">Passwords do not match</p>
                                                        )}
                                                        {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && (
                                                            <p className="text-xs text-emerald-500 flex items-center gap-1">
                                                                <CheckCircle2 className="w-3 h-3" /> Passwords match
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {}
                                                <div className="p-4 rounded-xl bg-muted/20 border border-border">
                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Password Requirements</p>
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                                                        <li className={cn("flex items-center gap-2", passwordData.newPassword.length >= 8 && "text-emerald-500")}>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            At least 8 characters
                                                        </li>
                                                        <li className={cn("flex items-center gap-2", /[a-z]/.test(passwordData.newPassword) && /[A-Z]/.test(passwordData.newPassword) && "text-emerald-500")}>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Upper & lowercase letters
                                                        </li>
                                                        <li className={cn("flex items-center gap-2", /\d/.test(passwordData.newPassword) && "text-emerald-500")}>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            At least one number
                                                        </li>
                                                        <li className={cn("flex items-center gap-2", /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) && "text-emerald-500")}>
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            Special character
                                                        </li>
                                                    </ul>
                                                </div>

                                                {}
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                                                        className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {isChangingPassword ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Updating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Key className="w-4 h-4" />
                                                                Update Password
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {}
                <AnimatePresence>
                    {showAddLinkDialog && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setShowAddLinkDialog(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                        {editingLinkIndex !== null ? "Edit Social Link" : "Add Social Link"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {editingLinkIndex !== null
                                            ? "Update your profile URL"
                                            : "Choose a platform and enter your profile URL"
                                        }
                                    </p>
                                </div>

                                {}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform</label>
                                    <Select
                                        value={selectedPlatform}
                                        onValueChange={(value) => setSelectedPlatform(value as SocialPlatform)}
                                    >
                                        <SelectTrigger className="w-full h-12 rounded-xl bg-muted/30 border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm">
                                            <SelectValue placeholder="Select Platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(SOCIAL_PLATFORMS).map(([key, platform]) => {
                                                const Icon = platform.icon;
                                                return (
                                                    <SelectItem key={key} value={key}>
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="w-4 h-4" />
                                                            {platform.name}
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="url"
                                            value={linkUrl}
                                            onChange={(e) => handleLinkUrlChange(e.target.value)}
                                            placeholder={SOCIAL_PLATFORMS[selectedPlatform].placeholder}
                                            className={cn(
                                                "w-full pl-11 pr-4 py-3 rounded-xl bg-muted/30 border focus:ring-2 outline-none transition-all text-sm",
                                                linkError ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border focus:border-primary focus:ring-primary/20"
                                            )}
                                        />
                                    </div>
                                    {linkError && (
                                        <p className="text-xs text-red-500 flex items-start gap-1">
                                            <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                            {linkError}
                                        </p>
                                    )}
                                </div>

                                {}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddLinkDialog(false)}
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddLink}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-90 transition-all"
                                    >
                                        {editingLinkIndex !== null ? "Update Link" : "Add Link"}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {}
                <AnimatePresence>
                    {
                        hasChanges && activeTab === "profile" && !isAutoSaving && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-4xl"
                            >
                                <div className="bg-background/80 backdrop-blur-xl border border-border/50 p-4 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4">
                                    <div className="hidden sm:flex items-center gap-3 pl-2">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <Save className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">Unsaved Changes</p>
                                            <p className="text-xs text-muted-foreground">You have modifications that aren't saved yet</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-border font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                const form = document.querySelector('form');
                                                if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                                            }}
                                            disabled={isLoading}
                                            className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 justify-center"
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
                                    </div>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>

                <ConfirmModal
                    isOpen={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={confirmDeleteLink}
                    title="Delete Link?"
                    description="Are you sure you want to remove this social link? This action cannot be undone."
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
