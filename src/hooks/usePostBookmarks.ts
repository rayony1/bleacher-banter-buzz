
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { bookmarkPost, removeBookmark, checkIfPostBookmarked } from '@/lib/supabase/bookmarks';

export const usePostBookmarks = (postId: string) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to check if a post is bookmarked
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user || !user.id) return;
      
      try {
        // Check if the post ID is a UUID (not demo data)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
        if (!isUUID) return;
        
        const { data, error } = await checkIfPostBookmarked(postId, user.id);
        
        if (error) throw error;
        
        setIsBookmarked(!!data);
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }
    };
    
    checkBookmarkStatus();
  }, [postId, user]);

  // Function to toggle bookmark status
  const toggleBookmark = async () => {
    if (!user || !user.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark posts",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the post ID is a UUID (not demo data)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
    if (!isUUID) {
      toast({
        title: isBookmarked ? "Bookmark removed" : "Post bookmarked",
        description: isBookmarked 
          ? "This post has been removed from your bookmarks" 
          : "This post has been added to your bookmarks"
      });
      
      setIsBookmarked(!isBookmarked);
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isBookmarked) {
        const { error } = await removeBookmark(postId, user.id);
        if (error) throw error;
        
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: "This post has been removed from your bookmarks"
        });
      } else {
        const { error } = await bookmarkPost(postId, user.id);
        if (error) throw error;
        
        setIsBookmarked(true);
        toast({
          title: "Post bookmarked",
          description: "This post has been added to your bookmarks"
        });
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      toast({
        title: "Error",
        description: "Failed to update bookmark status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isBookmarked,
    isLoading,
    toggleBookmark
  };
};
