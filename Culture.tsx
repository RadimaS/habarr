import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Scroll, MessageSquareQuote, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CultureCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  content?: {
    id: string;
    title: string;
    text: string;
  }[];
}

const iconMap = {
  'BookOpen': BookOpen,
  'Scroll': Scroll,
  'MessageSquareQuote': MessageSquareQuote
};

export function Culture() {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<CultureCard | null>(null);
  const [selectedContent, setSelectedContent] = useState<{ title: string; text: string } | null>(null);
  const [cultureCards, setCultureCards] = useState<CultureCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCultureData();
  }, []);

  const fetchCultureData = async () => {
    try {
      // Fetch cards
      const { data: cards, error: cardsError } = await supabase
        .from('culture_cards')
        .select('*')
        .order('created_at');

      if (cardsError) throw cardsError;

      // Fetch content for each card
      const cardsWithContent = await Promise.all(
        cards.map(async (card) => {
          const { data: content, error: contentError } = await supabase
            .from('culture_content')
            .select('*')
            .eq('card_id', card.id)
            .order('created_at');

          if (contentError) throw contentError;

          return {
            ...card,
            content
          };
        })
      );

      setCultureCards(cardsWithContent);
    } catch (error) {
      console.error('Error fetching culture data:', error);
      toast.error('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="w-8 h-8" /> : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => {
                  if (selectedContent) {
                    setSelectedContent(null);
                  } else if (selectedCard) {
                    setSelectedCard(null);
                  } else {
                    navigate('/learn');
                  }
                }}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-2xl font-bold">HABAR</span>
              </button>
              
              <nav className="hidden md:flex space-x-8">
                <button onClick={() => navigate('/dictionary')} className="text-gray-500 hover:text-gray-700">Словарь</button>
                <button onClick={() => navigate('/learn')} className="text-gray-500 hover:text-gray-700">Уроки</button>
                <button onClick={() => navigate('/practice')} className="text-gray-500 hover:text-gray-700">Практика</button>
                <button onClick={() => navigate('/culture')} className="text-gray-900 hover:text-gray-700">Культура</button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : selectedContent ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{selectedContent.title}</h1>
              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
              >
                Назад
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <p className="text-gray-600 whitespace-pre-line text-lg leading-relaxed">
                {selectedContent.text}
              </p>
            </div>
          </div>
        ) : selectedCard ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">{selectedCard.title}</h1>
              <button
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm hover:shadow transition-all"
              >
                Назад
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedCard.content?.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedContent(item)}
                  className={`${selectedCard.color} rounded-xl shadow-md p-6 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer`}
                >
                  <h2 className="text-xl font-semibold mb-4 text-white">{item.title}</h2>
                  <p className="text-white/90 line-clamp-3">{item.text.split('\n')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cultureCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className={`${card.color} h-64 relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform hover:scale-105 transition-transform duration-200`}
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="text-white mb-4">
                    {getIcon(card.icon)}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">{card.title}</h2>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
