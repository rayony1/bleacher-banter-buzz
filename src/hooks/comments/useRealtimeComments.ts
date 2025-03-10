
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Comment } from './types';

export const useRealtimeComments = (postId: string, onNewComment: (comment: Comment) => void) => {
  useEffect(() => {
    // Set up real-time subscription for new comments
    const channel = supabase
      .channel(`comments:${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          // Add new comment to state
          const newComment = payload.new as any;
          
          // Fetch user details for the new comment
          const fetchCommentAuthor = async () => {
            try {
              const { data: authorData } = await supabase
                .from('profiles')
                .select('username')
                .eq('user_id', newComment.user_id)
                .single();
              
              const commentWithAuthor: Comment = {
                id: newComment.id || newComment.comment_id,
                content: newComment.content,
                post_id: newComment.post_id,
                user_id: newComment.user_id,
                created_at: newComment.timestamp,
                updated_at: newComment.timestamp,
                createdAt: new Date(newComment.timestamp),
                author: {
                  username: authorData?.username || 'User',
                  avatar_url: '/placeholder.svg',
                  avatar: '/placeholder.svg'
                }
              };
              
              onNewComment(commentWithAuthor);
            } catch (err) {
              console.error('Error fetching comment author:', err);
              // Add comment without author details as fallback
              const fallbackComment: Comment = {
                id: newComment.id || newComment.comment_id,
                content: newComment.content,
                post_id: newComment.post_id,
                user_id: newComment.user_id,
                created_at: newComment.timestamp,
                updated_at: newComment.timestamp,
                createdAt: new Date(newComment.timestamp),
                author: {
                  username: 'User',
                  avatar_url: '/placeholder.svg',
                  avatar: '/placeholder.svg'
                }
              };
              
              onNewComment(fallbackComment);
            }
          };
          
          fetchCommentAuthor();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, onNewComment]);
};
