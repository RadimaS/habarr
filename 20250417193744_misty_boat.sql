/*
  # Add numbers audio table

  1. New Tables
    - `numbers_audio`
      - `id` (uuid, primary key)
      - `number` (text, not null)
      - `audio_url` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `numbers_audio` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS public.numbers_audio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number text NOT NULL,
  audio_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.numbers_audio ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users"
  ON public.numbers_audio
  FOR SELECT
  TO public
  USING (true);