
import React, { useState } from 'react';
import { Post, PostCardProps } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { usePostLikes } from '@/hooks/usePostLikes';

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostImages from './PostImages';
import PostInteractions from './PostInteractions';
import PostComments from './PostComments';

const PostCard = ({ post, onLike, onUnlike, disableInteractions = false, onDelete }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  
  // Check if post ID is a UUID (for handling demo posts differently)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(post.id);
  
  // Only use real-time likes for UUID posts
  const { liked, likesCount, isLoading, toggleLike } = 
    isUUID 
      ? usePostLikes(post.id, post.likes || 0)
      : { liked: false, likesCount: post.likes || 0, isLoading: false, toggleLike: () => {} };
  
  const handleLike = () => {
    if (disableInteractions || isLoading) return;
    
    if (isUUID) {
      toggleLike();
    } else {
      // For demo posts, just use the regular like/unlike functions
      if (liked) {
        onUnlike(post.id);
      } else {
        onLike(post.id);
      }
    }
  };
  
  const handleDelete = (postId: string) => {
    if (onDelete) {
      if (!isUUID) {
        console.log('Demo mode: Cannot delete non-UUID post');
        return;
      }
      onDelete(postId);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div className="p-4">
        <PostHeader 
          author={post.author} 
          isAnonymous={post.isAnonymous || false} 
          createdAt={post.createdAt}
          postId={post.id}
          onDelete={handleDelete}
        />
        
        <PostContent content={post.content} />
        
        {post.images && post.images.length > 0 && (
          <PostImages images={post.images} />
        )}
        
        <PostInteractions 
          comments={post.comments || 0}
          likes={likesCount}
          liked={liked}
          disableInteractions={disableInteractions}
          onCommentClick={() => setShowComments(!showComments)}
          onLikeClick={handleLike}
          postId={post.id}
        />
        
        <PostComments
          postId={post.id}
          showComments={showComments}
          disableInteractions={disableInteractions}
          userLoggedIn={!!user}
        />
      </div>
    </div>
  );
};

export default PostCard;
