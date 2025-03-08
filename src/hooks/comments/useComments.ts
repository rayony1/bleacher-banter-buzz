
import { useCallback } from 'react';
import { useCommentsData } from './useCommentsData';
import { useCreateComment } from './useCreateComment';
import { useRealtimeComments } from './useRealtimeComments';
import { Comment, UseCommentsReturn } from './types';

export const useComments = (postId: string): UseCommentsReturn => {
  const { comments, setComments, isLoading, error } = useCommentsData(postId);
  
  const handleCommentAdded = useCallback((comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  }, [setComments]);
  
  const { createComment, isCreatingComment } = useCreateComment(postId, handleCommentAdded);
  
  // Set up realtime comments
  useRealtimeComments(postId, handleCommentAdded);

  return {
    comments,
    isLoading,
    error,
    createComment,
    isCreatingComment,
    addComment: createComment // For backward compatibility
  };
};

export type { Comment } from './types';
