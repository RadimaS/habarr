import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Lesson {
  id: string;
  title: string;
  description: string;
  color: string;
}

export function Learn() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const defaultLessons: Lesson[] = [
    { id: 'basics', title: 'ОСНОВЫ', description: 'Начните свое путешествие в изучении чеченского языка с базовых концепций.', color: 'bg-orange-400' },
    { id: 'greetings', title: 'ПРИВЕТСТВИЯ', description: 'Изучите основные приветствия и фразы для повседневного общения.', color: 'bg-pink-400' },
    { id: 'numbers', title: 'ЧИСЛА', description: 'Научитесь считать и использовать числа в чеченском языке.', color: 'bg-blue-400' },
    { id: 'calendar', title: 'ДНИ НЕДЕЛИ, МЕСЯЦЫ И ВРЕМЕНА ГОДА', description: 'Изучите названия дней недели, месяцев и времен года.', color: 'bg-purple-400' },
    { id: 'colors', title: 'ЦВЕТА', description: 'Выучите основные цвета и их использование.', color: 'bg-red-400' },
    { id: 'family', title: 'СЕМЬЯ И РОДСТВЕННИКИ', description: 'Узнайте, как называть членов семьи и родственников.', color: 'bg-green-400' },
    { id: 'questions', title: 'ВОПРОСЫ И ПРОСТЫЕ ФРАЗЫ', description: 'Научитесь задавать вопросы и строить простые фразы.', color: 'bg-yellow-400' },
    { id: 'time', title: 'ВРЕМЕНА СУТОК И ЧАСЫ', description: 'Изучите, как говорить о времени.', color: 'bg-indigo-400' },
    { id: 'food', title: 'ЕДА И НАПИТКИ', description: 'Выучите названия продуктов и напитков.', color: 'bg-rose-400' },
    { id: 'clothes', title: 'ОДЕЖДА', description: 'Познакомьтесь с названиями предметов одежды.', color: 'bg-cyan-400' },
    { id: 'body', title: 'ТЕЛО ЧЕЛОВЕКА', description: 'Изучите названия частей тела.', color: 'bg-amber-400' },
    { id: 'animals', title: 'ЖИВОТНЫЕ', description: 'Выучите названия животных.', color: 'bg-lime-400' },
    { id: 'home', title: 'ДОМ И БЫТ', description: 'Узнайте слова, связанные с домом и бытом.', color: 'bg-teal-400' },
    { id: 'transport', title: 'ТРАНСПОРТ', description: 'Изучите виды транспорта.', color: 'bg-sky-400' },
    { id: 'weather', title: 'ПОГОДА И ПРИРОДА', description: 'Научитесь говорить о погоде и природе.', color: 'bg-emerald-400' },
    { id: 'verbs', title: 'ГЛАГОЛЫ ДЕЙСТВИЯ', description: 'Изучите основные глаголы действия.', color: 'bg-fuchsia-400' },
    { id: 'grammar', title: 'МЕСТОИМЕНИЯ И ПРОСТАЯ ГРАММАТИКА', description: 'Познакомьтесь с основами грамматики.', color: 'bg-violet-400' },
    { id: 'shopping', title: 'ФРАЗЫ ДЛЯ ОБЩЕНИЯ В МАГАЗИНЕ/КАФЕ', description: 'Выучите полезные фразы для общения в общественных местах.', color: 'bg-orange-400' },
    { id: 'emotions', title: 'ЭМОЦИИ И ЧУВСТВА', description: 'Научитесь выражать эмоции и чувства.', color: 'bg-pink-400' },
    { id: 'dialogues', title: 'ПРОСТЫЕ ДИАЛОГИ', description: 'Практикуйте диалоги из повседневной жизни.', color: 'bg-blue-400' }
  ];

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data: dbLessons, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const customLessons = dbLessons?.filter(
        dbLesson => !defaultLessons.some(defaultLesson => defaultLesson.id === dbLesson.id)
      ) || [];

      setLessons([...defaultLessons, ...customLessons]);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-2xl font-bold">HABAR</span>
              </button>
              <nav className="hidden md:flex space-x-8">
                <button onClick={() => navigate('/dictionary')} className="text-gray-500 hover:text-gray-700">Словарь</button>
                <button onClick={() => navigate('/learn')} className="text-gray-900 hover:text-gray-700">Уроки</button>
                <button onClick={() => navigate('/practice')} className="text-gray-500 hover:text-gray-700">Практика</button>
                <button onClick={() => navigate('/culture')} className="text-gray-500 hover:text-gray-700">Культура</button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3">
            <BookOpen className="w-8 h-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-gray-800">Уроки чеченского языка</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
                className={`h-64 relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 ${lesson.color}`}
              >
                <div className="p-6 flex flex-col h-full">
                  <h2 className="text-2xl font-bold text-white mb-4">{lesson.title}</h2>
                  <p className="text-white/90 text-sm mb-4 flex-grow">{lesson.description}</p>
                  <button 
                    className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors w-full mt-auto backdrop-blur-sm"
                  >
                    Начать урок
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
