
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { createComment as addComment } from '@/lib/supabase';
import { Comment } from './types';

export const useCreateComment = (postId: string, onCommentAdded: (comment: Comment) => void) => {
  const [isCreatingComment, setIsCreatingComment] = useState(false);
  const { user } = useAuth();

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
      
      // Call the callback to update the UI immediately
      onCommentAdded(newComment);
      
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
    createComment,
    isCreatingComment
  };
};
