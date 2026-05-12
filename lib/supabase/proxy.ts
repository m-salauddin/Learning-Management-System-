import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/supabase'
export async function updateSession(request: NextRequest, existingResponse?: NextResponse) {
    let supabaseResponse = existingResponse || NextResponse.next({
        request,
    })
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )
    const publicRoutes = ['/', '/about', '/contact', '/courses', '/pricing', '/instructors', '/terms', '/privacy'];
    const isPublicRoute = request.nextUrl.pathname === '/' || publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    const adminRoutes = [
        '/admin',
        '/dashboard/users',
        '/dashboard/courses',
        '/dashboard/discounts',
        '/dashboard/coupons',
        '/dashboard/analytics'
    ];
    const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard');
    const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');

    if (isPublicRoute && !isDashboardRoute && !isAdminRoute && !isAuthRoute) {
        return supabaseResponse;
    }

    let user = null;
    try {
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? null;
    } catch (error) {
        console.error('[Proxy] Auth check failed (network issue):', error instanceof Error ? error.message : error);

        if (isDashboardRoute || isAdminRoute) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return supabaseResponse;
    }

    if (isAuthRoute) {
        if (user) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    if (isAdminRoute) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        const appRole = user.app_metadata?.role;
        let userRole = appRole;
        if (!userRole) {
            try {
                const { data: rawProfile, error } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single()
                if (error) {
                    console.error('[Proxy] Database role fetch error:', error.message);
                }
                const profile = rawProfile as { role: 'admin' | 'student' | 'teacher' | 'moderator' } | null;
                userRole = profile?.role;
            } catch (error) {
                console.error('[Proxy] Role fetch failed:', error instanceof Error ? error.message : error);
            }
        }
        if (userRole !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    if (isDashboardRoute && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
