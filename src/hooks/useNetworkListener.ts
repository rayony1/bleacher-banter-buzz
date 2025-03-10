
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initNetworkListener } from '@/utils/offlineCache';

export const useNetworkListener = (
  setNetworkStatus: (status: boolean) => void,
  syncOfflinePosts: () => void,
  refreshPosts: () => Promise<void>
) => {
  const { toast } = useToast();
  
  // Set up network listener
  useEffect(() => {
    // Initialize the network listener (returns a cleanup function directly)
    const cleanup = initNetworkListener(
      // Online callback
      () => {
        setNetworkStatus(true);
        toast({
          title: "You're back online",
          description: "Your feed will now update with the latest posts"
        });
        
        // Process any offline posts
        syncOfflinePosts();
        refreshPosts();
      },
      // Offline callback
      () => {
        setNetworkStatus(false);
        toast({
          title: "You're offline",
          description: "You can still view cached content and create posts",
          variant: "destructive"
        });
      }
    );
    
    // Return the cleanup function
    return cleanup;
  }, [setNetworkStatus, syncOfflinePosts, refreshPosts, toast]);
};
