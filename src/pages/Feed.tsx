
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import FeedTabs from '@/components/feed/FeedTabs';
import PostCard from '@/components/feed/PostCard';
import CreatePostButton from '@/components/feed/CreatePostButton';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { FeedType } from '@/lib/types';
import { useFeed } from '@/hooks/useFeed';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/use-mobile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Feed = () => {
  const [activeTab, setActiveTab] = useState<FeedType>('school');
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const { user, isEmailConfirmed } = useAuth();
  const { toast } = useToast();
  const { isMobile } = useMobile();
  
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
    
    if (!isEmailConfirmed) {
      toast({
        title: 'Email confirmation required',
        description: 'Please confirm your email address to create posts.',
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
  
  const handleLikeUnlike = (postId: string, isLiked: boolean) => {
    if (!isEmailConfirmed) {
      toast({
        title: 'Email confirmation required',
        description: 'Please confirm your email address to like posts.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-0 pb-20' : 'pt-24 pb-16'}`}>
        <div className={`${isMobile ? 'px-0' : 'container px-4'} mx-auto`}>
          <div className={`${isMobile ? 'w-full' : 'max-w-2xl mx-auto'}`}>
            {/* Email Confirmation Warning */}
            {user && !isEmailConfirmed && (
              <div className={`${isMobile ? 'px-3 mt-3' : 'mt-0 mb-4'}`}>
                <Alert variant="warning" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <Mail className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                  <AlertTitle className="text-amber-800 dark:text-amber-400">Email not confirmed</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
                    <p>You can browse content, but to post, comment, or like, please confirm your email address.</p>
                    <Button variant="link" asChild className="p-0 h-auto text-amber-600 dark:text-amber-400 font-normal underline hover:text-amber-800 dark:hover:text-amber-300">
                      <Link to="/auth">Go to verification page</Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          
            {/* Feed Tabs */}
            <div className={isMobile ? 'sticky top-[53px] z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-4' : ''}>
              <FeedTabs 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                schoolName={user?.school || 'Your School'}
                districtName="Metro District"
                stateName="California"
              />
            </div>
            
            {/* Posts List */}
            <div className={`${isMobile ? 'px-3' : ''} space-y-3 mt-2`}>
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
                    onLike={(postId) => handleLikeUnlike(postId, false)}
                    onUnlike={(postId) => handleLikeUnlike(postId, true)}
                    disableInteractions={!isEmailConfirmed}
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
      
      {isMobile ? <BottomNav /> : <Footer />}
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
