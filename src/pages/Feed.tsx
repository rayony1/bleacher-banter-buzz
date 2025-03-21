import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { FeedType } from '@/lib/types';
import { useFeed } from '@/hooks/useFeed';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { usePushNotificationsSetup } from '@/hooks/usePushNotificationsSetup';
import { useNetworkListener } from '@/hooks/useNetworkListener';
import { useCreatePostHandler } from '@/hooks/useCreatePostHandler';
import { useToast } from '@/hooks/use-toast';
import { cachePosts, getCachedPosts, isOnline } from '@/utils/offlineCache';
import { clearBadgeCount } from '@/utils/notifications/index';
import { Capacitor } from '@capacitor/core';

// Components
import IOSFeedHeader from '@/components/feed/IOSFeedHeader';
import FeedHeader from '@/components/feed/FeedHeader';
import FeedTabs from '@/components/feed/FeedTabs';
import FeedContent from '@/components/feed/FeedContent';
import FloatingCreateButton from '@/components/feed/FloatingCreateButton';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import FeedLoadingState from '@/components/feed/FeedLoadingState';
import FeedErrorState from '@/components/feed/FeedErrorState';
import EnhancedNotificationPrompt from '@/components/notifications/EnhancedNotificationPrompt';
import PostDialog from '@/components/feed/PostDialog';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<FeedType>('school');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
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
  } = useFeed(
    filter, 
    user?.id || '', 
    user?.school || ''
  );
  
  const { 
    networkStatus, 
    setNetworkStatus, 
    syncOfflinePosts 
  } = useOfflineSync(user, refreshPosts);
  
  useNetworkListener(setNetworkStatus, syncOfflinePosts, refreshPosts);
  
  const { 
    shouldPromptForPermission,
    requestPermission
  } = usePushNotificationsSetup(user);
  
  const { 
    handleCreatePost, 
    isCreatingPost 
  } = useCreatePostHandler(user, refreshPosts, () => setCreatePostOpen(false));
  
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      clearBadgeCount();
      
      const appStateListener = Capacitor.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          clearBadgeCount();
        }
      });
      
      return () => {
        appStateListener.remove();
      };
    }
  }, []);
  
  useEffect(() => {
    if (posts && posts.length > 0) {
      cachePosts(posts, filter);
    }
  }, [posts, filter]);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    const online = await isOnline();
    
    if (online) {
      await refreshPosts();
      toast({
        title: "Feed refreshed",
        description: "Your feed has been updated with the latest posts"
      });
    } else {
      toast({
        title: "You're offline",
        description: "Using cached posts. Connect to the internet to get the latest content.",
        variant: "destructive"
      });
    }
    
    setIsRefreshing(false);
  };

  const handleAcceptNotifications = () => {
    requestPermission();
  };

  const handleDeclineNotifications = () => {
    localStorage.setItem('notificationsPromptDismissed', 'true');
  };
  
  if (isUserLoading || (isLoading && !posts.length)) {
    return <FeedLoadingState filter={filter} onTabChange={setFilter} />;
  }
  
  if (error && process.env.NODE_ENV !== 'development') {
    return <FeedErrorState error={error} onRetry={refreshPosts} />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-black">
      {isMobile ? (
        <IOSFeedHeader 
          isRefreshing={isRefreshing} 
          onRefresh={handleRefresh} 
          isOffline={!networkStatus}
        />
      ) : (
        <FeedHeader 
          isRefreshing={isRefreshing} 
          onRefresh={handleRefresh} 
          isOffline={!networkStatus}
        />
      )}
      
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto">
          <FeedTabs activeTab={filter} onTabChange={(tab: FeedType) => setFilter(tab)} />
          
          {shouldPromptForPermission() && (
            <div className="px-4 pt-4">
              <EnhancedNotificationPrompt 
                onAccept={handleAcceptNotifications}
                onDecline={handleDeclineNotifications}
              />
            </div>
          )}
          
          <FeedContent 
            posts={posts} 
            onLike={likePost} 
            onUnlike={unlikePost} 
            onCreatePost={() => setCreatePostOpen(true)}
            onDeletePost={deletePost}
            isOffline={!networkStatus}
          />
        </div>
      </main>
      
      <FloatingCreateButton onClick={() => setCreatePostOpen(true)} />
      
      <PostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        onSubmit={handleCreatePost}
        isSubmitting={isCreatingPost}
        isOffline={!networkStatus}
      />
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Feed;
