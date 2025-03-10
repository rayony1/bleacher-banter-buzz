
import { PushNotifications } from '@capacitor/push-notifications';
import { isNative } from './platform';
import { supabase } from '@/lib/supabase';

/**
 * Check if push notifications are available for the current platform
 */
export const arePushNotificationsAvailable = async (): Promise<boolean> => {
  if (!isNative()) {
    return false;
  }
  
  try {
    const result = await PushNotifications.checkPermissions();
    return result.receive !== 'denied';
  } catch (error) {
    console.error('Error checking push notification permissions:', error);
    return false;
  }
};

/**
 * Initialize push notifications for a user
 * @param userId The user ID to register for notifications
 * @returns A cleanup function to remove listeners
 */
export const initializePushNotifications = async (userId: string): Promise<() => void> => {
  if (!isNative()) {
    console.log('Push notifications not available on web');
    return () => {};
  }
  
  try {
    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== 'granted') {
      console.log('Push notification permission not granted');
      return () => {};
    }

    // Register with native platforms
    await PushNotifications.register();
    
    // Set up listeners
    const registrationListener = await PushNotifications.addListener('registration', 
      async (token) => {
        console.log('Push registration success, token:', token.value);
        
        // Store the token in Supabase
        try {
          await supabase.from('user_devices').upsert({ 
            user_id: userId, 
            device_token: token.value,
            created_at: new Date().toISOString()
          });
          console.log('Device token saved to database');
        } catch (error) {
          console.error('Error saving device token:', error);
        }
      }
    );
    
    const notificationListener = await PushNotifications.addListener('pushNotificationReceived',
      (notification) => {
        console.log('Push notification received:', notification);
      }
    );
    
    const actionListener = await PushNotifications.addListener('pushNotificationActionPerformed',
      (notification) => {
        console.log('Push notification action performed:', notification);
      }
    );
    
    // Return cleanup function
    return () => {
      registrationListener.remove();
      notificationListener.remove();
      actionListener.remove();
    };
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return () => {};
  }
};

/**
 * Format a notification for display
 */
export const formatNotificationTitle = (type: string, actor?: string): string => {
  switch (type) {
    case 'like':
      return actor ? `${actor} liked your post` : 'Someone liked your post';
    case 'comment':
      return actor ? `${actor} commented on your post` : 'New comment on your post';
    case 'game':
      return 'Game Update';
    case 'prediction':
      return 'Prediction Results';
    default:
      return 'New Notification';
  }
};

/**
 * Format notification body text
 */
export const formatNotificationBody = (type: string, content?: string): string => {
  switch (type) {
    case 'like':
      return 'Your post received a new like';
    case 'comment':
      return content ? `"${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"` : 'Someone commented on your post';
    case 'game':
      return content || 'There has been an update to a game you are following';
    case 'prediction':
      return content || 'The results for your prediction are in!';
    default:
      return content || 'Tap to view more details';
  }
};
