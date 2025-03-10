
// Notification grouping and batching utility
import { updateBadgeCount } from './badgeManagement';

interface NotificationBatch {
  [key: string]: {
    count: number;
    latest: {
      title: string;
      body: string;
      type: string;
      targetId: string;
    };
  };
}

// Track batched notifications in memory
const notificationBatches: NotificationBatch = {};

/**
 * Add notification to batch
 */
export const batchNotification = (
  type: string,
  targetId: string,
  title: string,
  body: string,
): void => {
  const key = `${type}:${targetId}`;
  
  if (!notificationBatches[key]) {
    notificationBatches[key] = {
      count: 0,
      latest: { title, body, type, targetId }
    };
  }
  
  notificationBatches[key].count += 1;
  notificationBatches[key].latest = { title, body, type, targetId };
  
  // Update badge count for each notification (don't batch badge updates)
  updateBadgeCount(type);
};

/**
 * Process batched notifications to show grouped notifications
 */
export const processNotificationBatches = (): void => {
  if (typeof document === 'undefined') return;
  
  Object.entries(notificationBatches).forEach(([key, batch]) => {
    const { count, latest } = batch;
    const { title, body, type, targetId } = latest;
    
    // Create modified title/body for batched notifications
    const batchedTitle = count > 1 ? `${title} (${count})` : title;
    const batchedBody = count > 1 ? `You have ${count} new notifications` : body;
    
    // Dispatch event for in-app notification
    const event = new CustomEvent('app:notification', { 
      detail: { 
        title: batchedTitle, 
        body: batchedBody, 
        type, 
        targetId 
      }
    });
    document.dispatchEvent(event);
    
    // Clear the batch after processing
    delete notificationBatches[key];
  });
};

/**
 * Set up periodic batch processing (call this once during app initialization)
 */
export const setupNotificationBatching = (intervalMs = 10000): () => void => {
  // Process immediately on first call
  processNotificationBatches();
  
  // Set interval for periodic processing
  const intervalId = setInterval(processNotificationBatches, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};
