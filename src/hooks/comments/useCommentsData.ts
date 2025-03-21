
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Comment } from './types';
import { getPostComments } from '@/lib/supabase';

export const useCommentsData = (postId: string) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      try {
        const { data, error } = await getPostComments(postId);
        
        if (error) throw new Error(error.message || 'Failed to load comments');
        
        // Transform to Comment type 
        return data?.map(comment => ({
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
        })) as Comment[];
      } catch (err) {
        console.error('Error fetching comments:', err);
        throw err;
      }
    },
    enabled: !!postId,
  });

  return {
    comments: query.data || [],
    setComments: (newComments: Comment[]) => {
      // For compatibility with old implementation
      queryClient.setQueryData(['comments', postId], newComments);
    },
    isLoading: query.isLoading,
    error: query.error as Error | null
  };
};
