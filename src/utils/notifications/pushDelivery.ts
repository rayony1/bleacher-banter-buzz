
import { Capacitor } from '@capacitor/core';
import { handleDeepLink } from './deepLinking';
import { processNotificationData } from './formatters';
import { updateBadgeCount, clearBadgeCount } from './badgeManagement';
import { registerDeviceToken, removeDeviceToken } from './tokenManagement';
import { handleReceivedNotification } from './handlers/notificationReceiver';

// Re-export all notification utilities for backward compatibility
export {
  registerDeviceToken,
  removeDeviceToken,
  clearBadgeCount,
  handleReceivedNotification
};
