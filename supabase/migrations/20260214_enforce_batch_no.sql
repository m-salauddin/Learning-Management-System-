-- Migration: Enforce Batch Number on Courses
-- Description: Ensures all courses have a batch number, defaults existing ones to 1, and sets NOT NULL constraint.

-- 1. Add batch_no if it doesn't exist (safety)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='batch_no') THEN
        ALTER TABLE public.courses ADD COLUMN batch_no INTEGER;
    END IF;
END $$;

-- 2. Update existing NULL values to 1
UPDATE public.courses 
SET batch_no = 1 
WHERE batch_no IS NULL;

-- 3. Set NOT NULL and DEFAULT
ALTER TABLE public.courses 
ALTER COLUMN batch_no SET DEFAULT 1,
ALTER COLUMN batch_no SET NOT NULL;
