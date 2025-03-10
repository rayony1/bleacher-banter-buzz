
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import { Comment } from '@/hooks/comments/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const timeAgo = formatDistanceToNow(comment.createdAt, { addSuffix: true });
  
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.author?.avatar || '/placeholder.svg'} alt={comment.author?.username} />
        <AvatarFallback>{comment.author?.username.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {comment.author?.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {timeAgo}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            @{comment.author?.username.toLowerCase().replace(/\s/g, '')}
          </span>
        </div>
        <p className="text-[15px] text-gray-900 dark:text-gray-100 mt-1">{comment.content}</p>
        
        <div className="flex items-center mt-2 space-x-6 text-gray-500 dark:text-gray-400 text-sm">
          <button className="flex items-center space-x-1 hover:text-[#2DD4BF]">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-[#2DD4BF]">
            <Heart className="h-3.5 w-3.5" />
            <span>{Math.floor(Math.random() * 5)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
