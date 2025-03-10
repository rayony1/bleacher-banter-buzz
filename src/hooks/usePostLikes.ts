import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase/client';
import { checkIfPostLiked, getLikesCount, likePost, unlikePost } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
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

  useEffect(() => {
    if (!postId) return;
    
    const channel = supabase.channel(`post_likes:${postId}`);
    
    const subscription = channel
      .on(
        'postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'post_likes',
          filter: `post_id=eq.${postId}`
        },
        async (payload: RealtimePostLikePayload) => {
          const { count, error } = await getLikesCount(postId);
          if (!error && count !== null) {
            setLikesCount(count);
          }
          
          if (user && payload.new && payload.new.user_id === user.id) {
            setLiked(true);
          } else if (user && payload.old && payload.old.user_id === user.id) {
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
