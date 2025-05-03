import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Helper function to clear auth storage
const clearAuthStorage = () => {
  try {
    localStorage.removeItem('auth-storage');
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};

// Helper function to get stored session
export const getStoredSession = () => {
  try {
    const storageKey = 'auth-storage';
    const storageData = localStorage.getItem(storageKey);
    if (!storageData) return null;
    
    const { currentSession } = JSON.parse(storageData);
    
    // Validate the session has required properties
    if (!currentSession?.access_token || !currentSession?.refresh_token) {
      clearAuthStorage();
      return null;
    }
    
    return currentSession;
  } catch (error) {
    console.error('Error getting stored session:', error);
    clearAuthStorage();
    return null;
  }
};

// Create Supabase client with enhanced error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'auth-storage',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Add error handling for token refresh
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'TOKEN_REFRESHED' && !session) {
    clearAuthStorage();
  }
});