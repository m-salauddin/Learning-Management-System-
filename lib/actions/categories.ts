"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/types/lms";

export interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
    color: string | null;
    description: string | null;
    parent_id: string | null;
    course_count: number;
    created_at: string;
    updated_at: string;
}

async function checkAdminAccess() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { isAdmin: false, userId: null };

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return { isAdmin: profile?.role === 'admin', userId: user.id };
}

export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Category };
}

export async function getCategoriesAdmin(): Promise<ApiResponse<Category[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Category[] };
}

export async function createCategory(input: Partial<Category>): Promise<ApiResponse<Category>> {
    const { isAdmin, userId } = await checkAdminAccess();
    if (!isAdmin) return { success: false, error: "Admin access required" };

    const supabase = await createClient();

    // Generate slug if not provided
    if (!input.slug && input.name) {
        input.slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const { data, error } = await supabase
        .from('categories')
        .insert([input])
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/dashboard/categories');
    return { success: true, data: data as Category };
}

export async function updateCategory(id: string, input: Partial<Category>): Promise<ApiResponse<Category>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) return { success: false, error: "Admin access required" };

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('categories')
        .update(input)
        .eq('id', id)
        .select()
        .single();

    if (error) return { success: false, error: error.message };

    revalidatePath('/dashboard/categories');
    return { success: true, data: data as Category };
}

export async function deleteCategory(id: string): Promise<ApiResponse<void>> {
    const { isAdmin } = await checkAdminAccess();
    if (!isAdmin) return { success: false, error: "Admin access required" };

    const supabase = await createClient();
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) return { success: false, error: error.message };

    revalidatePath('/dashboard/categories');
    return { success: true };
}
