
import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import CommentsSection from './CommentsSection';

interface PostCommentsProps {
  postId: string;
  showComments: boolean;
  disableInteractions: boolean;
  userLoggedIn: boolean;
}

const PostComments = ({ 
  postId, 
  showComments, 
  disableInteractions,
  userLoggedIn
}: PostCommentsProps) => {
  const [commentText, setCommentText] = useState('');
  
  const { 
    comments, 
    isLoading: isLoadingComments, 
    createComment, 
    isCreatingComment 
  } = useComments(postId);
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (disableInteractions) return;
    
    if (commentText.trim() !== '') {
      createComment(commentText);
      setCommentText('');
    }
  };

  if (!showComments) return null;
  
  return (
    <CommentsSection
      comments={comments || []}
      isLoadingComments={isLoadingComments}
      commentText={commentText}
      setCommentText={setCommentText}
      handleSubmitComment={handleSubmitComment}
      isCreatingComment={isCreatingComment}
      disableInteractions={disableInteractions}
      showUser={userLoggedIn}
    />
  );
};

export default PostComments;
