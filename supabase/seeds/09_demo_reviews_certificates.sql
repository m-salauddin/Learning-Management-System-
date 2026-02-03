-- ============================================================================
-- DEMO SEED PART 9: REVIEWS & CERTIFICATES
-- ============================================================================

-- REVIEWS for main course (25 reviews with varied ratings)
DO $$
DECLARE
    v_course_id UUID := 'cccccccc-0001-0001-0001-000000000001';
    v_student1_id UUID;
BEGIN
    SELECT id INTO v_student1_id FROM public.users WHERE email = 'student1@demo.com';

    INSERT INTO public.course_reviews (id, course_id, user_id, rating, review_text, is_verified, is_featured, helpful_count, created_at, updated_at)
    VALUES
        -- 5 star reviews (12)
        ('llllllll-0001-0001-0001-000000000001', v_course_id, v_student1_id, 5, 'Best web development course I have ever taken! Sarah explains everything so clearly. Went from zero knowledge to building full-stack apps in 3 months.', true, true, 45, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
        ('llllllll-0001-0001-0001-000000000002', v_course_id, NULL, 5, 'Absolutely fantastic! The projects are real-world applicable. Got my first developer job after completing this course.', true, true, 38, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'),
        ('llllllll-0001-0001-0001-000000000003', v_course_id, NULL, 5, 'The way Django and React are taught together is brilliant. Everything connects perfectly.', true, false, 22, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'),
        ('llllllll-0001-0001-0001-000000000004', v_course_id, NULL, 5, 'Very comprehensive course. Loved the deployment section - not many courses cover that!', true, false, 18, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'),
        ('llllllll-0001-0001-0001-000000000005', v_course_id, NULL, 5, 'Clear explanations, great pacing, responsive instructor. Highly recommended!', true, false, 15, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
        ('llllllll-0001-0001-0001-000000000006', v_course_id, NULL, 5, 'Perfect for beginners. Started with no coding experience and now I can build full apps.', true, false, 12, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
        ('llllllll-0001-0001-0001-000000000007', v_course_id, NULL, 5, 'The Discord community is super helpful. Always get answers within hours.', true, false, 10, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
        ('llllllll-0001-0001-0001-000000000008', v_course_id, NULL, 5, 'Worth every penny! The e-commerce project alone taught me so much.', true, false, 8, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
        ('llllllll-0001-0001-0001-000000000009', v_course_id, NULL, 5, 'Sarah is an amazing teacher. Her energy and passion for teaching is contagious!', true, false, 6, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
        ('llllllll-0001-0001-0001-000000000010', v_course_id, NULL, 5, 'Best investment I made in my career. Already got a 50% salary increase!', true, true, 32, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
        ('llllllll-0001-0001-0001-000000000011', v_course_id, NULL, 5, 'The course structure is perfect. Each module builds on the previous one.', true, false, 4, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        ('llllllll-0001-0001-0001-000000000012', v_course_id, NULL, 5, 'Finally understand how frontend and backend work together!', true, false, 2, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

        -- 4 star reviews (8)
        ('llllllll-0001-0001-0001-000000000013', v_course_id, NULL, 4, 'Great course overall. Would love more advanced React patterns.', true, false, 8, NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days'),
        ('llllllll-0001-0001-0001-000000000014', v_course_id, NULL, 4, 'Very good content. Some sections could use more exercises.', true, false, 5, NOW() - INTERVAL '24 days', NOW() - INTERVAL '24 days'),
        ('llllllll-0001-0001-0001-000000000015', v_course_id, NULL, 4, 'Solid course. The PostgreSQL section was a bit fast for me.', true, false, 4, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
        ('llllllll-0001-0001-0001-000000000016', v_course_id, NULL, 4, 'Good value for money. Learned a lot. Wish there were more quizzes.', true, false, 3, NOW() - INTERVAL '17 days', NOW() - INTERVAL '17 days'),
        ('llllllll-0001-0001-0001-000000000017', v_course_id, NULL, 4, 'Comprehensive course. Some minor audio issues in a few videos.', true, false, 2, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
        ('llllllll-0001-0001-0001-000000000018', v_course_id, NULL, 4, 'Really helpful for career transition. Docker section is excellent!', true, false, 7, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
        ('llllllll-0001-0001-0001-000000000019', v_course_id, NULL, 4, 'Great learning experience. Community support is top-notch.', true, false, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
        ('llllllll-0001-0001-0001-000000000020', v_course_id, NULL, 4, 'Very practical approach. Would recommend to anyone starting out.', true, false, 3, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

        -- 3 star reviews (3)
        ('llllllll-0001-0001-0001-000000000021', v_course_id, NULL, 3, 'Decent course but moves too fast in some areas. Need more time for practice.', true, false, 5, NOW() - INTERVAL '26 days', NOW() - INTERVAL '26 days'),
        ('llllllll-0001-0001-0001-000000000022', v_course_id, NULL, 3, 'Good content but expected more on testing and debugging.', true, false, 3, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'),
        ('llllllll-0001-0001-0001-000000000023', v_course_id, NULL, 3, 'Average course. Some concepts need more detailed explanations.', true, false, 2, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

        -- 2 star reviews (1)
        ('llllllll-0001-0001-0001-000000000024', v_course_id, NULL, 2, 'Too fast for complete beginners. Struggled to keep up.', true, false, 8, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'),

        -- 1 star review (1)
        ('llllllll-0001-0001-0001-000000000025', v_course_id, NULL, 1, 'Not what I expected. Refund requested.', true, false, 2, NOW() - INTERVAL '23 days', NOW() - INTERVAL '23 days')
    ON CONFLICT (id) DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text;

END $$;

-- Update course rating and rating_count
UPDATE public.courses 
SET 
    rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.course_reviews WHERE course_id = 'cccccccc-0001-0001-0001-000000000001'),
    rating_count = (SELECT COUNT(*) FROM public.course_reviews WHERE course_id = 'cccccccc-0001-0001-0001-000000000001')
WHERE id = 'cccccccc-0001-0001-0001-000000000001';

-- ============================================================================
-- CERTIFICATE for Student1's completed course (JavaScript)
-- ============================================================================
DO $$
DECLARE
    v_student1_id UUID;
    v_student1_name TEXT;
    v_teacher_name TEXT;
BEGIN
    SELECT id, name INTO v_student1_id, v_student1_name FROM public.users WHERE email = 'student1@demo.com';
    SELECT name INTO v_teacher_name FROM public.users WHERE email = 'teacher@demo.com';

    INSERT INTO public.certificates (
        id, user_id, course_id, enrollment_id,
        certificate_number, student_name, course_title, instructor_name,
        completion_date, verification_url, is_valid, issued_at
    ) VALUES (
        'mmmmmmmm-0001-0001-0001-000000000001',
        v_student1_id,
        'cccccccc-0001-0001-0001-000000000006',
        'kkkkkkkk-0001-0001-0001-000000000003',
        'CERT-2024-JS-00001',
        v_student1_name,
        'JavaScript Fundamentals: Complete Beginner Guide',
        v_teacher_name,
        (NOW() - INTERVAL '10 days')::date,
        'https://dokkhoit.com/verify/CERT-2024-JS-00001',
        true,
        NOW() - INTERVAL '10 days'
    )
    ON CONFLICT (id) DO UPDATE SET is_valid = true;

END $$;
