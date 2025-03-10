
import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { useAuth } from '@/lib/auth';
import { useToast } from './use-toast';
import { isNative } from '@/utils/platform';
import { registerDeviceToken, removeDeviceToken } from '@/lib/supabase/notifications';

export const usePushNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  // Check if we should enable push notification features
  const shouldEnablePushNotifications = () => {
    // Skip for demo mode or when not logged in
    if (!user || !user.id || user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
      console.log('Skipping push notification setup for demo user or development');
      return false;
    }
    
    // Only enable on native platforms
    if (!isNative()) {
      console.log('Skipping push notification setup for non-native platform');
      return false;
    }
    
    return true;
  };

  // Request permission from the user
  const requestPermission = async () => {
    if (!shouldEnablePushNotifications()) return;

    try {
      const result = await PushNotifications.requestPermissions();
      const permissionGranted = result.receive === 'granted';
      setHasPermission(permissionGranted);
      
      if (permissionGranted) {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive updates about new posts and likes",
        });
        
        await registerForPushNotifications();
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive updates. You can enable them in settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  // Register for push notifications
  const registerForPushNotifications = async () => {
    if (!shouldEnablePushNotifications()) return;

    try {
      // Register with device's push notification service
      await PushNotifications.register();
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  };

  // Clear notification badge count
  const clearNotifications = async () => {
    if (!shouldEnablePushNotifications() || !isRegistered) return;
    
    try {
      await PushNotifications.removeAllDeliveredNotifications();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  // Set up listeners for push notification events
  useEffect(() => {
    if (!shouldEnablePushNotifications()) return;

    // Handler for when registration is successful
    const tokenReceivedListener = PushNotifications.addListener('registration', 
      async (token) => {
        console.log('Push registration success, token:', token.value);
        
        if (user && user.id) {
          // Save token to Supabase for the user
          await registerDeviceToken(user.id, token.value);
        }
      }
    );
    
    // Handler for push notification received while app is in foreground
    const notificationReceivedListener = PushNotifications.addListener('pushNotificationReceived', 
      (notification) => {
        console.log('Push notification received:', notification);
        
        toast({
          title: notification.title || "New notification",
          description: notification.body || "",
        });
      }
    );
    
    // Handler for when user taps on a notification
    const notificationActionPerformedListener = PushNotifications.addListener('pushNotificationActionPerformed', 
      (action) => {
        console.log('Push notification action performed:', action);
        
        // Handle navigation based on notification type
        const data = action.notification.data;
        if (data && data.type === 'post' && data.postId) {
          // Navigate to post (this would need routing logic)
          console.log('Should navigate to post:', data.postId);
        }
      }
    );
    
    // Clean up listeners when component unmounts
    return () => {
      Promise.all([
        tokenReceivedListener.then(listener => listener.remove()),
        notificationReceivedListener.then(listener => listener.remove()),
        notificationActionPerformedListener.then(listener => listener.remove())
      ]).catch(error => {
        console.error('Error removing push notification listeners:', error);
      });
      
      // Remove device token when user logs out
      if (user && user.id) {
        removeDeviceToken(user.id).catch(error => {
          console.error('Error removing device token:', error);
        });
      }
    };
  }, [user]);

  return {
    hasPermission,
    isRegistered,
    requestPermission,
    clearNotifications
  };
};
