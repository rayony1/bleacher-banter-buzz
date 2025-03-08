
import React from 'react';
import { Heart, MessageCircle, BarChart2, Share, Bookmark } from 'lucide-react';

interface PostInteractionsProps {
  comments: number;
  likes: number;
  liked: boolean;
  disableInteractions: boolean;
  onCommentClick: () => void;
  onLikeClick: () => void;
  postId: string;
}

const PostInteractions = ({ 
  comments, 
  likes, 
  liked,
  disableInteractions,
  onCommentClick, 
  onLikeClick,
  postId 
}: PostInteractionsProps) => {
  return (
    <div className="flex items-center justify-between mt-4 text-gray-500 dark:text-gray-400">
      <button 
        className="flex items-center space-x-1 group"
        onClick={onCommentClick}
        disabled={disableInteractions}
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <MessageCircle className="h-5 w-5" />
        </div>
        <span className="text-sm group-hover:text-[#2DD4BF]">{comments}</span>
      </button>
      
      <button 
        className="flex items-center space-x-1 group"
        disabled={disableInteractions}
      >
        <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <Share className="h-5 w-5" />
        </div>
        <span className="text-sm group-hover:text-[#2DD4BF]">0</span>
      </button>
      
      <button 
        className={`flex items-center space-x-1 group ${liked ? 'text-[#2DD4BF]' : ''}`}
        onClick={onLikeClick}
        disabled={disableInteractions}
      >
        <div className={`p-2 rounded-full ${
          liked 
            ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' 
            : 'group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-[#2DD4BF]'
        } transition-colors`}>
          <Heart className={`h-5 w-5 ${liked ? 'fill-[#2DD4BF]' : ''}`} />
        </div>
        <span className={`text-sm ${liked ? 'text-[#2DD4BF]' : 'group-hover:text-[#2DD4BF]'}`}>
          {likes}
        </span>
      </button>
      
      <button 
        className="flex items-center space-x-1 group"
        disabled={disableInteractions}
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <BarChart2 className="h-5 w-5" />
        </div>
        <span className="text-sm group-hover:text-[#2DD4BF]">{Math.floor(Math.random() * 1000)}</span>
      </button>
      
      <button 
        className="flex items-center space-x-1 group"
        disabled={disableInteractions}
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <Bookmark className="h-5 w-5" />
        </div>
      </button>
    </div>
  );
};

export default PostInteractions;
