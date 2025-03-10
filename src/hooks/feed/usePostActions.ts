
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Post } from '@/lib/types';
import { deletePost as deletePostApi } from '@/lib/supabase/posts';

// Hook for post actions (like, unlike, create, delete)
export const usePostActions = (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  // Demo mode - handle liking posts
  const likePost = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, likeCount: post.likeCount + 1 } 
          : post
      )
    );
    
    toast({
      title: 'Post liked!',
      description: 'Demo mode: Like count updated',
    });
  };
  
  // Demo mode - handle unliking posts
  const unlikePost = (postId: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1), likeCount: Math.max(0, post.likeCount - 1) } 
          : post
      )
    );
    
    toast({
      title: 'Post unliked',
      description: 'Demo mode: Like count updated',
    });
  };
  
  // Demo mode - handle creating posts
  const createPost = ({ content, isAnonymous, images }: { content: string; isAnonymous: boolean; images: string[] }) => {
    if (!user && !isAnonymous) return;
    
    const newPost: Post = {
      id: `new-post-${Date.now()}`,
      content,
      author: isAnonymous ? null : {
        id: user?.id || '',
        username: user?.username || '',
        name: user?.name || '',
        avatar: user?.avatar,
        badges: user?.badges || [],
      },
      isAnonymous,
      schoolName: 'Westview High',
      likes: 0,
      comments: 0,
      timestamp: new Date(),
      createdAt: new Date(),
      likeCount: 0,
      commentCount: 0,
      images
    };
    
    setPosts(currentPosts => [newPost, ...currentPosts]);
    
    toast({
      title: 'Post created!',
      description: 'Demo mode: Your post has been added to the feed',
    });
  };

  // Handle post deletion
  const handleDeletePost = async (postId: string) => {
    try {
      setIsCreatingPost(true);
      
      // For demo posts
      if (process.env.NODE_ENV === 'development' && !user?.id) {
        setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
        toast({
          title: 'Post deleted',
          description: 'Demo mode: Your post has been deleted',
        });
        return;
      }
      
      // Real deletion using Supabase
      const { data, error } = await deletePostApi(postId);
      
      if (error) throw error;
      
      if (data) {
        // Remove the post from the local state
        setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
        
        toast({
          title: 'Post deleted',
          description: 'Your post has been removed successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'You can only delete your own posts',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete the post',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingPost(false);
    }
  };

  return {
    likePost,
    unlikePost,
    createPost,
    deletePost: handleDeletePost,
    isCreatingPost
  };
};
