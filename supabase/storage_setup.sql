
-- ============================================================================
-- STORAGE SETUP: BUCKETS AND POLICIES
-- ============================================================================
-- Run this in the Supabase SQL Editor to initialize your storage buckets.

-- 1. Create Buckets
-- ============================================================================

-- Public bucket for user avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public bucket for course thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('courses', 'courses', true)
ON CONFLICT (id) DO NOTHING;

-- Private bucket for lesson videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-videos', 'course-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Private bucket for certificates (if using PDF storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;


-- 2. Storage Policies
-- ============================================================================

-- ABLE TO DISABLE RLS ON STORAGE (Not recommended, but shown for context)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- AVATARS POLICIES
-- ----------------------------------------------------------------------------

-- Allow public read access to avatars
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
-- The filename should start with their user ID
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);


-- ----------------------------------------------------------------------------
-- COURSES (Thumbnails) POLICIES
-- ----------------------------------------------------------------------------

-- Allow public read access to course thumbnails
DROP POLICY IF EXISTS "Public Course Thumbnails" ON storage.objects;
CREATE POLICY "Public Course Thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'courses');

-- Allow admins and teachers to upload thumbnails
DROP POLICY IF EXISTS "Admins and teachers can upload thumbnails" ON storage.objects;
CREATE POLICY "Admins and teachers can upload thumbnails"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'courses' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);

-- Allow admins and teachers to update/delete thumbnails
DROP POLICY IF EXISTS "Admins and teachers can manage thumbnails" ON storage.objects;
CREATE POLICY "Admins and teachers can manage thumbnails"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'courses' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);


-- ----------------------------------------------------------------------------
-- COURSE VIDEOS POLICIES
-- ----------------------------------------------------------------------------

-- No public read access (private bucket)
-- Access is granted via signed URLs generated server-side

-- Allow admins and teachers to upload videos
DROP POLICY IF EXISTS "Admins and teachers can upload videos" ON storage.objects;
CREATE POLICY "Admins and teachers can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-videos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);

-- Allow admins and teachers to manage videos
DROP POLICY IF EXISTS "Admins and teachers can manage videos" ON storage.objects;
CREATE POLICY "Admins and teachers can manage videos"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'course-videos' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);


-- ----------------------------------------------------------------------------
-- CERTIFICATES POLICIES
-- ----------------------------------------------------------------------------

-- Allow admins and teachers to manage certificates
DROP POLICY IF EXISTS "Admins and teachers can manage certificates" ON storage.objects;
CREATE POLICY "Admins and teachers can manage certificates"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'certificates' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);

-- Clients get access via signed URLs
