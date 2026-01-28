/*
  # Database Schema needed for Supabase

  1. Create a `profiles` table that syncs with `auth.users`
  2. Create a `role_requests` table for role upgrade requests

  Instructions:
  Run these SQL commands in your Supabase SQL Editor.
*/

-- 1. Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'teacher', 'moderator', 'admin')),

  constraint username_length check (char_length(username) >= 3)
);

-- 2. Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- 3. Create policies
-- 3. Create policies
-- Best Practice: Explicitly define roles (TO public/authenticated)
create policy "Public profiles are viewable by everyone." on profiles
  for select to public using (true);

create policy "Users can insert their own profile." on profiles
  for insert to authenticated with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update to authenticated using ((select auth.uid()) = id);

-- 4. Create a trigger to automatically create a profile entry when a new user signs up
-- Best Practice: Set search_path for SECURITY DEFINER functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 5. Create a table for role requests
create table role_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  requested_role text not null check (requested_role in ('teacher', 'moderator', 'admin')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table role_requests enable row level security;

-- Policies for role_requests
create policy "Users can create their own requests" on role_requests
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can view their own requests" on role_requests
  for select to authenticated using ((select auth.uid()) = user_id);

-- Admins should be able to view and update all requests (implementation depends on how you handle admin checks)
-- keeping it simple for now
