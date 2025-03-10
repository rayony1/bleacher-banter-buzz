
import { Capacitor } from '@capacitor/core';
import { handleDeepLink } from './deepLinking';
import { processNotificationData } from './formatters';
import { updateBadgeCount, clearBadgeCount } from './badgeManagement';
import { registerDeviceToken, removeDeviceToken } from './tokenManagement';

export {
  registerDeviceToken,
  removeDeviceToken,
  clearBadgeCount
};

/**
 * Handle a received push notification
 */
export const handleReceivedNotification = (notification: any): void => {
  console.log('Push notification received:', notification);
  
  const { type, targetId, title, body } = processNotificationData(
    notification.data || {}
  );
  
  // Store the last notification for possible future use
  localStorage.setItem('lastNotification', JSON.stringify({
    type,
    targetId,
    title,
    body,
    receivedAt: new Date().toISOString()
  }));
  
  // Check if the notification was clicked/tapped
  const isActionPerformed = notification.actionId !== undefined;
  
  if (isActionPerformed) {
    // If the notification was tapped, handle deep linking
    handleDeepLink(type, targetId);
  } else {
    // If the notification was received in the foreground, show in-app notification
    console.log(`In-app notification: ${title} - ${body}`);
  }
  
  // Update badge count if on native platform
  if (Capacitor.isNativePlatform()) {
    updateBadgeCount(type);
  }
};
