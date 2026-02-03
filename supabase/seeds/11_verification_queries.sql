-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify the demo seed was successful
-- ============================================================================

-- 1. List published courses
SELECT id, title, slug, price, total_students, rating, published
FROM public.courses
WHERE published = true
ORDER BY total_students DESC;

-- 2. Course page join query (main course with all details)
SELECT 
    c.title,
    c.description,
    c.price,
    c.rating,
    c.total_students,
    cd.description_long IS NOT NULL as has_details,
    (SELECT COUNT(*) FROM public.modules WHERE course_id = c.id) as module_count,
    (SELECT COUNT(*) FROM public.lessons l JOIN public.modules m ON l.module_id = m.id WHERE m.course_id = c.id) as lesson_count,
    (SELECT COUNT(*) FROM public.course_projects WHERE course_id = c.id) as project_count,
    (SELECT COUNT(*) FROM public.course_resources WHERE course_id = c.id) as resource_count,
    (SELECT COUNT(*) FROM public.course_faq WHERE course_id = c.id) as faq_count,
    (SELECT COUNT(*) FROM public.course_reviews WHERE course_id = c.id) as review_count,
    u.name as instructor_name
FROM public.courses c
LEFT JOIN public.course_details cd ON cd.course_id = c.id
LEFT JOIN public.users u ON u.id = c.instructor_id
WHERE c.slug = 'web-development-python-django-react';

-- 3. Enrolled vs not enrolled lesson asset access
-- Student1 (enrolled) should see assets, Student2 (not enrolled) should not
SELECT 
    u.email,
    u.name,
    e.id IS NOT NULL as is_enrolled,
    COUNT(la.id) as accessible_assets
FROM public.users u
LEFT JOIN public.enrollments e ON e.user_id = u.id AND e.course_id = 'cccccccc-0001-0001-0001-000000000001'
LEFT JOIN public.modules m ON m.course_id = 'cccccccc-0001-0001-0001-000000000001'
LEFT JOIN public.lessons l ON l.module_id = m.id
LEFT JOIN public.lesson_assets la ON la.lesson_id = l.id AND (e.id IS NOT NULL OR l.is_free_preview = true)
WHERE u.email LIKE '%@demo.com'
GROUP BY u.email, u.name, e.id;

-- 4. Revenue totals (last 30 days)
SELECT 
    COUNT(*) as total_transactions,
    COUNT(*) FILTER (WHERE status = 'success') as successful,
    COUNT(*) FILTER (WHERE status = 'pending') as pending,
    COUNT(*) FILTER (WHERE status = 'failed') as failed,
    SUM(final_price) FILTER (WHERE status = 'success') as total_revenue,
    SUM(discount_amount) FILTER (WHERE status = 'success') as total_discounts
FROM public.transactions
WHERE created_at > NOW() - INTERVAL '30 days';

-- 5. Popular courses by enrollments
SELECT 
    c.title,
    c.total_students,
    COUNT(e.id) as enrollments,
    COALESCE(SUM(t.final_price) FILTER (WHERE t.status = 'success'), 0) as revenue
FROM public.courses c
LEFT JOIN public.enrollments e ON e.course_id = c.id
LEFT JOIN public.transactions t ON t.course_id = c.id
WHERE c.published = true
GROUP BY c.id, c.title, c.total_students
ORDER BY enrollments DESC;

-- 6. Progress calculation for a specific user
SELECT 
    c.title,
    e.progress_percentage,
    COUNT(lp.id) FILTER (WHERE lp.is_completed = true) as completed_lessons,
    (SELECT COUNT(*) FROM public.lessons l2 JOIN public.modules m2 ON l2.module_id = m2.id WHERE m2.course_id = c.id) as total_lessons,
    e.completed_at IS NOT NULL as is_completed
FROM public.enrollments e
JOIN public.courses c ON c.id = e.course_id
JOIN public.users u ON u.id = e.user_id
LEFT JOIN public.lesson_progress lp ON lp.enrollment_id = e.id
WHERE u.email = 'student1@demo.com'
GROUP BY c.id, c.title, e.progress_percentage, e.completed_at;

-- 7. User dashboard data
SELECT 
    u.email,
    u.name,
    u.role,
    u.completed_courses,
    u.certificates_earned,
    COUNT(DISTINCT e.course_id) as enrolled_courses,
    COALESCE(AVG(e.progress_percentage), 0) as avg_progress
FROM public.users u
LEFT JOIN public.enrollments e ON e.user_id = u.id
WHERE u.email LIKE '%@demo.com'
GROUP BY u.id, u.email, u.name, u.role, u.completed_courses, u.certificates_earned;

-- 8. Teacher's courses (instructor dashboard)
SELECT 
    c.title,
    c.slug,
    c.published,
    c.status,
    c.total_students,
    c.rating,
    c.price,
    COALESCE(SUM(t.final_price) FILTER (WHERE t.status = 'success'), 0) as total_revenue
FROM public.courses c
LEFT JOIN public.transactions t ON t.course_id = c.id
WHERE c.instructor_id = (SELECT id FROM public.users WHERE email = 'teacher@demo.com')
GROUP BY c.id, c.title, c.slug, c.published, c.status, c.total_students, c.rating, c.price
ORDER BY c.created_at DESC;

-- 9. Admin analytics summary
SELECT 
    (SELECT COUNT(*) FROM public.users) as total_users,
    (SELECT COUNT(*) FROM public.courses WHERE published = true) as published_courses,
    (SELECT COUNT(*) FROM public.enrollments) as total_enrollments,
    (SELECT COALESCE(SUM(final_price), 0) FROM public.transactions WHERE status = 'success') as total_revenue,
    (SELECT COALESCE(SUM(final_price), 0) FROM public.transactions WHERE status = 'success' AND created_at > NOW() - INTERVAL '30 days') as revenue_30d,
    (SELECT COUNT(DISTINCT user_id) FROM public.transactions WHERE created_at > NOW() - INTERVAL '30 days') as active_users_30d;

-- 10. Certificate verification
SELECT 
    c.certificate_number,
    c.student_name,
    c.course_title,
    c.instructor_name,
    c.completion_date,
    c.is_valid,
    c.verification_url
FROM public.certificates c
ORDER BY c.issued_at DESC;
