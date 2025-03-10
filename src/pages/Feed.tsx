import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FeedTabs from '@/components/feed/FeedTabs';
import CreatePostForm from '@/components/feed/CreatePostForm';
import { useFeed } from '@/hooks/useFeed';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { FeedType } from '@/lib/types';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import { createPost } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import FeedHeader from '@/components/feed/FeedHeader';
import FeedLoadingState from '@/components/feed/FeedLoadingState';
import FeedErrorState from '@/components/feed/FeedErrorState';
import FeedContent from '@/components/feed/FeedContent';
import FloatingCreateButton from '@/components/feed/FloatingCreateButton';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();
  const [filter, setFilter] = useState<FeedType>('school');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    // Only navigate to auth if not in development mode
    if (!isUserLoading && !user && process.env.NODE_ENV !== 'development') {
      navigate('/auth');
    }
  }, [user, isUserLoading, navigate]);
  
  const {
    posts,
    isLoading,
    error,
    likePost,
    unlikePost,
    refreshPosts,
    deletePost
  } = useFeed(filter);
  
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
      
      // Just show a toast for demo users or development mode
      if (!user.id || user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          setCreatePostOpen(false);
          toast({
            title: "Demo mode",
            description: "Post creation simulated in demo mode"
          });
          refreshPosts();
        }, 1000);
        return;
      }
      
      // Create post in Supabase
      await createPost(content, user.school, user.id, false, imageUrl ? [imageUrl] : undefined);
      
      setCreatePostOpen(false);
      toast({
        title: "Post created!",
        description: "Your post has been published"
      });
      
      // Refresh the feed to show the new post
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
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPosts();
    setIsRefreshing(false);
    
    toast({
      title: "Feed refreshed",
      description: "Your feed has been updated with the latest posts"
    });
  };
  
  // Show loading state while waiting for user or posts
  if (isUserLoading || (isLoading && !posts.length)) {
    return <FeedLoadingState filter={filter} onTabChange={setFilter} />;
  }
  
  // Never show error state in development mode
  if (error && process.env.NODE_ENV !== 'development') {
    return <FeedErrorState />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <FeedHeader isRefreshing={isRefreshing} onRefresh={handleRefresh} />
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto">
          <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
          
          <FeedContent 
            posts={posts} 
            onLike={likePost} 
            onUnlike={unlikePost} 
            onCreatePost={() => setCreatePostOpen(true)}
            onDeletePost={deletePost}
          />
        </div>
      </main>
      
      <FloatingCreateButton onClick={() => setCreatePostOpen(true)} />
      
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>
          <CreatePostForm 
            onSubmit={handleCreatePost} 
            isSubmitting={isCreatingPost} 
          />
        </DialogContent>
      </Dialog>
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Feed;
