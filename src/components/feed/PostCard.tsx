
import React, { useState } from 'react';
import { Post, PostCardProps } from '@/lib/types';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/lib/auth';

import PostHeader from './PostHeader';
import PostContent from './PostContent';
import PostImages from './PostImages';
import PostInteractions from './PostInteractions';
import CommentsSection from './CommentsSection';

const PostCard = ({ post, onLike, onUnlike, disableInteractions = false }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const { user } = useAuth();
  
  const { 
    comments, 
    isLoading: isLoadingComments, 
    createComment, 
    isCreatingComment 
  } = useComments(post.id);
  
  const handleLike = () => {
    if (disableInteractions) return;
    
    if (liked) {
      onUnlike(post.id);
    } else {
      onLike(post.id);
    }
    setLiked(!liked);
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (disableInteractions) return;
    
    if (commentText.trim() !== '') {
      createComment(commentText);
      setCommentText('');
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
          likes={post.likes || 0}
          liked={liked}
          disableInteractions={disableInteractions}
          onCommentClick={() => setShowComments(!showComments)}
          onLikeClick={handleLike}
        />
        
        {showComments && (
          <CommentsSection
            comments={comments || []}
            isLoadingComments={isLoadingComments}
            commentText={commentText}
            setCommentText={setCommentText}
            handleSubmitComment={handleSubmitComment}
            isCreatingComment={isCreatingComment}
            disableInteractions={disableInteractions}
            showUser={!!user}
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
