import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageSquare, AlertTriangle, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import PostCard from '@/components/feed/PostCard';
import FeedTabs from '@/components/feed/FeedTabs';
import EmailConfirmationBanner from '@/components/auth/EmailConfirmationBanner';
import CreatePostButton from '@/components/feed/CreatePostButton';
import { useFeed } from '@/hooks/useFeed';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Post, FeedType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, isEmailConfirmed } = useAuth();
  const [filter, setFilter] = useState<FeedType>('school');
  
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
  
  const handleCreatePostClick = () => {
    console.log('Create post button clicked');
    // This would typically open a modal or navigate to a create post page
  };
  
  if (isUserLoading || (isLoading && !posts)) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-[600px] mx-auto px-4 py-3 flex justify-between items-center">
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                  {user.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8"></div>
            )}
            
            <div className="text-xl font-bold">Bleacher Banter</div>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <main className="flex-1">
          <div className="max-w-[600px] mx-auto">
            <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
            
            <div className="animate-pulse space-y-0">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm m-4 p-4">
                  <div className="flex space-x-3">
                    <Skeleton className="h-12 w-12 rounded-full border-2 border-[#2DD4BF]" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-16 w-full" />
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-10" />
                        <Skeleton className="h-5 w-10" />
                      </div>
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
            {user ? (
              <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                  {user.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-8 w-8"></div>
            )}
            
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
          {user ? (
            <Avatar className="h-8 w-8 border-2 border-[#2DD4BF]">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-[#2DD4BF]/10 text-[#2DD4BF]">
                {user.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8"></div>
          )}
          
          <div className="text-xl font-bold">Bleacher Banter</div>
          
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto">
          {user && !isEmailConfirmed && (
            <EmailConfirmationBanner userEmail={user.email} compact={true} />
          )}
          
          <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
          
          {posts && posts.length > 0 ? (
            <div className="space-y-4 p-4">
              {posts.map((post: Post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={likePost} 
                  onUnlike={unlikePost}
                  disableInteractions={!isEmailConfirmed}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl shadow-sm m-4">
              <p className="mb-4">No posts in this feed yet</p>
              <Button 
                onClick={handleCreatePostClick}
                className="rounded-full px-4 py-2 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
                disabled={!isEmailConfirmed}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create post
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Button
        onClick={handleCreatePostClick}
        className="fixed bottom-20 right-4 md:right-6 rounded-full shadow-lg w-14 h-14 p-0 z-10 bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
        aria-label="Create new post"
        disabled={!isEmailConfirmed}
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Feed;
