import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const supabase = await createSupabaseServerClient();
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') !== 'false';

    // Public catalog query
    let query = supabase
        .from('courses')
        .select('id, title, slug, price, thumbnail_url, instructor:users(name, avatar_url), description');

    if (publishedOnly) {
        query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
    const supabase = await createSupabaseServerClient();

    // 1. Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Role Check (Teacher/Admin)
    // We rely on RLS policies, but we can also fail fast here.
    const { data: isTeacher } = await supabase.rpc('is_teacher');
    if (!isTeacher) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, slug, description, price } = body;

    const { data, error } = await supabase
        .from('courses')
        .insert({
            title,
            slug,
            description,
            price: price || 0,
            instructor_id: user.id
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
}
