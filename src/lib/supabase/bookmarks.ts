
import { supabase } from './client';

export const bookmarkPost = async (postId: string, userId: string) => {
  return await supabase
    .from('post_bookmarks')
    .insert({
      post_id: postId,
      user_id: userId
    })
    .select()
    .single();
};

export const removeBookmark = async (postId: string, userId: string) => {
  return await supabase
    .from('post_bookmarks')
    .delete()
    .match({
      post_id: postId,
      user_id: userId
    });
};

export const checkIfPostBookmarked = async (postId: string, userId: string) => {
  return await supabase
    .from('post_bookmarks')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();
};

export const getUserBookmarks = async (userId: string) => {
  return await supabase
    .from('post_bookmarks')
    .select(`
      *,
      posts!inner(*)
    `)
    .eq('user_id', userId);
};
