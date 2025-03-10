
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Update app badge count
 */
export const updateBadgeCount = async (notificationType: string): Promise<void> => {
  try {
    // Get current badge count from local storage
    const currentBadgeCount = parseInt(localStorage.getItem('badgeCount') || '0', 10);
    const newBadgeCount = currentBadgeCount + 1;
    
    // Update local storage
    localStorage.setItem('badgeCount', newBadgeCount.toString());
    
    // Update device badge if on native platform
    if (Capacitor.isNativePlatform()) {
      // PushNotifications plugin doesn't have setBadgeCount directly
      // We'll use removeAllDeliveredNotifications as a workaround
      await PushNotifications.removeAllDeliveredNotifications();
    }
  } catch (error) {
    console.error('Error updating badge count:', error);
  }
};

/**
 * Clear badge count
 */
export const clearBadgeCount = async (): Promise<void> => {
  try {
    // Update local storage
    localStorage.setItem('badgeCount', '0');
    
    // Clear device badge if on native platform
    if (Capacitor.isNativePlatform()) {
      // PushNotifications plugin doesn't have setBadgeCount directly
      // We'll use removeAllDeliveredNotifications as a workaround
      await PushNotifications.removeAllDeliveredNotifications();
      await PushNotifications.removeAllListeners();
    }
  } catch (error) {
    console.error('Error clearing badge count:', error);
  }
};
