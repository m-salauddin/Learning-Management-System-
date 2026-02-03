-- ============================================================================
-- DEMO SEED PART 4: MODULES & LESSONS
-- ============================================================================

-- Main course ID
DO $$
DECLARE
    v_course_id UUID := 'cccccccc-0001-0001-0001-000000000001';
    v_mod1 UUID := 'dddddddd-0001-0001-0001-000000000001';
    v_mod2 UUID := 'dddddddd-0001-0001-0001-000000000002';
    v_mod3 UUID := 'dddddddd-0001-0001-0001-000000000003';
    v_mod4 UUID := 'dddddddd-0001-0001-0001-000000000004';
    v_mod5 UUID := 'dddddddd-0001-0001-0001-000000000005';
    v_mod6 UUID := 'dddddddd-0001-0001-0001-000000000006';
    v_mod7 UUID := 'dddddddd-0001-0001-0001-000000000007';
    v_mod8 UUID := 'dddddddd-0001-0001-0001-000000000008';
BEGIN
    -- ========================================================================
    -- MODULES
    -- ========================================================================
    INSERT INTO public.modules (id, course_id, title, description, position, is_published)
    VALUES 
        (v_mod1, v_course_id, 'Getting Started with Python', 'Introduction to Python programming fundamentals', 1, true),
        (v_mod2, v_course_id, 'Python Advanced Concepts', 'OOP, file handling, and error management', 2, true),
        (v_mod3, v_course_id, 'Django Fundamentals', 'Building web applications with Django', 3, true),
        (v_mod4, v_course_id, 'Django REST Framework', 'Creating powerful REST APIs', 4, true),
        (v_mod5, v_course_id, 'React.js Essentials', 'Modern frontend development with React', 5, true),
        (v_mod6, v_course_id, 'React Advanced Patterns', 'State management and routing', 6, true),
        (v_mod7, v_course_id, 'Database & PostgreSQL', 'Database design and optimization', 7, true),
        (v_mod8, v_course_id, 'Deployment & DevOps', 'Taking your app to production', 8, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- ========================================================================
    -- LESSONS - Module 1: Python Basics
    -- ========================================================================
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0001-000000000001', v_mod1, 'Welcome to the Course', 'Course overview and setup instructions', 'video', 1, 8, true, true),
        ('eeeeeeee-0001-0001-0001-000000000002', v_mod1, 'Installing Python & VS Code', 'Setting up your development environment', 'video', 2, 15, true, true),
        ('eeeeeeee-0001-0001-0001-000000000003', v_mod1, 'Your First Python Program', 'Writing and running Hello World', 'video', 3, 12, true, true),
        ('eeeeeeee-0001-0001-0001-000000000004', v_mod1, 'Variables and Data Types', 'Understanding Python variables', 'video', 4, 25, false, true),
        ('eeeeeeee-0001-0001-0001-000000000005', v_mod1, 'Operators and Expressions', 'Arithmetic and comparison operators', 'video', 5, 20, false, true),
        ('eeeeeeee-0001-0001-0001-000000000006', v_mod1, 'Control Flow: If Statements', 'Making decisions in code', 'video', 6, 22, false, true),
        ('eeeeeeee-0001-0001-0001-000000000007', v_mod1, 'Loops: For and While', 'Repeating actions with loops', 'video', 7, 28, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 2: Python Advanced
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0002-000000000001', v_mod2, 'Functions Deep Dive', 'Parameters, returns, and scope', 'video', 1, 30, false, true),
        ('eeeeeeee-0001-0001-0002-000000000002', v_mod2, 'Classes and Objects', 'Introduction to OOP', 'video', 2, 35, false, true),
        ('eeeeeeee-0001-0001-0002-000000000003', v_mod2, 'Inheritance and Polymorphism', 'Advanced OOP concepts', 'video', 3, 28, false, true),
        ('eeeeeeee-0001-0001-0002-000000000004', v_mod2, 'File Handling', 'Reading and writing files', 'video', 4, 22, false, true),
        ('eeeeeeee-0001-0001-0002-000000000005', v_mod2, 'Exception Handling', 'Try, except, and error management', 'video', 5, 20, false, true),
        ('eeeeeeee-0001-0001-0002-000000000006', v_mod2, 'Modules and Packages', 'Organizing your code', 'video', 6, 18, false, true),
        ('eeeeeeee-0001-0001-0002-000000000007', v_mod2, 'Python Project: CLI App', 'Build a command-line application', 'video', 7, 45, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 3: Django Fundamentals
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0003-000000000001', v_mod3, 'Introduction to Django', 'What is Django and why use it', 'video', 1, 15, true, true),
        ('eeeeeeee-0001-0001-0003-000000000002', v_mod3, 'Django Project Setup', 'Creating your first Django project', 'video', 2, 20, true, true),
        ('eeeeeeee-0001-0001-0003-000000000003', v_mod3, 'URLs and Views', 'Routing requests in Django', 'video', 3, 25, false, true),
        ('eeeeeeee-0001-0001-0003-000000000004', v_mod3, 'Templates and Static Files', 'Rendering HTML with Django', 'video', 4, 30, false, true),
        ('eeeeeeee-0001-0001-0003-000000000005', v_mod3, 'Models and Databases', 'Django ORM basics', 'video', 5, 35, false, true),
        ('eeeeeeee-0001-0001-0003-000000000006', v_mod3, 'Admin Panel', 'Django admin customization', 'video', 6, 20, false, true),
        ('eeeeeeee-0001-0001-0003-000000000007', v_mod3, 'Forms and Validation', 'Handling user input', 'video', 7, 28, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 4: Django REST Framework
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0004-000000000001', v_mod4, 'REST API Concepts', 'Understanding RESTful architecture', 'video', 1, 18, false, true),
        ('eeeeeeee-0001-0001-0004-000000000002', v_mod4, 'DRF Setup and Serializers', 'Getting started with DRF', 'video', 2, 25, false, true),
        ('eeeeeeee-0001-0001-0004-000000000003', v_mod4, 'API Views and ViewSets', 'Building API endpoints', 'video', 3, 30, false, true),
        ('eeeeeeee-0001-0001-0004-000000000004', v_mod4, 'Authentication & Permissions', 'Securing your API', 'video', 4, 35, false, true),
        ('eeeeeeee-0001-0001-0004-000000000005', v_mod4, 'Pagination and Filtering', 'Handling large datasets', 'video', 5, 22, false, true),
        ('eeeeeeee-0001-0001-0004-000000000006', v_mod4, 'Testing APIs', 'Writing API tests', 'video', 6, 25, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 5: React Essentials
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0005-000000000001', v_mod5, 'React Introduction', 'What is React and why use it', 'video', 1, 15, true, true),
        ('eeeeeeee-0001-0001-0005-000000000002', v_mod5, 'Create React App', 'Setting up a React project', 'video', 2, 18, false, true),
        ('eeeeeeee-0001-0001-0005-000000000003', v_mod5, 'JSX and Components', 'Building UI components', 'video', 3, 28, false, true),
        ('eeeeeeee-0001-0001-0005-000000000004', v_mod5, 'Props and State', 'Managing component data', 'video', 4, 32, false, true),
        ('eeeeeeee-0001-0001-0005-000000000005', v_mod5, 'Events and Forms', 'Handling user interactions', 'video', 5, 25, false, true),
        ('eeeeeeee-0001-0001-0005-000000000006', v_mod5, 'Conditional Rendering', 'Dynamic UI patterns', 'video', 6, 20, false, true),
        ('eeeeeeee-0001-0001-0005-000000000007', v_mod5, 'Lists and Keys', 'Rendering collections', 'video', 7, 22, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 6: React Advanced
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0006-000000000001', v_mod6, 'React Hooks Deep Dive', 'useState, useEffect, and more', 'video', 1, 40, false, true),
        ('eeeeeeee-0001-0001-0006-000000000002', v_mod6, 'Custom Hooks', 'Creating reusable logic', 'video', 2, 28, false, true),
        ('eeeeeeee-0001-0001-0006-000000000003', v_mod6, 'Context API', 'Global state management', 'video', 3, 30, false, true),
        ('eeeeeeee-0001-0001-0006-000000000004', v_mod6, 'React Router', 'Client-side routing', 'video', 4, 35, false, true),
        ('eeeeeeee-0001-0001-0006-000000000005', v_mod6, 'API Integration', 'Fetching data with Axios', 'video', 5, 28, false, true),
        ('eeeeeeee-0001-0001-0006-000000000006', v_mod6, 'Redux Toolkit', 'Advanced state management', 'video', 6, 45, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 7: Database
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0007-000000000001', v_mod7, 'Database Fundamentals', 'SQL basics and concepts', 'video', 1, 25, false, true),
        ('eeeeeeee-0001-0001-0007-000000000002', v_mod7, 'PostgreSQL Setup', 'Installing and configuring PostgreSQL', 'video', 2, 18, false, true),
        ('eeeeeeee-0001-0001-0007-000000000003', v_mod7, 'Database Design', 'Tables, relationships, and normalization', 'video', 3, 35, false, true),
        ('eeeeeeee-0001-0001-0007-000000000004', v_mod7, 'Advanced Queries', 'Joins, subqueries, and aggregations', 'video', 4, 30, false, true),
        ('eeeeeeee-0001-0001-0007-000000000005', v_mod7, 'Indexing and Performance', 'Optimizing database queries', 'video', 5, 25, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

    -- Module 8: Deployment
    INSERT INTO public.lessons (id, module_id, title, description, lesson_type, position, duration_minutes, is_free_preview, is_published)
    VALUES 
        ('eeeeeeee-0001-0001-0008-000000000001', v_mod8, 'Git and GitHub', 'Version control essentials', 'video', 1, 28, false, true),
        ('eeeeeeee-0001-0001-0008-000000000002', v_mod8, 'Docker Basics', 'Containerizing your app', 'video', 2, 35, false, true),
        ('eeeeeeee-0001-0001-0008-000000000003', v_mod8, 'CI/CD Pipeline', 'Automated testing and deployment', 'video', 3, 30, false, true),
        ('eeeeeeee-0001-0001-0008-000000000004', v_mod8, 'Deploy to AWS', 'EC2, RDS, and S3', 'video', 4, 45, false, true),
        ('eeeeeeee-0001-0001-0008-000000000005', v_mod8, 'Domain and SSL', 'Setting up production domain', 'video', 5, 20, false, true),
        ('eeeeeeee-0001-0001-0008-000000000006', v_mod8, 'Monitoring and Logs', 'Keeping your app healthy', 'video', 6, 25, false, true),
        ('eeeeeeee-0001-0001-0008-000000000007', v_mod8, 'Course Conclusion', 'Next steps and resources', 'video', 7, 10, false, true)
    ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, position = EXCLUDED.position;

END $$;

-- Update course total_lessons count
UPDATE public.courses 
SET total_lessons = (SELECT COUNT(*) FROM public.lessons l JOIN public.modules m ON l.module_id = m.id WHERE m.course_id = 'cccccccc-0001-0001-0001-000000000001')
WHERE id = 'cccccccc-0001-0001-0001-000000000001';
