
import { handleDeepLink } from '../deepLinking';
import { processNotificationData } from '../formatters';
import { updateBadgeCount } from '../badgeManagement';
import { batchNotification, processNotificationBatches } from '../grouping';
import { Capacitor } from '@capacitor/core';

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
    // If the notification was received in the foreground, batch it
    console.log(`Batching notification: ${title} - ${body}`);
    
    if (typeof document !== 'undefined') {
      // Add to batch for grouped notifications
      batchNotification(type, targetId, title, body);
      
      // Process notification batches immediately if it's an important notification
      if (type === 'game') {
        processNotificationBatches();
      }
    }
  }
  
  // Update badge count for native platforms is now handled by the batching system
};
