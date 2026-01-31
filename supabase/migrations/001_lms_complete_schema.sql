-- ============================================================================
-- LMS COMPLETE SCHEMA MIGRATION
-- ============================================================================
-- This migration extends the existing auth system with full LMS functionality
-- including courses, modules, lessons, enrollments, payments, and analytics.
--
-- PREREQUISITE: schema.sql must be run first (users, instructor_profiles, courses base)
-- ============================================================================


-- ============================================================================
-- SECTION 1: ADDITIONAL ENUMS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lesson_type AS ENUM ('video', 'text', 'quiz', 'assignment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ============================================================================
-- SECTION 2: HELPER FUNCTIONS (Security)
-- ============================================================================

-- Check if user is a teacher
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('teacher', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is a moderator
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = auth.uid() 
        AND role IN ('moderator', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is enrolled in a course
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE user_id = auth.uid() 
        AND course_id = p_course_id
        AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is the course instructor
CREATE OR REPLACE FUNCTION public.is_course_instructor(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.courses 
        WHERE id = p_course_id 
        AND instructor_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user can access lesson content (enrolled, instructor, or admin)
CREATE OR REPLACE FUNCTION public.can_access_lesson(p_lesson_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_course_id UUID;
    v_is_free_preview BOOLEAN;
BEGIN
    -- Get course_id and free_preview status
    SELECT m.course_id, l.is_free_preview 
    INTO v_course_id, v_is_free_preview
    FROM public.lessons l
    JOIN public.modules m ON l.module_id = m.id
    WHERE l.id = p_lesson_id;
    
    -- Free preview lessons are accessible to all
    IF v_is_free_preview THEN
        RETURN TRUE;
    END IF;
    
    -- Check if admin
    IF public.is_admin() THEN
        RETURN TRUE;
    END IF;
    
    -- Check if instructor
    IF public.is_course_instructor(v_course_id) THEN
        RETURN TRUE;
    END IF;
    
    -- Check if enrolled
    RETURN public.is_enrolled(v_course_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- SECTION 3: COURSE CATEGORIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    icon TEXT DEFAULT '',
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    course_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "Public can read categories"
ON public.categories FOR SELECT
USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ============================================================================
-- SECTION 4: EXTEND COURSES TABLE
-- ============================================================================

-- Add new columns to existing courses table
ALTER TABLE public.courses 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS short_description TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS preview_video_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'English',
ADD COLUMN IF NOT EXISTS duration_hours NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_lessons INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_students INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS status course_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS learning_objectives TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create slug generation function
CREATE OR REPLACE FUNCTION public.generate_course_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INT := 0;
BEGIN
    -- Generate base slug from title
    base_slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    base_slug := trim(both '-' from base_slug);
    final_slug := base_slug;
    
    -- Check for uniqueness and append counter if needed
    WHILE EXISTS (SELECT 1 FROM public.courses WHERE slug = final_slug AND id != NEW.id) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    NEW.slug := final_slug;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-generating slug
DROP TRIGGER IF EXISTS generate_course_slug_trigger ON public.courses;
CREATE TRIGGER generate_course_slug_trigger
BEFORE INSERT OR UPDATE OF title ON public.courses
FOR EACH ROW
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION public.generate_course_slug();

-- Update courses RLS policies
DROP POLICY IF EXISTS "Public can read published courses" ON public.courses;
CREATE POLICY "Public can read published courses"
ON public.courses FOR SELECT
USING (
    status = 'published' 
    OR instructor_id = auth.uid() 
    OR public.is_admin()
    OR public.is_moderator()
);


-- ============================================================================
-- SECTION 5: MODULES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    position INT NOT NULL DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(course_id, position)
);

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_position ON public.modules(course_id, position);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Public can read modules of published courses
CREATE POLICY "Public can read published course modules"
ON public.modules FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id 
        AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin())
    )
);

-- Instructors can manage their course modules
CREATE POLICY "Instructors can manage own course modules"
ON public.modules FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id 
        AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id 
        AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_modules_updated_at ON public.modules;
CREATE TRIGGER update_modules_updated_at
BEFORE UPDATE ON public.modules
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- ============================================================================
-- SECTION 6: LESSONS TABLE (Metadata Only)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    lesson_type lesson_type DEFAULT 'video',
    position INT NOT NULL DEFAULT 0,
    duration_minutes INT DEFAULT 0,
    is_free_preview BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(module_id, position)
);

CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_position ON public.lessons(module_id, position);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Public can read lesson metadata (not content) of published courses
CREATE POLICY "Public can read published lesson metadata"
ON public.lessons FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.modules m
        JOIN public.courses c ON c.id = m.course_id
        WHERE m.id = module_id
        AND (c.status = 'published' OR c.instructor_id = auth.uid() OR public.is_admin())
    )
);

