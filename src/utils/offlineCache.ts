
// This file is now just re-exporting from the new modules for backward compatibility
// It can be removed once all imports are updated to use the new path

import { 
  cachePosts, 
  getCachedPosts, 
  queueOfflinePost, 
  getOfflineQueue,
  removeFromOfflineQueue,
  cacheImage,
  getCachedImage,
  isOnline,
  initNetworkListener,
  retryWithBackoff
} from './offline';

// Re-export everything for backward compatibility
export {
  cachePosts,
  getCachedPosts,
  queueOfflinePost,
  getOfflineQueue,
  removeFromOfflineQueue,
  cacheImage,
  getCachedImage,
  isOnline,
  initNetworkListener,
  retryWithBackoff
};
