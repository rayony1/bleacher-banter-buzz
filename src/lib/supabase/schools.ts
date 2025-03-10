
import { supabase } from './client';

export const getSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .order('school_name');
};
