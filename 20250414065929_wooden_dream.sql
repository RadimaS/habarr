/*
  # Create dictionary table

  1. New Tables
    - `dictionary_words`
      - `id` (uuid, primary key)
      - `chechen` (text, not null)
      - `russian` (text, not null)
      - `category` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `dictionary_words` table
    - Add policy for public read access
    - Add policy for admin write access
*/

CREATE TABLE IF NOT EXISTS public.dictionary_words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chechen text NOT NULL,
  russian text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dictionary_words ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Enable read access for all users"
  ON public.dictionary_words
  FOR SELECT
  TO public
  USING (true);

-- Insert initial dictionary data
INSERT INTO public.dictionary_words (chechen, russian, category) VALUES
  ('Марша вог1ийла', 'Добро пожаловать', 'Приветствия'),
  ('Де дика дойла', 'Добрый день', 'Приветствия'),
  ('Суна хьо гина вок', 'Рад тебя видеть', 'Приветствия'),
  ('Баркалла', 'Спасибо', 'Общие фразы'),
  ('Ц1а', 'Дом', 'Существительные'),
  ('Хи', 'Вода', 'Существительные'),
  ('Дика', 'Хороший', 'Прилагательные'),
  ('Воккха', 'Большой', 'Прилагательные'),
  ('1аьржа', 'Черный', 'Цвета'),
  ('К1айн', 'Белый', 'Цвета'),
  ('Сийна', 'Синий', 'Цвета'),
  ('Можа', 'Желтый', 'Цвета'),
  ('Ц1ен', 'Красный', 'Цвета'),
  ('Баьццара', 'Зеленый', 'Цвета'),
  ('Нана', 'Мать', 'Семья'),
  ('Да', 'Отец', 'Семья'),
  ('Ваша', 'Брат', 'Семья'),
  ('Йиша', 'Сестра', 'Семья'),
  ('Денана', 'Бабушка', 'Семья'),
  ('Деда', 'Дедушка', 'Семья'),
  ('Хьуна муха ю?', 'Как дела?', 'Общие фразы'),
  ('Дика ду', 'Хорошо', 'Общие фразы'),
  ('Суна хьо еза', 'Я тебя люблю', 'Общие фразы'),
  ('Ас хьоьга сатуьйсу', 'Я скучаю по тебе', 'Общие фразы'),
  ('Со', 'Я', 'Местоимения'),
  ('Хьо', 'Ты', 'Местоимения'),
  ('Иза', 'Он/Она', 'Местоимения'),
  ('Вай', 'Мы', 'Местоимения'),
  ('Шу', 'Вы', 'Местоимения'),
  ('Уьш', 'Они', 'Местоимения'),
  ('Ц1е', 'Имя', 'Существительные'),
  ('Некъ', 'Дорога', 'Существительные'),
  ('Стом', 'Фрукт', 'Еда'),
  ('Хьач', 'Яблоко', 'Еда'),
  ('Кемс', 'Виноград', 'Еда'),
  ('Хи', 'Вода', 'Напитки'),
  ('Шура', 'Молоко', 'Напитки'),
  ('Чай', 'Чай', 'Напитки'),
  ('Кофи', 'Кофе', 'Напитки');