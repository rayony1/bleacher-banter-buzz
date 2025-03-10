
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
    if (!user) {
      // Use sample posts when no user is available (demo mode)
      setPosts(SAMPLE_POSTS[feedType] || []);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // For demo posts shown in development or when no user is available
      if (process.env.NODE_ENV === 'development' && !user.id) {
        setPosts(SAMPLE_POSTS[feedType] || []);
        return;
      }
      
      console.log('Fetching posts for feed type:', feedType, 'User ID:', user.id);
      
      const { data, error } = await getFeedPosts(feedType, user.id);
      
      if (error) {
        console.error('Supabase error fetching posts:', error);
        throw error;
      }
      
      if (data) {
        console.log('Posts data received:', data);
        // Map the DB posts to our Post type
        const mappedPosts = data.map(mapDbPostToPost);
        setPosts(mappedPosts);
      } else {
        console.log('No posts data returned');
        // Fallback to sample posts if no data is returned
        setPosts(SAMPLE_POSTS[feedType] || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      // Fallback to sample posts if there's an error in development
      if (process.env.NODE_ENV === 'development') {
        setPosts(SAMPLE_POSTS[feedType] || []);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch posts when feed type changes or user changes
  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      // Use sample posts when no user is available (demo mode)
      setPosts(SAMPLE_POSTS[feedType] || []);
    }
  }, [feedType, user]);

  return {
    posts,
    setPosts,
    isLoading,
    error,
    refreshPosts: fetchPosts
  };
};
