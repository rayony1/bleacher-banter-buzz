
import React from 'react';
import { Heart, MessageCircle, Share, Bookmark, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  
  const handleBookmark = () => {
    if (disableInteractions) return;
    
    toast({
      title: "Post saved",
      description: "This post has been added to your bookmarks",
    });
  };
  
  const handleShare = () => {
    if (disableInteractions) return;
    
    // Get the current URL and append the post ID
    const shareUrl = `${window.location.origin}/post/${postId}`;
    
    // Try to use the Web Share API if available
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
        // Fallback to copying the URL
        copyToClipboard(shareUrl);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
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
  
  // Calculate a deterministic view count based on post ID and likes
  const getViewCount = () => {
    // Create a simple hash from the post ID
    const hash = postId.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    // Generate a view count that's relative to likes but feels realistic
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
        className="flex items-center space-x-1 group"
        onClick={handleBookmark}
        disabled={disableInteractions}
        aria-label="Bookmark post"
      >
        <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-[#2DD4BF] transition-colors">
          <Bookmark className="h-5 w-5" />
        </div>
      </button>
    </div>
  );
};

export default PostInteractions;
