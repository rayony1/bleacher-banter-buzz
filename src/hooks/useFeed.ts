
import { useFeedPosts } from './feed/useFeedPosts';
import { useRealtimePosts } from './feed/useRealtimePosts';
import { usePostActions } from './feed/usePostActions';
import { FeedType } from '@/lib/types';
import { UseFeedReturn } from './feed/types';

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
