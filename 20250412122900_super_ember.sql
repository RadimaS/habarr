/*
  # Update profiles table policies

  1. Security Changes
    - Update RLS policies to allow profile creation during signup
    - Maintain existing read/update policies
    - Ensure proper authentication checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;

-- Create updated policies
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

-- Modified insert policy to allow registration
CREATE POLICY "Enable insert for registration"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);