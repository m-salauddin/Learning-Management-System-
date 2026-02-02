-- ============================================================================
-- MIGRATION: Safe User Deletion and Role Change Handling for LMS
-- ============================================================================
-- This migration implements:
-- 1. Soft delete for users (is_deleted, deleted_at, is_banned)
-- 2. Safe course ownership (FK already RESTRICT, we add reassignment RPC)
-- 3. Role change with course ownership validation
-- 4. Enhanced RLS policies for instructor-based access
-- ============================================================================

-- ============================================================================
-- PART 1: Add soft delete and banned columns to users table
-- ============================================================================

-- Add is_deleted column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_deleted'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;
    END IF;
END $$;

-- Add deleted_at column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE public.users ADD COLUMN deleted_at timestamptz NULL;
    END IF;
END $$;

-- Add is_banned column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'is_banned'
    ) THEN
        ALTER TABLE public.users ADD COLUMN is_banned boolean NOT NULL DEFAULT false;
    END IF;
END $$;

-- Add index for faster filtering of active users
CREATE INDEX IF NOT EXISTS idx_users_active_status 
ON public.users (is_deleted, is_banned) 
WHERE is_deleted = false AND is_banned = false;

-- ============================================================================
-- PART 2: Helper functions
-- ============================================================================

-- Helper: Check if user is active (not deleted and not banned)
CREATE OR REPLACE FUNCTION public.is_active_user(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = p_user_id 
        AND is_deleted = false 
        AND is_banned = false
    );
END;
$$;

-- Helper: Check if current user is instructor of a specific course
CREATE OR REPLACE FUNCTION public.is_instructor_of_course(p_course_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.instructor_profiles ip ON ip.id = c.instructor_id
        WHERE c.id = p_course_id 
        AND ip.id = auth.uid()
    );
END;
$$;

-- Helper: Check if user owns any courses (via instructor_profile)
CREATE OR REPLACE FUNCTION public.user_owns_courses(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.courses c
        JOIN public.instructor_profiles ip ON ip.id = c.instructor_id
        WHERE ip.id = p_user_id
    );
END;
$$;

-- Helper: Get count of courses owned by user
CREATE OR REPLACE FUNCTION public.get_user_course_count(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_count integer;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.courses c
    JOIN public.instructor_profiles ip ON ip.id = c.instructor_id
    WHERE ip.id = p_user_id;
    
    RETURN COALESCE(v_count, 0);
END;
$$;

-- ============================================================================
-- PART 3: Admin-only RPC Functions
-- ============================================================================

-- RPC: Soft delete a user (admin only)
CREATE OR REPLACE FUNCTION public.admin_soft_delete_user(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_admin_id uuid;
    v_target_user RECORD;
    v_course_count integer;
BEGIN
    -- Get admin user ID
    v_admin_id := auth.uid();
    
    -- Verify caller is admin
    IF NOT public.is_admin() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only administrators can delete users'
        );
    END IF;
    
    -- Check if target user exists
    SELECT id, email, name, role, is_deleted INTO v_target_user
    FROM public.users 
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    -- Prevent self-deletion
    IF p_user_id = v_admin_id THEN
        RETURN json_build_object(
            'success', false,
            'error', 'You cannot delete your own account'
        );
    END IF;
    
    -- Check if already deleted
    IF v_target_user.is_deleted THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User is already deleted'
        );
    END IF;
    
    -- Check if user owns courses
    v_course_count := public.get_user_course_count(p_user_id);
    IF v_course_count > 0 THEN
        RETURN json_build_object(
            'success', false,
            'error', format('User owns %s courses. Reassign courses before deletion using admin_reassign_instructor.', v_course_count),
            'course_count', v_course_count
        );
    END IF;
    
    -- Perform soft delete
    UPDATE public.users
    SET 
        is_deleted = true,
        deleted_at = now(),
        is_banned = true,
        status = 'suspended',
        updated_at = now()
    WHERE id = p_user_id;
    
    -- Log to audit_log
    INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        v_admin_id,
        'soft_delete_user',
        'user',
        p_user_id,
        jsonb_build_object(
            'email', v_target_user.email,
            'name', v_target_user.name,
            'role', v_target_user.role,
            'is_deleted', false
        ),
        jsonb_build_object(
            'is_deleted', true,
            'is_banned', true,
            'deleted_at', now()
        )
    );
    
    RETURN json_build_object(
        'success', true,
        'message', format('User %s has been soft-deleted', v_target_user.email)
    );
