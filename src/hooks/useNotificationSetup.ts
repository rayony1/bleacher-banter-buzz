
import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { checkAllPermissions } from '@/utils/iOSPermissions';
import { initializePushNotifications } from '@/utils/pushNotifications';

export const useNotificationSetup = (user: User | null) => {
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  
  // Set up push notifications
  useEffect(() => {
    let cleanupNotifications: (() => void) | undefined;
    
    const setupNotifications = async () => {
      if (!user || !user.id || user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
        console.log('Skipping push notification setup for demo user or development');
        return;
      }
      
      try {
        cleanupNotifications = await initializePushNotifications(user.id);
        
        // Show notification prompt after a delay
        setTimeout(() => {
          // Only show if we haven't shown it before
          const hasShownPrompt = localStorage.getItem('notification_prompt_shown');
          if (!hasShownPrompt) {
            setShowNotificationPrompt(true);
            localStorage.setItem('notification_prompt_shown', 'true');
          }
        }, 5000);
      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };
    
    if (user) {
      setupNotifications();
    }
    
    return () => {
      if (cleanupNotifications) {
        cleanupNotifications();
      }
    };
  }, [user]);
  
  // Check iOS permissions
  useEffect(() => {
    const checkPermissions = async () => {
      if (process.env.NODE_ENV === 'production') {
        await checkAllPermissions();
      }
    };
    
    checkPermissions();
  }, []);
  
  const handleNotificationResponse = (granted: boolean) => {
    setShowNotificationPrompt(false);
    console.log('Notification permission response:', granted);
  };
  
  return {
    showNotificationPrompt,
    handleNotificationResponse
  };
};
