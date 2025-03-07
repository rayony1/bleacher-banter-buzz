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
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: [
        {
          id: '1',
          content: 'Great post! Looking forward to the game.',
          post_id: postId,
          user_id: 'user123',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          author: {
            username: 'SportsFan',
            avatar_url: 'https://source.unsplash.com/random/100x100?portrait=10',
            avatar: 'https://source.unsplash.com/random/100x100?portrait=10'
          }
        },
        {
          id: '2',
          content: 'I\'ll be there to cheer!',
          post_id: postId,
          user_id: 'user456',
          created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          updated_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60),
          author: {
            username: 'TeamSupporter',
            avatar_url: 'https://source.unsplash.com/random/100x100?portrait=11',
            avatar: 'https://source.unsplash.com/random/100x100?portrait=11'
          }
        }
      ],
      error: null
    };
  };

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
    
    console.log('Setting up mock subscription for comments');
    
    return () => {
      console.log('Cleaning up mock subscription for comments');
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
      
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        content,
        post_id: postId,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date(),
        author: {
          username: user.username,
          avatar_url: user.avatar,
          avatar: user.avatar
        }
      };
      
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

  const addComment = createComment;

  return {
    comments,
    isLoading,
    error,
    createComment,
    isCreatingComment,
    addComment
  };
};
