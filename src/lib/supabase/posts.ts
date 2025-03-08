
import { supabase } from './client';

// Post-related functions
export const getSchoolPosts = async (schoolId: string, limit = 20) => {
  return await supabase
    .from('posts')
    .select(`
      *,
      user:user_id (username, avatar_url)
    `)
    .eq('school_id', schoolId)
    .order('timestamp', { ascending: false })
    .limit(limit);
};

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

// Like functions
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

// Feed functions
export const getFeedPosts = async (feedType: 'school' | 'district' | 'state', userId: string, limit = 20) => {
  return await supabase
    .rpc('get_feed_posts', { feed_type: feedType, user_uuid: userId })
    .limit(limit);
};
