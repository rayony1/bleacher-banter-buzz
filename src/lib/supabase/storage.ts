
import { supabase } from './client';

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
