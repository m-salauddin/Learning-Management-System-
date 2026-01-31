"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useState, useRef, useEffect } from "react";
import { Save, Lock, User, Key, Shield, Camera, Upload, Loader2, Globe, MapPin, Phone as PhoneIcon } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { updateProfile, getUserById } from "@/lib/actions/users";
import { ExtendedUser } from "@/types/user";
import { setUser } from "@/lib/store/features/auth/authSlice";
import { motion, AnimatePresence } from "motion/react";

export default function ProfilePage() {
    const { user: authUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [userProfile, setUserProfile] = useState<ExtendedUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
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
        formData.name !== (userProfile.name || "") ||
        formData.bio !== (userProfile.bio || "") ||
        formData.phone !== (userProfile.phone || "") ||
        formData.location !== (userProfile.location || "") ||
        formData.website !== (userProfile.website || "")
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

        // Validation
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

            // Update profile with new avatar URL
            const result = await updateProfile({ avatar_url: publicUrl });

            if (result.user) {
                // If update successful, remove old image from storage if it was a Supabase URL
                if (oldAvatarUrl && oldAvatarUrl.includes('/storage/v1/object/public/avatars/')) {
                    // Extract filename more safely
                    const filename = oldAvatarUrl.split('/avatars/').pop();
                    if (filename) {
                        const { error: deleteError } = await supabase.storage
                            .from('avatars')
                            .remove([filename]);

                        if (deleteError) {
                            console.error("Failed to delete old avatar from storage:", deleteError);
                        } else {
                            console.log("Old avatar deleted successfully:", filename);
                        }
                    }
                }

                setUserProfile(result.user);
                // Update Redux state
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
            // Update Redux state
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

    if (!userProfile) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information and account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar & Info */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl">
                                {userProfile.avatar_url ? (
                                    <img
                                        src={userProfile.avatar_url}
                                        alt={userProfile.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold">
                                        {(userProfile.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all cursor-pointer group-hover:scale-110"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <h2 className="mt-4 text-xl font-bold">{userProfile.name}</h2>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>

                        <div className="mt-6 w-full pt-6 border-t border-border/50 flex justify-between text-sm">
                            <div className="text-center">
                                <p className="font-bold text-lg">{userProfile.courses_enrolled?.length || 0}</p>
                                <p className="text-muted-foreground text-xs">Courses</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg">{userProfile.completed_courses || 0}</p>
                                <p className="text-muted-foreground text-xs">Completed</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg">{userProfile.certificates_earned || 0}</p>
                                <p className="text-muted-foreground text-xs">Certificates</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                    <Key className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Password</p>
                                    <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-primary hover:underline">Change</button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Profile Information
                            </h3>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Full Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue={userProfile.email || ""}
                                        disabled
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 text-muted-foreground outline-none text-sm cursor-not-allowed opacity-70"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Phone Number</label>
                                    <div className="relative">
                                        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="New York, USA"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium text-foreground/80">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="website"
                                            type="url"
                                            value={formData.website}
                                            onChange={handleInputChange}
                                            placeholder="https://yourwebsite.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium text-foreground/80">Bio</label>
                                <textarea
                                    name="bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us a bit about yourself..."
                                    className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all text-sm resize-none"
                                />
                            </div>

                            <AnimatePresence>
                                {hasChanges && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="pt-4 flex justify-end gap-3"
                                    >
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-6 py-2.5 border border-border/50 text-foreground font-medium rounded-xl hover:bg-muted/50 transition-all text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
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
            </div>
        </div>
    );
}
