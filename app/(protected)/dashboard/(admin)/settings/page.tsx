"use client";
import * as React from "react";
import {
    Settings,
    Save,
    RefreshCw,
    Layout,
    BarChart3,
    Type,
    Plus,
    Trash2,
    MoveUp,
    MoveDown,
    Rocket,
    CheckCircle2,
    AlertCircle,
    Users,
    Search,
    UserPlus,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardCard } from "@/components/dashboard/ui/DashboardCard";
import { getSiteSettings, updateSiteSettings, SiteSetting, getActualSiteStats } from "@/lib/actions/site-settings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ActualStats = {
    learners: number;
    courses: number;
    mentors: number;
    avgRating: number;
};

export default function SiteSettingsPage() {
    const [heroStats, setHeroStats] = React.useState<SiteSetting[]>([]);
    const [totalLearners, setTotalLearners] = React.useState("50,000+");
    const [heroAvatars, setHeroAvatars] = React.useState<string[]>([]);
    const [actualStats, setActualStats] = React.useState<ActualStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [syncing, setSyncing] = React.useState(false);
    
    // User Picker State
    const [isUserPickerOpen, setIsUserPickerOpen] = React.useState(false);
    const [userSearchQuery, setUserSearchQuery] = React.useState("");
    const [userSearchResults, setUserSearchResults] = React.useState<any[]>([]);
    const [isSearchingUsers, setIsSearchingUsers] = React.useState(false);

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [stats, total, actual, avatars] = await Promise.all([
                    getSiteSettings('hero_stats'),
                    getSiteSettings('hero_total_learners'),
                    getActualSiteStats(),
                    getSiteSettings('hero_avatars')
                ]);
                if (stats) setHeroStats(stats);
                if (total) setTotalLearners(total);
                if (actual) setActualStats(actual);
                if (avatars) setHeroAvatars(avatars);
            } catch (error) {
                console.error("Failed to fetch settings:", error);
                toast.error("Failed to load settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const [statsResult, totalResult, avatarsResult] = await Promise.all([
                updateSiteSettings('hero_stats', heroStats),
                updateSiteSettings('hero_total_learners', totalLearners),
                updateSiteSettings('hero_avatars', heroAvatars)
            ]);

            if (statsResult.success && totalResult.success && avatarsResult.success) {
                toast.success("Settings updated successfully!");
            } else {
                toast.error(statsResult.error || totalResult.error || avatarsResult.error || "Failed to update settings");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setSaving(false);
        }
    };

    const updateStat = (index: number, field: keyof SiteSetting, value: string | number) => {
        const newStats = [...heroStats];
        newStats[index] = { ...newStats[index], [field]: value };
        setHeroStats(newStats);
    };

    const addStat = () => {
        if (heroStats.length >= 4) {
            toast.error("Maximum 4 stats allowed for the hero section");
            return;
        }
        setHeroStats([...heroStats, { label: "New Stat", value: 0, suffix: "+" }]);
    };

    const removeStat = (index: number) => {
        setHeroStats(heroStats.filter((_, i) => i !== index));
    };

    const handleSync = async () => {
        setSyncing(true);
        try {
            const actual = await getActualSiteStats();
            if (actual) {
                setActualStats(actual);
                
                // Map actual stats to heroStats structure
                const updatedHeroStats = heroStats.map(stat => {
                    const label = stat.label.toLowerCase();
                    if (label.includes('learner')) return { ...stat, value: actual.learners };
                    if (label.includes('course')) return { ...stat, value: actual.courses };
                    if (label.includes('mentor')) return { ...stat, value: actual.mentors };
                    if (label.includes('rating')) return { ...stat, value: actual.avgRating };
                    return stat;
                });
                
                setHeroStats(updatedHeroStats);
                setTotalLearners(`${actual.learners.toLocaleString()}+`);
                toast.success("Stats synced with database!");
            }
        } catch (error) {
            toast.error("Failed to sync stats");
        } finally {
            setSyncing(false);
        }
    };

    const handleUserSearch = async (query: string) => {
        setUserSearchQuery(query);
        
        setIsSearchingUsers(true);
        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            
            let queryBuilder = supabase
                .from('users')
                .select('id, name, avatar_url, email')
                .not('avatar_url', 'is', null)
                .neq('avatar_url', '');

            if (query.length >= 2) {
                queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
            } else {
                queryBuilder = queryBuilder.order('created_at', { ascending: false });
            }

            const { data } = await queryBuilder.limit(20);
            if (data) setUserSearchResults(data);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setIsSearchingUsers(false);
        }
    };

    // Fetch initial users when picker opens
    React.useEffect(() => {
        if (isUserPickerOpen && userSearchQuery === "") {
            handleUserSearch("");
        }
    }, [isUserPickerOpen]);

    const addAvatarFromUser = (avatarUrl: string) => {
        if (heroAvatars.length >= 5) {
            toast.error("Maximum 5 avatars allowed");
            return;
        }
        if (heroAvatars.includes(avatarUrl)) {
            toast.error("This avatar is already in the list");
            return;
        }
        setHeroAvatars([...heroAvatars, avatarUrl]);
        setIsUserPickerOpen(false);
        setUserSearchQuery("");
        setUserSearchResults([]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <PageHeader
                title="Site Configuration"
                description="Manage global site statistics and sections. Changes are reflected in real-time."
                icon={Settings}
                actions={
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg",
                            saving
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-primary/20"
                        )}
                    >
                        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                }
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <DashboardCard
                        title="Hero Section Statistics"
                        icon={BarChart3}
                        description="These stats appear in the homepage hero section."
                        action={
                            <button
                                onClick={handleSync}
                                disabled={syncing}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-primary/10 hover:text-primary rounded-lg transition-all"
                            >
                                <RefreshCw className={cn("w-3 h-3", syncing && "animate-spin")} />
                                {syncing ? "Syncing..." : "Sync with Database"}
                            </button>
                        }
                    >
                        {actualStats && (
                            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="space-y-1 sm:border-r border-primary/10 sm:pr-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Actual Learners</p>
                                    <p className="text-xl font-mono font-bold text-primary">{actualStats.learners}</p>
                                </div>
                                <div className="space-y-1 sm:border-r lg:border-r border-primary/10 sm:pr-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Actual Courses</p>
                                    <p className="text-xl font-mono font-bold text-primary">{actualStats.courses}</p>
                                </div>
                                <div className="space-y-1 sm:border-r border-primary/10 sm:pr-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Actual Mentors</p>
                                    <p className="text-xl font-mono font-bold text-primary">{actualStats.mentors}</p>
                                </div>
                                <div className="space-y-1 sm:pr-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Actual Rating</p>
                                    <p className="text-xl font-mono font-bold text-primary">{actualStats.avgRating}</p>
                                </div>
                            </div>
                        )}
                        <div className="space-y-4 pt-4">
                            <AnimatePresence mode="popLayout">
                                {heroStats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row gap-6 items-start sm:items-center"
                                    >
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Label</label>
                                                <div className="relative group">
                                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="text"
                                                        value={stat.label}
                                                        onChange={(e) => updateStat(index, 'label', e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all"
                                                        placeholder="e.g. Learners"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Value</label>
                                                <input
                                                    type="number"
                                                    value={stat.value}
                                                    onChange={(e) => updateStat(index, 'value', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all font-mono"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Suffix</label>
                                                <input
                                                    type="text"
                                                    value={stat.suffix}
                                                    onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all"
                                                    placeholder="e.g. +"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeStat(index)}
                                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all self-end sm:self-center"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {heroStats.length < 4 && (
                                <button
                                    onClick={addStat}
                                    className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
                                >
                                    <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
                                    <span className="font-bold text-sm uppercase tracking-widest">Add New Stat</span>
                                </button>
                            )}
                        </div>
                    </DashboardCard>

                    <DashboardCard
                        title="Hero Overall Social Proof"
                        icon={Rocket}
                        description="This setting controls the aggregate learner count next to the avatar stack."
                    >
                        <div className="space-y-6 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Learners Text</label>
                                <div className="relative group">
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        value={totalLearners}
                                        onChange={(e) => setTotalLearners(e.target.value)}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all"
                                        placeholder="e.g. 50,000+"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Learner Avatars (Max 5)</label>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            onClick={async () => {
                                                const { createClient } = await import("@/lib/supabase/client");
                                                const supabase = createClient();
                                                const { data } = await supabase
                                                    .from('users')
                                                    .select('avatar_url')
                                                    .not('avatar_url', 'is', null)
                                                    .neq('avatar_url', '')
                                                    .order('created_at', { ascending: false })
                                                    .limit(5);
                                                if (data) {
                                                    setHeroAvatars(data.map(u => u.avatar_url));
                                                    toast.success("Avatars synced with latest users");
                                                }
                                            }}
                                            className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1 transition-colors"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Sync with Latest Users
                                        </button>
                                        <button
                                            onClick={() => setIsUserPickerOpen(true)}
                                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                        >
                                            <UserPlus className="w-3 h-3" /> Pick from Users
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (heroAvatars.length >= 5) {
                                                    toast.error("Maximum 5 avatars allowed");
                                                    return;
                                                }
                                                setHeroAvatars([...heroAvatars, ""]);
                                            }}
                                            className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add URL
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isUserPickerOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden bg-slate-100 dark:bg-white/5 rounded-2xl border border-primary/10"
                                        >
                                            <div className="p-4 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Search Users</p>
                                                    <button onClick={() => setIsUserPickerOpen(false)} className="p-1 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={userSearchQuery}
                                                        onChange={(e) => handleUserSearch(e.target.value)}
                                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-hidden focus:ring-2 focus:ring-primary/20"
                                                        placeholder="Search by name or email..."
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {isSearchingUsers ? (
                                                        <div className="flex items-center justify-center py-8">
                                                            <RefreshCw className="w-6 h-6 animate-spin text-primary opacity-50" />
                                                        </div>
                                                    ) : userSearchResults.length > 0 ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {userSearchResults.map((user) => (
                                                                <button
                                                                    key={user.id}
                                                                    onClick={() => addAvatarFromUser(user.avatar_url)}
                                                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-slate-900 transition-all border border-transparent hover:border-primary/20 group text-left"
                                                                >
                                                                    <div className="relative">
                                                                        <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/30 transition-all" />
                                                                        <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                                            <Plus className="w-4 h-4 text-white" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{user.name}</p>
                                                                        <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-center py-8 text-xs text-slate-500 italic">No users with avatars found</p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="space-y-3">
                                    {heroAvatars.map((url, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 shadow-sm">
                                            <div className="flex items-center gap-3 w-full">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 overflow-hidden shrink-0">
                                                    {url ? (
                                                        <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                                <input
                                                    type="text"
                                                    value={url}
                                                    onChange={(e) => {
                                                        const newAvatars = [...heroAvatars];
                                                        newAvatars[index] = e.target.value;
                                                        setHeroAvatars(newAvatars);
                                                    }}
                                                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden transition-all"
                                                    placeholder="Avatar Image URL"
                                                />
                                                <button
                                                    onClick={() => setHeroAvatars(heroAvatars.filter((_, i) => i !== index))}
                                                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {heroAvatars.length === 0 && (
                                        <p className="text-xs text-slate-400 italic text-center py-4">No custom avatars set. Falling back to latest students.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DashboardCard>

                    <div className="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 flex gap-4 items-start shadow-sm">
                        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-amber-800 dark:text-amber-400">Pro Tip: Design Impact</h4>
                            <p className="text-sm text-amber-700/80 dark:text-amber-400/60 leading-relaxed mt-1">
                                High numbers increase social proof. Try to use rounded numbers like "200+" instead of "194" for a cleaner professional look in the hero section.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <DashboardCard title="Live Preview" icon={Layout}>
                        <div className="pt-4">
                            <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 shadow-inner">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b pb-2 flex items-center gap-2">
                                    <Rocket className="w-3 h-3" /> Mobile Grid Mockup
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {heroStats.map((stat, i) => (
                                        <div key={i} className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                                                <BarChart3 className="w-4 h-4 text-primary" />
                                            </div>
                                            <p className="text-sm font-black">{stat.value}{stat.suffix}</p>
                                            <p className="text-[8px] uppercase tracking-tighter text-slate-500">{stat.label}</p>
                                        </div>
                                    ))}
                                    {Array.from({ length: 4 - heroStats.length }).map((_, i) => (
                                        <div key={i} className="border border-dashed border-slate-200 dark:border-white/5 rounded-xl h-20 flex items-center justify-center opacity-30">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-white/5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Preview reflects actual homepage layout</span>
                            </div>
                        </div>
                    </DashboardCard>

                    <div className="p-8 rounded-3xl bg-linear-to-br from-primary via-secondary to-accent p-[2px] shadow-xl shadow-primary/20">
                        <div className="bg-white dark:bg-slate-950 rounded-[22px] p-6 text-center h-full flex flex-col justify-center">
                            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
                            <h3 className="font-black text-lg mb-2">Social Proof Control</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Use these settings to emphasize your platform's growth and success to new visitors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
