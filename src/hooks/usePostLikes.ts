
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { checkIfPostLiked, getLikesCount, likePost, unlikePost } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Type for the realtime payload we'll receive from Supabase
interface PostLikeChange {
  id?: string;
  user_id: string;
  post_id: string;
  created_at?: string;
}

// Add this type definition for the payload
type RealtimePostLikePayload = RealtimePostgresChangesPayload<PostLikeChange>;

export const usePostLikes = (postId: string, initialLikesCount: number) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Helper function to check if a string is a valid UUID
  const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };
  
  // Check initial like status
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
      // Skip Supabase calls for demo IDs that aren't valid UUIDs
      if (!isValidUUID(postId)) {
        console.log('Demo mode: Using mock data for non-UUID post ID');
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await checkIfPostLiked(postId, user.id);
        
        if (error) throw error;
        
        setLiked(!!data);
        
        const { count, error: countError } = await getLikesCount(postId);
        
        if (countError) throw countError;
        
        if (count !== null) setLikesCount(count);
      } catch (err) {
        console.error('Error checking like status:', err);
        setError(err instanceof Error ? err : new Error('Failed to check like status'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLikeStatus();
  }, [postId, user]);

  // Set up realtime subscription
  useEffect(() => {
    if (!postId) return;
    
    // Only set up Supabase realtime for valid UUIDs
    if (!isValidUUID(postId)) {
      console.log('Demo mode: Skipping realtime subscription for non-UUID post ID');
      return;
    }
    
    // Create a channel with proper naming convention
    const channel = supabase.channel(`post-likes-${postId}`);
    
    // Set up the subscription using the correct pattern with proper typing
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        (payload: RealtimePostLikePayload) => {
          // Get updated like count
          getLikesCount(postId).then(({ count, error }) => {
            if (!error && count !== null) {
              setLikesCount(count);
            }
          });
          
          // Update liked status if it's the current user
          if (user && payload.new && 'user_id' in payload.new && payload.new.user_id === user.id) {
            setLiked(true);
          } else if (user && payload.old && 'user_id' in payload.old && payload.old.user_id === user.id) {
            setLiked(false);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // For demo posts with non-UUID IDs, just update the UI state
      if (!isValidUUID(postId)) {
        console.log('Demo mode: Toggling like state for non-UUID post ID');
        setLiked(prev => !prev);
        setLikesCount(prev => liked ? Math.max(0, prev - 1) : prev + 1);
        
        toast({
          title: liked ? "Post unliked" : "Post liked",
          description: liked ? "You've removed your like from this post" : "You've liked this post"
        });
        
        setIsLoading(false);
        return;
      }
      
      if (liked) {
        const { error } = await unlikePost(postId, user.id);
        if (error) throw error;
        
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Post unliked",
          description: "You've removed your like from this post"
        });
      } else {
        const { error } = await likePost(postId, user.id);
        if (error) throw error;
        
        setLiked(true);
        setLikesCount(prev => prev + 1);
        
        toast({
          title: "Post liked",
          description: "You've liked this post"
        });
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setError(err instanceof Error ? err : new Error('Failed to like/unlike post'));
      
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to like/unlike post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    liked,
    likesCount,
    isLoading,
    error,
    toggleLike
  };
};
