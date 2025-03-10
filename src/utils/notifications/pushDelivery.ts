import { PushNotifications } from '@capacitor/push-notifications';
import { supabase } from '@/lib/supabase/client';
import { isOnline } from '@/utils/offline/networkStatus';
import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';

/**
 * Register device token with Supabase for push notifications
 */
export const registerDeviceToken = async (userId: string, token: string): Promise<void> => {
  try {
    // Only register if online
    if (await isOnline()) {
      const platform = Capacitor.getPlatform();
      
      await supabase
        .from('user_devices')
        .upsert({ 
          user_id: userId, 
          device_token: token,
          platform: platform, // Dynamically detect platform
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,device_token' 
        });
      
      console.log(`Device token registered successfully for ${platform} platform`);
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
 * Handle deep linking to specific content based on notification type
 */
const handleDeepLink = async (type: string, targetId: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Deep linking only supported on native platforms');
    return;
  }

  try {
    let appUrl = '';
    
    switch (type) {
      case 'like':
      case 'comment':
        // Navigate to the specific post
        appUrl = `bleacher-banter-buzz://post/${targetId}`;
        break;
      case 'game':
        // Navigate to the specific game
        appUrl = `bleacher-banter-buzz://game/${targetId}`;
        break;
      case 'prediction':
        // Navigate to the prediction details
        appUrl = `bleacher-banter-buzz://prediction/${targetId}`;
        break;
      default:
        // Default to opening the app to the feed
        appUrl = 'bleacher-banter-buzz://feed';
    }
    
    // Open the deep link using AppLauncher
    await AppLauncher.openUrl({ url: appUrl });
    
  } catch (error) {
    console.error('Error handling deep link:', error);
    
    // Fallback: If deep linking fails, just open the app
    try {
      await AppLauncher.openUrl({ url: 'bleacher-banter-buzz://feed' });
    } catch (fallbackError) {
      console.error('Failed to open fallback deep link:', fallbackError);
    }
  }
};

/**
 * Process notification data and extract relevant information
 */
const processNotificationData = (data: any): { 
  type: string; 
  targetId: string;
  title: string;
  body: string;
} => {
  // Default values
  let type = 'generic';
  let targetId = '';
  let title = 'Bleacher Banter';
  let body = 'You have a new notification';
  
  // Extract data if available
  if (data) {
    type = data.type || type;
    targetId = data.postId || data.gameId || data.predictionId || targetId;
    
    // Extract title and body if explicitly provided
    if (data.title) title = data.title;
    if (data.body) body = data.body;
    
    // Or generate based on notification type
    if (!data.title) {
      switch (type) {
        case 'like':
          title = 'New Like';
          body = data.username ? `${data.username} liked your post` : 'Someone liked your post';
          break;
        case 'comment':
          title = 'New Comment';
          body = data.username ? `${data.username} commented on your post` : 'Someone commented on your post';
          break;
        case 'game':
          title = 'Game Update';
          body = data.gameTitle || "There is an update to a game you're following";
          break;
        case 'prediction':
          title = 'Prediction Result';
          body = 'Your prediction results are in!';
          break;
      }
    }
  }
  
  return { type, targetId, title, body };
};

/**
 * Handle a received push notification
 */
export const handleReceivedNotification = (notification: any): void => {
  // Log the notification for debugging
  console.log('Push notification received:', notification);
  
  // Process notification data
  const { type, targetId, title, body } = processNotificationData(
    notification.data || {}
  );
  
  // Save last notification in localStorage for debugging
  localStorage.setItem('lastNotification', JSON.stringify({
    type,
    targetId,
    title,
    body,
    receivedAt: new Date().toISOString()
  }));
  
  // Handle the notification based on whether the app is in foreground or was activated by notification
  const isActionPerformed = notification.actionId !== undefined;
  
  if (isActionPerformed) {
    // User tapped on notification - handle deep linking
    handleDeepLink(type, targetId);
  } else {
    // App is in foreground - show in-app notification if supported
    // We could implement an in-app notification system here
    console.log(`In-app notification: ${title} - ${body}`);
  }
  
  // Update badge count based on notification type
  if (Capacitor.isNativePlatform()) {
    updateBadgeCount(type);
  }
};

/**
 * Update app badge count
 */
const updateBadgeCount = async (notificationType: string): Promise<void> => {
  try {
    // Get current badge count from localStorage
    const currentBadgeCount = parseInt(localStorage.getItem('badgeCount') || '0', 10);
    
    // For now, just increment the count. In a more sophisticated system,
    // we might want to fetch actual counts from the server
    const newBadgeCount = currentBadgeCount + 1;
    
    // Update the stored count
    localStorage.setItem('badgeCount', newBadgeCount.toString());
    
    // Update the app badge using the correct method
    await PushNotifications.removeAllDeliveredNotifications();
    await PushNotifications.removeAllListeners();
  } catch (error) {
    console.error('Error updating badge count:', error);
  }
};

/**
 * Clear badge count
 */
export const clearBadgeCount = async (): Promise<void> => {
  try {
    // Reset stored count
    localStorage.setItem('badgeCount', '0');
    
    // Clear the app badge using the correct method
    await PushNotifications.removeAllDeliveredNotifications();
    await PushNotifications.removeAllListeners();
  } catch (error) {
    console.error('Error clearing badge count:', error);
  }
};
