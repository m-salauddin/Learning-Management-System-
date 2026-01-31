-- ==========================================
-- 1. Courses & Content Schema
-- ==========================================

-- Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  thumbnail_url TEXT,
  instructor_id UUID NOT NULL REFERENCES public.users(id),
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_published ON public.courses(is_published, published_at);

-- Trigger for published_at and updated_at
CREATE OR REPLACE FUNCTION public.handle_course_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = true AND OLD.is_published = false THEN
    NEW.published_at = now();
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_meta
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_course_update();

-- Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (course_id, order_index)
);

-- Lessons Table (Metadata only)
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INT NOT NULL,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (module_id, order_index)
);

-- Lesson Assets (Protected Content)
CREATE TABLE IF NOT EXISTS public.lesson_assets (
  lesson_id UUID PRIMARY KEY REFERENCES public.lessons(id) ON DELETE CASCADE,
  content_markdown TEXT,
  video_path TEXT, -- Path in private storage bucket
  attachments JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. Enrollments & Progress
-- ==========================================

-- Enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  source TEXT,
  PRIMARY KEY (user_id, course_id)
);

CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_enrollments_course ON public.enrollments(course_id);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  last_watched_position_seconds INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

-- ==========================================
-- 3. Coupons & Transactions
-- ==========================================

CREATE TABLE IF NOT EXISTS public.coupons (
  code TEXT PRIMARY KEY,
  discount_percent INT CHECK (discount_percent BETWEEN 1 AND 100),
  valid_until TIMESTAMPTZ,
  usage_limit INT,
  used_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL,
  payment_provider TEXT NOT NULL, -- stripe, bkash
  provider_reference TEXT,
  status TEXT NOT NULL CHECK (status IN ('success', 'pending', 'failed', 'refunded')),
  coupon_code TEXT REFERENCES public.coupons(code),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transaction Success Trigger
CREATE OR REPLACE FUNCTION public.handle_transaction_success()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'success' AND (OLD.status IS DISTINCT FROM 'success') THEN
    INSERT INTO public.enrollments (user_id, course_id, source)
    VALUES (NEW.user_id, NEW.course_id, 'purchase')
    ON CONFLICT (user_id, course_id) DO NOTHING;
    
    -- Increment coupon usage
    IF NEW.coupon_code IS NOT NULL THEN
      UPDATE public.coupons 
      SET used_count = used_count + 1 
      WHERE code = NEW.coupon_code;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_transaction_success
  AFTER UPDATE ON public.transactions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_transaction_success();

-- ==========================================
-- 4. Certificates (Optional)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  course_id UUID NOT NULL REFERENCES public.courses(id),
  issued_at TIMESTAMPTZ DEFAULT now(),
  verification_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  UNIQUE (user_id, course_id)
);

-- ==========================================
-- 5. Authorization Helper Functions (RLS)
-- ==========================================

-- Check if user is instructor of a specific course
CREATE OR REPLACE FUNCTION public.is_instructor_of_course(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.courses 
    WHERE id = p_course_id 
    AND instructor_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is enrolled (and not expired)
CREATE OR REPLACE FUNCTION public.is_enrolled(p_course_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.enrollments 
    WHERE user_id = auth.uid() 
    AND course_id = p_course_id
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Check if user is teacher (role check)
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

-- Updated to Check Module/Lesson context for Enrollment
CREATE OR REPLACE FUNCTION public.can_access_lesson_asset(p_lesson_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_course_id UUID;
  v_is_preview BOOLEAN;
BEGIN
  -- Get course context and preview status
  SELECT m.course_id, l.is_free_preview 
  INTO v_course_id, v_is_preview
  FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  WHERE l.id = p_lesson_id;

  -- 1. Free Preview
  IF v_is_preview THEN RETURN TRUE; END IF;
  
  -- 2. Admin
  IF public.is_admin() THEN RETURN TRUE; END IF;
  
  -- 3. Instructor
  IF public.is_instructor_of_course(v_course_id) THEN RETURN TRUE; END IF;
  
  -- 4. Enrolled
  IF public.is_enrolled(v_course_id) THEN RETURN TRUE; END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==========================================
-- 6. Enable RLS & Policies
-- ==========================================

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Courses Policies
CREATE POLICY "Public courses are viewable by everyone" ON public.courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Instructors can view own courses" ON public.courses
  FOR SELECT USING (instructor_id = auth.uid());
  
CREATE POLICY "Admins can view all courses" ON public.courses
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Instructors can insert courses" ON public.courses
  FOR INSERT WITH CHECK (public.is_teacher() AND instructor_id = auth.uid());

CREATE POLICY "Instructors can update own courses" ON public.courses
  FOR UPDATE USING (instructor_id = auth.uid() OR public.is_admin());

-- Modules Policies
CREATE POLICY "Modules viewable if course published" ON public.modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = module_id AND is_published = true)
    OR
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (instructor_id = auth.uid() OR public.is_admin()))
  );

