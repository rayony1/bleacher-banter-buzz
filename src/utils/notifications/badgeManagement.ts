
import { PushNotifications } from '@capacitor/push-notifications';

/**
 * Update app badge count
 */
export const updateBadgeCount = async (notificationType: string): Promise<void> => {
  try {
    const currentBadgeCount = parseInt(localStorage.getItem('badgeCount') || '0', 10);
    const newBadgeCount = currentBadgeCount + 1;
    localStorage.setItem('badgeCount', newBadgeCount.toString());
    
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
    localStorage.setItem('badgeCount', '0');
    await PushNotifications.removeAllDeliveredNotifications();
    await PushNotifications.removeAllListeners();
  } catch (error) {
    console.error('Error clearing badge count:', error);
  }
};
