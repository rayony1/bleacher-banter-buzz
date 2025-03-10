
import { Network } from '@capacitor/network';
import { Post, FeedType } from '@/lib/types';
import { openDB, DBSchema } from 'idb';

// Define database schema
interface BleacherBanterDB extends DBSchema {
  posts: {
    key: string;
    value: {
      posts: Post[];
      feedType: FeedType;
      timestamp: number;
    };
  };
  offlineQueue: {
    key: string;
    value: {
      content: string;
      imageUrl?: string;
      isAnonymous: boolean;
      createdAt: string;
    };
  };
  offlineImages: {
    key: string;
    value: {
      imageUrl: string;
      imageData: Blob;
    };
  };
}

// Database setup
const dbPromise = openDB<BleacherBanterDB>('bleacherBanterDB', 2, {
  upgrade(db, oldVersion, newVersion) {
    // Create posts store - keyed by feedType
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts');
    }
    
    // Create offlineQueue store for posts created while offline
    if (!db.objectStoreNames.contains('offlineQueue')) {
      db.createObjectStore('offlineQueue', { keyPath: 'createdAt' });
    }
    
    // Add store for offline images (new in v2)
    if (oldVersion < 2) {
      db.createObjectStore('offlineImages', { keyPath: 'imageUrl' });
    }
  },
});

/**
 * Cache posts by feed type
 */
export const cachePosts = async (posts: Post[], feedType: FeedType): Promise<void> => {
  try {
    const db = await dbPromise;
    await db.put('posts', {
      posts,
      feedType,
      timestamp: Date.now(),
    }, feedType);
    console.log(`Cached ${posts.length} posts for ${feedType} feed`);
  } catch (error) {
    console.error('Error caching posts:', error);
  }
};

/**
 * Get cached posts by feed type
 */
export const getCachedPosts = async (feedType: FeedType): Promise<Post[]> => {
  try {
    const db = await dbPromise;
    const cachedData = await db.get('posts', feedType);
    
    if (cachedData) {
      console.log(`Retrieved ${cachedData.posts.length} cached posts for ${feedType} feed`);
      return cachedData.posts;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting cached posts:', error);
    return [];
  }
};

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

/**
 * Queue a post for later submission when online
 */
export const queueOfflinePost = async (post: {
  content: string;
  imageUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
}): Promise<void> => {
  try {
    const db = await dbPromise;
    
    // If the post has an image, cache it
    if (post.imageUrl) {
      await cacheImage(post.imageUrl);
    }
    
    await db.add('offlineQueue', post);
    console.log('Post queued for later submission');
  } catch (error) {
    console.error('Error queuing offline post:', error);
  }
};

/**
 * Get all queued offline posts
 */
export const getOfflineQueue = async (): Promise<any[]> => {
  try {
    const db = await dbPromise;
    return await db.getAll('offlineQueue');
  } catch (error) {
    console.error('Error getting offline queue:', error);
    return [];
  }
};

/**
 * Remove a post from the offline queue
 */
export const removeFromOfflineQueue = async (createdAt: string): Promise<void> => {
  try {
    const db = await dbPromise;
    await db.delete('offlineQueue', createdAt);
    console.log('Post removed from offline queue');
  } catch (error) {
    console.error('Error removing post from offline queue:', error);
  }
};

/**
 * Check if the device is online
 */
export const isOnline = async (): Promise<boolean> => {
  const status = await Network.getStatus();
  return status.connected;
};

/**
 * Initialize network status listener
 * @param onlineCallback Called when connection is restored
 * @param offlineCallback Called when connection is lost
 */
export const initNetworkListener = (
  onlineCallback: () => void,
  offlineCallback: () => void
) => {
  // Add the network listener and get the promise
  const listenerPromise = Network.addListener('networkStatusChange', (status) => {
    console.log('Network status changed:', status.connected);
    if (status.connected) {
      onlineCallback();
    } else {
      offlineCallback();
    }
  });
  
  // Return a cleanup function
  return () => {
    // We need to resolve the promise to get the handle before removing
    listenerPromise.then(handle => {
      handle.remove();
    });
  };
};
