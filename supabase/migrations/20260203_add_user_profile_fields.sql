-- Migration: Add user profile fields
-- Created: 2026-02-03
-- Description: Adds bio, phone, location, website, and social_links fields to users table

-- Add profile fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS website TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.users.bio IS 'User biography/about section';
COMMENT ON COLUMN public.users.phone IS 'User phone number';
COMMENT ON COLUMN public.users.location IS 'User location/address';
COMMENT ON COLUMN public.users.website IS 'User personal website URL';
COMMENT ON COLUMN public.users.social_links IS 'Array of social media links in JSON format: [{"platform": "github", "url": "https://..."}]';
