
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { initNetworkListener, retryWithBackoff } from '@/utils/offline/networkStatus';

export const useNetworkListener = (
  setNetworkStatus: (status: boolean) => void,
  syncOfflinePosts: () => void,
  refreshPosts: () => Promise<void>
) => {
  const { toast, dismiss } = useToast();
  const toastIdRef = useRef<string | null>(null);
  
  // Set up network listener with improved reliability
  useEffect(() => {
    let syncInProgress = false;
    
    // Online callback with retry mechanism for syncing
    const handleOnline = async () => {
      setNetworkStatus(true);
      
      // Clear any existing offline toast
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      
      toast({
        title: "You're back online",
        description: "Syncing your data and refreshing feed"
      });
      
      // Prevent multiple syncs from running simultaneously
      if (syncInProgress) return;
      
      syncInProgress = true;
      try {
        // Process any offline posts with retry logic
        await retryWithBackoff(async () => {
          await syncOfflinePosts();
          await refreshPosts();
        });
      } catch (error) {
        console.error('Failed to sync after multiple attempts:', error);
        toast({
          title: "Sync incomplete",
          description: "Some data couldn't be synchronized. Will try again later.",
          variant: "destructive"
        });
      } finally {
        syncInProgress = false;
      }
    };
    
    // Offline callback
    const handleOffline = () => {
      setNetworkStatus(false);
      
      // Show persistent offline toast
      if (!toastIdRef.current) {
        const id = toast({
          title: "You're offline",
          description: "You can still view cached content and create posts",
          variant: "destructive",
          duration: Infinity // Keep showing until connection is restored
        }).id;
        toastIdRef.current = id;
      }
    };
    
    // Initialize the network listener (returns a cleanup function directly)
    const cleanup = initNetworkListener(handleOnline, handleOffline);
    
    // Return the cleanup function
    return () => {
      cleanup();
      // Dismiss any lingering toasts
      if (toastIdRef.current) {
        dismiss(toastIdRef.current);
      }
    };
  }, [setNetworkStatus, syncOfflinePosts, refreshPosts, toast, dismiss]);
};
