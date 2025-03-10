
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
}

const FeedContent = ({ posts, onLike, onUnlike, onCreatePost, onDeletePost }: FeedContentProps) => {
  return (
    <div className="max-w-[600px] mx-auto">
      {posts && posts.length > 0 ? (
        <div className="space-y-4 p-4">
          {posts.map((post: Post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={onLike} 
              onUnlike={onUnlike}
              onDelete={onDeletePost}
              disableInteractions={false}
            />
          ))}
        </div>
      ) : (
        <FeedEmptyState onCreatePost={onCreatePost} />
      )}
    </div>
  );
};

export default FeedContent;
