
import { dbPromise } from './db';

/**
 * Cache an image from a URL (for offline use)
 */
export const cacheImage = async (imageUrl: string): Promise<void> => {
  try {
    // Only cache if it's a web URL (not a blob or data URL)
    if (!imageUrl.startsWith('blob:') && !imageUrl.startsWith('data:')) {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);
      
      const imageBlob = await response.blob();
      const db = await dbPromise;
      await db.put('offlineImages', { imageUrl, imageData: imageBlob });
      console.log('Image cached successfully:', imageUrl);
    }
  } catch (error) {
    console.error('Error caching image:', error);
  }
};

/**
 * Get a cached image
 */
export const getCachedImage = async (imageUrl: string): Promise<string | null> => {
  try {
    const db = await dbPromise;
    const cachedImage = await db.get('offlineImages', imageUrl);
    
    if (cachedImage && cachedImage.imageData) {
      const objectUrl = URL.createObjectURL(cachedImage.imageData);
      return objectUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
};
