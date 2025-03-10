
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

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
      if (Capacitor.getPlatform() === 'ios') {
        // For iOS, we can set the badge count directly
        await PushNotifications.removeAllDeliveredNotifications();
        const badgePlugin = (PushNotifications as any).setBadgeCount;
        if (typeof badgePlugin === 'function') {
          await badgePlugin({ count: newBadgeCount });
        }
      } else {
        // For Android, just clear notifications
        await PushNotifications.removeAllDeliveredNotifications();
      }
    }
    
    console.log(`Badge count updated to ${newBadgeCount}`);
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
      if (Capacitor.getPlatform() === 'ios') {
        // For iOS, we can set the badge count directly to zero
        const badgePlugin = (PushNotifications as any).setBadgeCount;
        if (typeof badgePlugin === 'function') {
          await badgePlugin({ count: 0 });
        }
      }
      
      // For all platforms, clear notifications
      await PushNotifications.removeAllDeliveredNotifications();
    }
    
    console.log('Badge count cleared');
  } catch (error) {
    console.error('Error clearing badge count:', error);
  }
};
