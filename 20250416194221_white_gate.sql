/*
  # Add greetings audio table

  1. New Tables
    - `greetings_audio`
      - `id` (uuid, primary key)
      - `phrase` (text, not null)
      - `audio_url` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `greetings_audio` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS public.greetings_audio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase text NOT NULL,
  audio_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.greetings_audio ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users"
  ON public.greetings_audio
  FOR SELECT
  TO public
  USING (true);

-- Insert initial greetings audio data
INSERT INTO public.greetings_audio (phrase, audio_url) VALUES
  ('Марша вог1ийла', '/audio-alphabet/greetings/1.mp3'),
  ('Де дика дойла', '/audio-alphabet/greetings/2.mp3'),
  ('Суна хьо гина вок', '/audio-alphabet/greetings/3.mp3'),
  ('Баркалла', '/audio-alphabet/greetings/4.mp3');