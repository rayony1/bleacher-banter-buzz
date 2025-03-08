
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { checkIfPostLiked, getLikesCount } from '@/lib/supabase';

export const usePostLikes = (postId: string, initialLikesCount: number) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const { user } = useAuth();
  
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return;
      
      try {
        const { data } = await checkIfPostLiked(postId, user.id);
        setLiked(!!data);
        
        // Get the likes count
        const { count } = await getLikesCount(postId);
        if (count !== null) setLikesCount(count);
      } catch (err) {
        console.error('Error checking like status:', err);
      }
    };
    
    checkLikeStatus();
  }, [postId, user]);

  return {
    liked,
    likesCount,
    setLiked,
    setLikesCount
  };
};
