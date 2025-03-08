
import { supabase } from './client';

// Follower functions
export const followUser = async (followerId: string, followingId: string) => {
  return await supabase
    .from('followers')
    .insert({
      follower_id: followerId,
      following_id: followingId
    })
    .select()
    .single();
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  return await supabase
    .from('followers')
    .delete()
    .match({
      follower_id: followerId,
      following_id: followingId
    });
};

export const getFollowers = async (userId: string) => {
  return await supabase
    .from('followers')
    .select('follower_id, profiles!followers_follower_id_fkey(*)')
    .eq('following_id', userId);
};

export const getFollowing = async (userId: string) => {
  return await supabase
    .from('followers')
    .select('following_id, profiles!followers_following_id_fkey(*)')
    .eq('follower_id', userId);
};
