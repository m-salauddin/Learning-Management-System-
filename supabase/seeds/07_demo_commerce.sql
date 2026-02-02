-- ============================================================================
-- DEMO SEED PART 7: COUPONS & TRANSACTIONS
-- ============================================================================

-- COUPONS (3 coupons)
INSERT INTO public.coupons (id, code, description, discount_type, discount_value, max_discount_amount, is_active, valid_from, valid_until, usage_limit, used_count)
VALUES
    ('iiiiiiii-0001-0001-0001-000000000001', 'WELCOME20', 'Welcome discount - 20% off', 'percentage', 20, 2000, true, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', 100, 12),
    ('iiiiiiii-0001-0001-0001-000000000002', 'FLAT500', 'Flat 500 Taka off', 'fixed', 500, NULL, true, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', 50, 8),
    ('iiiiiiii-0001-0001-0001-000000000003', 'EXPIRED10', 'Expired coupon for testing', 'percentage', 10, 1000, false, NOW() - INTERVAL '60 days', NOW() - INTERVAL '5 days', 100, 25)
ON CONFLICT (code) DO UPDATE SET 
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    used_count = EXCLUDED.used_count;

-- TRANSACTIONS (18 transactions across 60 days)
DO $$
DECLARE
    v_student1_id UUID;
    v_student2_id UUID;
    v_teacher_id UUID;
    v_admin_id UUID;
BEGIN
    SELECT id INTO v_student1_id FROM public.users WHERE email = 'student1@demo.com';
    SELECT id INTO v_student2_id FROM public.users WHERE email = 'student2@demo.com';
    SELECT id INTO v_teacher_id FROM public.users WHERE email = 'teacher@demo.com';
    SELECT id INTO v_admin_id FROM public.users WHERE email = 'admin@demo.com';

    -- Successful transactions for Student1 (enrolled in main course)
    INSERT INTO public.transactions (id, user_id, course_id, final_price, original_price, discount_amount, coupon_code, payment_provider, payment_method, status, paid_at, created_at)
    VALUES
        ('jjjjjjjj-0001-0001-0001-000000000001', v_student1_id, 'cccccccc-0001-0001-0001-000000000001', 7999, 9999, 2000, 'WELCOME20', 'bkash', 'bkash', 'success', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'),
        ('jjjjjjjj-0001-0001-0001-000000000002', v_student1_id, 'cccccccc-0001-0001-0001-000000000002', 8499, 8999, 500, 'FLAT500', 'nagad', 'nagad', 'success', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
        ('jjjjjjjj-0001-0001-0001-000000000003', v_student1_id, 'cccccccc-0001-0001-0001-000000000006', 4999, 4999, 0, NULL, 'bkash', 'bkash', 'success', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

    -- More successful transactions from other demo users
    INSERT INTO public.transactions (id, user_id, course_id, final_price, original_price, discount_amount, coupon_code, payment_provider, payment_method, status, paid_at, created_at)
    VALUES
        -- Main course purchases
        ('jjjjjjjj-0001-0001-0001-000000000004', v_admin_id, 'cccccccc-0001-0001-0001-000000000001', 9999, 9999, 0, NULL, 'card', 'visa', 'success', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days'),
        ('jjjjjjjj-0001-0001-0001-000000000005', v_teacher_id, 'cccccccc-0001-0001-0001-000000000002', 8999, 8999, 0, NULL, 'bank', 'bank_transfer', 'success', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
        
        -- Recent transactions (last 30 days for analytics)
        ('jjjjjjjj-0001-0001-0001-000000000006', v_admin_id, 'cccccccc-0001-0001-0001-000000000003', 7499, 7499, 0, NULL, 'bkash', 'bkash', 'success', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        ('jjjjjjjj-0001-0001-0001-000000000007', v_admin_id, 'cccccccc-0001-0001-0001-000000000004', 9999, 9999, 0, NULL, 'nagad', 'nagad', 'success', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
        ('jjjjjjjj-0001-0001-0001-000000000008', v_teacher_id, 'cccccccc-0001-0001-0001-000000000006', 4999, 4999, 0, NULL, 'bkash', 'bkash', 'success', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

        -- Pending transactions
        ('jjjjjjjj-0001-0001-0001-000000000009', v_student2_id, 'cccccccc-0001-0001-0001-000000000001', 9999, 9999, 0, NULL, 'bkash', 'bkash', 'pending', NULL, NOW() - INTERVAL '1 day'),
        ('jjjjjjjj-0001-0001-0001-000000000010', v_student2_id, 'cccccccc-0001-0001-0001-000000000003', 7499, 7499, 0, NULL, 'nagad', 'nagad', 'pending', NULL, NOW() - INTERVAL '12 hours'),

        -- Failed transactions
        ('jjjjjjjj-0001-0001-0001-000000000011', v_student2_id, 'cccccccc-0001-0001-0001-000000000002', 8999, 8999, 0, NULL, 'card', 'mastercard', 'failed', NULL, NOW() - INTERVAL '7 days'),
        ('jjjjjjjj-0001-0001-0001-000000000012', v_admin_id, 'cccccccc-0001-0001-0001-000000000001', 9999, 9999, 0, NULL, 'card', 'visa', 'failed', NULL, NOW() - INTERVAL '15 days'),

        -- More success for revenue analytics
        ('jjjjjjjj-0001-0001-0001-000000000013', v_admin_id, 'cccccccc-0001-0001-0001-000000000002', 8999, 8999, 0, NULL, 'bkash', 'bkash', 'success', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
        ('jjjjjjjj-0001-0001-0001-000000000014', v_teacher_id, 'cccccccc-0001-0001-0001-000000000003', 6999, 7499, 500, 'FLAT500', 'nagad', 'nagad', 'success', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
        ('jjjjjjjj-0001-0001-0001-000000000015', v_teacher_id, 'cccccccc-0001-0001-0001-000000000004', 9999, 9999, 0, NULL, 'bkash', 'bkash', 'success', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
        
        -- Refunded transaction
        ('jjjjjjjj-0001-0001-0001-000000000016', v_student2_id, 'cccccccc-0001-0001-0001-000000000004', 9999, 9999, 0, NULL, 'card', 'visa', 'refunded', NOW() - INTERVAL '18 days', NOW() - INTERVAL '20 days'),
        
        -- More recent success
        ('jjjjjjjj-0001-0001-0001-000000000017', v_admin_id, 'cccccccc-0001-0001-0001-000000000006', 4999, 4999, 0, NULL, 'bkash', 'bkash', 'success', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
        ('jjjjjjjj-0001-0001-0001-000000000018', v_teacher_id, 'cccccccc-0001-0001-0001-000000000001', 7999, 9999, 2000, 'WELCOME20', 'nagad', 'nagad', 'success', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours')
    ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, paid_at = EXCLUDED.paid_at;

    -- Set refunded_at for refunded transaction
    UPDATE public.transactions SET refunded_at = NOW() - INTERVAL '15 days' WHERE id = 'jjjjjjjj-0001-0001-0001-000000000016';

END $$;
