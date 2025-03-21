-- Fix for the schools and comments tables RLS policies

-- First, handle the schools table
DROP POLICY IF EXISTS "Schools are viewable by authenticated users" ON schools;
DROP POLICY IF EXISTS "Schools are viewable by anyone" ON schools;

-- Enable RLS on the schools table
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to view schools data
-- This is needed for registration and general app functionality
CREATE POLICY "Schools are viewable by anyone" 
ON schools 
FOR SELECT 
TO authenticated, anon
USING (true);

-- Now fix the comments table
DROP POLICY IF EXISTS "Users can view all comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

-- Enable RLS on the comments table
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows authenticated users to view all comments
CREATE POLICY "Users can view all comments" 
ON comments 
FOR SELECT 
TO authenticated
USING (true);

-- Create a policy that allows authenticated users to create comments
CREATE POLICY "Users can create comments" 
ON comments 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create a policy that allows users to update their own comments
CREATE POLICY "Users can update own comments" 
ON comments 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);

-- Create a policy that allows users to delete their own comments
CREATE POLICY "Users can delete own comments" 
ON comments 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
