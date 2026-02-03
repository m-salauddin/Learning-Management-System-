-- ============================================================================
-- DEMO SEED PART 8: ENROLLMENTS & PROGRESS
-- ============================================================================

-- Create enrollments for successful transactions
DO $$
DECLARE
    v_student1_id UUID;
    v_admin_id UUID;
    v_teacher_id UUID;
BEGIN
    SELECT id INTO v_student1_id FROM public.users WHERE email = 'student1@demo.com';
    SELECT id INTO v_admin_id FROM public.users WHERE email = 'admin@demo.com';
    SELECT id INTO v_teacher_id FROM public.users WHERE email = 'teacher@demo.com';

    -- Student1 enrollments (3 courses)
    INSERT INTO public.enrollments (id, user_id, course_id, transaction_id, progress_percentage, created_at)
    VALUES
        ('kkkkkkkk-0001-0001-0001-000000000001', v_student1_id, 'cccccccc-0001-0001-0001-000000000001', 'jjjjjjjj-0001-0001-0001-000000000001', 65, NOW() - INTERVAL '35 days'),
        ('kkkkkkkk-0001-0001-0001-000000000002', v_student1_id, 'cccccccc-0001-0001-0001-000000000002', 'jjjjjjjj-0001-0001-0001-000000000002', 30, NOW() - INTERVAL '20 days'),
        ('kkkkkkkk-0001-0001-0001-000000000003', v_student1_id, 'cccccccc-0001-0001-0001-000000000006', 'jjjjjjjj-0001-0001-0001-000000000003', 100, NOW() - INTERVAL '45 days')
    ON CONFLICT (user_id, course_id) DO UPDATE SET progress_percentage = EXCLUDED.progress_percentage;

    -- Update Student1's completed course with completed_at
    UPDATE public.enrollments SET completed_at = NOW() - INTERVAL '10 days' WHERE id = 'kkkkkkkk-0001-0001-0001-000000000003';

    -- Admin enrollments
    INSERT INTO public.enrollments (id, user_id, course_id, transaction_id, progress_percentage, created_at)
    VALUES
        ('kkkkkkkk-0001-0001-0001-000000000004', v_admin_id, 'cccccccc-0001-0001-0001-000000000001', 'jjjjjjjj-0001-0001-0001-000000000004', 15, NOW() - INTERVAL '40 days'),
        ('kkkkkkkk-0001-0001-0001-000000000005', v_admin_id, 'cccccccc-0001-0001-0001-000000000003', 'jjjjjjjj-0001-0001-0001-000000000006', 5, NOW() - INTERVAL '5 days'),
        ('kkkkkkkk-0001-0001-0001-000000000006', v_admin_id, 'cccccccc-0001-0001-0001-000000000004', 'jjjjjjjj-0001-0001-0001-000000000007', 0, NOW() - INTERVAL '3 days'),
        ('kkkkkkkk-0001-0001-0001-000000000007', v_admin_id, 'cccccccc-0001-0001-0001-000000000002', 'jjjjjjjj-0001-0001-0001-000000000013', 45, NOW() - INTERVAL '10 days'),
        ('kkkkkkkk-0001-0001-0001-000000000008', v_admin_id, 'cccccccc-0001-0001-0001-000000000006', 'jjjjjjjj-0001-0001-0001-000000000017', 0, NOW() - INTERVAL '1 day')
    ON CONFLICT (user_id, course_id) DO UPDATE SET progress_percentage = EXCLUDED.progress_percentage;

    -- Teacher enrollments (for testing other courses)
    INSERT INTO public.enrollments (id, user_id, course_id, transaction_id, progress_percentage, created_at)
    VALUES
        ('kkkkkkkk-0001-0001-0001-000000000009', v_teacher_id, 'cccccccc-0001-0001-0001-000000000002', 'jjjjjjjj-0001-0001-0001-000000000005', 80, NOW() - INTERVAL '25 days'),
        ('kkkkkkkk-0001-0001-0001-000000000010', v_teacher_id, 'cccccccc-0001-0001-0001-000000000003', 'jjjjjjjj-0001-0001-0001-000000000014', 20, NOW() - INTERVAL '8 days'),
        ('kkkkkkkk-0001-0001-0001-000000000011', v_teacher_id, 'cccccccc-0001-0001-0001-000000000004', 'jjjjjjjj-0001-0001-0001-000000000015', 10, NOW() - INTERVAL '6 days'),
        ('kkkkkkkk-0001-0001-0001-000000000012', v_teacher_id, 'cccccccc-0001-0001-0001-000000000006', 'jjjjjjjj-0001-0001-0001-000000000008', 55, NOW() - INTERVAL '2 days'),
        ('kkkkkkkk-0001-0001-0001-000000000013', v_teacher_id, 'cccccccc-0001-0001-0001-000000000001', 'jjjjjjjj-0001-0001-0001-000000000018', 0, NOW() - INTERVAL '4 hours')
    ON CONFLICT (user_id, course_id) DO UPDATE SET progress_percentage = EXCLUDED.progress_percentage;

END $$;

-- ============================================================================
-- LESSON PROGRESS for Student1 (Main course - 65% complete = ~34 lessons)
-- ============================================================================
DO $$
DECLARE
    v_student1_id UUID;
    v_enrollment_id UUID := 'kkkkkkkk-0001-0001-0001-000000000001';
    v_lesson RECORD;
    v_counter INT := 0;
    v_total_lessons INT;
BEGIN
    SELECT id INTO v_student1_id FROM public.users WHERE email = 'student1@demo.com';
    
    -- Get total lessons
    SELECT COUNT(*) INTO v_total_lessons
    FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE m.course_id = 'cccccccc-0001-0001-0001-000000000001';
    
    -- Create progress for ~65% of lessons (first 34 lessons)
    FOR v_lesson IN 
        SELECT l.id, l.duration_minutes
        FROM public.lessons l
        JOIN public.modules m ON l.module_id = m.id
        WHERE m.course_id = 'cccccccc-0001-0001-0001-000000000001'
        ORDER BY m.position, l.position
        LIMIT 34
    LOOP
        v_counter := v_counter + 1;
        
        INSERT INTO public.lesson_progress (
            id, user_id, lesson_id, enrollment_id,
            watched_seconds, is_completed, completed_at, created_at, updated_at
        ) VALUES (
            gen_random_uuid(),
            v_student1_id,
            v_lesson.id,
            v_enrollment_id,
            v_lesson.duration_minutes * 60, -- Fully watched
            true,
            NOW() - INTERVAL '35 days' + (v_counter || ' days')::INTERVAL,
            NOW() - INTERVAL '35 days' + (v_counter || ' days')::INTERVAL,
            NOW() - INTERVAL '35 days' + (v_counter || ' days')::INTERVAL
        )
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET
            watched_seconds = EXCLUDED.watched_seconds,
            is_completed = EXCLUDED.is_completed;
    END LOOP;
END $$;

-- ============================================================================
-- LESSON PROGRESS for Student1 (JavaScript course - 100% complete)
-- ============================================================================
DO $$
DECLARE
    v_student1_id UUID;
    v_enrollment_id UUID := 'kkkkkkkk-0001-0001-0001-000000000003';
    v_lesson RECORD;
    v_counter INT := 0;
BEGIN
    SELECT id INTO v_student1_id FROM public.users WHERE email = 'student1@demo.com';
    
    -- Complete all lessons for JavaScript course (Course 6)
    -- Note: Course 6 modules/lessons would need to exist. For now, this is a placeholder.
    -- The main demo focuses on Course 1.
END $$;
