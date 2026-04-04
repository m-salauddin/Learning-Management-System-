import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { course_id } = await request.json();
    if (!course_id) {
        return NextResponse.json({ error: 'Missing course_id' }, { status: 400 });
    }
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('price, is_published')
        .eq('id', course_id)
        .single();
    if (courseError || !course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }
    let canEnroll = false;
    const price = Number(course.price);
    if (price === 0) {
        canEnroll = true;
    } else {
        const { data: isAdmin } = await supabase.rpc('is_admin');
        if (isAdmin) canEnroll = true;
    }
    if (!canEnroll) {
        return NextResponse.json({
            error: 'Cannot manually enroll in paid course. Please complete payment.'
        }, { status: 403 });
    }
    const { error: enrollError } = await supabase
        .from('enrollments')
        .upsert({
            user_id: user.id,
            course_id: course_id,
            source: price === 0 ? 'free' : 'admin_override'
        }, { onConflict: 'user_id, course_id' });
    if (enrollError) {
        return NextResponse.json({ error: enrollError.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
}
