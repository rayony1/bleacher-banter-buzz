
import { useFeedPosts } from './feed/useFeedPosts';
import { useRealtimePosts } from './feed/useRealtimePosts';
import { usePostActions } from './feed/usePostActions';
import { FeedType } from '@/lib/types';
import { UseFeedReturn } from './feed/types';

export const useFeed = (
  feedType: FeedType,
  userId: string = '',
  userSchool: string = ''
): UseFeedReturn => {
  // Get posts with loading and error states
  const { 
    posts, 
    setPosts, 
    isLoading, 
    error, 
    refreshPosts 
  } = useFeedPosts(feedType);
  
  // Get post actions (like, unlike, create, delete)
  const { 
    likePost, 
    unlikePost, 
    createPost, 
    deletePost, 
    isCreatingPost 
  } = usePostActions(setPosts);
  
  // Set up realtime post updates
  useRealtimePosts(feedType, setPosts);

  // Return everything needed by components
  return {
    posts,
    isLoading,
    error,
    createPost,
    likePost,
    unlikePost,
    isCreatingPost,
    refreshPosts,
    deletePost,
  };
};
