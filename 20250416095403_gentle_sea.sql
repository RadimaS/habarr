/*
  # Add pronouns audio table

  1. New Tables
    - `pronouns_audio`
      - `id` (uuid, primary key)
      - `pronoun` (text, not null)
      - `audio_url` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `pronouns_audio` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS public.pronouns_audio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pronoun text NOT NULL,
  audio_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pronouns_audio ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users"
  ON public.pronouns_audio
  FOR SELECT
  TO public
  USING (true);

-- Insert initial pronouns audio data
INSERT INTO public.pronouns_audio (pronoun, audio_url) VALUES
  ('Со', '/audio/pronouns/1.mp3'),
  ('Хьо', '/audio/pronouns/2.mp3'),
  ('Иза', '/audio/pronouns/3.mp3'),
  ('Тхо', '/audio/pronouns/4.mp3'),
  ('Шу', '/audio/pronouns/5.mp3'),
  ('Уьш', '/audio/pronouns/6.mp3');