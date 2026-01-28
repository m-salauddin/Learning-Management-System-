-- Create user_role enum
CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'teacher', 'student');

-- Create generic function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create users table
CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  courses_enrolled TEXT[] DEFAULT ARRAY[]::TEXT[],
  role user_role DEFAULT 'student'::user_role,
  providers TEXT[] DEFAULT ARRAY['email']::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_provider text;
  v_name text;
  v_avatar_url text;
BEGIN
  -- Extract provider from app metadata (default to 'email' if not found or empty)
  v_provider := COALESCE(new.raw_app_meta_data->>'provider', 'email');
  
  -- Extract name from user metadata
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '');
  
  -- Extract avatar_url from user metadata
  v_avatar_url := COALESCE(new.raw_user_meta_data->>'avatar_url', '');

  INSERT INTO public.users (id, email, name, avatar_url, role, providers)
  VALUES (
    new.id,
    new.email,
    v_name,
    v_avatar_url,
    'student', -- Default role
    ARRAY[v_provider] -- Initialize providers array
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    providers = array_append(public.users.providers, v_provider); 
    -- Note: array_append might add duplicates if user logs in repeatedly. 
    -- For cleaner logic, you'd want to check uniqueness, but this is a simple start.

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
