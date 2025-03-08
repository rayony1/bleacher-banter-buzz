
import React from 'react';
import { Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Comment } from '@/hooks/useComments';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  comments: Comment[];
  isLoadingComments: boolean;
  commentText: string;
  setCommentText: (text: string) => void;
  handleSubmitComment: (e: React.FormEvent) => void;
  isCreatingComment: boolean;
  disableInteractions: boolean;
  showUser: boolean;
}

const CommentsSection = ({
  comments,
  isLoadingComments,
  commentText,
  setCommentText,
  handleSubmitComment,
  isCreatingComment,
  disableInteractions,
  showUser
}: CommentsSectionProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      {showUser && (
        <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
          <div className="flex-1 flex items-end gap-2">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post your reply"
              className="min-h-[60px] flex-1 text-sm resize-none border-gray-200 dark:border-gray-800 focus:border-[#2DD4BF] rounded-xl"
              disabled={disableInteractions}
            />
            <Button 
              type="submit" 
              size="sm" 
              variant="ghost" 
              className="rounded-full mb-1 h-9 w-9 p-0 bg-[#2DD4BF] text-white hover:bg-[#26B8A5]"
              disabled={isCreatingComment || commentText.trim() === '' || disableInteractions}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}
      
      <div className="space-y-3">
        {isLoadingComments ? (
          <p className="text-center text-sm text-gray-500 py-2">Loading replies...</p>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-center text-sm text-gray-500 py-2">No replies yet. Be the first to reply!</p>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
