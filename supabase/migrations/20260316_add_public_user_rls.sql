-- Allow everyone to see basic user information (name, avatar, bio)
-- This is necessary for showing instructors on course pages without requiring admin privileges
CREATE POLICY "Public can view basic user info" ON "public"."users"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Also ensure instructor_profiles are publicly readable (already should be based on previous check, but good to ensure)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'instructor_profiles' AND policyname = 'Public can read instructor profiles'
    ) THEN
        CREATE POLICY "Public can read instructor profiles" ON "public"."instructor_profiles"
        AS PERMISSIVE FOR SELECT
        TO public
        USING (true);
    END IF;
END $$;
