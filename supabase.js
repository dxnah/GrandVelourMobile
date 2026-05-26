import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ocfupyxszmyjgbqshjua.supabase.co';
const supabaseAnonKey = 'sb_publishable_WAqR7VA6ZUVfRPHJ3cPhjw_CUK7feor';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});