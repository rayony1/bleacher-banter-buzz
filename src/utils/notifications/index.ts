
// Re-export all notification-related utilities from one central file
export { registerDeviceToken, removeDeviceToken } from './tokenManagement';
export { handleReceivedNotification } from './handlers/notificationReceiver';
export { clearBadgeCount, updateBadgeCount } from './badgeManagement';
export { handleDeepLink } from './deepLinking';
export { processNotificationData } from './formatters';
export { 
  batchNotification, 
  processNotificationBatches, 
  setupNotificationBatching 
} from './grouping';

// Export common notification types
export type NotificationType = 'like' | 'comment' | 'game' | 'prediction' | 'generic';
