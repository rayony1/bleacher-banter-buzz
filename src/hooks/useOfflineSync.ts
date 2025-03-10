
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { createPost } from '@/lib/supabase';
import {
  isOnline,
  getOfflineQueue,
  removeFromOfflineQueue,
} from '@/utils/offlineCache';

export const useOfflineSync = (
  user: User | null, 
  refreshPosts: () => Promise<void>
) => {
  const { toast } = useToast();
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);

  // Check network status on component mount
  useEffect(() => {
    const checkNetworkStatus = async () => {
      const online = await isOnline();
      setNetworkStatus(online);
    };
    
    checkNetworkStatus();
  }, []);

  // Sync offline posts when we come back online
  const syncOfflinePosts = async () => {
    if (!user) return;
    
    try {
      const offlinePosts = await getOfflineQueue();
      if (offlinePosts.length === 0) return;
      
      toast({
        title: "Syncing posts",
        description: `Uploading ${offlinePosts.length} offline post(s)`
      });
      
      for (const post of offlinePosts) {
        try {
          await createPost(
            post.content, 
            user.school, 
            user.id, 
            post.isAnonymous, 
            post.imageUrl ? [post.imageUrl] : undefined
          );
          
          // Remove the post from the offline queue
          await removeFromOfflineQueue(post.createdAt);
        } catch (error) {
          console.error('Error syncing offline post:', error);
        }
      }
      
      toast({
        title: "Posts synced",
        description: "Your offline posts have been uploaded"
      });
      
      // Refresh the feed to show the new posts
      refreshPosts();
    } catch (error) {
      console.error('Error syncing offline posts:', error);
      toast({
        title: "Sync failed",
        description: "Failed to upload some offline posts",
        variant: "destructive"
      });
    }
  };

  return {
    networkStatus,
    setNetworkStatus,
    syncOfflinePosts
  };
};
