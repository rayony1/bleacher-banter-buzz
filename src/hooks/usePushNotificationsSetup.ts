
import { useEffect, useState, useCallback } from 'react';
import { PushNotifications, PermissionStatus } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { registerDeviceToken, removeDeviceToken, handleReceivedNotification } from '@/utils/notifications/pushDelivery';
import { isOnline } from '@/utils/offline/networkStatus';

export const usePushNotificationsSetup = (user: User | null) => {
  const { toast } = useToast();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [isRegistered, setIsRegistered] = useState(false);
  
  // Check if push is supported on this device
  const isPushSupported = Capacitor.isPluginAvailable('PushNotifications') && Capacitor.isNativePlatform();
  
  // Initialize push notifications
  const initializePushNotifications = useCallback(async () => {
    if (!isPushSupported || !user) return;
    
    try {
      // Check current permission status
      const permResult = await PushNotifications.checkPermissions();
      // Handle possible 'prompt-with-rationale' by converting to 'prompt'
      const normalizedStatus = permResult.receive === 'prompt-with-rationale' ? 'prompt' : permResult.receive;
      setPermissionStatus(normalizedStatus as 'prompt' | 'granted' | 'denied' | 'unknown');
      
      // If already granted, register for push
      if (permResult.receive === 'granted') {
        await PushNotifications.register();
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error initializing push notifications:', error);
    }
  }, [isPushSupported, user]);
  
  // Request push notification permission
  const requestPermission = useCallback(async () => {
    if (!isPushSupported) {
      toast({
        title: "Notifications not supported",
        description: "Push notifications are not supported on this device or platform.",
      });
      return;
    }
    
    try {
      const permResult = await PushNotifications.requestPermissions();
      // Handle possible 'prompt-with-rationale' by converting to 'prompt'
      const normalizedStatus = permResult.receive === 'prompt-with-rationale' ? 'prompt' : permResult.receive;
      setPermissionStatus(normalizedStatus as 'prompt' | 'granted' | 'denied' | 'unknown');
      
      if (permResult.receive === 'granted') {
        await PushNotifications.register();
        setIsRegistered(true);
        toast({
          title: "Notifications enabled",
          description: "You'll now receive updates about activity in your feed."
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You won't receive push notifications. You can enable them later in settings.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting push notification permission:', error);
      toast({
        title: "Permission request failed",
        description: "We couldn't request notification permissions. Please try again later.",
        variant: "destructive"
      });
    }
  }, [isPushSupported, toast]);
  
  // Set up event listeners for push notifications
  useEffect(() => {
    if (!isPushSupported || !user) return;
    
    // Create listener handles
    let registrationListener: any = null;
    let notificationListener: any = null;
    let notificationActionListener: any = null;
    
    // Set up listeners
    const setupListeners = async () => {
      // Handle registration event
      registrationListener = await PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
        setPushToken(token.value);
        
        // Register token with backend
        if (user && user.id && token.value) {
          registerDeviceToken(user.id, token.value);
        }
      });
      
      // Handle notification received when app is in foreground
      notificationListener = await PushNotifications.addListener(
        'pushNotificationReceived',
        (notification) => {
          handleReceivedNotification(notification);
        }
      );
      
      // Handle notification clicked
      notificationActionListener = await PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification) => {
          console.log('Push action performed:', notification.actionId);
          handleReceivedNotification(notification.notification);
        }
      );
    };
    
    // Initialize push notifications and listeners
    initializePushNotifications();
    setupListeners();
    
    // Clean up listeners
    return () => {
      if (registrationListener) registrationListener.remove();
      if (notificationListener) notificationListener.remove();
      if (notificationActionListener) notificationActionListener.remove();
    };
  }, [isPushSupported, user, initializePushNotifications]);
  
  // Check if we should prompt for notification permission
  const shouldPromptForPermission = useCallback(() => {
    // Only prompt if supported, user is logged in, and permission status is unknown or prompt
    return isPushSupported && !!user && ['unknown', 'prompt'].includes(permissionStatus);
  }, [isPushSupported, user, permissionStatus]);
  
  // Return needed values and functions
  return {
    isPushSupported,
    permissionStatus,
    isRegistered,
    pushToken,
    requestPermission,
    shouldPromptForPermission
  };
};
