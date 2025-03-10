
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { createPost } from '@/lib/supabase';
import {
  isOnline,
  retryWithBackoff,
  getOfflineQueue,
  removeFromOfflineQueue,
} from '@/utils/offline';

export const useOfflineSync = (
  user: User | null, 
  refreshPosts: () => Promise<void>
) => {
  const { toast } = useToast();
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const syncInProgressRef = useRef<boolean>(false);
  
  // Check network status on component mount
  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const online = await isOnline();
        setNetworkStatus(online);
      } catch (error) {
        console.error('Error checking initial network status:', error);
        setNetworkStatus(false);
      }
    };
    
    checkNetworkStatus();
  }, []);

  // Sync offline posts when we come back online with improved error handling and retry
  const syncOfflinePosts = useCallback(async () => {
    if (!user || syncInProgressRef.current) return;
    
    syncInProgressRef.current = true;
    
    try {
      const offlinePosts = await getOfflineQueue();
      if (offlinePosts.length === 0) {
        syncInProgressRef.current = false;
        return;
      }
      
      toast({
        title: "Syncing posts",
        description: `Uploading ${offlinePosts.length} offline post(s)`
      });
      
      let successCount = 0;
      let failCount = 0;
      
      for (const post of offlinePosts) {
        try {
          // Use retry with backoff pattern for each post upload
          await retryWithBackoff(async () => {
            await createPost(
              post.content, 
              user.school, 
              user.id, 
              post.isAnonymous, 
              post.imageUrl ? [post.imageUrl] : undefined
            );
            
            // Only remove from queue after successful upload
            await removeFromOfflineQueue(post.createdAt);
          });
          
          successCount++;
        } catch (error) {
          console.error('Error syncing offline post after retries:', error);
          failCount++;
        }
      }
      
      // Show appropriate toast based on sync results
      if (failCount === 0) {
        toast({
          title: "Posts synced",
          description: `${successCount} offline post(s) uploaded successfully`
        });
        
        // Refresh the feed to show the new posts
        await refreshPosts();
      } else if (successCount > 0) {
        toast({
          title: "Partial sync completed",
          description: `${successCount} posts uploaded, ${failCount} failed and will retry later`,
          variant: "destructive"
        });
        
        // Still refresh to show the posts that did get uploaded
        await refreshPosts();
      } else {
        toast({
          title: "Sync failed",
          description: "Failed to upload offline posts. Will retry automatically when connection improves.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in sync process:', error);
      toast({
        title: "Sync error",
        description: "An unexpected error occurred during sync",
        variant: "destructive"
      });
    } finally {
      syncInProgressRef.current = false;
    }
  }, [user, refreshPosts, toast]);

  return {
    networkStatus,
    setNetworkStatus,
    syncOfflinePosts
  };
};
