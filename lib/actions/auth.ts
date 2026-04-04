'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
export async function login(data: { email: string; password: string }) {
    const supabase = await createClient()
    const { email, password } = data
    const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (error) {
        return { error: error.message }
    }
    revalidatePath('/', 'layout')
    if (authData.session) {
        return { success: true, user: authData.user, session: authData.session }
    }
    return { success: true }
}
export async function signup(data: { email: string; password: string; fullName: string }) {
    const supabase = await createClient()
    const { email, password, fullName } = data
    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: 'student',
            },
        },
    })
    if (error) {
        return { error: error.message }
    }
    if (authData.session) {
        return { success: true, user: authData.user, session: authData.session }
    }
    return { success: true }
}
export async function signOut() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    if (error) {
        return { error: error.message }
    }
    return { success: true }
}
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ||
                 (process.env.NODE_ENV === 'production'
                    ? 'https://www.dokkhotait.com'
                    : 'http://localhost:3000');
export async function signInWithGoogle() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${BASE_URL}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })
    if (error) {
        return { error: error.message }
    }
    if (data.url) {
        redirect(data.url)
    }
}
export async function signInWithGithub() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${BASE_URL}/auth/callback`,
            scopes: 'read:user user:email',
        },
    })
    if (error) {
        return { error: error.message }
    }
    if (data.url) {
        redirect(data.url)
    }
}
export async function forgotPassword(email: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${BASE_URL}/auth/callback?next=/reset-password`,
    })
    if (error) {
        return { error: error.message }
    }
    return { success: true }
}
export async function updatePassword(password: string) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: password
    })
    if (error) {
        return { error: error.message }
    }
    revalidatePath('/', 'layout')
    redirect('/')
}
