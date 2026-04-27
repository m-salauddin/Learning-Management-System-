"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
    TransactionWithDetails, Coupon,
    CouponValidationResult, CreateTransactionInput,
    ApiResponse, PaginatedResponse
} from "@/types/lms";
export async function validateCoupon(
    code: string,
    courseId: string
): Promise<CouponValidationResult> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { valid: false, error: 'Please log in to use coupons' };
    }
    const { data, error } = await supabase
        .rpc('validate_coupon', {
            p_code: code.toUpperCase(),
            p_course_id: courseId
        });
    if (error) {
        return { valid: false, error: 'Failed to validate coupon' };
    }
    return data as CouponValidationResult;
}
export async function createTransaction(
    input: CreateTransactionInput
): Promise<ApiResponse<{ transaction_id: string; amount: number; original_price: number }>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: existingEnrollment } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', input.course_id)
        .single();
    if (existingEnrollment) {
        return { success: false, error: 'You are already enrolled in this course' };
    }
    const { data: course } = await supabase
        .from('courses')
        .select('price, discount_price, status')
        .eq('id', input.course_id)
        .single();
    if (!course) {
        return { success: false, error: 'Course not found' };
    }
    if (course.status !== 'published') {
        return { success: false, error: 'Course is not available for purchase' };
    }
    let finalAmount = course.discount_price || course.price;
    let discountAmount = 0;
    let couponId: string | null = null;
    if (input.coupon_code) {
        const couponResult = await validateCoupon(input.coupon_code, input.course_id);
        if (couponResult.valid && couponResult.discount_amount) {
            const basePrice = course.discount_price || course.price;
            let actualDiscountAmount = couponResult.discount_amount;
            
            if (couponResult.discount_type === 'percentage') {
                actualDiscountAmount = basePrice * ((couponResult.discount_value || 0) / 100);
            }
            
            finalAmount = Math.max(0, basePrice - actualDiscountAmount);
            discountAmount = actualDiscountAmount;
            couponId = couponResult.coupon_id || null;
        }
    }
    if (finalAmount <= 0) {
        const { data: transaction, error: txError } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                course_id: input.course_id,
                amount: 0,
                original_price: course.price,
                discount_amount: discountAmount,
                coupon_id: couponId,
                coupon_code: input.coupon_code || '',
                payment_provider: 'free',
                status: 'completed',
                paid_at: new Date().toISOString()
            })
            .select('id')
            .single();
        if (txError) {
            return { success: false, error: txError.message };
        }
        await supabase.rpc('create_enrollment_after_payment', {
            p_transaction_id: transaction.id
        });
        revalidatePath('/dashboard/my-courses');
        return {
            success: true,
            data: {
                transaction_id: transaction.id,
                amount: 0,
                original_price: course.price
            }
        };
    }
    const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
            user_id: user.id,
            course_id: input.course_id,
            amount: finalAmount,
            original_price: course.price,
            discount_amount: discountAmount,
            coupon_id: couponId,
            coupon_code: input.coupon_code || '',
            payment_provider: input.payment_provider,
            payment_intent_id: input.payment_intent_id || '',
            payment_method: input.payment_method || '',
            status: 'pending'
        })
        .select('id')
        .single();
    if (error) {
        return { success: false, error: error.message };
    }

    
    if (input.payment_provider === 'manual') {
        await supabase.rpc('create_pending_enrollment', {
            p_transaction_id: transaction.id
        });
    }

    return {
        success: true,
        data: {
            transaction_id: transaction.id,
            amount: finalAmount,
            original_price: course.price
        }
    };
}
export async function confirmPayment(
    transactionId: string,
    paymentIntentId: string,
    paymentMethod: string = ''
): Promise<ApiResponse<{ enrollment_id: string }>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();
    if (txError || !transaction) {
        return { success: false, error: 'Transaction not found' };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    if (transaction.user_id !== user.id && profile?.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }
    if (transaction.status === 'completed') {
        return { success: false, error: 'Transaction already completed' };
    }
    const { error: updateError } = await supabase
        .from('transactions')
        .update({
            status: 'completed',
            payment_intent_id: paymentIntentId,
            payment_method: paymentMethod,
            paid_at: new Date().toISOString()
        })
        .eq('id', transactionId);
    if (updateError) {
        return { success: false, error: updateError.message };
    }
    if (transaction.coupon_id) {
        await supabase
            .from('coupons')
            .update({ usage_count: supabase.rpc('increment', { x: 1 }) })
            .eq('id', transaction.coupon_id);
    }
    const { data: enrollmentResult, error: enrollError } = await supabase
        .rpc('create_enrollment_after_payment', {
            p_transaction_id: transactionId
        });
    if (enrollError) {
        return { success: false, error: enrollError.message };
    }
    revalidatePath('/dashboard/my-courses');
    return {
        success: true,
        data: { enrollment_id: enrollmentResult.enrollment_id }
    };
}
export async function getMyTransactions(params: {
    page?: number;
    pageSize?: number;
} = {}): Promise<PaginatedResponse<TransactionWithDetails>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10 } = params;
    const offset = (page - 1) * pageSize;
    const { data, error, count } = await supabase
        .from('transactions')
        .select(`
            *,
            course:courses(id, title, slug, thumbnail_url),
            coupon:coupons(id, code, discount_type, discount_value)
        `, { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    return {
        data: data as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}
export async function getAllTransactions(params: {
    page?: number;
    pageSize?: number;
    status?: string;
    courseId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
} = {}): Promise<PaginatedResponse<TransactionWithDetails>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10, status, courseId, userId, startDate, endDate } = params;
    const offset = (page - 1) * pageSize;
    let query = supabase
        .from('transactions')
        .select(`
            *,
            user:users(id, name, email, avatar_url),
            course:courses(id, title, slug, thumbnail_url),
            coupon:coupons(id, code, discount_type, discount_value)
        `, { count: 'exact' });
    if (status) {
        query = query.eq('status', status);
    }
    if (courseId) {
        query = query.eq('course_id', courseId);
    }
    if (userId) {
        query = query.eq('user_id', userId);
    }
    if (startDate) {
        query = query.gte('created_at', startDate);
    }
    if (endDate) {
        query = query.lte('created_at', endDate);
    }
    query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    const { data, error, count } = await query;
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    return {
        data: data as any,
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}
export async function createCoupon(input: Omit<Coupon, 'id' | 'usage_count' | 'created_by' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Coupon>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') {
        return { success: false, error: 'Admin access required' };
    }
    const { data, error } = await supabase
        .from('coupons')
        .insert({
            ...input,
            code: input.code.toUpperCase(),
            created_by: user.id
        })
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
}
export async function updateCoupon(
    couponId: string,
    updates: Partial<Pick<Coupon, 'is_active' | 'valid_until' | 'usage_limit' | 'description'>>
): Promise<ApiResponse<Coupon>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') {
        return { success: false, error: 'Admin access required' };
    }
    const { data, error } = await supabase
        .from('coupons')
        .update(updates)
        .eq('id', couponId)
        .select()
        .single();
    if (error) {
        return { success: false, error: error.message };
    }
    return { success: true, data };
}
export async function getCoupons(params: {
    page?: number;
    pageSize?: number;
    isActive?: boolean;
} = {}): Promise<PaginatedResponse<Coupon>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile?.role !== 'admin') {
        return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const { page = 1, pageSize = 10, isActive } = params;
    const offset = (page - 1) * pageSize;
    let query = supabase
        .from('coupons')
        .select('*', { count: 'exact' });
    if (isActive !== undefined) {
        query = query.eq('is_active', isActive);
    }
    query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);
    const { data, error, count } = await query;
    if (error) {
        return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
    return {
        data: data as Coupon[],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
    };
}
export async function getTransactionById(id: string): Promise<ApiResponse<TransactionWithDetails>> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { success: false, error: 'Unauthorized' };
    }

    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            user:users(id, name, email, avatar_url),
            course:courses(id, title, slug, thumbnail_url, total_lessons, total_students),
            coupon:coupons(id, code, discount_type, discount_value)
        `)
        .eq('id', id)
        .single();

    if (error || !data) {
        return { success: false, error: 'Transaction not found' };
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (data.user_id !== user.id && profile?.role !== 'admin') {
        return { success: false, error: 'Unauthorized' };
    }

    return { success: true, data: data as any };
}
