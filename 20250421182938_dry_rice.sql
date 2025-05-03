/*
  # Add culture content tables

  1. New Tables
    - `culture_cards`
      - `id` (text, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `icon` (text, not null)
      - `color` (text, not null)
      - `created_at` (timestamp with time zone)

    - `culture_content`
      - `id` (text, primary key)
      - `card_id` (text, references culture_cards)
      - `title` (text, not null)
      - `text` (text, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create culture_cards table
CREATE TABLE IF NOT EXISTS public.culture_cards (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create culture_content table
CREATE TABLE IF NOT EXISTS public.culture_content (
  id text PRIMARY KEY,
  card_id text REFERENCES public.culture_cards(id) ON DELETE CASCADE,
  title text NOT NULL,
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.culture_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Enable read access for all users"
  ON public.culture_cards
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable read access for all users"
  ON public.culture_content
  FOR SELECT
  TO public
  USING (true);

-- Insert initial data
INSERT INTO public.culture_cards (id, title, description, icon, color) VALUES
  ('traditions', 'КУЛЬТУРА И ОБЫЧАИ', 'Узнайте о богатой культуре и традициях чеченского народа', 'BookOpen', 'bg-emerald-400'),
  ('tales', 'СКАЗКИ И ЛЕГЕНДЫ', 'Погрузитесь в мир чеченских сказок и легенд', 'Scroll', 'bg-purple-400'),
  ('proverbs', 'ПОСЛОВИЦЫ И ПОГОВОРКИ', 'Изучите мудрость, заключенную в чеченских пословицах', 'MessageSquareQuote', 'bg-amber-400');

-- Insert traditions content
INSERT INTO public.culture_content (id, card_id, title, text) VALUES
  ('hospitality', 'traditions', 'Гостеприимство (Хьошалла)', 'Гостеприимство (хьошалла) является одной из важнейших традиций чеченского народа. В чеченской культуре гость считается посланником Всевышнего и пользуется особым почетом.

Основные правила гостеприимства:

1. Прием гостя
- Гостя встречают с улыбкой и добрыми словами
- Хозяин дома первым приветствует гостя
- Гостю предлагают самое удобное место в доме

2. Угощение
- Для гостя готовят лучшие блюда
- Первым начинает трапезу гость
- Хозяин следит, чтобы у гостя всегда было все необходимое

3. Защита и безопасность
- Хозяин несет полную ответственность за безопасность гостя
- Защита гостя считается священным долгом
- Гость находится под защитой всего тейпа

4. Проводы
- Гостя провожают со всеми почестями
- Приглашают посетить дом снова
- Хозяин может проводить гостя часть пути

Хьошалла учит:
- Щедрости и великодушию
- Уважению к людям независимо от их происхождения
- Умению создавать теплую и доброжелательную атмосферу
- Ответственности за благополучие других'),
  ('respect', 'traditions', 'Уважение к старшим (Яхь)', 'Уважение к старшим (яхь) - фундаментальный принцип чеченского общества, который передается из поколения в поколение.

Основные правила проявления уважения:

1. В общении
- Младшие не перебивают старших
- При входе старшего все встают
- Обращение к старшим только на "Вы"
- Внимательное слушание советов старших

2. В поведении
- Сдержанность в присутствии старших
- Готовность оказать помощь
- Уступать дорогу и место
- Не проходить перед старшими

3. В семье
- Особое почитание родителей
- Забота о старших родственниках
- Следование советам старших
- Помощь в домашних делах

4. В обществе
- Учет мнения старейшин
- Участие старших в важных решениях
- Передача традиций молодому поколению
- Разрешение споров с участием старших

Яхь воспитывает:
- Почтительность и скромность
- Мудрость в принятии решений
- Сохранение и передачу традиций
- Уважение к опыту и знаниям'),
  ('honor', 'traditions', 'Честь и достоинство (Сий)', 'Честь и достоинство (сий) - основополагающие понятия чеченской культуры, определяющие поведение человека в обществе.

Основные составляющие чести:

1. Личные качества
- Храбрость и мужество
- Верность данному слову
- Честность и правдивость
- Скромность и достоинство

2. Отношения с людьми
- Уважение к другим
- Защита слабых
- Помощь нуждающимся
- Справедливость в решениях

3. Семейная честь
- Защита семьи
- Забота о репутации
- Достойное воспитание детей
- Уважение к родителям

4. Общественный долг
- Служение народу
- Защита родины
- Сохранение традиций
- Участие в общественной жизни

Сий учит:
- Достойному поведению
- Ответственности за свои поступки
- Защите справедливости
- Верности принципам'),
  ('family', 'traditions', 'Семейные ценности (Доьзал)', 'Семейные ценности (доьзал) занимают центральное место в чеченской культуре, определяя основы общественного устройства.

Основные аспекты семейных ценностей:

1. Роли в семье
- Отец как глава семьи
- Мать как хранительница очага
- Уважение к старшим
- Забота о младших

2. Воспитание детей
- Передача традиций
- Обучение родному языку
- Привитие моральных ценностей
- Физическое развитие

3. Родственные связи
- Поддержка родственников
- Участие в семейных событиях
- Взаимопомощь
- Сохранение родословной

4. Семейные традиции
- Совместные трапезы
- Семейные советы
- Празднование важных событий
- Почитание предков

Доьзал учит:
- Ответственности за семью
- Уважению к родителям
- Заботе о близких
- Сохранению традиций');

-- Insert tales content
INSERT INTO public.culture_content (id, card_id, title, text) VALUES
  ('nart', 'tales', 'Легенда о Нарт-Бийсаре и Сером Волке', 'Легенда о Нарт-Бийсаре и Сером Волке
(из устного фольклора тайпа Орстхой)

[Previous content remains unchanged...]'),
  ('towers', 'tales', 'Легенда о чеченских башнях', 'Легенда о чеченских башнях
[Previous content remains unchanged...]'),
  ('prometheus', 'tales', 'Пхьармат', 'Хьуна дала дика дийриг, диканца хьо дукха вахарг
[Previous content remains unchanged...]');

-- Insert proverbs content
INSERT INTO public.culture_content (id, card_id, title, text) VALUES
  ('honor-proverbs', 'proverbs', 'О чести и достоинстве', 'Сий доцу стаг вала веза. (Человек без чести должен умереть)
[Previous content remains unchanged...]'),
  ('work-proverbs', 'proverbs', 'О труде и усердии', 'Къа ца хьегна, ирс ца карадо. (Без труда счастья не найдешь)
[Previous content remains unchanged...]'),
  ('wisdom-proverbs', 'proverbs', 'О мудрости и знаниях', 'Дешна стаг вац вуон, 1илма доцу стаг ву вуон. (Не тот плох, кто учился, а тот, кто знаний не имеет)
[Previous content remains unchanged...]'),
  ('friendship-proverbs', 'proverbs', 'О дружбе и верности', 'Доттаг1чун доттаг1а - доттаг1а ву. (Друг друга - тоже друг)
[Previous content remains unchanged...]'),
  ('family-proverbs', 'proverbs', 'О семье и воспитании', '1аж 1ожана гена ца бужу. (Яблоко от яблони недалеко падает)
[Previous content remains unchanged...]'),
  ('life-proverbs', 'proverbs', 'О жизни и судьбе', 'Денна ца яхьа хиэ чалх. (Не каждый день река ворох приносит)
[Previous content remains unchanged...]');