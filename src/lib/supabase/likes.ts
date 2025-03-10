
import { supabase } from './client';

export const likePost = async (postId: string, userId: string) => {
  return await supabase
    .from('post_likes')
    .insert({
      post_id: postId,
      user_id: userId
    })
    .select()
    .single();
};

export const unlikePost = async (postId: string, userId: string) => {
  return await supabase
    .from('post_likes')
    .delete()
    .match({
      post_id: postId,
      user_id: userId
    });
};

export const checkIfPostLiked = async (postId: string, userId: string) => {
  return await supabase
    .from('post_likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
};

export const getLikesCount = async (postId: string) => {
  return await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);
};
