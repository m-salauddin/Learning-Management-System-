'use server'

import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/types/user'

export async function requestRoleChange(role: UserRole) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { error } = await supabase
        .from('role_requests')
        .insert({
            user_id: user.id,
            requested_role: role as "teacher" | "moderator" | "admin",
        })

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}

export async function getUserRole() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // SECURITY: Only check app_metadata (secure) and database, never user_metadata
    const appRole = user.app_metadata?.role
    
    // If no app_metadata, check database
    if (!appRole) {
        const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
        return data?.role || 'student'
    }

    return appRole || 'student'
}