CREATE POLICY "Instructor manage modules" ON public.modules
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND (instructor_id = auth.uid() OR public.is_admin()))
  );

-- Lessons Policies (Metadata)
CREATE POLICY "Lessons viewable if course published" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON m.course_id = c.id
      WHERE m.id = module_id AND (c.is_published = true OR c.instructor_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Instructor manage lessons" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON m.course_id = c.id
      WHERE m.id = module_id AND (c.instructor_id = auth.uid() OR public.is_admin())
    )
  );

-- Lesson Assets (Strict Access)
CREATE POLICY "Protected asset access" ON public.lesson_assets
  FOR SELECT USING (public.can_access_lesson_asset(lesson_id));

CREATE POLICY "Instructor manage assets" ON public.lesson_assets
  FOR ALL USING (
     public.can_access_lesson_asset(lesson_id) AND (public.is_teacher() OR public.is_admin()) 
     -- Note: can_access includes instructor check, but we add is_teacher for clarity/enforcement on writes
  );

-- Enrollments
CREATE POLICY "Users view own enrollments" ON public.enrollments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins view all enrollments" ON public.enrollments
  FOR SELECT USING (public.is_admin());

-- Note: No INSERT policy for enrollments for public users (Server side only or via RPC triggers)

-- Lesson Progress
CREATE POLICY "Users view/manage own progress" ON public.lesson_progress
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid()); -- Users can update own progress

-- Transactions
CREATE POLICY "Users view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins view all transactions" ON public.transactions
  FOR SELECT USING (public.is_admin());

-- Coupons
CREATE POLICY "Admins manage coupons" ON public.coupons
  FOR ALL USING (public.is_admin());

-- Certificates
CREATE POLICY "Users view own certificates" ON public.certificates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Public verify certificate" ON public.certificates
  FOR SELECT USING (true); -- Verification usually done via ID/Code lookup, so SELECT true is okay if we filter by code in query or use RPC.
-- Actually, strict RLS:
DROP POLICY IF EXISTS "Public verify certificate" ON public.certificates;
CREATE POLICY "Public verify certificate" ON public.certificates
  FOR SELECT USING (true); -- This basically makes it public. A better way for signatures is usually an RPC or unrestricted read if the code is secret.

-- ==========================================
-- 7. Admin Analytics & RPCs
-- ==========================================

CREATE OR REPLACE FUNCTION public.get_total_revenue(p_from TIMESTAMPTZ DEFAULT null, p_to TIMESTAMPTZ DEFAULT null)
RETURNS NUMERIC AS $$
BEGIN
  IF NOT public.is_admin() THEN RAIS EXCEPTION 'Access denied'; END IF;
  
  RETURN (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.transactions
    WHERE status = 'success'
    AND (p_from IS NULL OR created_at >= p_from)
    AND (p_to IS NULL OR created_at <= p_to)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_daily_active_users(p_days INT DEFAULT 30)
RETURNS TABLE (date DATE, count BIGINT) AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  
  RETURN QUERY
  SELECT 
    date_trunc('day', updated_at)::DATE as date,
    count(distinct user_id) as count
  FROM public.users
  WHERE updated_at > now() - (p_days || ' days')::INTERVAL
  GROUP BY 1
  ORDER BY 1 DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Banning
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION public.admin_set_ban(p_user_id UUID, p_banned BOOLEAN)
RETURNS VOID AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  UPDATE public.users SET is_banned = p_banned WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.admin_assign_role(p_user_id UUID, p_role user_role)
RETURNS VOID AS $$
BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'Access denied'; END IF;
  UPDATE public.users SET role = p_role WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
