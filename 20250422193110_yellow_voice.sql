/*
  # Add audio URL to dictionary words

  1. Changes
    - Add `audio_url` column to `dictionary_words` table
      - Type: text
      - Nullable: true (since not all words will have audio)

  2. Notes
    - Using IF NOT EXISTS to prevent errors if column already exists
    - Column is nullable to maintain compatibility with existing records
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'dictionary_words' 
    AND column_name = 'audio_url'
  ) THEN 
    ALTER TABLE dictionary_words 
    ADD COLUMN audio_url text;
  END IF;
END $$;