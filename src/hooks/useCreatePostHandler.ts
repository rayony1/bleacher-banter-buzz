
import { useState } from 'react';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { createPost } from '@/lib/supabase';
import { isOnline, queueOfflinePost } from '@/utils/offlineCache';

export const useCreatePostHandler = (
  user: User | null, 
  refreshPosts: () => Promise<void>,
  closeDialog: () => void
) => {
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { toast } = useToast();
  
  const handleCreatePost = async (content: string, imageUrl?: string) => {
    if (!user) {
      toast({
        title: "Not authorized",
        description: "You must be logged in to create a post",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsCreatingPost(true);
      
      if (!user.id || user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          closeDialog();
          toast({
            title: "Demo mode",
            description: "Post creation simulated in demo mode"
          });
          refreshPosts();
        }, 1000);
        return;
      }
      
      // Check if we're online
      const online = await isOnline();
      
      if (!online) {
        // Queue post for later if offline
        await queueOfflinePost({
          content,
          imageUrl,
          isAnonymous: false,
          createdAt: new Date().toISOString()
        });
        
        closeDialog();
        toast({
          title: "Post saved",
          description: "Your post will be uploaded when you're back online"
        });
        setIsCreatingPost(false);
        return;
      }
      
      await createPost(content, user.school, user.id, false, imageUrl ? [imageUrl] : undefined);
      
      closeDialog();
      toast({
        title: "Post created!",
        description: "Your post has been published"
      });
      
      refreshPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "Error",
        description: "Failed to create your post",
        variant: "destructive"
      });
    } finally {
      setIsCreatingPost(false);
    }
  };
  
  return {
    handleCreatePost,
    isCreatingPost
  };
};
