
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
import { Post } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading, isEmailConfirmed } = useAuth();
  const [filter, setFilter] = useState<'all' | 'school' | 'district' | 'athletes'>('school');
  
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
  
  // Loading state
  if (isUserLoading || (isLoading && !posts)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
          <div className="container mx-auto max-w-4xl">
            <FeedTabs activeTab={filter} onTabChange={setFilter} />
            <div className="mt-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-950 rounded-lg shadow p-5 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <div className="flex space-x-3">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
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
  
  // Show error
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
          <div className="container mx-auto max-w-4xl">
            <Alert variant="destructive" className="mb-6">
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={`flex-1 ${isMobile ? 'pt-16 pb-20' : 'pt-24 pb-16'} px-4`}>
        <div className="container mx-auto max-w-4xl">
          
          {/* Email confirmation warning */}
          {user && !isEmailConfirmed && (
            <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
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
          
          <FeedTabs activeTab={filter} onTabChange={setFilter} />
          
          <div className="flex justify-end mt-6">
            <CreatePostButton />
          </div>
          
          <div className="mt-6 space-y-6">
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
              <div className="bg-white dark:bg-gray-950 rounded-lg shadow p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Be the first to post in this feed!
                </p>
                <CreatePostButton />
              </div>
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
