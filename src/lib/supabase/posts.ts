
import { supabase } from './client';

export const createPost = async (content: string, schoolId: string, userId: string, isAnonymous = false, images?: string[]) => {
  return await supabase
    .from('posts')
    .insert({
      content,
      school_id: schoolId,
      user_id: userId,
      is_anonymous: isAnonymous,
      images,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single();
};
