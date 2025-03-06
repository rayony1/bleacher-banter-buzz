
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeedTabs from '@/components/feed/FeedTabs';
import PostCard from '@/components/feed/PostCard';
import CreatePostButton from '@/components/feed/CreatePostButton';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { FeedType } from '@/lib/types';
import { useFeed } from '@/hooks/useFeed';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const Feed = () => {
  const [activeTab, setActiveTab] = useState<FeedType>('school');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    posts, 
    isLoading, 
    error, 
    createPost, 
    likePost, 
    unlikePost 
  } = useFeed(activeTab);
  
  const handleTabChange = (tab: FeedType) => {
    setActiveTab(tab);
  };
  
  const handleOpenCreatePostModal = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a post.',
        variant: 'destructive',
      });
      return;
    }
    setIsCreatePostModalOpen(true);
  };
  
  const handleCloseCreatePostModal = () => {
    setIsCreatePostModalOpen(false);
  };
  
  const handleCreatePost = (content: string, isAnonymous: boolean, images: string[]) => {
    createPost({ content, isAnonymous, images });
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto">
            {/* Feed Tabs */}
            <FeedTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange}
              schoolName={user?.school || 'Your School'}
              districtName="Metro District"
              stateName="California"
            />
            
            {/* Posts List */}
            <div className="space-y-6">
              {isLoading ? (
                // Show skeleton loaders when loading
                Array.from({ length: 3 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              ) : error ? (
                <div className="text-center py-10 text-red-500">
                  <p>Error loading posts. Please try again later.</p>
                  <p className="text-sm">{(error as Error).message}</p>
                </div>
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onLike={likePost}
                    onUnlike={unlikePost}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Create Post Button */}
          <CreatePostButton onClick={handleOpenCreatePostModal} />
          
          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            onClose={handleCloseCreatePostModal}
            onCreatePost={handleCreatePost}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Skeleton loader for posts
const PostSkeleton = () => (
  <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden p-4">
    <div className="flex items-start gap-3 mb-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="space-y-2 mb-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <Skeleton className="h-40 w-full rounded-lg mb-4" />
    <div className="flex justify-between pt-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export default Feed;
