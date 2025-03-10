
import { Post } from '@/lib/types';
import { toast } from "@/hooks/use-toast";
import { Network } from '@capacitor/network';

// Type for offline post queue
export interface OfflinePost {
  content: string;
  imageUrl?: string;
  isAnonymous: boolean;
  createdAt: string;
}

// Local storage keys
const CACHE_KEYS = {
  POSTS: 'bleacher_banter_cached_posts',
  OFFLINE_QUEUE: 'bleacher_banter_offline_posts',
  NETWORK_STATUS: 'bleacher_banter_network_status'
};

// Cache posts in local storage
export const cachePosts = (posts: Post[], feedType: string): void => {
  try {
    const cacheKey = `${CACHE_KEYS.POSTS}_${feedType}`;
    localStorage.setItem(cacheKey, JSON.stringify(posts));
    console.log(`Cached ${posts.length} posts for ${feedType} feed`);
  } catch (error) {
    console.error('Error caching posts:', error);
  }
};

// Get cached posts from local storage
export const getCachedPosts = (feedType: string): Post[] => {
  try {
    const cacheKey = `${CACHE_KEYS.POSTS}_${feedType}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error('Error retrieving cached posts:', error);
  }
  return [];
};

// Queue a post for when the device comes back online
export const queueOfflinePost = (post: OfflinePost): void => {
  try {
    const queue = getOfflinePostQueue();
    queue.push(post);
    localStorage.setItem(CACHE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    
    toast({
      title: "Post saved offline",
      description: "Your post will be published when you're back online",
    });
    
    console.log('Post queued for offline sync', post);
  } catch (error) {
    console.error('Error queueing offline post:', error);
    
    toast({
      title: "Couldn't save post",
      description: "There was an error saving your post offline",
      variant: "destructive"
    });
  }
};

// Get the offline post queue
export const getOfflinePostQueue = (): OfflinePost[] => {
  try {
    const queue = localStorage.getItem(CACHE_KEYS.OFFLINE_QUEUE);
    return queue ? JSON.parse(queue) : [];
  } catch (error) {
    console.error('Error getting offline post queue:', error);
    return [];
  }
};

// Clear specific post from the offline queue
export const removeFromOfflineQueue = (index: number): void => {
  try {
    const queue = getOfflinePostQueue();
    if (index >= 0 && index < queue.length) {
      queue.splice(index, 1);
      localStorage.setItem(CACHE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
    }
  } catch (error) {
    console.error('Error removing post from offline queue:', error);
  }
};

// Check if device is online
export const isOnline = async (): Promise<boolean> => {
  try {
    const status = await Network.getStatus();
    return status.connected;
  } catch (error) {
    console.error('Error checking network status:', error);
    // Fallback to navigator.onLine if Capacitor Network fails
    return navigator.onLine;
  }
};

// Initialize network status listener
export const initNetworkListener = (
  onlineCallback: () => void, 
  offlineCallback: () => void
): (() => void) => {
  let listener: any;
  
  // Create the listener and store the handle
  Network.addListener('networkStatusChange', (status) => {
    // Save current network status
    localStorage.setItem(CACHE_KEYS.NETWORK_STATUS, status.connected ? 'online' : 'offline');
    
    if (status.connected) {
      console.log('Device is online');
      onlineCallback();
    } else {
      console.log('Device is offline');
      offlineCallback();
    }
  }).then(handle => {
    listener = handle;
  });
  
  // Return a cleanup function
  return () => {
    if (listener) {
      listener.remove();
    }
  };
};
