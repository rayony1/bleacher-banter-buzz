
import { useState, useEffect } from 'react';
import { Comment } from './types';
import { getPostComments } from '@/lib/supabase';

export const useCommentsData = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = async () => {
    try {
      const { data, error } = await getPostComments(postId);
      
      if (error) throw error;
      
      // Transform to Comment type 
      return {
        data: data?.map(comment => ({
          id: comment.id || comment.comment_id,
          content: comment.content,
          post_id: comment.post_id,
          user_id: comment.user_id,
          created_at: comment.timestamp,
          updated_at: comment.timestamp,
          createdAt: new Date(comment.timestamp),
          author: {
            username: comment.author?.username || 'Anonymous',
            // Use default avatar since avatar_url doesn't exist in the profiles table
            avatar_url: '/placeholder.svg',
            avatar: '/placeholder.svg'
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
  }, [postId]);

  return {
    comments,
    setComments,
    isLoading,
    error
  };
};
