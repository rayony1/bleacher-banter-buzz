
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Post, FeedType } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export const useFeed = (feedType: FeedType) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Query to fetch posts
  const { 
    data: posts,
    isLoading,
    error,
    refetch 
  } = useQuery({
    queryKey: ['posts', feedType],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .rpc('get_feed_posts', {
          feed_type: feedType,
          user_uuid: user.id
        });

      if (error) throw error;

      // Transform the data to match our Post type
      return data.map((post: any) => ({
        id: post.post_id,
        content: post.content,
        author: post.is_anonymous ? null : {
          id: post.user_id,
          username: post.username,
          name: post.username,
          avatar: `https://source.unsplash.com/random/100x100?portrait=${post.user_id}`,
          school: post.school_name,
          badges: [],  // We'll need to fetch badges separately if needed
          points: 0,   // We'd need to calculate this
          isAthlete: false, // We'd need additional data for this
          createdAt: new Date(post.post_timestamp)
        },
        isAnonymous: post.is_anonymous,
        schoolName: post.school_name,
        likes: post.likes_count,
        comments: post.comments_count,
        createdAt: new Date(post.post_timestamp),
        images: post.images || []
      })) as Post[];
    },
    enabled: !!user,
  });
  
  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts'
        }, 
        () => {
          // When posts change, refetch the data
          refetch();
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  // Mutation to create a new post
  const createPostMutation = useMutation({
    mutationFn: async ({ content, isAnonymous, images }: { content: string; isAnonymous: boolean; images: string[] }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          is_anonymous: isAnonymous,
          images: images.length > 0 ? images : null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the posts query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['posts', feedType] });
      
      toast({
        title: 'Post created!',
        description: 'Your post has been published successfully.',
      });
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Mutation to like a post
  const likePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', feedType] });
    },
    onError: (error) => {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post. Please try again.',
        variant: 'destructive',
      });
    }
  });
  
  // Mutation to unlike a post
  const unlikePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .match({
          post_id: postId,
          user_id: user.id
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', feedType] });
    },
    onError: (error) => {
      console.error('Error unliking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to unlike post. Please try again.',
        variant: 'destructive',
      });
    }
  });

  return {
    posts,
    isLoading,
    error,
    createPost: createPostMutation.mutate,
    likePost: likePostMutation.mutate,
    unlikePost: unlikePostMutation.mutate,
    isCreatingPost: createPostMutation.isPending,
  };
};
