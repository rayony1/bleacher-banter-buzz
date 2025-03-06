
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iszezjuznvucctnlqdld.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzemV6anV6bnZ1Y2N0bmxxZGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODc2NzMsImV4cCI6MjA1Njg2MzY3M30.GPUzecAuJWEEnNR8FaSd2MCfVHFsgz5o-jseTOGCP0c';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication helper functions
export const signUp = async (email: string, password: string, username: string, schoolId: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        school_id: schoolId
      }
    }
  });
  
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Function to get the current user
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

// Function to get a user's profile
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      schools:school_id (*),
      user_badges (
        badges:badge_id (*)
      )
    `)
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

// Function to add a school to the database (for admins/testing)
export const addSchool = async (school: {
  school_name: string;
  district: string;
  state: string;
  mascot?: string;
  colors?: { primary: string; secondary: string };
}) => {
  const { data, error } = await supabase
    .from('schools')
    .insert(school)
    .select()
    .single();
  
  return { data, error };
};

// Function to get all schools
export const getSchools = async () => {
  const { data, error } = await supabase
    .from('schools')
    .select('*');
  
  return { data, error };
};

// Function to get all games for the scoreboard
export const getGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      home_team:home_team_id (school_name, mascot),
      away_team:away_team_id (school_name, mascot)
    `)
    .order('start_time', { ascending: true });
  
  return { data, error };
};

// Function to get a user's predictions
export const getUserPredictions = async (userId: string) => {
  const { data, error } = await supabase
    .from('predictions')
    .select(`
      *,
      games:game_id (
        *,
        home_team:home_team_id (school_name, mascot),
        away_team:away_team_id (school_name, mascot)
      )
    `)
    .eq('user_id', userId);
  
  return { data, error };
};

// Function to create a prediction
export const createPrediction = async (prediction: {
  game_id: string;
  user_id: string;
  selected_team: 'home' | 'away';
  predicted_home_score?: number;
  predicted_away_score?: number;
}) => {
  const { data, error } = await supabase
    .from('predictions')
    .insert(prediction)
    .select()
    .single();
  
  return { data, error };
};

// Function to get posts for a user's school feed
export const getSchoolPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      author:user_id (username, school_id)
    `)
    .order('timestamp', { ascending: false });
  
  return { data, error };
};

// Function to create a post
export const createPost = async (post: {
  user_id: string;
  content: string;
  is_anonymous?: boolean;
  images?: string[];
}) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single();
  
  return { data, error };
};

// Function to get comments for a post
export const getPostComments = async (postId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:user_id (username)
    `)
    .eq('post_id', postId)
    .order('timestamp', { ascending: true });
  
  return { data, error };
};

// Function to create a comment
export const createComment = async (comment: {
  post_id: string;
  user_id: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single();
  
  return { data, error };
};
