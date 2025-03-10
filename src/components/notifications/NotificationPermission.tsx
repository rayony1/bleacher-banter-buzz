
import React, { useEffect, useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/lib/auth';
import { arePushNotificationsAvailable } from '@/utils/pushNotifications';
import NotificationPermissionDialog from './NotificationPermissionDialog';

// This component checks if notification permissions should be requested
// and shows the permission dialog when appropriate
const NotificationPermission: React.FC = () => {
  const { user } = useAuth();
  const { hasPermission } = usePushNotifications();
  const [showDialog, setShowDialog] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      // Only check if user is logged in and we haven't checked yet
      if (user && user.id && !hasChecked && hasPermission === null) {
        // Skip for demo users
        if (user.id === 'demo-user-id' || process.env.NODE_ENV === 'development') {
          console.log('Skipping push notification setup for demo user or development');
          setHasChecked(true);
          return;
        }

        try {
          // Check if notifications are available on this platform
          const available = await arePushNotificationsAvailable();
          
          // If available and user doesn't have preference set, show dialog
          if (available && !localStorage.getItem('notification-preference')) {
            setShowDialog(true);
          }
          
          setHasChecked(true);
        } catch (error) {
          console.error('Error checking notification permission:', error);
          setHasChecked(true);
        }
      }
    };

    checkNotificationPermission();
  }, [user, hasPermission, hasChecked]);

  const handleDialogOpenChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      // Save preference to avoid showing dialog again
      localStorage.setItem('notification-preference', 'asked');
    }
  };

  // Only render the dialog when needed
  if (!showDialog) return null;

  return (
    <NotificationPermissionDialog 
      open={showDialog} 
      onOpenChange={handleDialogOpenChange} 
    />
  );
};

export default NotificationPermission;
