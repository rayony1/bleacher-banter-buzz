import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iszezjuznvucctnlqdld.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzemV6anV6bnZ1Y2N0bmxxZGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODc2NzMsImV4cCI6MjA1Njg2MzY3M30.GPUzecAuJWEEnNR8FaSd2MCfVHFsgz5o-jseTOGCP0c';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication helper functions
export const signUp = async (email: string, password: string, username: string, schoolId: string) => {
  console.log('Signing up with:', { email, username, schoolId });
  
  try {
    // First check if username already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing username:', checkError);
      return { data: null, error: new Error('Error checking username availability') };
    }
    
    if (existingUsers) {
      console.error('Username already exists:', username);
      return { 
        data: null, 
        error: new Error('This username is already taken. Please choose a different one.') 
      };
    }
    
    // Step 1: Create the user in Auth with metadata that will be used by the database trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          school_id: schoolId
        },
        emailRedirectTo: `${window.location.origin}/auth?confirmation=true`
      }
    });
    
    if (authError) {
      console.error('Error during auth signup:', authError);
      return { data: null, error: authError };
    }

    console.log('Auth signup successful:', authData);
    
    // The database trigger (handle_new_user) will create the profile automatically
    // using the metadata we passed in the signUp options
    
    return { data: authData, error: null };
  } catch (err) {
    console.error('Error during signup:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error during signup') };
  }
};

export const signIn = async (email: string, password: string) => {
  console.log('Signing in with:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Signin response:', data, error);
    return { data, error };
  } catch (err) {
    console.error('Error during signin:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error during signin') };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Function to get the current user
export const getCurrentUser = async () => {
  console.log('Getting current user...');
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    console.log('Session found for user:', session.user.id);
  } else {
    console.log('No active session found');
  }
  
  return session?.user || null;
};

// Function to get a user's profile
export const getUserProfile = async (userId: string) => {
  console.log('Getting profile for user:', userId);
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
  
  if (error) {
    console.error('Error fetching user profile:', error);
  } else if (data) {
    console.log('Profile data retrieved successfully');
  } else {
    console.log('No profile found for user:', userId);
  }
  
  return { data, error };
};

// Function to resend confirmation email
export const resendConfirmationEmail = async (email: string) => {
  console.log('Resending confirmation email to:', email);
  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth?confirmation=true`
    }
  });
  
  if (error) {
    console.error('Error resending confirmation email:', error);
  } else {
    console.log('Confirmation email resent successfully');
  }
  
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

// Function to get schools by district
export const getSchoolsByDistrict = async (district: string) => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('district', district);
  
  return { data, error };
};

// Function to get Texas schools
export const getTexasSchools = async () => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('state', 'TX');
  
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

// Function to get all badges for a school
export const getSchoolBadges = async (schoolId: string) => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('school_id', schoolId);
  
  return { data, error };
};

// Function to get specific football badges
export const getFootballBadges = async () => {
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('badge_name', 'Football Team');
  
  return { data, error };
};

export const sendMagicLink = async (email: string, redirectTo?: string) => {
  console.log('Sending magic link to:', email);
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/auth?magic_link=true`
      }
    });
    
    if (error) {
      console.error('Error sending magic link:', error);
      return { data: null, error };
    }
    
    console.log('Magic link sent successfully');
    return { data, error: null };
  } catch (err) {
    console.error('Exception sending magic link:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error sending magic link') };
  }
};
