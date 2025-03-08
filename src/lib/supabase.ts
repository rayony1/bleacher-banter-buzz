import { createClient } from '@supabase/supabase-js';
import { User } from '@/lib/types';

// Initialize the Supabase client with your Supabase URL and anon key
const supabaseUrl = 'https://iszezjuznvucctnlqdld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzemV6anV6bnZ1Y2N0bmxxZGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODc2NzMsImV4cCI6MjA1Njg2MzY3M30.GPUzecAuJWEEnNR8FaSd2MCfVHFsgz5o-jseTOGCP0c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, username: string, schoolId: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        school_id: schoolId,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
};

export const resendConfirmationEmail = async (email: string) => {
  try {
    console.log('Resending confirmation email to:', email);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      console.error('Error resending confirmation email:', error);
      return { error };
    }
    
    console.log('Confirmation email sent successfully');
    return { error: null };
  } catch (err) {
    console.error('Exception during resend:', err);
    const error = err instanceof Error ? err : new Error('Unknown error during resend');
    return { error };
  }
};

export const sendMagicLink = async (email: string) => {
  return await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};

// School-related functions
export const addSchool = async (schoolName: string, district: string, state: string) => {
  return await supabase
    .from('schools')
    .insert({ school_name: schoolName, district, state })
    .select()
    .single();
};

export const getSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .order('school_name');
};

export const getSchoolsByDistrict = async (district: string) => {
  return await supabase
    .from('schools')
    .select('*')
    .eq('district', district)
    .order('school_name');
};

export const getTexasSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .eq('state', 'Texas')
    .order('school_name');
};

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

// Comment functions
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

// Game and prediction-related functions
export const getGames = async (limit = 20) => {
  return await supabase
    .from('games')
    .select(`
      *,
      home_team:home_team_id (school_name, mascot),
      away_team:away_team_id (school_name, mascot)
    `)
    .order('start_time', { ascending: true })
    .limit(limit);
};

export const getUserPredictions = async (userId: string) => {
  return await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
};

export const createPrediction = async (gameId: string, userId: string, selectedTeam: string, predictedHomeScore?: number, predictedAwayScore?: number) => {
  return await supabase
    .from('predictions')
    .insert({
      game_id: gameId,
      user_id: userId,
      selected_team: selectedTeam,
      predicted_home_score: predictedHomeScore,
      predicted_away_score: predictedAwayScore,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
};

// Badge-related functions
export const getSchoolBadges = async (schoolId: string) => {
  return await supabase
    .from('badges')
    .select('*')
    .eq('school_id', schoolId);
};

export const getFootballBadges = async () => {
  return await supabase
    .from('badges')
    .select('*')
    .eq('type', 'team');
};

// File upload functions
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
};

// Feed functions
export const getFeedPosts = async (feedType: 'school' | 'district' | 'state', userId: string, limit = 20) => {
  return await supabase
    .rpc('get_feed_posts', { feed_type: feedType, user_uuid: userId })
    .limit(limit);
};

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
