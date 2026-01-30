import "server-only";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "admin" | "student" | "teacher" | "moderator";

/**
 * Get the current user and their role from the database.
 * This function is cached to avoid multiple database calls per request.
 */
export const getUserAndRole = cache(async () => {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
        console.error('[getUserAndRole] Auth error:', authError.message);
    }
    
    if (!user) {
        console.log('[getUserAndRole] No authenticated user');
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

    // SECURITY: Only trust app_metadata (server-controlled) and database role.
    // NEVER trust user_metadata for authorization as users can modify it!
    const appRole = user.app_metadata?.role as AppRole | undefined;
    const dbRole = profile?.role as AppRole | undefined;

    // Priority: app_metadata (secure) > database > default
    const role = appRole || dbRole || "student";
    
    console.log(`[getUserAndRole] User: ${user.email}, appRole: ${appRole}, dbRole: ${dbRole}, finalRole: ${role}`);
    
    return {
        user,
        role,
        profile: profile ? {
            fullName: profile.name,
            avatarUrl: profile.avatar_url,
        } : null
    };
});

/**
 * Require authentication. Redirects to /login if not authenticated.
 */
export async function requireAuth() {
    const { user, role, profile } = await getUserAndRole();
    if (!user) redirect("/login");
    return { user, role, profile };
}

/**
 * Require specific role(s). Redirects to /login if not authenticated,
 * or shows 404 if user doesn't have the required role.
 */
export async function requireRole(allowed: AppRole[]) {
    const { user, role, profile } = await getUserAndRole();
    if (!user) redirect("/login");
    if (!role || !allowed.includes(role)) {
        notFound();
    }
    return { user, role, profile };
}

/**
 * Require admin role specifically. Redirects to /dashboard if not admin.
 */
export async function requireAdmin() {
    const { user, role, profile } = await getUserAndRole();
    
    if (!user) {
        console.warn('[requireAdmin] No user found, redirecting to login');
        redirect("/login");
    }
    
    if (role !== "admin") {
        console.warn(`[requireAdmin] User ${user.email} (role: ${role}) attempted to access admin route, redirecting to dashboard`);
        redirect("/dashboard");
    }
    
    return { user, role, profile };
}
