/*
  # Add pronouns to dictionary words

  1. Changes
    - Add pronouns to dictionary_words table with appropriate category
    - Use DO block to handle duplicate entries safely
*/

DO $$
BEGIN
  -- Insert pronouns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM dictionary_words WHERE chechen = 'Со' AND category = 'Местоимения') THEN
    INSERT INTO dictionary_words (chechen, russian, category) VALUES ('Со', 'Я', 'Местоимения');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dictionary_words WHERE chechen = 'Хьо' AND category = 'Местоимения') THEN
    INSERT INTO dictionary_words (chechen, russian, category) VALUES ('Хьо', 'Ты', 'Местоимения');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dictionary_words WHERE chechen = 'Иза' AND category = 'Местоимения') THEN
    INSERT INTO dictionary_words (chechen, russian, category) VALUES ('Иза', 'Он/Она', 'Местоимения');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dictionary_words WHERE chechen = 'Тхо' AND category = 'Местоимения') THEN
    INSERT INTO dictionary_words (chechen, russian, category) VALUES ('Тхо', 'Мы', 'Местоимения');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dictionary_words WHERE chechen = 'Шу' AND category = 'Местоимения') THEN
    INSERT INTO dictionary_words (chechen, russian, category) VALUES ('Шу', 'Вы', 'Местоимения');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM dictionary_words WHERE chechen = 'Уьш' AND category = 'Местоимения') THEN
    INSERT INTO dictionary_words (chechen, russian, category) VALUES ('Уьш', 'Они', 'Местоимения');
  END IF;
END $$;