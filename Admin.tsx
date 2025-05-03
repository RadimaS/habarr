import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Loader2, Volume2, Upload, Search, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Word {
  id: string;
  chechen: string;
  russian: string;
  category: string;
  audio_url?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  color: string;
}

const COLORS = [
  'bg-orange-400',
  'bg-pink-400',
  'bg-blue-400',
  'bg-purple-400',
  'bg-red-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-indigo-400',
  'bg-rose-400',
  'bg-cyan-400',
  'bg-amber-400',
  'bg-lime-400',
  'bg-teal-400',
  'bg-sky-400',
  'bg-emerald-400',
  'bg-fuchsia-400',
  'bg-violet-400'
];

export function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState<Word[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'words' | 'lessons'>('words');
  const [newWord, setNewWord] = useState<Partial<Word>>({
    chechen: '',
    russian: '',
    category: '',
    audio_url: ''
  });
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    color: COLORS[0]
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (!session?.user) {
          toast.error('Необходимо войти в систему');
          navigate('/');
          return;
        }

        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        
        if (session.user.email !== adminEmail) {
          toast.error('Доступ запрещен. Только администратор может просматривать эту страницу.');
          navigate('/');
          return;
        }

        setIsAuthenticated(true);
        await Promise.all([fetchWords(), fetchLessons()]);
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Ошибка аутентификации');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchWords = async () => {
    try {
      const { data, error } = await supabase
        .from('dictionary_words')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWords(data || []);
    } catch (error) {
      console.error('Error fetching words:', error);
      toast.error('Ошибка при загрузке слов');
    }
  };

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Ошибка при загрузке уроков');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const uploadAudio = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `audio/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading audio:', error);
      throw new Error('Ошибка при загрузке аудио');
    }
  };

  const handleSubmitWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!newWord.chechen || !newWord.russian || !newWord.category) {
        throw new Error('Заполните обязательные поля');
      }

      let audioUrl = newWord.audio_url;

      if (audioFile) {
        audioUrl = await uploadAudio(audioFile);
      }

      const { error } = await supabase
        .from('dictionary_words')
        .insert([{
          chechen: newWord.chechen,
          russian: newWord.russian,
          category: newWord.category,
          audio_url: audioUrl
        }]);

      if (error) throw error;

      toast.success('Слово успешно добавлено');
      setNewWord({ chechen: '', russian: '', category: '', audio_url: '' });
      setAudioFile(null);
      fetchWords();
    } catch (error) {
      console.error('Error adding word:', error);
      toast.error(error.message || 'Ошибка при добавлении слова');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!newLesson.title || !newLesson.description || !newLesson.color) {
        throw new Error('Заполните все поля');
      }

      const { error } = await supabase
        .from('lessons')
        .insert([{
          title: newLesson.title,
          description: newLesson.description,
          color: newLesson.color
        }]);

      if (error) throw error;

      toast.success('Урок успешно добавлен');
      setNewLesson({ title: '', description: '', color: COLORS[0] });
      fetchLessons();
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error(error.message || 'Ошибка при добавлении урока');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteWord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dictionary_words')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Слово успешно удалено');
      fetchWords();
    } catch (error) {
      console.error('Error deleting word:', error);
      toast.error('Ошибка при удалении слова');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Урок успешно удален');
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Ошибка при удалении урока');
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

  const filteredWords = words.filter(word => 
    word.chechen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.russian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Доступ запрещен</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-2xl font-bold">HABAR</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex space-x-4">
          <button
            onClick={() => setActiveTab('words')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'words'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Словарь
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'lessons'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Уроки
          </button>
        </div>

        {activeTab === 'words' ? (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Добавить новое слово</h2>
              <form onSubmit={handleSubmitWord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Слово на чеченском *
                    </label>
                    <input
                      type="text"
                      value={newWord.chechen}
                      onChange={(e) => setNewWord({ ...newWord, chechen: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Перевод на русский *
                    </label>
                    <input
                      type="text"
                      value={newWord.russian}
                      onChange={(e) => setNewWord({ ...newWord, russian: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Категория *
                    </label>
                    <input
                      type="text"
                      value={newWord.category}
                      onChange={(e) => setNewWord({ ...newWord, category: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Аудио произношение
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Добавить слово
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center mb-6">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Поиск слов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="overflow-x-auto">
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
                        Категория
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Аудио
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Действия
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWords.map((word) => (
                      <tr key={word.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {word.chechen}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {word.russian}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {word.category}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handleDeleteWord(word.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Добавить новый урок</h2>
              <form onSubmit={handleSubmitLesson} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Название урока *
                  </label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание *
                  </label>
                  <textarea
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цвет карточки *
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewLesson({ ...newLesson, color })}
                        className={`w-8 h-8 rounded-full ${color} ${
                          newLesson.color === color ? 'ring-2 ring-offset-2 ring-gray-900' : ''
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Добавить урок
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`${lesson.color} rounded-xl p-6 relative group`}
                >
                  <button
                    onClick={() => handleDeleteLesson(lesson.id)}
                    className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <BookOpen className="w-8 h-8 text-white mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">{lesson.title}</h3>
                  <p className="text-white/90">{lesson.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}