-- Instructors can manage their lessons
CREATE POLICY "Instructors can manage own lessons"
ON public.lessons FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.modules m
        JOIN public.courses c ON c.id = m.course_id
        WHERE m.id = module_id
        AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.modules m
        JOIN public.courses c ON c.id = m.course_id
        WHERE m.id = module_id
        AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
BEFORE UPDATE ON public.lessons
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- ============================================================================
-- SECTION 7: LESSON ASSETS TABLE (Protected Content)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lesson_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE UNIQUE,
    
    -- Video content (stored in private Supabase Storage)
    video_path TEXT DEFAULT '',
    video_duration_seconds INT DEFAULT 0,
    
    -- Text/Markdown content
    markdown_content TEXT DEFAULT '',
    
    -- Additional resources
    resources JSONB DEFAULT '[]'::jsonb,
    
    -- Attachments (file paths in storage)
    attachments TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_assets_lesson_id ON public.lesson_assets(lesson_id);

ALTER TABLE public.lesson_assets ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Only enrolled users, instructors, or admins can access lesson assets
-- Free preview lessons are accessible to all
CREATE POLICY "Authorized users can read lesson assets"
ON public.lesson_assets FOR SELECT
USING (
    public.can_access_lesson(lesson_id)
);

-- Instructors can manage their lesson assets
CREATE POLICY "Instructors can manage own lesson assets"
ON public.lesson_assets FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.lessons l
        JOIN public.modules m ON m.id = l.module_id
        JOIN public.courses c ON c.id = m.course_id
        WHERE l.id = lesson_id
        AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.lessons l
        JOIN public.modules m ON m.id = l.module_id
        JOIN public.courses c ON c.id = m.course_id
        WHERE l.id = lesson_id
        AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_lesson_assets_updated_at ON public.lesson_assets;
CREATE TRIGGER update_lesson_assets_updated_at
BEFORE UPDATE ON public.lesson_assets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- ============================================================================
-- SECTION 8: ENROLLMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ DEFAULT NULL, -- NULL = lifetime access
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'refunded')),
    
    -- Progress tracking
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    completed_lessons INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT now(),
    last_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    
    -- Completion
    completed_at TIMESTAMPTZ DEFAULT NULL,
    certificate_issued BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.enrollments(status);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Users can read their own enrollments
CREATE POLICY "Users can read own enrollments"
ON public.enrollments FOR SELECT
USING (
    user_id = auth.uid() 
    OR public.is_admin()
    OR EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id 
        AND c.instructor_id = auth.uid()
    )
);

-- System creates enrollments (via RPC or triggers)
CREATE POLICY "System can create enrollments"
ON public.enrollments FOR INSERT
WITH CHECK (
    user_id = auth.uid() 
    OR public.is_admin()
);

-- Users can update their own enrollment progress
CREATE POLICY "Users can update own enrollment progress"
ON public.enrollments FOR UPDATE
USING (user_id = auth.uid() OR public.is_admin());

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_enrollments_updated_at ON public.enrollments;
CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- ============================================================================
-- SECTION 9: LESSON PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    
    -- Progress tracking
    watched_seconds INT DEFAULT 0,
    total_seconds INT DEFAULT 0,
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    
    -- Completion
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ DEFAULT NULL,
    
    -- Timestamps
    started_at TIMESTAMPTZ DEFAULT now(),
    last_watched_at TIMESTAMPTZ DEFAULT now(),
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_enrollment_id ON public.lesson_progress(enrollment_id);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Users can read their own progress
CREATE POLICY "Users can read own progress"
ON public.lesson_progress FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

