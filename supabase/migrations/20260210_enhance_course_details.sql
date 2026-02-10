-- Migration: Enhance Course Details Schema
-- Description: Adds tables for extended course details, batches, projects, resources, FAQs, and leads.
-- Author: Assistant

-- 1. Course Details (Extended Info)
CREATE TABLE IF NOT EXISTS public.course_details (
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE PRIMARY KEY,
  description_long TEXT,
  learning_outcomes TEXT[] DEFAULT ARRAY[]::TEXT[],
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  target_audience TEXT[] DEFAULT ARRAY[]::TEXT[],
  curriculum_overview TEXT,
  language TEXT DEFAULT 'Bangla',
  last_updated_at TIMESTAMPTZ DEFAULT now(),
  trailer_lesson_id UUID, -- Optional link to a free lesson
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_details ENABLE ROW LEVEL SECURITY;

-- Policies for course_details
CREATE POLICY "Public read access for course_details" ON public.course_details
  FOR SELECT USING (true);

CREATE POLICY "Admins/Instructors can update course_details" ON public.course_details
  FOR ALL USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_details.course_id)
  );


-- 2. Course Batches
CREATE TABLE IF NOT EXISTS public.course_batches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  batch_name TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  seats_total INTEGER,
  seats_remaining INTEGER,
  class_schedule TEXT, -- e.g. "Sat, Mon, Wed 9:00 PM"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for active batches" ON public.course_batches
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins/Instructors can manage batches" ON public.course_batches
  FOR ALL USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_batches.course_id)
  );


-- 3. Course Projects
CREATE TABLE IF NOT EXISTS public.course_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
  order_index INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT false, -- Visible to generic public?
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for projects" ON public.course_projects
  FOR SELECT USING (true); -- Filter by is_public in query if needed, or enforce here. 
  -- We allow reading all because even private ones might show a "Locked" card.

CREATE POLICY "Admins/Instructors can manage projects" ON public.course_projects
  FOR ALL USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_projects.course_id)
  );


-- 4. Course Resources
CREATE TABLE IF NOT EXISTS public.course_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT CHECK (resource_type IN ('file', 'link', 'pdf', 'code', 'video')),
  storage_path TEXT, -- path in supabase storage
  external_url TEXT,
  file_size_bytes BIGINT,
  is_public BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for public resources" ON public.course_resources
  FOR SELECT USING (is_public = true);

CREATE POLICY "Enrolled students can read all resources" ON public.course_resources
  FOR SELECT USING (
    (auth.uid() IN (SELECT user_id FROM public.enrollments WHERE course_id = course_resources.course_id AND status = 'active')) OR
    (auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_resources.course_id)) OR
    public.is_admin()
  );
  
CREATE POLICY "Admins/Instructors can manage resources" ON public.course_resources
  FOR ALL USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_resources.course_id)
  );


-- 5. Course FAQ
CREATE TABLE IF NOT EXISTS public.course_faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_faq ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for faq" ON public.course_faq
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins/Instructors can manage faq" ON public.course_faq
  FOR ALL USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_faq.course_id)
  );


-- 6. Course Leads
CREATE TABLE IF NOT EXISTS public.course_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'course_page',
  is_read BOOLEAN DEFAULT false,
  is_processed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON public.course_leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins/Instructors can view leads" ON public.course_leads
  FOR SELECT USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_leads.course_id)
  );

CREATE POLICY "Admins/Instructors can update leads" ON public.course_leads
  FOR UPDATE USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_leads.course_id)
  );
