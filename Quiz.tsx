import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Trophy, BookOpen, ArrowRight, Sparkles, Star, GraduationCap, Brain, Lightbulb, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

// ... остальные интерфейсы и defaultLessonConfig остаются без изменений
interface LessonConfig {
  title: string;
  next: string;
  prev: string;
  category: string | string[];
}

const defaultLessonConfig: { [key: string]: LessonConfig } = {
  'basics': {
    title: 'Основы',
    next: 'greetings',
    prev: 'culture',
    category: ['Основы', 'Местоимения']
  },
  'greetings': {
    title: 'Приветствия',
    next: 'numbers',
    prev: 'basics',
    category: 'Приветствия'
  },
  'numbers': {
    title: 'Числа',
    next: 'calendar',
    prev: 'greetings',
    category: 'Числа'
  },
  'calendar': {
    title: 'Дни недели, месяцы и времена года',
    next: 'colors',
    prev: 'numbers',
    category: ['Дни недели', 'Месяцы', 'Времена года']
  },
  'colors': {
    title: 'Цвета',
    next: 'family',
    prev: 'calendar',
    category: 'Цвета'
  },
  'family': {
    title: 'Семья и родственники',
    next: 'questions',
    prev: 'colors',
    category: 'Семья'
  },
  'questions': {
    title: 'Вопросы и простые фразы',
    next: 'time',
    prev: 'family',
    category: 'Общие фразы'
  },
  'time': {
    title: 'Времена суток и часы',
    next: 'food',
    prev: 'questions',
    category: 'Время'
  },
  'food': {
    title: 'Еда и напитки',
    next: 'clothes',
    prev: 'time',
    category: ['Еда', 'Напитки']
  },
  'clothes': {
    title: 'Одежда',
    next: 'body',
    prev: 'food',
    category: 'Одежда'
  },
  'body': {
    title: 'Тело человека',
    next: 'animals',
    prev: 'clothes',
    category: 'Тело'
  },
  'animals': {
    title: 'Животные',
    next: 'home',
    prev: 'body',
    category: 'Животные'
  },
  'home': {
    title: 'Дом и быт',
    next: 'transport',
    prev: 'animals',
    category: 'Дом'
  },
  'transport': {
    title: 'Транспорт',
    next: 'weather',
    prev: 'home',
    category: 'Транспорт'
  },
  'weather': {
    title: 'Погода и природа',
    next: 'verbs',
    prev: 'transport',
    category: ['Погода', 'Природа']
  },
  'verbs': {
    title: 'Глаголы действия',
    next: 'grammar',
    prev: 'weather',
    category: 'Глаголы'
  },
  'grammar': {
    title: 'Местоимения и простая грамматика',
    next: 'shopping',
    prev: 'verbs',
    category: ['Грамматика', 'Местоимения']
  },
  'shopping': {
    title: 'Фразы для общения в магазине/кафе',
    next: 'emotions',
    prev: 'grammar',
    category: 'Общение'
  },
  'emotions': {
    title: 'Эмоции и чувства',
    next: 'dialogues',
    prev: 'shopping',
    category: 'Эмоции'
  },
  'dialogues': {
    title: 'Простые диалоги',
    next: 'culture',
    prev: 'emotions',
    category: 'Диалоги'
  },
  'culture': {
    title: 'Культура и традиции',
    next: 'basics',
    prev: 'dialogues',
    category: 'Культура'
  }
};

// LessonQuiz и PracticeQuiz остаются без изменений
const LessonQuiz = ({ lessonId, currentLesson, onComplete }) => {
  const navigate = useNavigate();
  const [words, setWords] = useState<QuizWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchWords();
  }, [lessonId]);

  const fetchWords = async () => {
    try {
      let query = supabase
        .from('dictionary_words')
        .select('russian, chechen');

      if (Array.isArray(currentLesson.category)) {
        query = query.or(
          currentLesson.category.map(cat => `category.ilike.%${cat}%`).join(',')
        );
      } else {
        query = query.ilike('category', `%${currentLesson.category}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const shuffledWords = [...(data || [])].sort(() => Math.random() - 0.5);
      const selectedWords = shuffledWords.slice(0, Math.min(20, shuffledWords.length));
      
      setWords(selectedWords);
      setCurrentWordIndex(0);
      setSelectedOption(null);
      setIsCorrect(null);
      setQuizCompleted(false);
      setCorrectAnswers(0);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const generateOptions = () => {
    if (!words[currentWordIndex]) return;

    const correctAnswer = words[currentWordIndex].chechen;
    const otherWords = words.filter((_, index) => index !== currentWordIndex);
    const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledWords.slice(0, 2).map(word => word.chechen);
    
    const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useEffect(() => {
    if (words.length > 0) {
      generateOptions();
    }
  }, [currentWordIndex, words]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const correct = option === words[currentWordIndex].chechen;
    setIsCorrect(correct);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setQuizCompleted(true);
        if (correct) {
          confetti({
            particleCount: 300,
            spread: 160,
            origin: { y: 0.6 }
          });
        }
        onComplete();
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentWordIndex(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsCorrect(null);
    fetchWords();
  };

  const goToNextLesson = () => {
    navigate(`/lesson/${currentLesson.next}`);
  };

  const renderNavigationButtons = () => (
    <div className="flex justify-center space-x-4">
      <button
        onClick={() => navigate(`/lesson/${lessonId}`)}
        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Вернуться к уроку
      </button>
      <button
        onClick={resetQuiz}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
      <button
        onClick={goToNextLesson}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        Следующий урок
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      {!quizCompleted ? (
        <>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Проверь себя: {currentLesson.title}
          </h2>
          
          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">Вопрос {currentWordIndex + 1} из {words.length}</span>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg mb-6 text-center">
              <p className="text-2xl font-semibold">{words[currentWordIndex]?.russian}</p>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !selectedOption && handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    selectedOption === option
                      ? isCorrect
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : selectedOption !== null && option === words[currentWordIndex].chechen
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } border`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-4 mb-8">
                <Trophy className="w-20 h-20 text-yellow-500" />
                <Star className="w-16 h-16 text-yellow-400" />
                <Sparkles className="w-20 h-20 text-yellow-500" />
              </div>
              <GraduationCap className="w-24 h-24 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Отличная работа!</h2>
              <p className="text-lg text-gray-600 mb-2">
                Вы правильно ответили на {correctAnswers} из {words.length} вопросов
              </p>
              <p className="text-gray-600">
                Продолжайте в том же духе! Вы отлично усваиваете материал.
              </p>
            </div>
          </div>
          {renderNavigationButtons()}
        </>
      )}
    </div>
  );
};

