# Social Links Implementation Guide

## Overview
This guide will help you add the `social_links` field and other profile fields to your Supabase `users` table.

## Step 1: Apply Database Migration

You have two options to apply the migration:

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the following SQL:

```sql
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

-- Add comments for documentation
COMMENT ON COLUMN public.users.bio IS 'User biography/about section';
COMMENT ON COLUMN public.users.phone IS 'User phone number';
COMMENT ON COLUMN public.users.location IS 'User location/address';
COMMENT ON COLUMN public.users.website IS 'User personal website URL';
COMMENT ON COLUMN public.users.social_links IS 'Array of social media links in JSON format: [{"platform": "github", "url": "https://..."}]';
```

5. Click **Run** button at the bottom right
6. Wait for "Success. No rows returned" message

### Option B: Using Supabase CLI (if you have local setup)

If you have Supabase CLI configured:

```bash
cd c:/Users/HP/VsCode/dokkhoit-project/dokkhoit-frontend
supabase db push
```

## Step 2: Verify the Migration

Run this query in SQL Editor to verify the columns were added:

```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name IN ('bio', 'phone', 'location', 'website', 'social_links');
```

You should see all 5 columns listed.

## Step 3: Test the Feature

1. Go to your profile page: http://localhost:3000/dashboard/profile
2. Scroll to the **Social Links** section
3. Click **Add Link** button
4. Select a platform (e.g., GitHub)
5. Enter a valid URL
6. Click **Add Link**
7. Click **Save Changes** at the bottom
8. Refresh the page to verify the link was saved

## Social Links Data Structure

The `social_links` column stores data in this JSON format:

```json
[
  {
    "platform": "github",
    "url": "https://github.com/username"
  },
  {
    "platform": "linkedin",
    "url": "https://linkedin.com/in/username"
  },
  {
    "platform": "twitter",
    "url": "https://twitter.com/username"
  }
]
```

## Supported Platforms

- **GitHub**: `https://github.com/username`
- **LinkedIn**: `https://linkedin.com/in/username`
- **X (Twitter)**: `https://twitter.com/username` or `https://x.com/username`
- **Facebook**: `https://facebook.com/username`
- **Instagram**: `https://instagram.com/username`
- **WhatsApp**: `https://wa.me/phonenumber`
- **Custom**: Any valid URL

## Code Changes Made

### 1. Database Migration
- ✅ Created migration file: `supabase/migrations/20260203_add_user_profile_fields.sql`
- ✅ Adds 5 new columns to `users` table

### 2. Backend (lib/actions/users.ts)
- ✅ Updated `updateProfile` function to include `social_links` in allowed updates

### 3. Frontend (app/(protected)/dashboard/profile/page.tsx)
- ✅ Social links UI components
- ✅ Add/Edit/Delete functionality
- ✅ Platform-specific URL validation
- ✅ Max 3 links enforcement
- ✅ Social links sent in profile update request

## Troubleshooting

### Issue: "Column already exists" error
**Solution**: Some columns may already exist. This is fine - the migration uses `IF NOT EXISTS` to prevent errors.

### Issue: Social links not saving
**Check**:
1. Verify columns exist in database (Step 2 above)
2. Check browser console for errors
3. Verify RLS policies allow user to update their own profile

### Issue: Permission denied
**Solution**: Make sure the RLS policy "Users can update own profile" exists:

```sql
CREATE POLICY "Users can update own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);
```

## Next Steps

After applying the migration:
1. Test adding social links
2. Test editing existing links
3. Test removing links
4. Verify links persist after page refresh
5. Check that the "Save Changes" button appears when links are modified

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check Supabase logs in the dashboard
3. Verify your database schema matches the migration
