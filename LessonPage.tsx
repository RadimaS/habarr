import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Volume2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AlphabetLetter {
  id: string;
  letter: string;
  audio_url: string;
  order: number;
}

interface Pronoun {
  id: string;
  pronoun: string;
  audio_url: string;
}

interface Word {
  id: string;
  chechen: string;
  russian: string;
  audio_url?: string;
}

interface Greeting {
  id: string;
  phrase: string;
  audio_url: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface NumberAudio {
  id: string;
  number: string;
  audio_url: string;
}

const DEFAULT_LESSONS = ['basics', 'greetings', 'numbers'];

const LESSON_CATEGORIES = {
  'colors': { title: 'Цвета', category: 'Цвета' },
  'family': { title: 'Семья и родственники', category: 'Семья' },
  'food': { title: 'Еда и напитки', category: ['Еда', 'Напитки'] },
  'animals': { title: 'Животные', category: 'Животные' },
  'weather': { title: 'Погода и природа', category: ['Погода', 'Природа'] },
  'clothes': { title: 'Одежда', category: 'Одежда' },
  'body': { title: 'Тело человека', category: 'Тело' },
  'home': { title: 'Дом и быт', category: 'Дом' },
  'transport': { title: 'Транспорт', category: 'Транспорт' },
  'verbs': { title: 'Глаголы действия', category: 'Глаголы' },
  'grammar': { title: 'Местоимения и простая грамматика', category: ['Грамматика', 'Местоимения'] },
  'shopping': { title: 'Фразы для общения в магазине/кафе', category: 'Общение' },
  'emotions': { title: 'Эмоции и чувства', category: 'Эмоции' },
  'dialogues': { title: 'Простые диалоги', category: 'Диалоги' },
  'calendar': { title: 'Дни недели, месяцы и времена года', category: ['Дни недели', 'Месяцы', 'Времена года'] },
  'questions': { title: 'Вопросы и простые фразы', category: 'Общие фразы' },
  'time': { title: 'Времена суток и часы', category: 'Время' }
};

export function LessonPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const [words, setWords] = useState<Word[]>([]);
  const [letters, setLetters] = useState<AlphabetLetter[]>([]);
  const [pronouns, setPronouns] = useState<Pronoun[]>([]);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [numbers, setNumbers] = useState<NumberAudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (lessonId) {
      fetchLessonData();
    }
  }, [lessonId, currentPage]);

  const fetchLessonData = async () => {
    try {
      if (!lessonId) {
        navigate('/learn');
        return;
      }

      // Handle special lessons
      if (DEFAULT_LESSONS.includes(lessonId)) {
        switch (lessonId) {
          case 'basics':
            if (currentPage === 1) {
              await fetchAlphabet();
            } else {
              await fetchPronouns();
            }
            break;
          case 'greetings':
            await fetchGreetings();
            break;
          case 'numbers':
            await fetchNumbers();
            break;
        }
        setLoading(false);
        return;
      }

      // Handle predefined category lessons
      if (LESSON_CATEGORIES[lessonId]) {
        const lessonInfo = LESSON_CATEGORIES[lessonId];
        setCurrentLesson({
          id: lessonId,
          title: lessonInfo.title,
          description: `Изучите слова и фразы на тему "${lessonInfo.title}"`,
          color: 'bg-indigo-500'
        });

        let query = supabase
          .from('dictionary_words')
          .select('*');

        // Handle multiple categories
        if (Array.isArray(lessonInfo.category)) {
          query = query.or(
            lessonInfo.category.map(cat => `category.ilike.%${cat}%`).join(',')
          );
        } else {
          query = query.ilike('category', `%${lessonInfo.category}%`);
        }

        const { data: wordsData, error: wordsError } = await query;

        if (wordsError) throw wordsError;
        setWords(wordsData || []);
        setLoading(false);
        return;
      }

      // Handle custom lessons from database
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) {
        console.error('Lesson error:', lessonError);
        toast.error('Урок не найден');
        navigate('/learn');
        return;
      }

      setCurrentLesson(lessonData);

      const { data: wordsData, error: wordsError } = await supabase
        .from('dictionary_words')
        .select('*')
        .ilike('category', `%${lessonData.title}%`);

      if (wordsError) throw wordsError;
      setWords(wordsData || []);

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      toast.error('Ошибка при загрузке урока');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlphabet = async () => {
    try {
      const { data, error } = await supabase
        .from('alphabet_audio')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      setLetters(data || []);
    } catch (error) {
      console.error('Error fetching alphabet:', error);
      toast.error('Ошибка при загрузке алфавита');
    }
  };

  const fetchPronouns = async () => {
    try {
      const { data: pronounsData, error: pronounsError } = await supabase
        .from('pronouns_audio')
        .select('*');

      if (pronounsError) throw pronounsError;

      setPronouns(pronounsData || []);
    } catch (error) {
      console.error('Error fetching pronouns:', error);
      toast.error('Ошибка при загрузке местоимений');
    }
  };

  const fetchGreetings = async () => {
    try {
      const { data: greetingsData, error: greetingsError } = await supabase
        .from('greetings_audio')
        .select('*');

      if (greetingsError) throw greetingsError;

      setGreetings(greetingsData || []);

      const { data: wordsData, error: wordsError } = await supabase
        .from('dictionary_words')
        .select('*')
        .eq('category', 'Приветствия');

      if (wordsError) throw wordsError;

      const wordsWithAudio = wordsData.map(word => {
        const greeting = greetingsData?.find(g => g.phrase === word.chechen);
        return {
          ...word,
          audio_url: greeting?.audio_url
        };
      });

      setWords(wordsWithAudio);
    } catch (error) {
      console.error('Error fetching greetings:', error);
      toast.error('Ошибка при загрузке приветствий');
    }
  };

  const fetchNumbers = async () => {
    try {
      const { data: numbersData, error: numbersError } = await supabase
        .from('numbers_audio')
        .select('*')
        .order('number');

      if (numbersError) throw numbersError;

      setNumbers(numbersData || []);

      const { data: wordsData, error: wordsError } = await supabase
        .from('dictionary_words')
        .select('*')
        .eq('category', 'Числа');

      if (wordsError) throw wordsError;

      const wordsWithAudio = wordsData.map(word => {
        const number = numbersData?.find(n => n.number === word.chechen);
        return {
          ...word,
          audio_url: number?.audio_url
        };
      });

      setWords(wordsWithAudio);
    } catch (error) {
      console.error('Error fetching numbers:', error);
      toast.error('Ошибка при загрузке чисел');
    }
  };

  const playAudio = async (audioUrl: string) => {
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Ошибка воспроизведения аудио');
    }
  };

  const renderAlphabet = () => {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">Чеченский алфавит</h2>
            <p className="text-white/90 text-lg mb-8">
              Изучите основы чеченского языка, начиная с алфавита. Нажмите на значок звука, чтобы услышать произношение.
            </p>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
              <Volume2 className="w-5 h-5" />
              <span>Доступно аудио произношение</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {letters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white rounded-xl p-6 flex flex-col items-center justify-between hover:shadow-lg transition-shadow relative group"
            >
              <div className="text-3xl font-bold text-indigo-600 mb-4">{letter.letter}</div>
              <button
                onClick={() => playAudio(letter.audio_url)}
                className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -z-10" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPronouns = () => {
    const pronounExamples = {
      'Со': { transcription: '[so]', example: 'Со вог1у (Я иду)' },
      'Хьо': { transcription: '[ho]', example: 'Хьо мичахь ю? (Ты где?)' },
      'Иза': { transcription: '[iza]', example: 'Иза ц1ахь ву (Он дома)' },
      'Тхо': { transcription: '[tho]', example: 'Тхо дог1уш ду (Мы идём)' },
      'Шу': { transcription: '[shu]', example: 'Шу муьлш ду? (Вы кто?)' },
      'Уьш': { transcription: '[uiesh]', example: 'Уьш схьакхечна (Они приехали)' }
    };

    const russianPronouns = {
      'Со': 'Я',
      'Хьо': 'Ты',
      'Иза': 'Он/Она',
      'Тхо': 'Мы',
      'Шу': 'Вы',
      'Уьш': 'Они'
    };

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">Личные местоимения</h2>
            <p className="text-white/90 text-lg mb-8">
              Изучите личные местоимения чеченского языка. Нажмите на значок звука, чтобы услышать произношение.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Русский
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Чеченский
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Транскрипция
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пример
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Произношение
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pronouns.map((pronoun) => (
                <tr key={pronoun.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {russianPronouns[pronoun.pronoun]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pronoun.pronoun}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pronounExamples[pronoun.pronoun]?.transcription}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pronounExamples[pronoun.pronoun]?.example}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => playAudio(pronoun.audio_url)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderWords = () => {
    let title = 'Слова и фразы';
    let description = 'Изучите новые слова и фразы';

    if (currentLesson) {
      title = currentLesson.title;
      description = currentLesson.description;
    } else if (lessonId === 'greetings') {
      title = 'Приветствия и фразы';
      description = 'Изучите основные приветствия и фразы на чеченском языке';
    } else if (lessonId === 'numbers') {
      title = 'Числа';
      description = 'Изучите числа на чеченском языке';
    }
    
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-3xl p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
            <p className="text-white/90 text-lg mb-8">{description}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Чеченский
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Русский
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Произношение
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {words.map((word) => (
                <tr key={word.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {word.chechen}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {word.russian}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {word.audio_url ? (
                      <button
                        onClick={() => playAudio(word.audio_url!)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-gray-400">Нет аудио</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    if (lessonId !== 'basics') return null;

    return (
      <div className="flex justify-center space-x-4 mt-8">
        {currentPage === 2 && (
          <button
            onClick={() => setCurrentPage(1)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Алфавит
          </button>
        )}
        {currentPage === 1 && (
          <button
            onClick={() => setCurrentPage(2)}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            Местоимения
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/learn')}
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <>
            {lessonId === 'basics' ? (
              currentPage === 1 ? renderAlphabet() : renderPronouns()
            ) : (
              renderWords()
            )}

            {renderNavigation()}

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => navigate(`/quiz/${lessonId}`)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                Проверить знания
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}