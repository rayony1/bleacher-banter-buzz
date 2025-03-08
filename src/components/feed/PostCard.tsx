
import React, { useState } from 'react';
import { Post, PostCardProps } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { usePostLikes } from '@/hooks/usePostLikes';

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostImages from './PostImages';
import PostInteractions from './PostInteractions';
import PostComments from './PostComments';

const PostCard = ({ post, onLike, onUnlike, disableInteractions = false }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const { liked, likesCount, setLiked, setLikesCount } = usePostLikes(post.id, post.likes || 0);
  
  const handleLike = () => {
    if (disableInteractions) return;
    
    if (liked) {
      onUnlike(post.id);
      setLiked(false);
      setLikesCount(prev => Math.max(0, prev - 1));
    } else {
      onLike(post.id);
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div className="p-4">
        <PostHeader 
          author={post.author} 
          isAnonymous={post.isAnonymous || false} 
          createdAt={post.createdAt} 
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
