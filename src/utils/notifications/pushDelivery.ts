
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/lib/supabase/client';
import { isOnline } from '@/utils/offline/networkStatus';

/**
 * Register device token with Supabase for push notifications
 */
export const registerDeviceToken = async (userId: string, token: string): Promise<void> => {
  try {
    // Only register if online
    if (await isOnline()) {
      await supabase
        .from('user_devices')
        .upsert({ 
          user_id: userId, 
          device_token: token,
          platform: 'ios', // In future, detect platform dynamically
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,device_token' 
        });
      
      console.log('Device token registered successfully');
    } else {
      console.log('Unable to register device token while offline, will try later');
      // Could queue this operation for later with offline queue
    }
  } catch (error) {
    console.error('Error registering device token:', error);
  }
};

/**
 * Remove device token from Supabase when notifications are disabled
 */
export const removeDeviceToken = async (userId: string, token: string): Promise<void> => {
  try {
    if (await isOnline()) {
      await supabase
        .from('user_devices')
        .delete()
        .match({ user_id: userId, device_token: token });
      
      console.log('Device token removed successfully');
    }
  } catch (error) {
    console.error('Error removing device token:', error);
  }
};

/**
 * Handle a received push notification
 */
export const handleReceivedNotification = (notification: any): void => {
  // Log the notification for debugging
  console.log('Push notification received:', notification);
  
  // Process different notification types based on the payload
  // In a real app, you might navigate to specific screens here
  const notificationType = notification.data?.type;
  
  switch (notificationType) {
    case 'like':
      // Handle a like notification
      console.log('Like notification:', notification.data?.postId);
      break;
    case 'comment':
      // Handle a comment notification
      console.log('Comment notification:', notification.data?.postId);
      break;
    case 'game':
      // Handle a game update notification
      console.log('Game notification:', notification.data?.gameId);
      break;
    default:
      // Handle other notification types
      console.log('Generic notification');
  }
};
