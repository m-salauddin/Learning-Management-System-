-- ============================================================================
-- DEMO SEED PART 10: LEADS & FINAL CLEANUP
-- ============================================================================

-- Sample leads (5 contact form submissions)
INSERT INTO public.course_leads (id, course_id, name, email, phone, message, source, is_read, is_processed, created_at)
VALUES
    ('nnnnnnnn-0001-0001-0001-000000000001', 'cccccccc-0001-0001-0001-000000000001', 'Karim Hossain', 'karim@example.com', '+8801712345678', 'I am interested in the course but have some questions about the payment plan. Do you offer monthly installments?', 'course_page', true, true, NOW() - INTERVAL '20 days'),
    ('nnnnnnnn-0001-0001-0001-000000000002', 'cccccccc-0001-0001-0001-000000000001', 'Nadia Ahmed', 'nadia@example.com', '+8801898765432', 'Can I get a corporate discount for my team of 5 people?', 'course_page', true, false, NOW() - INTERVAL '15 days'),
    ('nnnnnnnn-0001-0001-0001-000000000003', 'cccccccc-0001-0001-0001-000000000001', 'Rafiq Islam', 'rafiq@example.com', NULL, 'Is this course suitable for someone with 6 months of Python experience?', 'course_page', false, false, NOW() - INTERVAL '7 days'),
    ('nnnnnnnn-0001-0001-0001-000000000004', 'cccccccc-0001-0001-0001-000000000002', 'Sumi Rahman', 'sumi@example.com', '+8801555123456', 'Do you provide job placement support after completing the React course?', 'course_page', false, false, NOW() - INTERVAL '3 days'),
    ('nnnnnnnn-0001-0001-0001-000000000005', 'cccccccc-0001-0001-0001-000000000001', 'Tanvir Hassan', 'tanvir@example.com', '+8801677889900', 'I want to enroll but the payment failed. Can you help?', 'course_page', false, false, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO UPDATE SET is_read = EXCLUDED.is_read;

-- ============================================================================
-- UPDATE COURSE STATS
-- ============================================================================

-- Update total_students based on enrollments
UPDATE public.courses c
SET total_students = (
    SELECT COUNT(*) FROM public.enrollments e WHERE e.course_id = c.id
);

-- Update instructor stats
UPDATE public.instructor_profiles ip
SET 
    total_courses = (SELECT COUNT(*) FROM public.courses c WHERE c.instructor_id = ip.id),
    total_students = (
        SELECT COALESCE(SUM(c.total_students), 0) 
        FROM public.courses c 
        WHERE c.instructor_id = ip.id
    );

-- Update user completed_courses count
UPDATE public.users u
SET completed_courses = (
    SELECT COUNT(*) FROM public.enrollments e 
    WHERE e.user_id = u.id AND e.completed_at IS NOT NULL
)
WHERE email LIKE '%@demo.com';

-- Update user certificates_earned count
UPDATE public.users u
SET certificates_earned = (
    SELECT COUNT(*) FROM public.certificates c WHERE c.user_id = u.id
)
WHERE email LIKE '%@demo.com';

-- ============================================================================
-- FINAL STATUS OUTPUT
-- ============================================================================

-- Check seed status (uncomment to verify)
/*
SELECT 'Users' as table_name, COUNT(*) as count FROM public.users WHERE email LIKE '%@demo.com'
UNION ALL
SELECT 'Categories', COUNT(*) FROM public.categories
UNION ALL
SELECT 'Courses', COUNT(*) FROM public.courses
UNION ALL
SELECT 'Modules', COUNT(*) FROM public.modules
UNION ALL
SELECT 'Lessons', COUNT(*) FROM public.lessons
UNION ALL
SELECT 'Lesson Assets', COUNT(*) FROM public.lesson_assets
UNION ALL
SELECT 'Projects', COUNT(*) FROM public.course_projects
UNION ALL
SELECT 'Resources', COUNT(*) FROM public.course_resources
UNION ALL
SELECT 'FAQs', COUNT(*) FROM public.course_faq
UNION ALL
SELECT 'Reviews', COUNT(*) FROM public.course_reviews
UNION ALL
SELECT 'Coupons', COUNT(*) FROM public.coupons
UNION ALL
SELECT 'Transactions', COUNT(*) FROM public.transactions
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM public.enrollments
UNION ALL
SELECT 'Lesson Progress', COUNT(*) FROM public.lesson_progress
UNION ALL
SELECT 'Certificates', COUNT(*) FROM public.certificates
UNION ALL
SELECT 'Leads', COUNT(*) FROM public.course_leads;
*/