END;
$$;

-- RPC: Reassign all courses from one instructor to another (admin only)
CREATE OR REPLACE FUNCTION public.admin_reassign_instructor(
    p_from_user uuid,
    p_to_user uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_admin_id uuid;
    v_from_user RECORD;
    v_to_user RECORD;
    v_reassigned_count integer;
    v_from_instructor_id uuid;
    v_to_instructor_id uuid;
BEGIN
    -- Get admin user ID
    v_admin_id := auth.uid();
    
    -- Verify caller is admin
    IF NOT public.is_admin() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only administrators can reassign instructors'
        );
    END IF;
    
    -- Validate from_user exists and is a teacher
    SELECT id, email, name, role INTO v_from_user
    FROM public.users 
    WHERE id = p_from_user;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Source user not found'
        );
    END IF;
    
    -- Validate to_user exists and is a teacher
    SELECT id, email, name, role INTO v_to_user
    FROM public.users 
    WHERE id = p_to_user;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Target user not found'
        );
    END IF;
    
    -- Target must be a teacher
    IF v_to_user.role != 'teacher' THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Target user must be a teacher to receive course ownership'
        );
    END IF;
    
    -- From user must be a teacher or have instructor profile
    IF v_from_user.role != 'teacher' AND NOT EXISTS (SELECT 1 FROM public.instructor_profiles WHERE id = p_from_user) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Source user is not an instructor'
        );
    END IF;
    
    -- Get instructor profile IDs
    SELECT id INTO v_from_instructor_id FROM public.instructor_profiles WHERE id = p_from_user;
    SELECT id INTO v_to_instructor_id FROM public.instructor_profiles WHERE id = p_to_user;
    
    -- Ensure target has instructor profile (create if needed for teachers)
    IF v_to_instructor_id IS NULL THEN
        INSERT INTO public.instructor_profiles (id, bio)
        VALUES (p_to_user, '')
        ON CONFLICT (id) DO NOTHING
        RETURNING id INTO v_to_instructor_id;
        
        -- Refetch if insert happened
        IF v_to_instructor_id IS NULL THEN
            SELECT id INTO v_to_instructor_id FROM public.instructor_profiles WHERE id = p_to_user;
        END IF;
    END IF;
    
    IF v_from_instructor_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Source user has no instructor profile'
        );
    END IF;
    
    -- Count and reassign courses
    UPDATE public.courses
    SET 
        instructor_id = v_to_instructor_id,
        updated_at = now()
    WHERE instructor_id = v_from_instructor_id;
    
    GET DIAGNOSTICS v_reassigned_count = ROW_COUNT;
    
    IF v_reassigned_count = 0 THEN
        RETURN json_build_object(
            'success', true,
            'message', 'No courses to reassign',
            'reassigned_count', 0
        );
    END IF;
    
    -- Update instructor stats
    UPDATE public.instructor_profiles
    SET 
        total_courses = (SELECT COUNT(*) FROM public.courses WHERE instructor_id = v_to_instructor_id),
        updated_at = now()
    WHERE id = v_to_instructor_id;
    
    UPDATE public.instructor_profiles
    SET 
        total_courses = 0,
        updated_at = now()
    WHERE id = v_from_instructor_id;
    
    -- Log to audit_log
    INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        v_admin_id,
        'reassign_instructor',
        'courses',
        p_from_user,
        jsonb_build_object(
            'from_user_id', p_from_user,
            'from_user_email', v_from_user.email
        ),
        jsonb_build_object(
            'to_user_id', p_to_user,
            'to_user_email', v_to_user.email,
            'courses_reassigned', v_reassigned_count
        )
    );
    
    RETURN json_build_object(
        'success', true,
        'message', format('%s courses reassigned from %s to %s', v_reassigned_count, v_from_user.email, v_to_user.email),
        'reassigned_count', v_reassigned_count
    );
END;
$$;

