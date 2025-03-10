
import { useState, useEffect } from 'react';
import { Post, FeedType } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { getFeedPosts } from '@/lib/supabase/posts';
import { SAMPLE_POSTS } from './types';
import { mapDbPostToPost } from './utils';

// Hook for fetching posts
export const useFeedPosts = (feedType: FeedType) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS[feedType] || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch posts from Supabase
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo mode or when not logged in, always use sample posts
      if (!user || !user.id || user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
        console.log('Using sample posts for feed type:', feedType);
        setPosts(SAMPLE_POSTS[feedType] || []);
        setIsLoading(false);
        return;
      }
      
      console.log('Fetching posts for feed type:', feedType, 'User ID:', user.id);
      
      const { data, error } = await getFeedPosts(feedType, user.id);
      
      if (error) {
        console.error('Supabase error fetching posts:', error);
        // Don't throw here, just set the error state and use sample posts
        setError(new Error(`Failed to fetch posts: ${error.message}`));
        setPosts(SAMPLE_POSTS[feedType] || []);
      } else if (data && data.length > 0) {
        console.log('Posts data received:', data);
        // Map the DB posts to our Post type
        const mappedPosts = data.map(mapDbPostToPost);
        setPosts(mappedPosts);
      } else {
        console.log('No posts data returned, using sample posts');
        setPosts(SAMPLE_POSTS[feedType] || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      // Fallback to sample posts if there's an error
      setPosts(SAMPLE_POSTS[feedType] || []);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch posts when feed type changes or user changes
  useEffect(() => {
    fetchPosts();
  }, [feedType, user]);

  return {
    posts,
    setPosts,
    isLoading,
    error,
    refreshPosts: fetchPosts
  };
};
