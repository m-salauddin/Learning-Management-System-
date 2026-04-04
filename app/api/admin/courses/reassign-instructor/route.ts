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
                { success: false, error: "Only administrators can reassign instructors" },
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
        const { fromUserId, toUserId } = body as {
            fromUserId: string;
            toUserId: string;
        };
        if (!fromUserId || typeof fromUserId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid fromUserId" },
                { status: 400 }
            );
        }
        if (!toUserId || typeof toUserId !== "string") {
            return NextResponse.json(
                { success: false, error: "Missing or invalid toUserId" },
                { status: 400 }
            );
        }
        if (fromUserId === toUserId) {
            return NextResponse.json(
                { success: false, error: "Source and target instructor cannot be the same" },
                { status: 400 }
            );
        }
        const { data, error } = await supabase.rpc("admin_reassign_instructor", {
            p_from_user: fromUserId,
            p_to_user: toUserId
        });
        if (error) {
            console.error("[admin/courses/reassign-instructor] RPC error:", error);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );
        }
        const result = data as {
            success: boolean;
            error?: string;
            message?: string;
            reassigned_count?: number;
        };
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || "Failed to reassign instructor"
                },
                { status: 400 }
            );
        }
        return NextResponse.json({
            success: true,
            message: result.message || "Instructor reassigned successfully",
            reassigned_count: result.reassigned_count || 0
        });
    } catch (error) {
        console.error("[admin/courses/reassign-instructor] Unexpected error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
