import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { checkIfPostLiked, getLikesCount, likePost, unlikePost } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type RealtimePostLikePayload = {
  new: {
    user_id: string;
    post_id: string;
    created_at?: string;
  } | null;
  old: {
    user_id: string;
    post_id: string;
    created_at?: string;
  } | null;
  eventType: 'INSERT' | 'DELETE' | 'UPDATE';
};

export const usePostLikes = (postId: string, initialLikesCount: number) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if the user has liked this post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await checkIfPostLiked(postId, user.id);
        
        if (error) throw error;
        
        setLiked(!!data);
        
        // Get the likes count
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

  // Subscribe to changes in the post_likes table for this post
  useEffect(() => {
    if (!postId) return;
    
    const channel = supabase
      .channel(`post_likes:${postId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'post_likes',
        filter: `post_id=eq.${postId}` 
      }, async (payload: RealtimePostLikePayload) => {
        // Update likes count after any change
        const { count, error } = await getLikesCount(postId);
        if (!error && count !== null) {
          setLikesCount(count);
        }
        
        // Update liked status if the user is the one who liked/unliked
        if (user && payload.new && payload.new.user_id === user.id) {
          setLiked(payload.eventType !== 'DELETE');
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, user]);

  // Handle liking and unliking a post
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
      
      if (liked) {
        // Unlike the post
        const { error } = await unlikePost(postId, user.id);
        if (error) throw error;
        
        setLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Post unliked",
          description: "You've removed your like from this post"
        });
      } else {
        // Like the post
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
