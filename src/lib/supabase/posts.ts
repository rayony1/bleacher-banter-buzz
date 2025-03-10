
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

export const getFeedPosts = async (feedType: string, userId: string, limit = 20) => {
  return await supabase
    .rpc('get_feed_posts', { 
      feed_type: feedType, 
      user_uuid: userId 
    })
    .limit(limit);
};

export const getPostById = async (postId: string) => {
  return await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, avatar_url),
      schools!inner(school_name)
    `)
    .eq('post_id', postId)
    .single();
};
