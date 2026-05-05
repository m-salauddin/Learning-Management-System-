"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/lms";

export type Notification = {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
};

export async function getNotifications(): Promise<ApiResponse<Notification[]>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data: data as Notification[] };
}

export async function markNotificationAsRead(id: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data: null };
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data: null };
}

export async function deleteNotification(id: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data: null };
}

/**
 * Internal function to create a notification. 
 * Should be called from other server actions.
 */
export async function createNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'info',
    link: string | null = null
): Promise<ApiResponse<string>> {
    const supabase = await createClient();
    
    // We use RPC to ensure it's created correctly via the DB function
    const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId,
        p_title: title,
        p_message: message,
        p_type: type,
        p_link: link
    });

    if (error) {
        console.error('Error creating notification:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data: data as string };
}
