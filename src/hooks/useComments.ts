
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { supabase, getPostComments, createComment as addComment } from '@/lib/supabase';

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  createdAt: Date;
  author: {
    username: string;
    avatar_url?: string;
    avatar?: string;
  };
};

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const { data, error } = await getPostComments(postId);
      
      if (error) throw error;
      
      // Transform to Comment type 
      return {
        data: data?.map(comment => ({
          id: comment.id,
          content: comment.content,
          post_id: comment.post_id,
          user_id: comment.user_id,
          created_at: comment.timestamp,
          updated_at: comment.timestamp,
          createdAt: new Date(comment.timestamp),
          author: {
            username: comment.author?.username || 'Anonymous',
            avatar_url: comment.author?.avatar_url,
            avatar: comment.author?.avatar_url
          }
        })),
        error: null
      };
    } catch (err) {
      console.error('Error fetching comments:', err);
      return { data: null, error: err };
    }
  };

  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchComments();
        
        if (error) {
          throw new Error(error instanceof Error ? error.message : 'Failed to load comments');
        }
        
        setComments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load comments'));
        console.error('Error loading comments:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadComments();
    
    // Set up real-time subscription for new comments
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          // Add new comment to state
          const newComment = payload.new as any;
          
          // Fetch user details for the new comment
          const fetchCommentAuthor = async () => {
            try {
              const { data: authorData } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('user_id', newComment.user_id)
                .single();
              
              const commentWithAuthor: Comment = {
                id: newComment.id,
                content: newComment.content,
                post_id: newComment.post_id,
                user_id: newComment.user_id,
                created_at: newComment.timestamp,
                updated_at: newComment.timestamp,
                createdAt: new Date(newComment.timestamp),
                author: {
                  username: authorData?.username || 'User',
                  avatar_url: authorData?.avatar_url || '',
                  avatar: authorData?.avatar_url || ''
                }
              };
              
              setComments(prev => [commentWithAuthor, ...prev]);
            } catch (err) {
              console.error('Error fetching comment author:', err);
              // Add comment without author details as fallback
              const fallbackComment: Comment = {
                id: newComment.id,
                content: newComment.content,
                post_id: newComment.post_id,
                user_id: newComment.user_id,
                created_at: newComment.timestamp,
                updated_at: newComment.timestamp,
                createdAt: new Date(newComment.timestamp),
                author: {
                  username: 'User',
                  avatar_url: '',
                  avatar: ''
                }
              };
              
              setComments(prev => [fallbackComment, ...prev]);
            }
          };
          
          fetchCommentAuthor();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  const createComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Not authorized",
        description: "You must be logged in to comment",
        variant: "destructive"
      });
      return { error: new Error('Not authorized') };
    }
    
    try {
      setIsCreatingComment(true);
      
      const { data, error } = await addComment(postId, user.id, content);
      
      if (error) throw error;
      
      // Transform the returned data
      const newComment: Comment = {
        id: data.id,
        content: data.content,
        post_id: data.post_id,
        user_id: data.user_id,
        created_at: data.timestamp,
        updated_at: data.timestamp,
        createdAt: new Date(data.timestamp),
        author: {
          username: user.username,
          avatar_url: user.avatar,
          avatar: user.avatar
        }
      };
      
      // The real-time subscription should handle adding the comment to the UI
      // But we'll manually add it as well for immediate feedback
      setComments(prev => [newComment, ...prev]);
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted"
      });
      
      return { data: newComment, error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add comment');
      console.error('Error adding comment:', error);
      
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive"
      });
      
      return { error };
    } finally {
      setIsCreatingComment(false);
    }
  };

  return {
    comments,
    isLoading,
    error,
    createComment,
    isCreatingComment,
    addComment: createComment
  };
};
