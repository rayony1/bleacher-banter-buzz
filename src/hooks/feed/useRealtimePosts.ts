
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { FeedType } from '@/lib/types';
import { RealtimePostPayload } from './types';
import { mapDbPostToPost } from './utils';

// Hook for setting up realtime post updates
export const useRealtimePosts = (
  feedType: FeedType, 
  setPosts: React.Dispatch<React.SetStateAction<any[]>>
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;
    
    // Create a channel for posts
    const channel = supabase.channel('public:posts');
    
    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: feedType === 'school' ? `school_id=eq.${user.school}` : undefined,
        },
        async (payload: RealtimePostPayload) => {
          console.log('New post:', payload);
          
          // Fetch the new post to get full details
          if (payload.new && 'post_id' in payload.new) {
            const { data, error } = await supabase
              .rpc('get_feed_posts', { 
                feed_type: feedType, 
                user_uuid: user.id 
              })
              .eq('post_id', payload.new.post_id)
              .single();
            
            if (!error && data) {
              // Add the new post to the top of the list
              const newPost = mapDbPostToPost(data);
              setPosts(currentPosts => [newPost, ...currentPosts]);
              
              // Show a toast notification
              toast({
                title: "New post",
                description: "Someone just added a new post to your feed",
              });
            }
          }
        }
      )
      .subscribe();
    
    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [feedType, user, setPosts, toast]);
};
