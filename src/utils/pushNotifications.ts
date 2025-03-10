
import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Request push notification permissions from the user
 * @returns Promise with the permission status
 */
export const requestPushPermissions = async (): Promise<boolean> => {
  try {
    // Check if the device supports push notifications
    const supported = await PushNotifications.checkPermissions();
    
    if (supported.receive === 'granted') {
      console.log('Push permissions already granted');
      return true;
    }
    
    // Request permission
    const permission = await PushNotifications.requestPermissions();
    
    if (permission.receive === 'granted') {
      console.log('Push permissions granted, registering...');
      await PushNotifications.register();
      return true;
    } else {
      console.log('Push permissions denied:', permission.receive);
      return false;
    }
  } catch (error) {
    console.error('Error requesting push permissions:', error);
    return false;
  }
};

/**
 * Register the device token with the server
 * @param userId The user's ID
 * @param token The device push token
 */
export const registerDeviceToken = async (userId: string, token: string): Promise<void> => {
  try {
    if (!userId || !token) {
      console.error('Missing userId or token for registration');
      return;
    }
    
    const { error } = await supabase
      .from('user_devices')
      .upsert({ 
        user_id: userId, 
        device_token: token,
        updated_at: new Date().toISOString()
      });
    
    if (error) {
      throw error;
    }
    
    console.log('Device token registered successfully');
  } catch (error) {
    console.error('Error registering device token:', error);
    throw error;
  }
};

/**
 * Initialize push notification listeners and handlers
 * @param userId The current user's ID
 */
export const initializePushNotifications = async (userId: string): Promise<(() => void) | undefined> => {
  if (!userId) {
    console.log('No user ID provided, skipping push notification setup');
    return;
  }
  
  try {
    // Request permissions first
    const permissionGranted = await requestPushPermissions();
    
    if (!permissionGranted) {
      console.log('Push notifications not permitted, skipping setup');
      return;
    }
    
    // Set up registration listener
    const registrationListener = await PushNotifications.addListener('registration', 
      (token) => {
        console.log('Push registration success:', token.value);
        registerDeviceToken(userId, token.value)
          .catch(err => console.error('Error in token registration:', err));
      }
    );
    
    // Set up notification received listener (app in foreground)
    const pushReceivedListener = await PushNotifications.addListener('pushNotificationReceived',
      (notification) => {
        console.log('Push received in foreground:', notification);
        
        // Show a toast for foreground notifications
        toast({
          title: notification.title || 'New notification',
          description: notification.body || '',
        });
      }
    );
    
    // Set up notification action listener (user tapped notification)
    const pushActionListener = await PushNotifications.addListener('pushNotificationActionPerformed',
      (action) => {
        console.log('Push action performed:', action);
        
        // Handle navigation based on notification data if needed
        const notificationData = action.notification.data;
        
        // Example: If notification is for a post, navigate to it
        if (notificationData && notificationData.postId) {
          // This would need to be implemented with a navigation context
          console.log('Should navigate to post:', notificationData.postId);
        }
      }
    );
    
    // Return cleanup function
    return () => {
      registrationListener.remove();
      pushReceivedListener.remove();
      pushActionListener.remove();
    };
  } catch (error) {
    console.error('Error setting up push notifications:', error);
    return;
  }
};
