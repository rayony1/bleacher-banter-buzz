
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
}

// Database setup
const dbPromise = openDB<BleacherBanterDB>('bleacherBanterDB', 1, {
  upgrade(db) {
    // Create posts store - keyed by feedType
    db.createObjectStore('posts');
    
    // Create offlineQueue store for posts created while offline
    db.createObjectStore('offlineQueue', { keyPath: 'createdAt' });
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
): () => void => {
  // Get a reference to the promise for the listener
  const listenerPromise = Network.addListener('networkStatusChange', (status) => {
    console.log('Network status changed:', status.connected);
    if (status.connected) {
      onlineCallback();
    } else {
      offlineCallback();
    }
  });
  
  // Return a cleanup function that removes the listener when the promise resolves
  return () => {
    listenerPromise.then(handle => {
      handle.remove();
    }).catch(error => {
      console.error('Error removing network listener:', error);
    });
  };
};
