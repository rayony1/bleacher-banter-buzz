
import { useState } from 'react';
import { Post } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { createPost as createPostAPI, deletePost as deletePostAPI } from '@/lib/supabase/posts';
import { likePost as likePostAPI, unlikePost as unlikePostAPI } from '@/lib/supabase/likes';

export const usePostActions = (
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Function to create a new post
  const createPost = async ({ content, isAnonymous, images }: { content: string; isAnonymous: boolean; images: string[] }) => {
    if (!user || !user.id || !user.school) {
      toast({
        title: "Error",
        description: "You must be logged in to create a post",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCreatingPost(true);
      
      const { data, error } = await createPostAPI(content, user.school, user.id, isAnonymous, images);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      
      // We don't need to update the posts list here as the realtime subscription will handle it
      
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPost(false);
    }
  };

  // Function to like a post
  const likePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to like a post",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await likePostAPI(postId, user.id);
      
      if (error) throw error;
      
      // Update the UI optimistically
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? { ...post, likeCount: post.likeCount + 1, liked: true }
            : post
        )
      );
      
    } catch (err) {
      console.error('Error liking post:', err);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to unlike a post
  const unlikePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to unlike a post",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await unlikePostAPI(postId, user.id);
      
      if (error) throw error;
      
      // Update the UI optimistically
      setPosts(currentPosts =>
        currentPosts.map(post =>
          post.id === postId
            ? { ...post, likeCount: Math.max(0, post.likeCount - 1), liked: false }
            : post
        )
      );
      
    } catch (err) {
      console.error('Error unliking post:', err);
      toast({
        title: "Error",
        description: "Failed to unlike post. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to delete a post
  const deletePost = async (postId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to delete a post",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await deletePostAPI(postId);
      
      if (error) throw error;
      
      // Remove the post from the UI
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    createPost,
    likePost,
    unlikePost,
    deletePost,
    isCreatingPost,
  };
};
