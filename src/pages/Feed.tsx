
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/lib/auth';
import { FeedType } from '@/lib/types';
import { useFeed } from '@/hooks/useFeed';
import { checkAllPermissions } from '@/utils/iOSPermissions';
import { initializePushNotifications } from '@/utils/pushNotifications';
import IOSFeedHeader from '@/components/feed/IOSFeedHeader';
import FeedTabs from '@/components/feed/FeedTabs';
import CreatePostForm from '@/components/feed/CreatePostForm';
import { useToast, toast } from '@/hooks/use-toast';
import FeedHeader from '@/components/feed/FeedHeader';
import FeedLoadingState from '@/components/feed/FeedLoadingState';
import FeedErrorState from '@/components/feed/FeedErrorState';
import FeedContent from '@/components/feed/FeedContent';
import FloatingCreateButton from '@/components/feed/FloatingCreateButton';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import NotificationPermission from '@/components/notifications/NotificationPermission';
import { createPost } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { 
  cachePosts, 
  getCachedPosts, 
  queueOfflinePost, 
  initNetworkListener, 
  isOnline 
} from '@/utils/offlineCache';

const Feed = () => {
  const { isMobile } = useMobile();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useAuth();
  const [filter, setFilter] = useState<FeedType>('school');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  
  // Check network status on component mount
  useEffect(() => {
    const checkNetworkStatus = async () => {
      const online = await isOnline();
      setNetworkStatus(online);
    };
    
    checkNetworkStatus();
  }, []);
  
  // Set up network listener
  useEffect(() => {
    const cleanup = initNetworkListener(
      // Online callback
      () => {
        setNetworkStatus(true);
        toast({
          title: "You're back online",
          description: "Your feed will now update with the latest posts"
        });
        refreshPosts();
      },
      // Offline callback
      () => {
        setNetworkStatus(false);
        toast({
          title: "You're offline",
          description: "You can still view cached content and create posts",
          variant: "destructive"
        });
      }
    );
    
    return cleanup;
  }, []);
  
  // Set up push notifications
  useEffect(() => {
    let cleanupNotifications: (() => void) | undefined;
    
    const setupNotifications = async () => {
      if (!user || !user.id || user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
        console.log('Skipping push notification setup for demo user or development');
        return;
      }
      
      try {
        cleanupNotifications = await initializePushNotifications(user.id);
        
        // Show notification prompt after a delay
        setTimeout(() => {
          // Only show if we haven't shown it before
          const hasShownPrompt = localStorage.getItem('notification_prompt_shown');
          if (!hasShownPrompt) {
            setShowNotificationPrompt(true);
            localStorage.setItem('notification_prompt_shown', 'true');
          }
        }, 5000);
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };
    
    if (user) {
      setupNotifications();
    }
    
    return () => {
      if (cleanupNotifications) {
        cleanupNotifications();
      }
    };
  }, [user]);
  
  useEffect(() => {
    const checkPermissions = async () => {
      if (process.env.NODE_ENV === 'production') {
        await checkAllPermissions();
      }
    };
    
    checkPermissions();
  }, []);
  
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
  } = useFeed(filter);
  
  // Cache posts when they change
  useEffect(() => {
    if (posts && posts.length > 0) {
      cachePosts(posts, filter);
    }
  }, [posts, filter]);
  
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
      
      // Check if we're online
      const online = await isOnline();
      
      if (!online) {
        // Queue post for later if offline
        queueOfflinePost({
          content,
          imageUrl,
          isAnonymous: false,
          createdAt: new Date().toISOString()
        });
        setCreatePostOpen(false);
        setIsCreatingPost(false);
        return;
      }
      
      await createPost(content, user.school, user.id, false, imageUrl ? [imageUrl] : undefined);
      
      setCreatePostOpen(false);
      toast({
        title: "Post created!",
        description: "Your post has been published"
      });
      
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
    
    // Check if we're online before refreshing
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
  
  const handleNotificationResponse = (granted: boolean) => {
    setShowNotificationPrompt(false);
    console.log('Notification permission response:', granted);
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
          
          {showNotificationPrompt && (
            <div className="px-4 pt-4">
              <NotificationPermission onRequestComplete={handleNotificationResponse} />
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
      
      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create a post</DialogTitle>
          </DialogHeader>
          <CreatePostForm 
            onSubmit={handleCreatePost} 
            isSubmitting={isCreatingPost} 
            isOffline={!networkStatus}
          />
        </DialogContent>
      </Dialog>
      
      {isMobile && <BottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

export default Feed;
