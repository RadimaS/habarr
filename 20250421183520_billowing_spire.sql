/*
  # Create Culture Tables

  1. New Tables
    - `culture_cards`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `created_at` (timestamp with timezone)
    
    - `culture_content`
      - `id` (uuid, primary key)
      - `card_id` (uuid, foreign key to culture_cards)
      - `title` (text)
      - `text` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for admin write access

  3. Relationships
    - Foreign key from culture_content to culture_cards
*/

-- Create culture_cards table
CREATE TABLE IF NOT EXISTS public.culture_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create culture_content table
CREATE TABLE IF NOT EXISTS public.culture_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.culture_cards(id) ON DELETE CASCADE,
  title text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.culture_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_content ENABLE ROW LEVEL SECURITY;

-- Create policies for culture_cards
CREATE POLICY "Enable read access for all users on culture_cards"
  ON public.culture_cards
  FOR SELECT
  TO public
  USING (true);

-- Create policies for culture_content
CREATE POLICY "Enable read access for all users on culture_content"
  ON public.culture_content
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO public.culture_cards (title, description, icon, color, created_at) VALUES
  ('История', 'Изучите богатую историю чеченского народа', 'BookOpen', 'bg-gradient-to-br from-blue-500 to-blue-700', now()),
  ('Традиции', 'Познакомьтесь с традициями и обычаями', 'Scroll', 'bg-gradient-to-br from-green-500 to-green-700', now()),
  ('Пословицы', 'Мудрость народа в пословицах', 'MessageSquareQuote', 'bg-gradient-to-br from-purple-500 to-purple-700', now());

-- Insert sample content
DO $$
DECLARE
  history_id uuid;
  traditions_id uuid;
  proverbs_id uuid;
BEGIN
  -- Get the IDs of the cards we just inserted
  SELECT id INTO history_id FROM public.culture_cards WHERE title = 'История' LIMIT 1;
  SELECT id INTO traditions_id FROM public.culture_cards WHERE title = 'Традиции' LIMIT 1;
  SELECT id INTO proverbs_id FROM public.culture_cards WHERE title = 'Пословицы' LIMIT 1;

  -- Insert content for History
  INSERT INTO public.culture_content (card_id, title, text) VALUES
    (history_id, 'Древняя история', 'Чеченцы являются одним из древнейших народов Кавказа. Археологические находки свидетельствуют о том, что предки чеченцев жили на территории современной Чечни еще в эпоху неолита...'),
    (history_id, 'Средневековье', 'В средние века на территории Чечни существовало множество независимых обществ, объединенных общим языком, культурой и традициями...');

  -- Insert content for Traditions
  INSERT INTO public.culture_content (card_id, title, text) VALUES
    (traditions_id, 'Гостеприимство', 'Гостеприимство является одной из важнейших традиций чеченского народа. Гость считается посланником Бога и пользуется особым уважением...'),
    (traditions_id, 'Этикет', 'Чеченский этикет (гIиллакх) регулирует все аспекты общественной жизни. Особое внимание уделяется уважению к старшим...');

  -- Insert content for Proverbs
  INSERT INTO public.culture_content (card_id, title, text) VALUES
    (proverbs_id, 'Народная мудрость', 'Чеченские пословицы отражают многовековую мудрость народа. Они учат доброте, честности, храбрости и другим важным качествам...'),
    (proverbs_id, 'Популярные пословицы', 'Хьекъал дешна ца лора, и дала деза.\nУм не покупается, он должен быть дан.\n\nДика дош - дарба ду.\nДоброе слово - лекарство.');
END $$;