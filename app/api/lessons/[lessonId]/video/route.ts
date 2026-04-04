import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ lessonId: string }> }
) {
    const { lessonId } = await params;
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: asset, error: dbError } = await supabase
        .from('lesson_assets')
        .select('video_path')
        .eq('lesson_id', lessonId)
        .single();
    if (dbError || !asset || !asset.video_path) {
        return NextResponse.json(
            { error: 'Access denied or video not found' },
            { status: 403 }
        );
    }
    const expirySeconds = 300;
    const { data: signedData, error: signError } = await supabase
        .storage
        .from('course-videos')
        .createSignedUrl(asset.video_path, expirySeconds);
    if (signError) {
        console.error('Sign error:', signError);
        const errorMessage = signError.message?.includes('Bucket not found')
            ? "The 'course-videos' storage bucket was not found. Please run the storage setup script."
            : 'Failed to generate link';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
    const expiresAt = new Date(Date.now() + expirySeconds * 1000).toISOString();
    return NextResponse.json({
        url: signedData.signedUrl,
        expires_at: expiresAt,
    });
}