-- Users can insert/update their own progress
CREATE POLICY "Users can manage own progress"
ON public.lesson_progress FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_lesson_progress_updated_at ON public.lesson_progress;
CREATE TRIGGER update_lesson_progress_updated_at
BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- ============================================================================
-- SECTION 10: COUPONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    
    -- Discount details
    discount_type coupon_type DEFAULT 'percentage',
    discount_value NUMERIC(10,2) NOT NULL,
    
    -- Constraints
    min_purchase_amount NUMERIC(10,2) DEFAULT 0,
    max_discount_amount NUMERIC(10,2) DEFAULT NULL, -- Cap for percentage discounts
    
    -- Validity
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ DEFAULT NULL, -- NULL = no expiry
    
    -- Usage limits
    usage_limit INT DEFAULT NULL, -- NULL = unlimited
    usage_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    
    -- Scope
    course_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Empty = all courses
    category_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Empty = all categories
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Metadata
    description TEXT DEFAULT '',
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON public.coupons(is_active);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Only admins can manage coupons
CREATE POLICY "Admins can manage coupons"
ON public.coupons FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Public can check coupon validity via RPC (not direct access)


-- ============================================================================
-- SECTION 11: TRANSACTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    
    -- Payment details
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    original_price NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    
    -- Coupon
    coupon_id UUID REFERENCES public.coupons(id) ON DELETE SET NULL,
    coupon_code TEXT DEFAULT '',
    
    -- Payment gateway
    payment_provider TEXT DEFAULT '', -- 'stripe', 'paypal', 'sslcommerz', etc.
    payment_intent_id TEXT DEFAULT '',
    payment_method TEXT DEFAULT '',
    
    -- Status
    status transaction_status DEFAULT 'pending',
    
    -- Timestamps
    paid_at TIMESTAMPTZ DEFAULT NULL,
    refunded_at TIMESTAMPTZ DEFAULT NULL,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_course_id ON public.transactions(course_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions"
ON public.transactions FOR SELECT
USING (
    user_id = auth.uid() 
    OR public.is_admin()
    OR EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id 
        AND c.instructor_id = auth.uid()
    )
);

-- Transactions created via server-only RPC
CREATE POLICY "System can create transactions"
ON public.transactions FOR INSERT
WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Only admins can update transactions
CREATE POLICY "Admins can update transactions"
ON public.transactions FOR UPDATE
USING (public.is_admin());


-- ============================================================================
-- SECTION 12: CERTIFICATES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    
    -- Certificate details
    certificate_number TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ DEFAULT now(),
    
    -- Verification
    verification_url TEXT DEFAULT '',
    is_valid BOOLEAN DEFAULT true,
    
    -- Metadata
    student_name TEXT NOT NULL,
    course_title TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    completion_date DATE NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON public.certificates(certificate_number);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Users can read their own certificates
CREATE POLICY "Users can read own certificates"
ON public.certificates FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

-- Public can verify certificates via RPC


-- ============================================================================
-- SECTION 13: COURSE REVIEWS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT DEFAULT '',
    
    is_verified BOOLEAN DEFAULT true, -- Verified purchase
    is_featured BOOLEAN DEFAULT false,
    is_hidden BOOLEAN DEFAULT false,
    
    helpful_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_rating ON public.course_reviews(rating);

ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- Public can read reviews
CREATE POLICY "Public can read reviews"
ON public.course_reviews FOR SELECT
USING (NOT is_hidden OR user_id = auth.uid() OR public.is_admin());

-- Users can manage their own reviews
CREATE POLICY "Users can manage own reviews"
ON public.course_reviews FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews"
ON public.course_reviews FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- ============================================================================
-- SECTION 14: AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'user', 'course', 'enrollment', etc.
    entity_id UUID,
    
    old_values JSONB DEFAULT NULL,
    new_values JSONB DEFAULT NULL,
    
    ip_address INET,
    user_agent TEXT DEFAULT '',
    
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON public.audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs"
ON public.audit_log FOR SELECT
USING (public.is_admin());

