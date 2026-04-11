"use server"

import { createBkashPayment, executeBkashPaymentAPI } from "@/lib/bkash";
import { createTransaction, confirmPayment } from "@/lib/actions/payments";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types/lms";

/**
 * Initiates a bKash Tokenized Checkout (URL-based) payment.
 * 1. Creates a pending transaction in our database.
 * 2. Calls bKash Create Payment API to get the bkashURL for user redirect.
 */
export async function initiateBkashPayment(
    courseId: string,
    couponCode?: string
): Promise<ApiResponse<{ bkashURL: string }>> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: "Please log in" };

        // 1. Create a pending transaction in our DB
        const txResult = await createTransaction({
            course_id: courseId,
            coupon_code: couponCode,
            payment_provider: 'bkash_auto',
        });

        if (!txResult.success || !txResult.data) {
            return { success: false, error: txResult.error };
        }

        const { transaction_id, amount } = txResult.data;

        // 2. Call bKash Create Payment API
        const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/bkash/callback`;
        
        const response = await createBkashPayment({
            amount,
            orderID: transaction_id,
            callbackURL
        });

        // 3. Store bKash paymentID in our transaction for later lookup
        await supabase
            .from('transactions')
            .update({ payment_intent_id: response.paymentID })
            .eq('id', transaction_id);

        return {
            success: true,
            data: { bkashURL: response.bkashURL }
        };

    } catch (error: any) {
        console.error("[bKash Action] Init Error:", error.message);
        return { success: false, error: error.message || "Internal Server Error" };
    }
}

/**
 * Handles the bKash callback after user returns with status=success.
 * 1. Calls bKash Execute Payment API to finalize the payment.
 * 2. Updates our transaction and creates enrollment.
 */
export async function handleBkashCallback(paymentID: string): Promise<ApiResponse<{ enrollment_id: string }>> {
    try {
        const supabase = await createClient();

        // 1. Execute the payment with bKash
        const response = await executeBkashPaymentAPI(paymentID);

        if (response.transactionStatus !== 'Completed') {
            return { success: false, error: `bKash payment not completed. Status: ${response.transactionStatus}` };
        }

        // 2. Find our transaction by bKash paymentID
        const { data: transaction } = await supabase
            .from('transactions')
            .select('id')
            .eq('payment_intent_id', paymentID)
            .single();

        if (!transaction) {
            return { success: false, error: "Transaction not found for this payment" };
        }

        // 3. Complete the transaction and enroll the user
        const result = await confirmPayment(
            transaction.id,
            response.trxID, // bKash trxID as confirmed payment reference
            'bkash_auto'
        );

        return result;

    } catch (error: any) {
        console.error("[bKash Action] Execute Error:", error.message);
        return { success: false, error: error.message || "Internal Server Error" };
    }
}

/**
 * Manually verify a bKash transaction status.
 */
export async function verifyBkashTransaction(paymentID: string): Promise<ApiResponse<{ 
    status: string; 
    enrollment_id?: string;
    transaction?: any;
    user?: any;
    bkashData?: any;
}>> {
    try {
        const supabase = await createClient();

        // 1. Check our database first with relations
        const { data: tx, error: txError } = await supabase
            .from('transactions')
            .select(`
                *,
                user:users(*),
                course:courses(title, thumbnail_url)
            `)
            .eq('payment_intent_id', paymentID)
            .single();

        if (tx && tx.status === 'completed') {
            return { 
                success: true, 
                data: { 
                    status: 'completed',
                    transaction: tx,
                    user: tx.user
                } 
            };
        }

        // 2. Query bKash if not completed in our DB or if we need fresh data
        const { queryBkashPayment } = await import("@/lib/bkash");
        const bKashResponse = await queryBkashPayment(paymentID);

        if (bKashResponse.transactionStatus === 'Completed') {
            const result = await handleBkashCallback(paymentID);
            if (result.success) {
                // Fetch fresh data after callback
                const { data: freshTx } = await supabase
                    .from('transactions')
                    .select('*, user:users(*)')
                    .eq('payment_intent_id', paymentID)
                    .single();

                return { 
                    success: true, 
                    data: { 
                        status: 'completed', 
                        enrollment_id: result.data?.enrollment_id,
                        transaction: freshTx,
                        user: freshTx?.user,
                        bkashData: bKashResponse
                    } 
                };
            }
        }

        return { 
            success: true, 
            data: { 
                status: bKashResponse.transactionStatus || 'Initiated',
                bkashData: bKashResponse,
                transaction: tx,
                user: tx?.user
            } 
        };

    } catch (error: any) {
        console.error("[bKash Action] Verify Error:", error.message);
        return { success: false, error: error.message || "Failed to verify transaction" };
    }
}
