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

-- Add RLS policies with unique names
CREATE POLICY "culture_cards_read_policy" ON public.culture_cards
  FOR SELECT TO public USING (true);

CREATE POLICY "culture_content_read_policy" ON public.culture_content
  FOR SELECT TO public USING (true);

-- Insert sample data
INSERT INTO public.culture_cards (title, description, icon, color, created_at) VALUES
  ('История', 'Узнайте об истории чеченского народа, его традициях и обычаях', 'BookOpen', 'bg-gradient-to-br from-blue-500 to-blue-700', now()),
  ('Традиции', 'Познакомьтесь с богатыми традициями и обычаями чеченского народа', 'Scroll', 'bg-gradient-to-br from-green-500 to-green-700', now()),
  ('Пословицы', 'Изучите мудрость чеченского народа через пословицы и поговорки', 'MessageSquareQuote', 'bg-gradient-to-br from-purple-500 to-purple-700', now());

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
    (history_id, 'Древняя история', 'Чеченцы являются одним из древнейших народов Кавказа. Археологические находки свидетельствуют о том, что предки современных чеченцев жили на территории современной Чечни еще в эпоху неолита.

История чеченского народа тесно связана с Кавказскими горами, которые веками служили естественной защитой и определяли образ жизни народа.'),
    (history_id, 'Средневековье', 'В средние века на территории современной Чечни существовало множество независимых обществ, объединенных общим языком, культурой и традициями.

Чеченское общество было организовано по принципу тейпов - родовых объединений, которые играли важную роль в социальной и политической жизни народа.');

  -- Insert content for Traditions
  INSERT INTO public.culture_content (card_id, title, text) VALUES
    (traditions_id, 'Гостеприимство', 'Гостеприимство является одной из важнейших традиций чеченского народа. Гость считается посланником Всевышнего и пользуется особым уважением.

Хозяин дома обязан обеспечить безопасность гостя и создать для него максимально комфортные условия пребывания.'),
    (traditions_id, 'Уважение к старшим', 'В чеченской культуре особое место занимает уважение к старшим. Молодые люди должны проявлять почтение к старшим, прислушиваться к их советам и мудрости.

Эта традиция помогает сохранять преемственность поколений и передавать культурное наследие.');

  -- Insert content for Proverbs
  INSERT INTO public.culture_content (card_id, title, text) VALUES
    (proverbs_id, 'Мудрые изречения', 'Нохчийн кица:
"Дика дош - дашо сан"
(Доброе слово - золотая монета)

"Хьекъал эцалур дац, ахча дала а"
(Ум за деньги не купишь)'),
    (proverbs_id, 'Поговорки о труде', 'Нохчийн кица:
"Къахьегначунна - рицкъа"
(Кто трудится - тому достаток)

"Къинхьегам - ирсан некъ бу"
(Труд - путь к счастью)');
END $$;