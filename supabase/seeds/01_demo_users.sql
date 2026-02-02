-- ============================================================================
-- DEMO SEED PART 1: USERS & INSTRUCTOR PROFILES
-- ============================================================================
-- Run this after creating demo users via Supabase Auth Dashboard or Admin API
-- Users to create: admin@demo.com, teacher@demo.com, student1@demo.com, student2@demo.com
-- ============================================================================

-- Deterministic UUIDs for demo users (use these when creating auth users)
-- Admin:    11111111-1111-1111-1111-111111111111
-- Teacher:  22222222-2222-2222-2222-222222222222
-- Student1: 33333333-3333-3333-3333-333333333333
-- Student2: 44444444-4444-4444-4444-444444444444

-- ============================================================================
-- APPROACH A: If you already created auth users, update public.users roles
-- ============================================================================

-- Update roles for existing users (match by email)
UPDATE public.users SET 
    role = 'admin',
    name = 'Demo Admin',
    avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    bio = 'Platform administrator with full access.',
    status = 'active'
WHERE email = 'admin@demo.com';

UPDATE public.users SET 
    role = 'teacher',
    name = 'Sarah Johnson',
    avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio = 'Full-stack developer with 10+ years of experience. Passionate about teaching modern web technologies.',
    status = 'active'
WHERE email = 'teacher@demo.com';

UPDATE public.users SET 
    role = 'student',
    name = 'Ahmed Rahman',
    avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
    bio = 'Aspiring web developer learning new skills.',
    status = 'active'
WHERE email = 'student1@demo.com';

UPDATE public.users SET 
    role = 'student',
    name = 'Fatima Khan',
    avatar_url = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
    bio = 'Interested in programming and technology.',
    status = 'active'
WHERE email = 'student2@demo.com';

-- ============================================================================
-- CREATE INSTRUCTOR PROFILE FOR TEACHER
-- ============================================================================

INSERT INTO public.instructor_profiles (id, bio, expertise, social_links, total_courses, total_students, rating)
SELECT 
    id,
    'Senior Full-Stack Developer with expertise in Python, Django, React, and modern web technologies. Former tech lead at major startups. Taught 50,000+ students worldwide.',
    ARRAY['Python', 'Django', 'React', 'JavaScript', 'PostgreSQL', 'Docker', 'AWS'],
    '{"twitter": "https://twitter.com/sarahjohnson", "linkedin": "https://linkedin.com/in/sarahjohnson", "youtube": "https://youtube.com/@sarahcodes", "github": "https://github.com/sarahjohnson"}'::jsonb,
    6,
    2500,
    4.8
FROM public.users WHERE email = 'teacher@demo.com'
ON CONFLICT (id) DO UPDATE SET
    bio = EXCLUDED.bio,
    expertise = EXCLUDED.expertise,
    social_links = EXCLUDED.social_links,
    total_courses = EXCLUDED.total_courses,
    total_students = EXCLUDED.total_students,
    rating = EXCLUDED.rating;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- SELECT id, email, name, role FROM public.users WHERE email LIKE '%@demo.com';
-- SELECT * FROM public.instructor_profiles;
