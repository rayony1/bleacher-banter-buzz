
// Export the client
export { supabase } from './client';

// Auth functions
export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
};

// School functions
export const getSchools = async () => {
  return await supabase
    .from('schools')
    .select('*')
    .order('school_name');
};

// Post functions
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

// File upload functions
export const uploadImage = async (file: File, path?: string): Promise<string> => {
  try {
    // Validate file size and type
    if (file.size > 6 * 1024 * 1024) {
      throw new Error('File size exceeds 6MB limit');
    }
    
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('File type not supported. Please upload JPEG, PNG, or WebP');
    }
    
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = path || `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `posts/${fileName}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (err) {
    console.error('Error uploading image:', err);
    throw err;
  }
};

// Game functions
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
