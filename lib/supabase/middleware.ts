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

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Redirect logged-in users away from login/register pages
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
        if (user) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
        return supabaseResponse
    }

    // Protect Admin Routes (both /admin and /dashboard admin routes)
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
        console.log(`[Middleware] Admin route detected: ${request.nextUrl.pathname}`);

        if (!user) {
            console.log('[Middleware] No user, redirecting to login');
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Check role: app_metadata (secure) first, then database
        const appRole = user.app_metadata?.role;
        let userRole = appRole;

        console.log(`[Middleware] User: ${user.email}, app_metadata role: ${appRole}`);

        if (!userRole) {
            // Only query database if app_metadata doesn't have role
            const { data: rawProfile, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('[Middleware] Database role fetch error:', error.message);
            }

            // Explicitly cast to avoid 'never' type
            const profile = rawProfile as { role: 'admin' | 'student' | 'teacher' | 'moderator' } | null;
            userRole = profile?.role;
            console.log(`[Middleware] Database role: ${userRole}`);
        }

        console.log(`[Middleware] Final role: ${userRole}, isAdmin: ${userRole === 'admin'}`);

        if (userRole !== 'admin') {
            console.log('[Middleware] Not admin, redirecting to dashboard');
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        console.log('[Middleware] Admin access granted');
    }

    // Protect Dashboard Routes (Optional but recommended)
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new Response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}
