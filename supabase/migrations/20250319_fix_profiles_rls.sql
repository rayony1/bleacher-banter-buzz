-- Fix for the profiles table RLS policy to prevent infinite recursion

-- First, drop any existing RLS policies on the profiles table that might be causing issues
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles from their school" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON profiles;

-- Enable RLS on the profiles table if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a new simplified policy that allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a policy that allows users to view profiles from users at the same school
-- This is a direct query without recursive joins that were causing the infinite recursion
CREATE POLICY "Users can view profiles from their school" 
ON profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles AS viewer_profile
    WHERE viewer_profile.user_id = auth.uid()
    AND viewer_profile.school_id = profiles.school_id
  )
);

-- Create a policy that allows users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create a policy that allows users to insert their own profile during registration
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Public access policy for specific profile fields (optional, uncomment if needed)
-- CREATE POLICY "Public profiles are viewable by everyone"
-- ON profiles
-- FOR SELECT
-- USING (is_public = true);
