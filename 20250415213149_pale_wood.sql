/*
  # Update alphabet order

  1. Changes
    - Delete existing alphabet data
    - Insert alphabet data in correct order with proper pronunciations
*/

-- First, delete existing data
DELETE FROM alphabet_audio;

-- Insert alphabet data in correct order
INSERT INTO alphabet_audio (letter, audio_url) VALUES
  ('А а', 'hhttps://zoiwfdniswnroolmstcu.supabase.co/storage/v1/object/public/audio-alphabet//1.mp3'),
  ('Аь аь', '/audio/2.mp3'),
  ('Б б', '/audio/3.mp3'),
  ('В в', '/audio/4.mp3'),
  ('Г г', '/audio/5.mp3'),
  ('Гӏ гӏ', '/audio/6.mp3'),
  ('Д д', '/audio/7.mp3'),
  ('Е е', '/audio/8.mp3'),
  ('Ё ё', '/audio/9.mp3'),
  ('Ж ж', '/audio/10.mp3'),
  ('З з', '/audio/11.mp3'),
  ('И и', '/audio/12.mp3'),
  ('Й й', '/audio/13.mp3'),
  ('К к', '/audio/14.mp3'),
  ('Кх кх', '/audio/15.mp3'),
  ('Къ къ', '/audio/16.mp3'),
  ('Кӏ кӏ', '/audio/17.mp3'),
  ('Л л', '/audio/18.mp3'),
  ('М м', '/audio/19.mp3'),
  ('Н н', '/audio/20.mp3'),
  ('О о', '/audio/21.mp3'),
  ('Оь оь', '/audio/22.mp3'),
  ('П п', '/audio/23.mp3'),
  ('Пӏ пӏ', '/audio/24.mp3'),
  ('Р р', '/audio/25.mp3'),
  ('С с', '/audio/26.mp3'),
  ('Т т', '/audio/27.mp3'),
  ('Тӏ тӏ', '/audio/28.mp3'),
  ('У у', '/audio/29.mp3'),
  ('Уь уь', '/audio/30.mp3'),
  ('Ф ф', '/audio/31.mp3'),
  ('Х х', '/audio/32.mp3'),
  ('Хь хь', '/audio/33.mp3'),
  ('Хӏ хӏ', '/audio/34.mp3'),
  ('Ц ц', '/audio/35.mp3'),
  ('Цӏ цӏ', '/audio/36.mp3'),
  ('Ч ч', '/audio/37.mp3'),
  ('Чӏ чӏ', '/audio/38.mp3'),
  ('Ш ш', '/audio/39.mp3'),
  ('Щ щ', '/audio/40.mp3'),
  ('ъ', '/audio/41.mp3'),
  ('ы', '/audio/42.mp3'),
  ('ь', '/audio/43.mp3'),
  ('Э э', '/audio/44.mp3'),
  ('Ю ю', '/audio/45.mp3'),
  ('Я я', '/audio/46.mp3'),
  ('I', '/audio/47.mp3');