
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, MessageSquare, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import PostCard from '@/components/feed/PostCard';
import FeedTabs from '@/components/feed/FeedTabs';
import CreatePostButton from '@/components/feed/CreatePostButton';
import { useFeed } from '@/hooks/useFeed';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { Post, FeedType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, isEmailConfirmed } = useAuth();
  const [filter, setFilter] = useState<FeedType>('school');
  
  // Redirect if not logged in
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
  
  // Loading state
  if (isUserLoading || (isLoading && !posts)) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-20 pb-16'}`}>
          <div className="max-w-xl mx-auto px-2">
            <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
            <div className="mt-3 space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <div className="flex space-x-6">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
        {isMobile && <BottomNav />}
        {!isMobile && <Footer />}
      </div>
    );
  }
  
  // Show error
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-20 pb-16'}`}>
          <div className="max-w-xl mx-auto px-4">
            <Alert variant="destructive" className="mb-4">
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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-20 pb-16'}`}>
        <div className="max-w-xl mx-auto px-2">
          
          {/* Email confirmation warning */}
          {user && !isEmailConfirmed && (
            <Alert className="mb-4 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-400">Email not confirmed</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                Your email address is not confirmed. You can browse the app, but you won't be able to post, comment, or make predictions until you confirm your email.
                <Button 
                  variant="link" 
                  className="text-amber-600 dark:text-amber-400 p-0 h-auto font-semibold"
                  onClick={() => navigate('/auth')}
                >
                  Resend confirmation email
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
          
          <div className="flex justify-end mt-4 mb-3">
            <CreatePostButton onClick={handleCreatePostClick} />
          </div>
          
          <div className="space-y-3">
            {posts && posts.length > 0 ? (
              posts.map((post: Post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={likePost} 
                  onUnlike={unlikePost}
                  disableInteractions={!isEmailConfirmed}
                />
              ))
            ) : (
              <Card className="p-6 text-center border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Be the first to post in this feed!
                </p>
                <CreatePostButton onClick={handleCreatePostClick} />
              </Card>
            )}
          </div>
        </div>
      </main>
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Feed;
