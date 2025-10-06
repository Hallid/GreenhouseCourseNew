import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

console.log('Supabase Config Check:', {
  url: supabaseUrl.substring(0, 30) + '...',
  hasAnonKey: supabaseAnonKey.length > 20,
  isConfigured: supabaseUrl !== 'https://placeholder.supabase.co'
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-anon-key' &&
         !supabaseUrl.includes('placeholder') &&
         !supabaseAnonKey.includes('placeholder');
};

// Export the raw values for debugging
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  isConfigured: isSupabaseConfigured()
};