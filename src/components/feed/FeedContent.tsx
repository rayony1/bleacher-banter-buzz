
import React from 'react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';
import FeedEmptyState from './FeedEmptyState';

interface FeedContentProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onCreatePost: () => void;
  onDeletePost?: (postId: string) => void;
  isOffline?: boolean;
}

const FeedContent = ({ 
  posts, 
  onLike, 
  onUnlike, 
  onCreatePost, 
  onDeletePost,
  isOffline = false
}: FeedContentProps) => {
  return (
    <div className="max-w-[600px] mx-auto">
      {posts && posts.length > 0 ? (
        <div className="space-y-4 p-4">
          {isOffline && (
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-3 rounded-lg text-sm mb-4">
              You're viewing cached content while offline. Some interactions may be limited.
            </div>
          )}
          {posts.map((post: Post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={onLike} 
              onUnlike={onUnlike}
              onDelete={onDeletePost}
              disableInteractions={isOffline}
            />
          ))}
        </div>
      ) : (
        <FeedEmptyState onCreatePost={onCreatePost} isOffline={isOffline} />
      )}
    </div>
  );
};

export default FeedContent;
