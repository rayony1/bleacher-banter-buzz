
import { supabase } from './client';

export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
};
