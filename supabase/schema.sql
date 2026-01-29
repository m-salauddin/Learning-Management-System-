
-- 1. Create the enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth_provider AS ENUM ('google', 'github', 'password');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- 2. Create the users table in public schema
-- This table syncs with auth.users but contains our custom application data
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT '',
  courses_enrolled TEXT[] DEFAULT ARRAY[]::TEXT[],
  role user_role DEFAULT 'student'::user_role,
  providers auth_provider[] DEFAULT ARRAY[]::auth_provider[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 3. Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


-- 4. Set up RLS Policies
-- Allow users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile (e.g., name, avatar)
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Helper function to safely check admin role (bypassing RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Allow admins to view all users
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles"
  ON public.users
  FOR SELECT
  USING (public.is_admin());


-- 5. Helper function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


-- 6. Trigger for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();


-- 7. Function to automatically sync auth.users to public.users
-- This handles name, avatar, and provider extraction from Supabase Auth metadata
-- Helper function to sync providers from auth.identities
CREATE OR REPLACE FUNCTION public.sync_user_providers()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_providers public.auth_provider[];
BEGIN
  -- Determine user_id based on trigger context
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
  ELSE
    v_user_id := NEW.user_id;
  END IF;

  -- fetch providers from auth.identities
  SELECT array_agg(DISTINCT 
      CASE 
        WHEN provider = 'email' THEN 'password'::public.auth_provider 
        WHEN provider = 'google' THEN 'google'::public.auth_provider 
        WHEN provider = 'github' THEN 'github'::public.auth_provider 
        ELSE 'password'::public.auth_provider -- Fallback for others
      END
  )
  INTO v_providers
  FROM auth.identities
  WHERE user_id = v_user_id;

  -- Ensure we don't have nulls
  IF v_providers IS NULL THEN
     v_providers := ARRAY[]::public.auth_provider[];
  END IF;

  -- Update public.users
  UPDATE public.users
  SET 
    providers = v_providers,
    updated_at = now()
  WHERE id = v_user_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to sync providers on identity changes
DROP TRIGGER IF EXISTS on_auth_identity_change ON auth.identities;
CREATE TRIGGER on_auth_identity_change
  AFTER INSERT OR UPDATE OR DELETE ON auth.identities
  FOR EACH ROW EXECUTE PROCEDURE public.sync_user_providers();


-- Function to automatically sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name text;
  v_avatar_url text;
BEGIN
  -- Extract name
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  
  -- Extract avatar
  v_avatar_url := COALESCE(new.raw_user_meta_data->>'avatar_url', '');

  INSERT INTO public.users (id, email, name, avatar_url, role, providers)
  VALUES (
    new.id,
    new.email,
    v_name,
    v_avatar_url,
    'student',
    ARRAY[]::public.auth_provider[] -- Will be synced by on_auth_identity_change trigger
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = CASE WHEN public.users.name = '' THEN EXCLUDED.name ELSE public.users.name END,
    avatar_url = CASE WHEN public.users.avatar_url = '' THEN EXCLUDED.avatar_url ELSE public.users.avatar_url END,
    updated_at = now();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- 8. Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 9. (Optional) Backfill existing users
-- Run this once if you already have users in auth.users
INSERT INTO public.users (id, email, name, avatar_url, role, providers)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', ''),
  COALESCE(raw_user_meta_data->>'avatar_url', ''),
  'student',
  ARRAY[
    CASE 
      WHEN COALESCE(raw_app_meta_data->>'provider', 'email') = 'email' THEN 'password'::public.auth_provider
      ELSE COALESCE(raw_app_meta_data->>'provider', 'password')::public.auth_provider
    END
  ]
FROM auth.users
ON CONFLICT (id) DO NOTHING;