const PracticeQuiz = ({ lessonId, currentLesson, onComplete }) => {
  const navigate = useNavigate();
  const [words, setWords] = useState<QuizWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const isFirstCard = lessonId === 'basics';

  useEffect(() => {
    fetchWords();
  }, [lessonId]);

  const fetchWords = async () => {
    try {
      let query = supabase
        .from('dictionary_words')
        .select('russian, chechen');

      if (Array.isArray(currentLesson.category)) {
        query = query.or(
          currentLesson.category.map(cat => `category.ilike.%${cat}%`).join(',')
        );
      } else {
        query = query.ilike('category', `%${currentLesson.category}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const shuffledWords = [...(data || [])].sort(() => Math.random() - 0.5);
      const selectedWords = shuffledWords.slice(0, Math.min(20, shuffledWords.length));
      
      setWords(selectedWords);
      setCurrentWordIndex(0);
      setSelectedOption(null);
      setIsCorrect(null);
      setQuizCompleted(false);
      setCorrectAnswers(0);
    } catch (error) {
      console.error('Error fetching words:', error);
    }
  };

  const generateOptions = () => {
    if (!words[currentWordIndex]) return;

    const correctAnswer = words[currentWordIndex].chechen;
    const otherWords = words.filter((_, index) => index !== currentWordIndex);
    const shuffledWords = [...otherWords].sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledWords.slice(0, 2).map(word => word.chechen);
    
    const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useEffect(() => {
    if (words.length > 0) {
      generateOptions();
    }
  }, [currentWordIndex, words]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    const correct = option === words[currentWordIndex].chechen;
    setIsCorrect(correct);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      if (currentWordIndex < words.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setQuizCompleted(true);
        if (correct) {
          confetti({
            particleCount: 300,
            spread: 160,
            origin: { y: 0.6 }
          });
        }
        onComplete();
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentWordIndex(0);
    setCorrectAnswers(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setIsCorrect(null);
    fetchWords();
  };

  const goToPrevQuiz = () => {
    navigate(`/quiz/${currentLesson.prev}`, { state: { from: 'practice' } });
  };

  const renderNavigationButtons = () => (
    <div className="flex justify-center space-x-4">
      {!isFirstCard && (
        <button
          onClick={goToPrevQuiz}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Вернуться
        </button>
      )}
      <button
        onClick={resetQuiz}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Попробовать снова
      </button>
      <button
        onClick={() => navigate('/practice')}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        Далее
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      {!quizCompleted ? (
        <>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Проверь себя: {currentLesson.title}
          </h2>
          
          <div className="mb-8">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">Вопрос {currentWordIndex + 1} из {words.length}</span>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg mb-6 text-center">
              <p className="text-2xl font-semibold">{words[currentWordIndex]?.russian}</p>
            </div>

            <div className="space-y-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !selectedOption && handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    selectedOption === option
                      ? isCorrect
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : selectedOption !== null && option === words[currentWordIndex].chechen
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  } border`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-4 mb-8">
                <Trophy className="w-20 h-20 text-yellow-500" />
                <Star className="w-16 h-16 text-yellow-400" />
                <Sparkles className="w-20 h-20 text-yellow-500" />
              </div>
              <GraduationCap className="w-24 h-24 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Отличная работа!</h2>
              <p className="text-lg text-gray-600 mb-2">
                Вы правильно ответили на {correctAnswers} из {words.length} вопросов
              </p>
              <p className="text-gray-600">
                Продолжайте в том же духе! Вы отлично усваиваете материал.
              </p>
            </div>
          </div>
          {renderNavigationButtons()}
        </>
      )}
    </div>
  );
};
export function Quiz() {
  const { lessonId = 'basics' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState<LessonConfig | null>(null);

  const isFromPractice = location.pathname.includes('/quiz/') && location.state?.from === 'practice';

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      if (defaultLessonConfig[lessonId]) {
        setCurrentLesson(defaultLessonConfig[lessonId]);
        setLoading(false);
        return;
      }

      const { data: lessonData, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) throw error;

      if (lessonData) {
        const customLessonConfig: LessonConfig = {
          title: lessonData.title,
          next: lessonId,
          prev: lessonId,
          category: lessonData.title
        };
        setCurrentLesson(customLessonConfig);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      navigate('/learn');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Урок не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate(isFromPractice ? '/practice' : `/lesson/${lessonId}`)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-2xl font-bold">HABAR</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {isFromPractice ? (
          <PracticeQuiz
            lessonId={lessonId}
            currentLesson={currentLesson}
            onComplete={handleQuizComplete}
          />
        ) : (
          <LessonQuiz
            lessonId={lessonId}
            currentLesson={currentLesson}
            onComplete={handleQuizComplete}
          />
        )}
      </main>
    </div>
  );
}
