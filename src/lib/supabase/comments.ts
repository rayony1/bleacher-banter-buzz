
import { supabase } from './client';

export const getPostComments = async (postId: string) => {
  return await supabase
    .from('comments')
    .select(`
      *,
      author:user_id (username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('timestamp', { ascending: false });
};

export const createComment = async (postId: string, userId: string, content: string) => {
  return await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      content,
      timestamp: new Date().toISOString(),
    })
    .select()
    .single();
};
