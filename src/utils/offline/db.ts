
import { openDB, DBSchema } from 'idb';
import { Post, FeedType } from '@/lib/types';

// Define database schema
export interface BleacherBanterDB extends DBSchema {
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
export const dbPromise = openDB<BleacherBanterDB>('bleacherBanterDB', 2, {
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
