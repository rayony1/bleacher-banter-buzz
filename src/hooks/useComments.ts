
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

export type Comment = {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  author: {
    username: string;
    avatar_url?: string;
  };
};

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Mock function to fetch comments
  const fetchComments = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return {
      data: [
        {
          id: '1',
          content: 'Great post! Looking forward to the game.',
          post_id: postId,
          user_id: 'user123',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          author: {
            username: 'SportsFan',
            avatar_url: 'https://source.unsplash.com/random/100x100?portrait=10'
          }
        },
        {
          id: '2',
          content: 'I\'ll be there to cheer!',
          post_id: postId,
          user_id: 'user456',
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          author: {
            username: 'TeamSupporter',
            avatar_url: 'https://source.unsplash.com/random/100x100?portrait=11'
          }
        }
      ],
      error: null
    };
  };

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await fetchComments();
        
        if (error) {
          throw new Error(error.message);
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
    
    // In a real app, we would set up real-time subscription
    // This would be replaced with actual Supabase subscription
    
    return () => {
      // Cleanup function for real subscriptions would go here
    };
  }, [postId]);

  // Add comment
  const addComment = async (content: string) => {
    if (!user) {
      toast({
        title: "Not authorized",
        description: "You must be logged in to comment",
        variant: "destructive"
      });
      return { error: new Error('Not authorized') };
    }
    
    try {
      // Mock new comment
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content,
        post_id: postId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: {
          username: user.username,
          avatar_url: user.avatar
        }
      };
      
      // Add to local state
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
    }
  };

  return {
    comments,
    isLoading,
    error,
    addComment
  };
};