-- RPC: Assign a new role to a user with course ownership validation (admin only)
CREATE OR REPLACE FUNCTION public.admin_assign_role(
    p_user_id uuid,
    p_new_role user_role,
    p_reassign_to uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_admin_id uuid;
    v_target_user RECORD;
    v_course_count integer;
    v_reassign_result json;
BEGIN
    -- Get admin user ID
    v_admin_id := auth.uid();
    
    -- Verify caller is admin
    IF NOT public.is_admin() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only administrators can assign roles'
        );
    END IF;
    
    -- Check if target user exists
    SELECT id, email, name, role, is_deleted INTO v_target_user
    FROM public.users 
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    -- Prevent changing deleted user's role
    IF v_target_user.is_deleted THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Cannot change role of a deleted user'
        );
    END IF;
    
    -- If role is same, just return success
    IF v_target_user.role = p_new_role THEN
        RETURN json_build_object(
            'success', true,
            'message', 'User already has this role'
        );
    END IF;
    
    -- Check course ownership when demoting from teacher
    IF v_target_user.role = 'teacher' AND p_new_role != 'teacher' THEN
        v_course_count := public.get_user_course_count(p_user_id);
        
        IF v_course_count > 0 THEN
            -- If reassign_to is provided, reassign courses first
            IF p_reassign_to IS NOT NULL THEN
                v_reassign_result := public.admin_reassign_instructor(p_user_id, p_reassign_to);
                
                -- Check if reassignment succeeded
                IF NOT (v_reassign_result->>'success')::boolean THEN
                    RETURN json_build_object(
                        'success', false,
                        'error', format('Course reassignment failed: %s', v_reassign_result->>'error')
                    );
                END IF;
            ELSE
                -- Block role change if courses exist and no reassignment target
                RETURN json_build_object(
                    'success', false,
                    'error', format('Reassign courses first. User owns %s courses. Provide p_reassign_to parameter or call admin_reassign_instructor.', v_course_count),
                    'course_count', v_course_count,
                    'requires_reassignment', true
                );
            END IF;
        END IF;
    END IF;
    
    -- If promoting to teacher, ensure instructor profile exists
    IF p_new_role = 'teacher' THEN
        INSERT INTO public.instructor_profiles (id, bio)
        VALUES (p_user_id, '')
        ON CONFLICT (id) DO NOTHING;
    END IF;
    
    -- Update the role
    UPDATE public.users
    SET 
        role = p_new_role,
        updated_at = now()
    WHERE id = p_user_id;
    
    -- Log to audit_log
    INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        v_admin_id,
        'assign_role',
        'user',
        p_user_id,
        jsonb_build_object(
            'email', v_target_user.email,
            'old_role', v_target_user.role
        ),
        jsonb_build_object(
            'new_role', p_new_role,
            'reassign_to', p_reassign_to
        )
    );
    
    RETURN json_build_object(
        'success', true,
        'message', format('Role updated from %s to %s for user %s', v_target_user.role, p_new_role, v_target_user.email),
        'old_role', v_target_user.role,
        'new_role', p_new_role
    );
END;
$$;

-- RPC: Restore a soft-deleted user (admin only)
CREATE OR REPLACE FUNCTION public.admin_restore_user(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_admin_id uuid;
    v_target_user RECORD;
BEGIN
    v_admin_id := auth.uid();
    
    IF NOT public.is_admin() THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Only administrators can restore users'
        );
    END IF;
    
    SELECT id, email, name, is_deleted INTO v_target_user
    FROM public.users 
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User not found'
        );
    END IF;
    
    IF NOT v_target_user.is_deleted THEN
        RETURN json_build_object(
            'success', true,
            'message', 'User is not deleted'
        );
    END IF;
    
    -- Restore user
    UPDATE public.users
    SET 
        is_deleted = false,
        deleted_at = NULL,
        is_banned = false,
        status = 'active',
        updated_at = now()
    WHERE id = p_user_id;
    
    -- Log to audit_log
    INSERT INTO public.audit_log (user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (
        v_admin_id,
        'restore_user',
        'user',
        p_user_id,
        jsonb_build_object('is_deleted', true),
        jsonb_build_object('is_deleted', false, 'is_banned', false)
    );
    
    RETURN json_build_object(
        'success', true,
        'message', format('User %s has been restored', v_target_user.email)
    );
END;
$$;

-- ============================================================================
-- PART 4: Update is_admin() to check for active status
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role = 'admin'
        AND is_deleted = false
        AND is_banned = false
    );
END;
$$;

-- Update is_moderator() if it exists to also check active status
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
        AND is_deleted = false
        AND is_banned = false
    );
END;
$$;

-- ============================================================================
-- PART 5: Enhanced RLS Policies
-- ============================================================================

