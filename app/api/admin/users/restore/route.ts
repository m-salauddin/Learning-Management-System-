import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/admin/users/restore
 * Restores a soft-deleted user (admin only)
 * 
 * Request body: { userId: string }
 * 
 * Response:
 * - 200: { success: true, message: string }
 * - 400: { success: false, error: string }
 * - 401: { success: false, error: "Unauthorized" }
 * - 500: { success: false, error: string }
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verify authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify admin role (server-side check before RPC)
        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("role, is_deleted, is_banned")
            .eq("id", user.id)
            .single();

        if (userError || !currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { success: false, error: "Only administrators can restore users" },
                { status: 403 }
            );
        }

        if (currentUser.is_deleted || currentUser.is_banned) {
            return NextResponse.json(
                { success: false, error: "Your account is not active" },
                { status: 403 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { userId } = body;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid userId" },
                { status: 400 }
            );
        }

        // Call the admin RPC function
        const { data, error } = await supabase.rpc("admin_restore_user", {
            p_user_id: userId
        });

        if (error) {
            console.error("[admin/users/restore] RPC error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }

        // RPC returns JSON with success/error
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
        };

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || "Failed to restore user" },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message || "User has been restored"
        });

    } catch (error) {
        console.error("[admin/users/restore] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
