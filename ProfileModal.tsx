import React from 'react';
import { X, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

export function ProfileModal({ isOpen, onClose, userName }: ProfileModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
      toast.success('Вы успешно вышли из системы');
    } catch (error) {
      toast.error('Ошибка при выходе из системы');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-4 rounded-full mb-4">
            <User className="w-12 h-12 text-gray-700" />
          </div>
          <h2 className="text-xl font-semibold mb-6">{userName}</h2>
          <button
            onClick={handleSignOut}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}