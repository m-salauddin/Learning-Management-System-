import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // 1. Strict Admin Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin');

    if (rpcError || !isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { action, user_id, role, banned } = body;

    if (!user_id) {
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    }

    try {
        if (action === 'assign_role') {
            if (!['admin', 'teacher', 'moderator', 'student'].includes(role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            const { error } = await supabase.rpc('admin_assign_role', {
                p_user_id: user_id,
                p_role: role
            });
            if (error) throw error;
            return NextResponse.json({ success: true, message: `Role updated to ${role}` });

        } else if (action === 'ban_user') {
            const { error } = await supabase.rpc('admin_set_ban', {
                p_user_id: user_id,
                p_banned: !!banned
            });
            if (error) throw error;
            return NextResponse.json({ success: true, message: `User ban status: ${banned}` });

        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
