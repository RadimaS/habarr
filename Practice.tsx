import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface QuizCard {
  id: string;
  title: string;
  color: string;
}

export function Practice() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [quizCards, setQuizCards] = useState<QuizCard[]>([]);

  const defaultCards: QuizCard[] = [
    { id: 'basics', title: 'ОСНОВЫ', color: 'bg-orange-400' },
    { id: 'greetings', title: 'ПРИВЕТСТВИЯ', color: 'bg-pink-400' },
    { id: 'numbers', title: 'ЧИСЛА', color: 'bg-blue-400' },
    { id: 'calendar', title: 'ДНИ НЕДЕЛИ, МЕСЯЦЫ И ВРЕМЕНА ГОДА', color: 'bg-purple-400' },
    { id: 'colors', title: 'ЦВЕТА', color: 'bg-red-400' },
    { id: 'family', title: 'СЕМЬЯ И РОДСТВЕННИКИ', color: 'bg-green-400' },
    { id: 'questions', title: 'ВОПРОСЫ И ПРОСТЫЕ ФРАЗЫ', color: 'bg-yellow-400' },
    { id: 'time', title: 'ВРЕМЕНА СУТОК И ЧАСЫ', color: 'bg-indigo-400' },
    { id: 'food', title: 'ЕДА И НАПИТКИ', color: 'bg-rose-400' },
    { id: 'clothes', title: 'ОДЕЖДА', color: 'bg-cyan-400' },
    { id: 'body', title: 'ТЕЛО ЧЕЛОВЕКА', color: 'bg-amber-400' },
    { id: 'animals', title: 'ЖИВОТНЫЕ', color: 'bg-lime-400' },
    { id: 'home', title: 'ДОМ И БЫТ', color: 'bg-teal-400' },
    { id: 'transport', title: 'ТРАНСПОРТ', color: 'bg-sky-400' },
    { id: 'weather', title: 'ПОГОДА И ПРИРОДА', color: 'bg-emerald-400' },
    { id: 'verbs', title: 'ГЛАГОЛЫ ДЕЙСТВИЯ', color: 'bg-fuchsia-400' },
    { id: 'grammar', title: 'МЕСТОИМЕНИЯ И ПРОСТАЯ ГРАММАТИКА', color: 'bg-violet-400' },
    { id: 'shopping', title: 'ФРАЗЫ ДЛЯ ОБЩЕНИЯ В МАГАЗИНЕ/КАФЕ', color: 'bg-orange-400' },
    { id: 'emotions', title: 'ЭМОЦИИ И ЧУВСТВА', color: 'bg-pink-400' },
    { id: 'dialogues', title: 'ПРОСТЫЕ ДИАЛОГИ', color: 'bg-blue-400' }
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
        dbLesson => !defaultCards.some(defaultCard => defaultCard.id === dbLesson.id)
      ).map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        color: lesson.color
      })) || [];

      setQuizCards([...defaultCards, ...customLessons]);
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
                <button onClick={() => navigate('/learn')} className="text-gray-500 hover:text-gray-700">Уроки</button>
                <button onClick={() => navigate('/practice')} className="text-gray-900 hover:text-gray-700">Практика</button>
                <button onClick={() => navigate('/culture')} className="text-gray-500 hover:text-gray-700">Культура</button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizCards.map((card) => (
              <div
                key={card.id}
                onClick={() => navigate(`/quiz/${card.id}`, { state: { from: 'practice' } })}
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200 h-48 ${card.color}`}
              >
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <h3 className="text-2xl font-bold text-white text-center">
                    {card.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