-- System inserts via triggers (using SECURITY DEFINER functions)


-- ============================================================================
-- SECTION 15: USER ACTIVITY TABLE (For Analytics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    activity_type TEXT NOT NULL, -- 'login', 'lesson_view', 'course_complete', etc.
    entity_type TEXT DEFAULT NULL,
    entity_id UUID DEFAULT NULL,
    
    metadata JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON public.user_activity(created_at);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can read their own activity
CREATE POLICY "Users can read own activity"
ON public.user_activity FOR SELECT
USING (user_id = auth.uid() OR public.is_admin());

-- System inserts activity
CREATE POLICY "System can insert activity"
ON public.user_activity FOR INSERT
WITH CHECK (user_id = auth.uid() OR public.is_admin());


-- ============================================================================
-- SECTION 16: COURSE STATS VIEW
-- ============================================================================

CREATE OR REPLACE VIEW public.course_stats AS
SELECT 
    c.id,
    c.title,
    c.instructor_id,
    c.status,
    c.price,
    COUNT(DISTINCT e.id) AS total_enrollments,
    COUNT(DISTINCT CASE WHEN e.status = 'active' THEN e.id END) AS active_enrollments,
    COUNT(DISTINCT CASE WHEN e.completed_at IS NOT NULL THEN e.id END) AS completions,
    COALESCE(AVG(cr.rating), 0) AS avg_rating,
    COUNT(DISTINCT cr.id) AS review_count,
    COALESCE(SUM(t.amount), 0) AS total_revenue
FROM public.courses c
LEFT JOIN public.enrollments e ON e.course_id = c.id
LEFT JOIN public.course_reviews cr ON cr.course_id = c.id AND NOT cr.is_hidden
LEFT JOIN public.transactions t ON t.course_id = c.id AND t.status = 'completed'
GROUP BY c.id;


-- ============================================================================
-- SECTION 17: RPC FUNCTIONS
-- ============================================================================

-- 17.1: Get Admin Dashboard Stats
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- Check admin permission
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM public.users),
        'total_students', (SELECT COUNT(*) FROM public.users WHERE role = 'student'),
        'total_teachers', (SELECT COUNT(*) FROM public.users WHERE role = 'teacher'),
        'total_courses', (SELECT COUNT(*) FROM public.courses),
        'published_courses', (SELECT COUNT(*) FROM public.courses WHERE status = 'published'),
        'total_enrollments', (SELECT COUNT(*) FROM public.enrollments),
        'active_enrollments', (SELECT COUNT(*) FROM public.enrollments WHERE status = 'active'),
        'total_revenue', (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE status = 'completed'),
        'new_users_today', (SELECT COUNT(*) FROM public.users WHERE created_at >= CURRENT_DATE),
        'new_enrollments_today', (SELECT COUNT(*) FROM public.enrollments WHERE created_at >= CURRENT_DATE),
        'revenue_today', (SELECT COALESCE(SUM(amount), 0) FROM public.transactions WHERE status = 'completed' AND created_at >= CURRENT_DATE)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.2: Get Total Revenue (with date range)
