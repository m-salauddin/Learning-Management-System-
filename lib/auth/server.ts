import "server-only";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export type AppRole = "admin" | "student" | "teacher" | "moderator";
export const getUserAndRole = cache(async () => {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) {
        console.error('[getUserAndRole] Auth error:', authError.message);
    }
    if (!user) {
        return { user: null, role: null as AppRole | null, profile: null };
    }
    const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("role, name, avatar_url")
        .eq("id", user.id)
        .single();
    if (profileError) {
        console.error('[getUserAndRole] Profile fetch error:', profileError.message);
    }
    const appRole = user.app_metadata?.role as AppRole | undefined;
    const dbRole = profile?.role as AppRole | undefined;
    const role = appRole || dbRole || "student";
    return {
        user,
        role,
        profile: profile ? {
            fullName: profile.name,
            avatarUrl: profile.avatar_url,
        } : null
    };
});
export async function requireAuth() {
    const { user, role, profile } = await getUserAndRole();
    if (!user) redirect("/login");
    return { user, role, profile };
}
export async function requireRole(allowed: AppRole[]) {
    const { user, role, profile } = await getUserAndRole();
    if (!user) redirect("/login");
    if (!role || !allowed.includes(role)) {
        notFound();
    }
    return { user, role, profile };
}
export async function requireAdmin() {
    const { user, role, profile } = await getUserAndRole();
    if (!user) {
        redirect("/login");
    }
    if (role !== "admin") {
        redirect("/dashboard");
    }
    return { user, role, profile };
}