-- First, drop existing policies that need updating (idempotent with IF EXISTS)
DROP POLICY IF EXISTS "Instructor can manage own courses" ON public.courses;
DROP POLICY IF EXISTS "Public can read published courses" ON public.courses;
DROP POLICY IF EXISTS "Instructors can manage own course modules" ON public.modules;
DROP POLICY IF EXISTS "Public can read published course modules" ON public.modules;
DROP POLICY IF EXISTS "Instructors can manage own lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public can read published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Instructors can manage own lesson assets" ON public.lesson_assets;
DROP POLICY IF EXISTS "Authorized users can read lesson assets" ON public.lesson_assets;

-- Users table: Add active user check for own profile access
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;

-- Re-create users policies with active user checks
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (
    auth.uid() = id
    AND is_deleted = false
);

CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (
    auth.uid() = id
    AND is_deleted = false
    AND is_banned = false
);

CREATE POLICY "Admins can view all profiles"
ON public.users FOR SELECT
USING (public.is_admin());

-- Admins can update any user
CREATE POLICY "Admins can update any user"
ON public.users FOR UPDATE
USING (public.is_admin());

-- ============================================================================
-- Courses: Only owner instructor or admin can write
-- ============================================================================

CREATE POLICY "Public can read published courses"
ON public.courses FOR SELECT
USING (
    (status = 'published'::course_status)
    OR public.is_instructor_of_course(id)
    OR public.is_admin()
    OR public.is_moderator()
);

CREATE POLICY "Instructor can manage own courses"
ON public.courses FOR ALL
USING (
    public.is_active_user() 
    AND (
        public.is_instructor_of_course(id) 
        OR public.is_admin()
    )
)
WITH CHECK (
    public.is_active_user() 
    AND (
        public.is_instructor_of_course(id) 
        OR public.is_admin()
    )
);

-- ============================================================================
-- Modules: Only owner instructor or admin can write
-- ============================================================================

CREATE POLICY "Public can read published course modules"
ON public.modules FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = modules.course_id
        AND (
            c.status = 'published'::course_status
            OR public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
);

CREATE POLICY "Instructors can manage own course modules"
ON public.modules FOR ALL
USING (
    public.is_active_user()
    AND EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = modules.course_id
        AND (
            public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
)
WITH CHECK (
    public.is_active_user()
    AND EXISTS (
        SELECT 1 FROM courses c
        WHERE c.id = modules.course_id
        AND (
            public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
);

-- ============================================================================
-- Lessons: Only owner instructor or admin can write
-- ============================================================================

CREATE POLICY "Public can read published lessons"
ON public.lessons FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM modules m
        JOIN courses c ON c.id = m.course_id
        WHERE m.id = lessons.module_id
        AND (
            c.status = 'published'::course_status
            OR public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
);

CREATE POLICY "Instructors can manage own lessons"
ON public.lessons FOR ALL
USING (
    public.is_active_user()
    AND EXISTS (
        SELECT 1 FROM modules m
        JOIN courses c ON c.id = m.course_id
        WHERE m.id = lessons.module_id
        AND (
            public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
)
WITH CHECK (
    public.is_active_user()
    AND EXISTS (
        SELECT 1 FROM modules m
        JOIN courses c ON c.id = m.course_id
        WHERE m.id = lessons.module_id
        AND (
            public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
);

-- ============================================================================
-- Lesson Assets: Only owner instructor or admin can write
-- ============================================================================

CREATE POLICY "Authorized users can read lesson assets"
ON public.lesson_assets FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = lesson_assets.lesson_id
        AND (
            c.status = 'published'::course_status
            OR public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
);

CREATE POLICY "Instructors can manage own lesson assets"
ON public.lesson_assets FOR ALL
USING (
    public.is_active_user()
    AND EXISTS (
        SELECT 1 FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = lesson_assets.lesson_id
        AND (
            public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
)
WITH CHECK (
    public.is_active_user()
    AND EXISTS (
        SELECT 1 FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = lesson_assets.lesson_id
        AND (
            public.is_instructor_of_course(c.id)
            OR public.is_admin()
        )
    )
);

-- ============================================================================
-- PART 6: Grant execute permissions on new functions
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.is_active_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_instructor_of_course(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_courses(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_course_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_soft_delete_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reassign_instructor(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_assign_role(uuid, user_role, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_restore_user(uuid) TO authenticated;

-- ============================================================================
-- COMPLETE: Migration finished successfully
-- ============================================================================