CREATE OR REPLACE FUNCTION public.get_total_revenue(
    p_start_date TIMESTAMPTZ DEFAULT NULL,
    p_end_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS NUMERIC AS $$
DECLARE
    total NUMERIC;
BEGIN
    IF NOT public.is_admin() AND NOT public.is_teacher() THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;
    
    SELECT COALESCE(SUM(amount), 0) INTO total
    FROM public.transactions
    WHERE status = 'completed'
    AND (p_start_date IS NULL OR created_at >= p_start_date)
    AND (p_end_date IS NULL OR created_at <= p_end_date)
    AND (public.is_admin() OR EXISTS (
        SELECT 1 FROM public.courses c 
        WHERE c.id = course_id AND c.instructor_id = auth.uid()
    ));
    
    RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.3: Get Daily Active Users
CREATE OR REPLACE FUNCTION public.get_daily_active_users(
    p_days INT DEFAULT 30
)
RETURNS TABLE(date DATE, count BIGINT) AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        COUNT(DISTINCT user_id) as count
    FROM public.user_activity
    WHERE created_at >= CURRENT_DATE - p_days
    GROUP BY DATE(created_at)
    ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.4: Get Popular Courses
CREATE OR REPLACE FUNCTION public.get_popular_courses(
    p_limit INT DEFAULT 10
)
RETURNS TABLE(
    course_id UUID,
    title TEXT,
    instructor_name TEXT,
    enrollment_count BIGINT,
    revenue NUMERIC,
    rating NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.title,
        u.name,
        COUNT(DISTINCT e.id),
        COALESCE(SUM(t.amount), 0),
        COALESCE(AVG(cr.rating), 0)
    FROM public.courses c
    JOIN public.users u ON u.id = c.instructor_id
    LEFT JOIN public.enrollments e ON e.course_id = c.id
    LEFT JOIN public.transactions t ON t.course_id = c.id AND t.status = 'completed'
    LEFT JOIN public.course_reviews cr ON cr.course_id = c.id
    WHERE c.status = 'published'
    GROUP BY c.id, u.name
    ORDER BY COUNT(DISTINCT e.id) DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.5: Get New Signups
CREATE OR REPLACE FUNCTION public.get_new_signups(
    p_days INT DEFAULT 30
)
RETURNS TABLE(date DATE, count BIGINT) AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    RETURN QUERY
    SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
    FROM public.users
    WHERE created_at >= CURRENT_DATE - p_days
    GROUP BY DATE(created_at)
    ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.6: Validate Coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
    p_code TEXT,
    p_course_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_coupon RECORD;
    v_user_usage INT;
    v_course_price NUMERIC;
    v_discount_amount NUMERIC;
BEGIN
    -- Get coupon
    SELECT * INTO v_coupon 
    FROM public.coupons 
    WHERE code = UPPER(p_code) AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN json_build_object('valid', false, 'error', 'Invalid coupon code');
    END IF;
    
    -- Check validity period
    IF v_coupon.valid_from > now() THEN
        RETURN json_build_object('valid', false, 'error', 'Coupon not yet active');
    END IF;
    
    IF v_coupon.valid_until IS NOT NULL AND v_coupon.valid_until < now() THEN
        RETURN json_build_object('valid', false, 'error', 'Coupon has expired');
    END IF;
    
    -- Check usage limit
    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
        RETURN json_build_object('valid', false, 'error', 'Coupon usage limit reached');
    END IF;
    
    -- Check per-user limit
    SELECT COUNT(*) INTO v_user_usage
    FROM public.transactions
    WHERE user_id = auth.uid() AND coupon_id = v_coupon.id;
    
    IF v_user_usage >= v_coupon.per_user_limit THEN
        RETURN json_build_object('valid', false, 'error', 'You have already used this coupon');
    END IF;
    
    -- Check course scope
    IF array_length(v_coupon.course_ids, 1) > 0 AND NOT p_course_id = ANY(v_coupon.course_ids) THEN
        RETURN json_build_object('valid', false, 'error', 'Coupon not valid for this course');
    END IF;
    
    -- Get course price
    SELECT price INTO v_course_price FROM public.courses WHERE id = p_course_id;
    
    -- Check minimum purchase
    IF v_course_price < v_coupon.min_purchase_amount THEN
        RETURN json_build_object('valid', false, 'error', 'Minimum purchase amount not met');
    END IF;
    
    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount_amount := v_course_price * (v_coupon.discount_value / 100);
        IF v_coupon.max_discount_amount IS NOT NULL THEN
            v_discount_amount := LEAST(v_discount_amount, v_coupon.max_discount_amount);
        END IF;
    ELSE
        v_discount_amount := LEAST(v_coupon.discount_value, v_course_price);
    END IF;
    
    RETURN json_build_object(
        'valid', true,
        'coupon_id', v_coupon.id,
        'discount_type', v_coupon.discount_type,
        'discount_value', v_coupon.discount_value,
        'discount_amount', v_discount_amount,
        'final_price', v_course_price - v_discount_amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.7: Create Enrollment (After Payment)
CREATE OR REPLACE FUNCTION public.create_enrollment_after_payment(
    p_transaction_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_transaction RECORD;
    v_enrollment_id UUID;
    v_total_lessons INT;
BEGIN
    -- Get transaction
    SELECT * INTO v_transaction 
    FROM public.transactions 
    WHERE id = p_transaction_id AND status = 'completed';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Transaction not found or not completed';
    END IF;
    
    -- Check if already enrolled
    IF EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE user_id = v_transaction.user_id 
        AND course_id = v_transaction.course_id
    ) THEN
        RETURN json_build_object('success', false, 'error', 'Already enrolled');
    END IF;
    
    -- Count total lessons
    SELECT COUNT(*) INTO v_total_lessons
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = v_transaction.course_id;
    
    -- Create enrollment
    INSERT INTO public.enrollments (user_id, course_id, total_lessons)
    VALUES (v_transaction.user_id, v_transaction.course_id, v_total_lessons)
    RETURNING id INTO v_enrollment_id;
    
    -- Update course stats
    UPDATE public.courses 
    SET total_students = total_students + 1
    WHERE id = v_transaction.course_id;
    
    RETURN json_build_object(
        'success', true,
        'enrollment_id', v_enrollment_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.8: Update Lesson Progress
CREATE OR REPLACE FUNCTION public.update_lesson_progress(
    p_lesson_id UUID,
    p_watched_seconds INT,
    p_is_completed BOOLEAN DEFAULT false
)
RETURNS JSON AS $$
DECLARE
    v_enrollment RECORD;
    v_lesson RECORD;
    v_progress_id UUID;
    v_total_completed INT;
    v_total_lessons INT;
BEGIN
    -- Get lesson and course info
    SELECT l.*, m.course_id INTO v_lesson
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE l.id = p_lesson_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lesson not found';
    END IF;
    
    -- Get enrollment
    SELECT * INTO v_enrollment
    FROM public.enrollments
    WHERE user_id = auth.uid() AND course_id = v_lesson.course_id AND status = 'active';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Not enrolled in this course';
    END IF;
    
    -- Upsert progress
    INSERT INTO public.lesson_progress (
        user_id, lesson_id, enrollment_id, 
        watched_seconds, is_completed, completed_at
    )
    VALUES (
        auth.uid(), p_lesson_id, v_enrollment.id,
        p_watched_seconds, p_is_completed, 
        CASE WHEN p_is_completed THEN now() ELSE NULL END
    )
    ON CONFLICT (user_id, lesson_id) DO UPDATE
    SET 
        watched_seconds = GREATEST(lesson_progress.watched_seconds, EXCLUDED.watched_seconds),
        is_completed = lesson_progress.is_completed OR EXCLUDED.is_completed,
        completed_at = COALESCE(lesson_progress.completed_at, EXCLUDED.completed_at),
        last_watched_at = now(),
        updated_at = now()
    RETURNING id INTO v_progress_id;
    
    -- Update enrollment progress
    SELECT 
        COUNT(*) FILTER (WHERE is_completed),
        COUNT(*)
    INTO v_total_completed, v_total_lessons
    FROM public.lesson_progress lp
    JOIN public.lessons l ON l.id = lp.lesson_id
    JOIN public.modules m ON m.id = l.module_id
    WHERE lp.user_id = auth.uid() AND m.course_id = v_lesson.course_id;
    
    UPDATE public.enrollments
    SET 
        completed_lessons = v_total_completed,
        progress_percentage = CASE WHEN v_total_lessons > 0 
            THEN (v_total_completed::NUMERIC / v_total_lessons * 100) 
            ELSE 0 END,
        last_accessed_at = now(),
        last_lesson_id = p_lesson_id,
        completed_at = CASE 
            WHEN v_total_completed = total_lessons AND total_lessons > 0 
            THEN COALESCE(completed_at, now()) 
            ELSE NULL END
    WHERE id = v_enrollment.id;
    
    RETURN json_build_object(
        'success', true,
        'progress_id', v_progress_id,
        'completed_lessons', v_total_completed,
        'total_lessons', v_total_lessons,
        'progress_percentage', CASE WHEN v_total_lessons > 0 
            THEN ROUND((v_total_completed::NUMERIC / v_total_lessons * 100), 2)
            ELSE 0 END
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.9: Verify Certificate
CREATE OR REPLACE FUNCTION public.verify_certificate(
    p_certificate_number TEXT
)
RETURNS JSON AS $$
DECLARE
    v_cert RECORD;
BEGIN
    SELECT * INTO v_cert
    FROM public.certificates
    WHERE certificate_number = p_certificate_number;
    
    IF NOT FOUND THEN
        RETURN json_build_object('valid', false, 'error', 'Certificate not found');
    END IF;
    
    IF NOT v_cert.is_valid THEN
        RETURN json_build_object('valid', false, 'error', 'Certificate has been revoked');
    END IF;
    
    RETURN json_build_object(
        'valid', true,
        'student_name', v_cert.student_name,
        'course_title', v_cert.course_title,
        'instructor_name', v_cert.instructor_name,
        'completion_date', v_cert.completion_date,
        'issued_at', v_cert.issued_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.10: Get Instructor Dashboard Stats
CREATE OR REPLACE FUNCTION public.get_instructor_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    IF NOT public.is_teacher() THEN
        RAISE EXCEPTION 'Unauthorized: Teacher access required';
    END IF;
    
    SELECT json_build_object(
        'total_courses', (
            SELECT COUNT(*) FROM public.courses WHERE instructor_id = auth.uid()
        ),
        'published_courses', (
            SELECT COUNT(*) FROM public.courses 
            WHERE instructor_id = auth.uid() AND status = 'published'
        ),
        'total_students', (
            SELECT COUNT(DISTINCT e.user_id) 
            FROM public.enrollments e
            JOIN public.courses c ON c.id = e.course_id
            WHERE c.instructor_id = auth.uid()
        ),
        'total_revenue', (
            SELECT COALESCE(SUM(t.amount), 0)
            FROM public.transactions t
            JOIN public.courses c ON c.id = t.course_id
            WHERE c.instructor_id = auth.uid() AND t.status = 'completed'
        ),
        'avg_rating', (
            SELECT COALESCE(AVG(cr.rating), 0)
            FROM public.course_reviews cr
            JOIN public.courses c ON c.id = cr.course_id
            WHERE c.instructor_id = auth.uid()
        ),
        'total_reviews', (
            SELECT COUNT(*)
            FROM public.course_reviews cr
            JOIN public.courses c ON c.id = cr.course_id
            WHERE c.instructor_id = auth.uid()
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 17.11: Get Student Dashboard Stats
CREATE OR REPLACE FUNCTION public.get_student_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'enrolled_courses', (
            SELECT COUNT(*) FROM public.enrollments 
            WHERE user_id = auth.uid() AND status = 'active'
        ),
        'completed_courses', (
            SELECT COUNT(*) FROM public.enrollments 
            WHERE user_id = auth.uid() AND completed_at IS NOT NULL
        ),
        'in_progress_courses', (
            SELECT COUNT(*) FROM public.enrollments 
            WHERE user_id = auth.uid() 
            AND status = 'active' 
            AND completed_at IS NULL
            AND progress_percentage > 0
        ),
        'total_certificates', (
            SELECT COUNT(*) FROM public.certificates 
            WHERE user_id = auth.uid() AND is_valid = true
        ),
        'total_learning_time', (
            SELECT COALESCE(SUM(watched_seconds), 0)
            FROM public.lesson_progress
            WHERE user_id = auth.uid()
        ),
        'avg_progress', (
            SELECT COALESCE(AVG(progress_percentage), 0)
            FROM public.enrollments
            WHERE user_id = auth.uid() AND status = 'active'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================================
-- SECTION 18: TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- 18.1: Update course lesson count when lessons change
CREATE OR REPLACE FUNCTION public.update_course_lesson_count()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_total_lessons INT;
    v_total_duration INT;
BEGIN
    -- Get course_id
    IF TG_OP = 'DELETE' THEN
        SELECT m.course_id INTO v_course_id
        FROM public.modules m WHERE m.id = OLD.module_id;
    ELSE
        SELECT m.course_id INTO v_course_id
        FROM public.modules m WHERE m.id = NEW.module_id;
    END IF;
    
    -- Count lessons and duration
    SELECT COUNT(*), COALESCE(SUM(duration_minutes), 0)
    INTO v_total_lessons, v_total_duration
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = v_course_id;
    
    -- Update course
    UPDATE public.courses
    SET 
        total_lessons = v_total_lessons,
        duration_hours = v_total_duration / 60.0
    WHERE id = v_course_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_course_lesson_count_trigger ON public.lessons;
CREATE TRIGGER update_course_lesson_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_course_lesson_count();


-- 18.2: Update course rating when reviews change
CREATE OR REPLACE FUNCTION public.update_course_rating()
RETURNS TRIGGER AS $$
DECLARE
    v_course_id UUID;
    v_avg_rating NUMERIC;
    v_rating_count INT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_course_id := OLD.course_id;
    ELSE
        v_course_id := NEW.course_id;
    END IF;
    
    SELECT AVG(rating), COUNT(*)
    INTO v_avg_rating, v_rating_count
    FROM public.course_reviews
    WHERE course_id = v_course_id AND NOT is_hidden;
    
    UPDATE public.courses
    SET 
        rating = COALESCE(v_avg_rating, 0),
        rating_count = v_rating_count
    WHERE id = v_course_id;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_course_rating_trigger ON public.course_reviews;
CREATE TRIGGER update_course_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.course_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_course_rating();


-- 18.3: Issue certificate on course completion
CREATE OR REPLACE FUNCTION public.auto_issue_certificate()
RETURNS TRIGGER AS $$
DECLARE
    v_user RECORD;
    v_course RECORD;
    v_instructor RECORD;
    v_cert_number TEXT;
BEGIN
    -- Only trigger on completion
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
        -- Check if certificate already exists
        IF EXISTS (
            SELECT 1 FROM public.certificates 
            WHERE user_id = NEW.user_id AND course_id = NEW.course_id
        ) THEN
            RETURN NEW;
        END IF;
        
        -- Get user, course, and instructor info
        SELECT * INTO v_user FROM public.users WHERE id = NEW.user_id;
        SELECT * INTO v_course FROM public.courses WHERE id = NEW.course_id;
        SELECT * INTO v_instructor FROM public.users WHERE id = v_course.instructor_id;
        
        -- Generate certificate number
        v_cert_number := 'CERT-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT FROM 1 FOR 8));
        
        -- Create certificate
        INSERT INTO public.certificates (
            user_id, course_id, enrollment_id,
            certificate_number, student_name, course_title,
            instructor_name, completion_date
        ) VALUES (
            NEW.user_id, NEW.course_id, NEW.id,
            v_cert_number, v_user.name, v_course.title,
            v_instructor.name, CURRENT_DATE
        );
        
        -- Mark certificate as issued on enrollment
        NEW.certificate_issued := true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS auto_issue_certificate_trigger ON public.enrollments;
CREATE TRIGGER auto_issue_certificate_trigger
BEFORE UPDATE ON public.enrollments
FOR EACH ROW
EXECUTE FUNCTION public.auto_issue_certificate();


-- ============================================================================
-- SECTION 19: STORAGE POLICIES (For Supabase Storage)
-- ============================================================================
-- Note: These need to be run in Supabase Dashboard or via Storage API
-- The bucket 'course-videos' should be created as PRIVATE

-- Example policies (to be created via Supabase Dashboard):
-- 
-- Policy: "Authenticated users can upload course videos"
-- Allowed operations: INSERT
-- Target roles: authenticated
-- Policy definition: (bucket_id = 'course-videos' AND auth.uid() IS NOT NULL)
--
-- Policy: "Service role can read all videos"
-- Allowed operations: SELECT
-- Target roles: service_role
-- Policy definition: (bucket_id = 'course-videos')
--
-- Direct access to videos is BLOCKED for regular users.
-- Videos are accessed only via signed URLs generated server-side.


-- ============================================================================
-- DONE!
-- ============================================================================
