import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface DictionaryWord {
  id: string;
  chechen: string;
  russian: string;
  category: string;
}

export function Dictionary() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDictionaryWords();
  }, []);

  const fetchDictionaryWords = async () => {
    try {
      const { data, error } = await supabase
        .from('dictionary_words')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;

      setWords(data || []);
    } catch (error) {
      console.error('Error fetching dictionary words:', error);
      toast.error('Ошибка при загрузке словаря');
    } finally {
      setLoading(false);
    }
  };

  const filteredWords = words.filter(word => 
    word.chechen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.russian.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (word.category && word.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                <button onClick={() => navigate('/dictionary')} className="text-gray-900 hover:text-gray-700">Словарь</button>
                <button onClick={() => navigate('/learn')} className="text-gray-500 hover:text-gray-700">Уроки</button>
                <button onClick={() => navigate('/practice')} className="text-gray-500 hover:text-gray-700">Практика</button>
                <button onClick={() => navigate('/culture')} className="text-gray-500 hover:text-gray-700">Культура</button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Поиск слов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Чеченский
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Русский
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredWords.map((word) => (
                  <tr key={word.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{word.chechen}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{word.russian}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{word.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
