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

    // Check metadata first (fastest)
    const metaRole = user.user_metadata?.role

    // Optionally check public profile if you need to be sure
    // const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    return metaRole || 'student'
}
