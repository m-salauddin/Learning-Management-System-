-- Migration: Add RLS policies for course_instructors
-- Description: Enables access for public to read and admins/instructors to manage multiple instructors.

-- 1. Ensure RLS is enabled
ALTER TABLE public.course_instructors ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if any (to be safe)
DROP POLICY IF EXISTS "Public can read course instructors" ON public.course_instructors;
DROP POLICY IF EXISTS "Admins/Instructors can manage course instructors" ON public.course_instructors;

-- 3. Create policies
CREATE POLICY "Public can read course instructors" 
ON public.course_instructors
FOR SELECT 
USING (true);

CREATE POLICY "Admins/Instructors can manage course instructors" 
ON public.course_instructors
FOR ALL 
USING (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_instructors.course_id)
)
WITH CHECK (
    public.is_admin() OR 
    auth.uid() IN (SELECT instructor_id FROM public.courses WHERE id = course_instructors.course_id)
);
