
import React, { useState } from 'react';
import { Post, PostCardProps } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { usePostLikes } from '@/hooks/usePostLikes';

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostImages from './PostImages';
import PostInteractions from './PostInteractions';
import PostComments from './PostComments';

const PostCard = ({ 
  post, 
  onLike, 
  onUnlike, 
  disableInteractions = false, 
  onDelete 
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  
  // Helper function to check if a string is a valid UUID
  const isUUID = (id: string): boolean => {
    if (!id) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };
  
  // Use real-time likes for all posts for better UX
  const { liked, likesCount, isLoading, toggleLike } = usePostLikes(post.id, post.likes || 0);
  
  const handleLike = () => {
    if (disableInteractions || isLoading) return;
    
    // Use the real-time toggle like function
    toggleLike();
    
    // Also notify parent component for non-UUID posts (demo posts)
    if (!isUUID(post.id)) {
      if (liked) {
        onUnlike(post.id);
      } else {
        onLike(post.id);
      }
    }
  };
  
  const handleDelete = (postId: string) => {
    if (onDelete) {
      if (!isUUID(postId)) {
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
