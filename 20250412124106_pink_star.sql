/*
  # Fix profile policies for authentication

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies that properly handle authentication flow
    - Allow public insert for initial profile creation
    - Maintain secure read/update policies for authenticated users

  2. Security
    - Enable public insert for initial profile creation during signup
    - Restrict profile reading to authenticated users (own profile only)
    - Restrict profile updates to authenticated users (own profile only)
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for registration" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for public" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create new policies with proper security rules
CREATE POLICY "Enable insert for profile creation"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);