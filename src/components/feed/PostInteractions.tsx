
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, BarChart2, Share, Bookmark } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { likePost, unlikePost, checkIfPostLiked, getLikesCount } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

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
  likes: initialLikes, 
  liked: initialLiked,
  disableInteractions,
  onCommentClick, 
  onLikeClick,
  postId 
}: PostInteractionsProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    // Check if the post is liked by the current user
    const checkLikeStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await checkIfPostLiked(postId, user.id);
        setLiked(!!data);
        
        // Get the likes count
        const { count } = await getLikesCount(postId);
        if (count !== null) setLikes(count);
      } catch (err) {
        console.error('Error checking like status:', err);
      }
    };
    
    checkLikeStatus();
  }, [postId, user]);

  const handleLikeClick = async () => {
    if (disableInteractions || !user || isLiking) return;
    
    try {
      setIsLiking(true);
      
      if (liked) {
        await unlikePost(postId, user.id);
        setLiked(false);
        setLikes(prev => Math.max(0, prev - 1));
      } else {
        await likePost(postId, user.id);
        setLiked(true);
        setLikes(prev => prev + 1);
      }
      
      // Call the parent handler for any additional logic
      onLikeClick();
    } catch (err) {
      console.error('Error handling like:', err);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive"
      });
    } finally {
      setIsLiking(false);
    }
  };

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
        onClick={handleLikeClick}
        disabled={disableInteractions || isLiking}
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
