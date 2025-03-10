
import { Post, FeedType } from '@/lib/types';
import { dbPromise } from './db';

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
