"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type SiteSetting = {
    label: string;
    value: number;
    suffix: string;
};

const DEFAULT_HERO_STATS: SiteSetting[] = [
    { label: "Learners", value: 200, suffix: "+" },
    { label: "Courses", value: 50, suffix: "+" },
    { label: "Mentors", value: 15, suffix: "+" },
    { label: "Average Rating", value: 4.9, suffix: "" }
];

export async function getSiteSettings<T = any>(key: string): Promise<T | null> {
    const supabase = await createClient();
    
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error || !data) {
            console.warn(`[getSiteSettings] Could not fetch ${key}, using actual data as fallback.`, error?.message);
            
            const actual = await getActualSiteStats();
            if (!actual) return null;

            if (key === 'hero_stats') {
                const stats: SiteSetting[] = [
                    { label: "Learners", value: actual.learners, suffix: "+" },
                    { label: "Courses", value: actual.courses, suffix: "+" },
                    { label: "Mentors", value: actual.mentors, suffix: "+" },
                    { label: "Average Rating", value: actual.avgRating, suffix: "" }
                ];
                return stats as unknown as T;
            }
            if (key === 'hero_total_learners') return `${actual.learners.toLocaleString()}+` as unknown as T;
            
            if (key === 'hero_avatars') {
                const { data: avatarsData } = await supabase
                    .from('users')
                    .select('avatar_url')
                    .not('avatar_url', 'is', null)
                    .neq('avatar_url', '')
                    .order('created_at', { ascending: false })
                    .limit(5);
                return (avatarsData || []).map(u => u.avatar_url) as unknown as T;
            }
            
            return null;
        }

        return data.value as T;
    } catch (err) {
        console.error(`[getSiteSettings] Critical error fetching ${key}:`, err);
        return null;
    }
}

export async function updateSiteSettings(key: string, value: any) {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        return { success: false, error: "Only admins can update settings" };
    }

    try {
        const { error } = await supabase
            .from('site_settings')
            .upsert({ 
                key, 
                value, 
                updated_at: new Date().toISOString(),
                updated_by: user.id
            }, { onConflict: 'key' });

        if (error) {
            console.error(`[updateSiteSettings] Error updating ${key}:`, error.message);
            return { success: false, error: error.message };
        }

        revalidatePath('/');
        return { success: true };
    } catch (err) {
        console.error(`[updateSiteSettings] Critical error updating ${key}:`, err);
        return { success: false, error: "Internal Server Error" };
    }
}
export async function getActualSiteStats() {
    const supabase = await createClient();

    try {
        const [
            { count: learnerCount },
            { count: courseCount },
            { count: mentorCount },
            { data: ratingData }
        ] = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
            supabase.from('courses').select('*', { count: 'exact', head: true }).eq('status', 'published'),
            supabase.from('instructor_profiles').select('*', { count: 'exact', head: true }),
            supabase.from('courses').select('rating').eq('status', 'published')
        ]);

        const totalRating = ratingData?.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0) || 0;
        const avgRating = ratingData && ratingData.length > 0 ? totalRating / ratingData.length : 0;

        return {
            learners: learnerCount || 0,
            courses: courseCount || 0,
            mentors: mentorCount || 0,
            avgRating: parseFloat(avgRating.toFixed(1))
        };
    } catch (err) {
        console.error("[getActualSiteStats] Error:", err);
        return null;
    }
}
