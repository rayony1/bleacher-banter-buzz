
import { supabase } from './client';

/**
 * Register a device token for push notifications
 */
export const registerDeviceToken = async (userId: string, deviceToken: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_devices')
      .upsert({ 
        user_id: userId, 
        device_token: deviceToken,
        platform: getPlatformName(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'device_token'  // If token already exists, update it
      });
    
    if (error) {
      throw error;
    }
    
    console.log('Device token registered successfully');
  } catch (error) {
    console.error('Error registering device token:', error);
    throw error;
  }
};

/**
 * Remove a device token when user logs out
 */
export const removeDeviceToken = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('user_devices')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      throw error;
    }
    
    console.log('Device token removed successfully');
  } catch (error) {
    console.error('Error removing device token:', error);
    throw error;
  }
};

/**
 * Get the platform name
 */
const getPlatformName = (): string => {
  // Simple platform detection - could be improved with Capacitor.getPlatform()
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    return 'ios';
  } else if (/Android/.test(navigator.userAgent)) {
    return 'android';
  }
  return 'web';
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (userId: string, limit = 20) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return { data };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    return { error };
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { error };
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { error };
  }
};
