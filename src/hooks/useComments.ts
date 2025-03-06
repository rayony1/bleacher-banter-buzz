
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export type Comment = {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  } | null;
  createdAt: Date;
};

export const useComments = (postId: string) => {
  const { user, isEmailConfirmed } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch comments for a post
  const { 
    data: comments,
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          comment_id,
          post_id,
          content,
          timestamp,
          user_id,
          profiles:user_id (username)
        `)
        .eq('post_id', postId)
        .order('timestamp', { ascending: true });

      if (error) throw error;

      // Transform the data to match our Comment type
      return data.map((comment: any) => ({
        id: comment.comment_id,
        postId: comment.post_id,
        content: comment.content,
        author: {
          id: comment.user_id,
          username: comment.profiles?.username || 'Unknown User',
          avatar: `https://source.unsplash.com/random/100x100?portrait=${comment.user_id}`
        },
        createdAt: new Date(comment.timestamp)
      })) as Comment[];
    },
    enabled: !!postId,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!postId) return;
    
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'comments',
          filter: `post_id=eq.${postId}`
        }, 
        () => {
          // When comments change, refetch the data
          refetch();
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, refetch]);

  // Mutation to create a new comment
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('User not authenticated');
      
      if (!isEmailConfirmed) {
        throw new Error('Email confirmation required to comment');
      }
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the comments query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      
      // Also invalidate the posts query to update the comment count
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast({
        title: 'Comment added!',
        description: 'Your comment has been published.',
      });
    },
    onError: (error: Error) => {
      console.error('Error creating comment:', error);
      
      if (error.message.includes('Email confirmation required')) {
        toast({
          title: 'Email confirmation required',
          description: 'Please confirm your email address to post comments.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to add comment. Please try again.',
          variant: 'destructive',
        });
      }
    }
  });

  return {
    comments,
    isLoading,
    error,
    createComment: createCommentMutation.mutate,
    isCreatingComment: createCommentMutation.isPending,
    isEmailConfirmed
  };
};
