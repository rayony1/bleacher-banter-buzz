
import { PushNotifications } from '@capacitor/push-notifications';
import { isNative } from './platform';

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
