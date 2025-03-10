
import { supabase } from '@/lib/supabase/client';
import { isOnline } from '@/utils/offline/networkStatus';
import { Capacitor } from '@capacitor/core';

/**
 * Register device token with Supabase for push notifications
 */
export const registerDeviceToken = async (userId: string, token: string): Promise<void> => {
  try {
    if (await isOnline()) {
      const platform = Capacitor.getPlatform();
      
      await supabase
        .from('user_devices')
        .upsert({ 
          user_id: userId, 
          device_token: token,
          platform: platform,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,device_token' 
        });
      
      console.log(`Device token registered successfully for ${platform} platform`);
    } else {
      console.log('Unable to register device token while offline, will try later');
    }
  } catch (error) {
    console.error('Error registering device token:', error);
  }
};

/**
 * Remove device token from Supabase when notifications are disabled
 */
export const removeDeviceToken = async (userId: string, token: string): Promise<void> => {
  try {
    if (await isOnline()) {
      await supabase
        .from('user_devices')
        .delete()
        .match({ user_id: userId, device_token: token });
      
      console.log('Device token removed successfully');
    }
  } catch (error) {
    console.error('Error removing device token:', error);
  }
};
