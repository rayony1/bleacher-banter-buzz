
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PostCard from '@/components/feed/PostCard';
import FeedTabs from '@/components/feed/FeedTabs';
import CreatePostForm from '@/components/feed/CreatePostForm';
import { useFeed } from '@/hooks/useFeed';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Post, FeedType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import { createPost } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();
  const [filter, setFilter] = useState<FeedType>('school');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate('/auth');
    }
  }, [user, isUserLoading, navigate]);
  
  const {
    posts,
    isLoading,
    error,
    likePost,
    unlikePost,
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
      
      // If using mock data, pass to the hook
      // In a real app, we would insert to the database
      await createPost(content, user.school, user.id, false, imageUrl ? [imageUrl] : undefined);
      
      setCreatePostOpen(false);
      toast({
        title: "Post created!",
        description: "Your post has been published"
      });
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
  
  if (isUserLoading || (isLoading && !posts)) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-xl font-bold">Bleacher Banter</div>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1">
          <div className="max-w-[600px] mx-auto">
            <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
            
            <div className="animate-pulse space-y-4 px-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <div className="flex justify-between pt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-xl font-bold">Bleacher Banter</div>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1">
          <div className="max-w-[600px] mx-auto px-4 py-6">
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load feed. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-xl font-bold">Bleacher Banter</div>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto">
          <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
          
          {posts && posts.length > 0 ? (
            <div className="space-y-4 p-4">
              {posts.map((post: Post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={likePost} 
                  onUnlike={unlikePost}
                  disableInteractions={false}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl shadow-sm m-4">
              <p className="mb-4">No posts in this feed yet</p>
              <Button 
                onClick={() => setCreatePostOpen(true)}
                className="rounded-full px-4 py-2 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create post
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Button
        onClick={() => setCreatePostOpen(true)}
        className="fixed bottom-20 right-4 md:right-6 rounded-full shadow-lg w-14 h-14 p-0 z-10 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
        aria-label="Create new post"
      >
        <Plus className="h-6 w-6" />
      </Button>
      
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
