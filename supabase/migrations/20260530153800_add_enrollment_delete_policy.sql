-- Add DELETE RLS policy for public.enrollments table to allow admins to delete enrollments
CREATE POLICY "Admins can delete enrollments"
ON public.enrollments FOR DELETE
USING (public.is_admin());
