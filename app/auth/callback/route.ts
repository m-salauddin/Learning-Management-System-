import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    const next = searchParams.get('next') ?? '/'

    const error = searchParams.get('error')
    const error_description = searchParams.get('error_description')
    const error_code = searchParams.get('error_code')

    if (code) {
        const supabase = await createClient()
        const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        if (!sessionError) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'

            const separator = next.includes('?') ? '&' : '?'
            const redirectUrl = `${next}${separator}social_login=success`

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectUrl}`)
            }
        }
    }


    const errorParams = new URLSearchParams()
    if (error) errorParams.set('error', error)
    if (error_description) errorParams.set('error_description', error_description)
    if (error_code) errorParams.set('error_code', error_code)


    return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
}
