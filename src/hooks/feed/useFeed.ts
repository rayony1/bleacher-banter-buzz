
import { FeedType } from '@/lib/types';
import { useFeedPosts } from './useFeedPosts';
import { useRealtimePosts } from './useRealtimePosts';
import { usePostActions } from './usePostActions';
import { UseFeedReturn } from './types';

export const useFeed = (feedType: FeedType): UseFeedReturn => {
  const { posts, setPosts, isLoading, error, refreshPosts } = useFeedPosts(feedType);
  const { likePost, unlikePost, createPost, deletePost, isCreatingPost } = usePostActions(setPosts);
  
  // Set up realtime post updates
  useRealtimePosts(feedType, setPosts);

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
