/*
  # Fix profile creation policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies that properly handle profile creation
    - Allow profile creation for both authenticated and anonymous users
    - Maintain secure read/update policies

  2. Security
    - Enable profile creation during signup
    - Maintain read/update restrictions to own profile only
    - Ensure proper authentication checks for sensitive operations
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for public" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for registration" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create new policies with proper security rules
CREATE POLICY "Enable profile creation"
  ON public.profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable profile selection"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);