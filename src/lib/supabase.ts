
// This file is kept as a placeholder to avoid import errors, but all Supabase functionality is removed
// No actual Supabase connection happens

// Placeholder version of the Supabase client
export const supabase = {
  auth: {
    signOut: async () => ({ error: null }),
    signInWithPassword: async () => ({ data: null, error: null }),
    getSession: async () => ({ data: { session: null } }),
    signUp: async () => ({ data: null, error: null }),
    resend: async () => ({ data: null, error: null }),
    signInWithOtp: async () => ({ data: null, error: null })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        maybeSingle: async () => null,
        single: async () => null,
        order: () => ({ limit: async () => ({ data: [] }) }),
      }),
      like: () => ({
        order: () => ({ limit: async () => ({ data: [] }) }),
      }),
      order: () => ({
        limit: async () => ({ data: [] }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  functions: {
    invoke: async () => ({ data: null, error: null }),
  },
};

// All the functions below are kept for type safety but don't do anything
export const signUp = async () => ({ data: null, error: null });
export const signIn = async () => ({ data: null, error: null });
export const signOut = async () => ({ error: null });
export const getCurrentUser = async () => null;
export const getUserProfile = async () => ({ data: null, error: null });
export const resendConfirmationEmail = async () => ({ data: null, error: null });
export const addSchool = async () => ({ data: null, error: null });
export const getSchools = async () => ({ data: [], error: null });
export const getSchoolsByDistrict = async () => ({ data: [], error: null });
export const getTexasSchools = async () => ({ data: [], error: null });
export const getGames = async () => ({ data: [], error: null });
export const getUserPredictions = async () => ({ data: [], error: null });
export const createPrediction = async () => ({ data: null, error: null });
export const getSchoolPosts = async () => ({ data: [], error: null });
export const createPost = async () => ({ data: null, error: null });
export const getPostComments = async () => ({ data: [], error: null });
export const createComment = async () => ({ data: null, error: null });
export const getSchoolBadges = async () => ({ data: [], error: null });
export const getFootballBadges = async () => ({ data: [], error: null });
export const sendMagicLink = async () => ({ data: null, error: null });
