/*
  # Add lessons table

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `color` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on lessons table
    - Add policies for public read access
    - Add policies for admin write access
*/

CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON public.lessons
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable admin insert access"
  ON public.lessons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'email' = 'radmond11@gmail.com'
  );

CREATE POLICY "Enable admin delete access"
  ON public.lessons
  FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'radmond11@gmail.com'
  );

CREATE POLICY "Enable admin update access"
  ON public.lessons
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'radmond11@gmail.com'
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = 'radmond11@gmail.com'
  );