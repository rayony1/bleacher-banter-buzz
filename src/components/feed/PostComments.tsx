
import React, { useState } from 'react';
import { useComments } from '@/hooks/useComments';
import CommentsSection from './CommentsSection';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { 
    comments, 
    isLoading: isLoadingComments, 
    createComment, 
    isCreatingComment,
    error
  } = useComments(postId);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disableInteractions) return;
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on posts",
        variant: "destructive"
      });
      return;
    }
    
    if (commentText.trim() !== '') {
      try {
        await createComment(commentText);
        setCommentText('');
        
        toast({
          title: "Comment posted",
          description: "Your comment has been added to the discussion"
        });
      } catch (err) {
        console.error('Error posting comment:', err);
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to post comment",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Empty comment",
        description: "Please enter some text for your comment",
        variant: "destructive"
      });
    }
  };

  if (!showComments) return null;
  
  if (error) {
    console.error('Comments error:', error);
  }
  
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
