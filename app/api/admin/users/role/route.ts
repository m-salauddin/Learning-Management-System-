import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types/user";

/**
 * POST /api/admin/users/role
 * Assigns a new role to a user (admin only)
 * 
 * Request body: { 
 *   userId: string, 
 *   newRole: UserRole,
 *   reassignTo?: string  // Optional: if demoting teacher with courses, reassign to this user
 * }
 * 
 * Response:
 * - 200: { success: true, message: string, old_role: string, new_role: string }
 * - 400: { success: false, error: string, course_count?: number, requires_reassignment?: boolean }
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
                { success: false, error: "Only administrators can assign roles" },
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
        const { userId, newRole, reassignTo } = body as {
            userId: string;
            newRole: UserRole;
            reassignTo?: string;
        };

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid userId" },
                { status: 400 }
            );
        }

        const validRoles: UserRole[] = ["admin", "teacher", "student", "moderator"];
        if (!newRole || !validRoles.includes(newRole)) {
            return NextResponse.json(
                { success: false, error: "Invalid role. Must be: admin, teacher, student, or moderator" },
                { status: 400 }
            );
        }

        // Call the admin RPC function
        const { data, error } = await supabase.rpc("admin_assign_role", {
            p_user_id: userId,
            p_new_role: newRole,
            p_reassign_to: reassignTo || null
        });

        if (error) {
            console.error("[admin/users/role] RPC error:", error);
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
            course_count?: number;
            requires_reassignment?: boolean;
            old_role?: string;
            new_role?: string;
        };

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to assign role",
                    course_count: result.course_count,
                    requires_reassignment: result.requires_reassignment
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message || "Role updated successfully",
            old_role: result.old_role,
            new_role: result.new_role
        });

    } catch (error) {
        console.error("[admin/users/role] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
