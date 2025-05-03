import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Rocket, BookOpen, AudioLines, Globe, PresentationIcon, UsersIcon } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { Learn } from './pages/Learn';
import { Dictionary } from './pages/Dictionary';
import { LessonPage } from './pages/LessonPage';
import { Quiz } from './pages/Quiz';
import { Practice } from './pages/Practice';
import { Culture } from './pages/Culture';
import { Admin } from './pages/Admin';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      setIsAdmin(session?.user?.email === adminEmail);
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      setIsAdmin(session?.user?.email === adminEmail);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen main-bg relative">
      <ScrollToTop />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/learn" element={<Learn />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/quiz/:lessonId" element={<Quiz />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/culture" element={<Culture />} />
        <Route path="/admin" element={
          isAdmin ? <Admin /> : <Navigate to="/" replace />
        } />
        <Route path="/" element={
          <>
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              adminOnly={true}
            />
            <div className="content-overlay absolute inset-0"></div>
            <div className="container mx-auto px-4 relative z-10">
              <nav className="py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-orange-500">
                    <PresentationIcon className="w-8 h-8" />
                    <UsersIcon className="w-8 h-8 -ml-1" />
                  </div>
                  <span className="text-2xl font-bold text-white">HABAR</span>
                </div>
              </nav>

              <main className="flex flex-col items-center justify-center min-h-[80vh] text-center">
                <div className="max-w-4xl">
                  <div className="mb-8 float-animation">
                    <div className="flex items-center justify-center text-orange-500 mb-4">
                      <PresentationIcon className="w-16 h-16" />
                      <UsersIcon className="w-16 h-16 -ml-2" />
                    </div>
                  </div>
                  <h1 className="text-6xl font-bold text-white mb-6 md:text-7xl text-4xl">
                    Марша дог1ийла
                  </h1>
                  <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                    Добро пожаловать в интерактивное приложение для изучения чеченского языка
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => navigate('/learn')}
                      className="bg-white text-gray-800 px-8 py-3 rounded-full font-semibold text-lg hover:bg-white/90 transition-colors flex items-center gap-2 pulse-animation"
                    >
                      <Rocket className="w-5 h-5" />
                      Начать обучение
                    </button>
                  </div>
                </div>
              </main>
              <section className="py-20 bg-white/95 rounded-3xl mt-20">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 md:text-4xl text-3xl px-4">О нас</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
                    <div className="flex flex-col items-center text-center text-xl p-6 rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-200">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <BookOpen className="w-8 h-8 text-gray-700" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Эффективное обучение</h3>
                      <p className="text-gray-600">Структурированные уроки и интерактивные упражнения для быстрого освоения языка</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center text-xl p-6 rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-200">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <AudioLines className="w-8 h-8 text-gray-700" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Озвучка</h3>
                      <p className="text-gray-600">Узнавайте, как звучат слова, и практикуйтесь с помощью голосовой озвучки от носителей</p>
                    </div>
                    
                    <div className="flex flex-col items-center text-center text-xl p-6 rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-lg border border-gray-200">
                      <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <Globe className="w-8 h-8 text-gray-700" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">Доступность</h3>
                      <p className="text-gray-600">Бесплатный доступ к материалам в любое время и с любого устройства</p>
                    </div>
                  </div>
                </div>
              </section>

              

              <footer className="text-center py-4">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-white/50 text-sm hover:text-white/75 transition-colors"
                >
                  я админ
                </button>
              </footer>
            </div>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;