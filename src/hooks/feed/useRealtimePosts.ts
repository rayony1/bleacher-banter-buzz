
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { FeedType, Post } from '@/lib/types';
import { RealtimePostPayload } from './types';
import { mapDbPostToPost } from './utils';

// Hook for setting up realtime post updates
export const useRealtimePosts = (
  feedType: FeedType, 
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Set up realtime subscription
  useEffect(() => {
    // Skip realtime subscription for demo users or when not logged in
    if (!user || !user.id || user.id === 'demo-user-id') {
      console.log('Demo mode: Skipping realtime subscription');
      return;
    }
    
    console.log('Setting up realtime subscription for', feedType);
    
    // Create a channel for posts
    const channel = supabase.channel('public:posts');
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        async (payload) => {
          console.log('New post event received:', payload);
          
          try {
            // For demo or non-logged-in users, just ignore realtime updates
            if (!user.id || user.id === 'demo-user-id') {
              return;
            }
            
            // Type guard to ensure payload.new exists and has required fields
            if (!payload.new || typeof payload.new !== 'object') {
              console.warn('Invalid payload received:', payload);
              return;
            }
            
            const newPost = payload.new as { post_id?: string };
            if (!newPost.post_id) {
              console.warn('Received payload without post_id:', payload);
              return;
            }
            
            try {
              const { data, error } = await supabase
                .rpc('get_feed_posts', { 
                  feed_type: feedType, 
                  user_uuid: user.id 
                })
                .eq('post_id', newPost.post_id)
                .single();
              
              if (error) {
                console.error('Error fetching new post:', error);
                return;
              }
              
              if (data) {
                // Add the new post to the top of the list
                const mappedPost = mapDbPostToPost(data);
                setPosts(currentPosts => [mappedPost, ...currentPosts]);
                
                // Show a toast notification
                toast({
                  title: "New post",
                  description: "Someone just added a new post to your feed",
                });
              }
            } catch (err) {
              console.error('Error processing realtime post:', err);
            }
          } catch (err) {
            console.error('Error in realtime handler:', err);
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });
    
    // Clean up the subscription when the component unmounts
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [feedType, user, setPosts, toast]);
};
