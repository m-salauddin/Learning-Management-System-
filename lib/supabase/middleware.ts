import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/supabase'
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
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
    const {
        data: { user },
    } = await supabase.auth.getUser()
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        if (user) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }
    const adminRoutes = [
        '/admin',
        '/dashboard/users',
        '/dashboard/courses',
        '/dashboard/discounts',
        '/dashboard/coupons',
        '/dashboard/analytics'
    ];
    const isAdminRoute = adminRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    if (isAdminRoute) {
        if (!user) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
        const appRole = user.app_metadata?.role;
        let userRole = appRole;
        if (!userRole) {
            const { data: rawProfile, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single()
            if (error) {
                console.error('[Middleware] Database role fetch error:', error.message);
            }
            const profile = rawProfile as { role: 'admin' | 'student' | 'teacher' | 'moderator' } | null;
            userRole = profile?.role;
        }
        if (userRole !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }
    return supabaseResponse
}
