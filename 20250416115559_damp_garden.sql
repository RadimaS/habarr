/*
  # Update audio URLs to use correct bucket

  1. Changes
    - Update audio URLs in alphabet_audio table to use correct bucket path
    - Update audio URLs in pronouns_audio table to use correct bucket path
*/

-- Update alphabet audio URLs
UPDATE alphabet_audio 
SET audio_url = REPLACE(audio_url, '/audio/', '/audio-alphabet/');

-- Update pronouns audio URLs
UPDATE pronouns_audio 
SET audio_url = REPLACE(audio_url, '/audio/pronouns/', '/audio-alphabet/pronouns/');