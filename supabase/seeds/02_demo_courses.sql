-- ============================================================================
-- DEMO SEED PART 2: CATEGORIES & COURSES
-- ============================================================================

-- Get teacher ID
DO $$
DECLARE
    v_teacher_id UUID;
    v_cat_webdev UUID := 'aaaaaaaa-0001-0001-0001-000000000001';
    v_cat_mobile UUID := 'aaaaaaaa-0001-0001-0001-000000000002';
    v_cat_data UUID := 'aaaaaaaa-0001-0001-0001-000000000003';
BEGIN
    SELECT id INTO v_teacher_id FROM public.users WHERE email = 'teacher@demo.com';
    
    IF v_teacher_id IS NULL THEN
        RAISE EXCEPTION 'Teacher user not found. Run 01_demo_users.sql first.';
    END IF;

    -- ========================================================================
    -- CATEGORIES
    -- ========================================================================
    INSERT INTO public.categories (id, name, slug, description, icon, course_count)
    VALUES 
        (v_cat_webdev, 'Web Development', 'web-development', 'Full-stack web development courses', 'Globe', 4),
        (v_cat_mobile, 'Mobile Development', 'mobile-development', 'iOS and Android app development', 'Smartphone', 1),
        (v_cat_data, 'Data Science', 'data-science', 'Machine learning and data analysis', 'BarChart', 1)
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        course_count = EXCLUDED.course_count;

    -- ========================================================================
    -- MAIN COURSE: Web Development with Python, Django & React
    -- ========================================================================
    INSERT INTO public.courses (
        id, title, slug, description, short_description, price, discount_price,
        instructor_id, category_id, published, status, level, language,
        duration_hours, total_lessons, total_students, rating, rating_count,
        thumbnail_url, preview_video_url,
        requirements, learning_objectives, tags, batch_no,
        created_at, updated_at
    ) VALUES (
        'cccccccc-0001-0001-0001-000000000001',
        'Web Development with Python, Django & React',
        'web-development-python-django-react',
        E'Master full-stack web development from scratch! This comprehensive course takes you from beginner to professional developer.\n\nYou will learn Python programming, Django framework, React.js, PostgreSQL, RESTful APIs, authentication, deployment, and much more.\n\nBy the end of this course, you will have built 8 real-world projects including an e-commerce platform, social media app, and job board.',
        'Complete full-stack bootcamp: Python, Django, React, PostgreSQL & deployment',
        12999, 9999,
        v_teacher_id, v_cat_webdev, true, 'published', 'beginner', 'Bangla',
        45.5, 52, 1847, 4.8, 234,
        'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800',
        'course-videos/web-development-python-django-react/preview.mp4',
        ARRAY['Basic computer skills', 'No prior programming experience needed', 'A computer with internet access', 'Willingness to learn and practice'],
        ARRAY['Build full-stack web applications from scratch', 'Master Python programming fundamentals', 'Create REST APIs with Django REST Framework', 'Build interactive UIs with React', 'Work with PostgreSQL databases', 'Deploy applications to production', 'Implement authentication and authorization', 'Write clean, maintainable code'],
        ARRAY['python', 'django', 'react', 'javascript', 'postgresql', 'fullstack', 'web development'],
        5,
        NOW() - INTERVAL '45 days',
        NOW() - INTERVAL '2 days'
    )
    ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        discount_price = EXCLUDED.discount_price,
        published = EXCLUDED.published,
        total_students = EXCLUDED.total_students,
        rating = EXCLUDED.rating,
        rating_count = EXCLUDED.rating_count;

    -- ========================================================================
    -- OTHER COURSES
    -- ========================================================================
    
    -- Course 2: React Masterclass (Published)
    INSERT INTO public.courses (
        id, title, slug, description, short_description, price,
        instructor_id, category_id, published, status, level, language,
        duration_hours, total_lessons, total_students, rating, rating_count,
        thumbnail_url, requirements, learning_objectives, tags, batch_no,
        created_at, updated_at
    ) VALUES (
        'cccccccc-0001-0001-0001-000000000002',
        'React.js Masterclass 2024',
        'react-masterclass-2024',
        'Deep dive into React.js with hooks, context, Redux, and advanced patterns.',
        'Advanced React patterns, hooks, Redux & real-world projects',
        8999, v_teacher_id, v_cat_webdev, true, 'published', 'intermediate', 'Bangla',
        28, 38, 923, 4.7, 156,
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        ARRAY['Basic JavaScript knowledge', 'HTML/CSS fundamentals'],
        ARRAY['Master React Hooks', 'State management with Redux', 'Build production apps'],
        ARRAY['react', 'javascript', 'redux', 'frontend'], 3,
        NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days'
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, published = EXCLUDED.published;

    -- Course 3: Node.js Backend (Published)
    INSERT INTO public.courses (
        id, title, slug, description, short_description, price,
        instructor_id, category_id, published, status, level,
        duration_hours, total_lessons, total_students, rating, rating_count,
        thumbnail_url, tags, batch_no, created_at, updated_at
    ) VALUES (
        'cccccccc-0001-0001-0001-000000000003',
        'Node.js & Express Backend Development',
        'nodejs-express-backend',
        'Build scalable backend APIs with Node.js, Express, and MongoDB.',
        'RESTful APIs, authentication, MongoDB & deployment',
        7499, v_teacher_id, v_cat_webdev, true, 'published', 'intermediate',
        22, 30, 678, 4.6, 89,
        'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
        ARRAY['nodejs', 'express', 'mongodb', 'backend', 'api'], 2,
        NOW() - INTERVAL '60 days', NOW() - INTERVAL '10 days'
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, published = EXCLUDED.published;

    -- Course 4: Flutter (Published)
    INSERT INTO public.courses (
        id, title, slug, description, short_description, price,
        instructor_id, category_id, published, status, level,
        duration_hours, total_lessons, total_students, rating, rating_count,
        thumbnail_url, tags, batch_no, created_at, updated_at
    ) VALUES (
        'cccccccc-0001-0001-0001-000000000004',
        'Flutter App Development Complete Guide',
        'flutter-complete-guide',
        'Build beautiful cross-platform mobile apps with Flutter and Dart.',
        'iOS & Android apps with single codebase',
        9999, v_teacher_id, v_cat_mobile, true, 'published', 'beginner',
        35, 45, 512, 4.5, 67,
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        ARRAY['flutter', 'dart', 'mobile', 'ios', 'android'], 1,
        NOW() - INTERVAL '40 days', NOW() - INTERVAL '8 days'
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, published = EXCLUDED.published;

    -- Course 5: Data Science (Draft - Teacher only)
    INSERT INTO public.courses (
        id, title, slug, description, short_description, price,
        instructor_id, category_id, published, status, level,
        duration_hours, total_lessons, thumbnail_url, tags, batch_no,
        created_at, updated_at
    ) VALUES (
        'cccccccc-0001-0001-0001-000000000005',
        'Python for Data Science & Machine Learning',
        'python-data-science-ml',
        'Learn data analysis, visualization, and machine learning with Python.',
        'Pandas, NumPy, Matplotlib, Scikit-learn',
        14999, v_teacher_id, v_cat_data, false, 'draft', 'intermediate',
        50, 0,
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        ARRAY['python', 'data science', 'machine learning', 'pandas'], 1,
        NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 day'
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, published = EXCLUDED.published;

    -- Course 6: JavaScript Fundamentals
    INSERT INTO public.courses (
        id, title, slug, description, short_description, price,
        instructor_id, category_id, published, status, level,
        duration_hours, total_lessons, total_students, rating, rating_count,
        thumbnail_url, tags, batch_no, created_at, updated_at
    ) VALUES (
        'cccccccc-0001-0001-0001-000000000006',
        'JavaScript Fundamentals: Complete Beginner Guide',
        'javascript-fundamentals',
        'Start your programming journey with JavaScript.',
        'Variables, functions, DOM, async/await',
        4999, v_teacher_id, v_cat_webdev, true, 'published', 'beginner',
        18, 25, 2103, 4.9, 312,
        'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800',
        ARRAY['javascript', 'beginner', 'programming', 'web'], 4,
        NOW() - INTERVAL '55 days', NOW() - INTERVAL '3 days'
    ) ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, published = EXCLUDED.published;

END $$;
