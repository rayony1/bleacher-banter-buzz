import React from 'react';
import { Heart, MessageCircle, Share, Bookmark, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePostBookmarks } from '@/hooks/usePostBookmarks';

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
  const { toast } = useToast();
  const { isBookmarked, toggleBookmark } = usePostBookmarks(postId);
  
  const handleBookmark = () => {
    if (disableInteractions) return;
    toggleBookmark();
  };
  
  const handleShare = () => {
    if (disableInteractions) return;
    
    const shareUrl = `${window.location.origin}/post/${postId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post',
        text: 'I found this interesting post',
        url: shareUrl,
      })
      .then(() => {
        console.log('Post shared successfully');
      })
      .catch((error) => {
        console.error('Error sharing post:', error);
        copyToClipboard(shareUrl);
      });
    } else {
      copyToClipboard(shareUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Post link copied to clipboard",
        });
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive"
        });
      });
  };
  
  const getViewCount = () => {
    const hash = postId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return Math.max(
      likes * 10 + (hash % 100),
      20 + (hash % 50)
    );
  };
  
  return (
    <div className="flex items-center justify-between mt-4 text-gray-500 dark:text-gray-400">
      <button 
        className="flex items-center space-x-1 group"
        onClick={onCommentClick}
        disabled={disableInteractions}
        aria-label="View comments"
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <MessageCircle className="h-5 w-5" />
        </div>
        <span className="text-sm group-hover:text-[#2DD4BF]">{comments}</span>
      </button>
      
      <button 
        className="flex items-center space-x-1 group"
        onClick={handleShare}
        disabled={disableInteractions}
        aria-label="Share post"
      >
        <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <Share className="h-5 w-5" />
        </div>
        <span className="text-sm group-hover:text-[#2DD4BF]">Share</span>
      </button>
      
      <button 
        className={`flex items-center space-x-1 group ${liked ? 'text-[#2DD4BF]' : ''}`}
        onClick={onLikeClick}
        disabled={disableInteractions}
        aria-label={liked ? "Unlike post" : "Like post"}
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
        disabled={true}
        aria-label="View stats"
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <BarChart2 className="h-5 w-5" />
        </div>
        <span className="text-sm group-hover:text-[#2DD4BF]">{getViewCount()}</span>
      </button>
      
      <button 
        className={`flex items-center space-x-1 group ${isBookmarked ? 'text-[#2DD4BF]' : ''}`}
        onClick={handleBookmark}
        disabled={disableInteractions}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
      >
        <div className={`p-2 rounded-full ${
          isBookmarked 
            ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' 
            : 'group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF]'
        } transition-colors`}>
          <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-[#2DD4BF]' : ''}`} />
        </div>
      </button>
    </div>
  );
};

export default PostInteractions;
