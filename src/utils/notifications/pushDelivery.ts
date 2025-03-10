
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
  
  localStorage.setItem('lastNotification', JSON.stringify({
    type,
    targetId,
    title,
    body,
    receivedAt: new Date().toISOString()
  }));
  
  const isActionPerformed = notification.actionId !== undefined;
  
  if (isActionPerformed) {
    handleDeepLink(type, targetId);
  } else {
    console.log(`In-app notification: ${title} - ${body}`);
  }
  
  if (Capacitor.isNativePlatform()) {
    updateBadgeCount(type);
  }
};
