import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }
        const { data: currentUser, error: userError } = await supabase
            .from("users")
            .select("role, is_deleted, is_banned")
            .eq("id", user.id)
            .single();
        if (userError || !currentUser || currentUser.role !== "admin") {
            return NextResponse.json(
                { success: false, error: "Only administrators can delete users" },
                { status: 403 }
            );
        }
        if (currentUser.is_deleted || currentUser.is_banned) {
            return NextResponse.json(
                { success: false, error: "Your account is not active" },
                { status: 403 }
            );
        }
        const body = await request.json();
        const { userId } = body;
        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid userId" },
                { status: 400 }
            );
        }
        const { data, error } = await supabase.rpc("admin_soft_delete_user", {
            p_user_id: userId
        });
        if (error) {
            console.error("[admin/users/delete] RPC error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
            course_count?: number;
        };
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to delete user",
                    course_count: result.course_count
                },
                { status: 400 }
            );
        }
        return NextResponse.json({
            success: true,
            message: result.message || "User has been soft-deleted"
        });
    } catch (error) {
        console.error("[admin/users/delete] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
