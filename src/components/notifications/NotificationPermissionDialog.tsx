
import React from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { isNative } from '@/utils/platform';

interface NotificationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestComplete?: (granted: boolean) => void;
}

const NotificationPermissionDialog: React.FC<NotificationPermissionDialogProps> = ({
  open,
  onOpenChange,
  onRequestComplete
}) => {
  const handleRequestPermission = async () => {
    try {
      if (isNative()) {
        const result = await PushNotifications.requestPermissions();
        const granted = result.receive === 'granted';
        console.log('Push notification permission result:', granted ? 'granted' : 'denied');
        
        if (granted) {
          await PushNotifications.register();
        }
        
        if (onRequestComplete) {
          onRequestComplete(granted);
        }
      } else {
        console.log('Push notifications not available in web');
        if (onRequestComplete) {
          onRequestComplete(false);
        }
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error requesting push notification permission:', error);
      if (onRequestComplete) {
        onRequestComplete(false);
      }
      onOpenChange(false);
    }
  };

  const handleDecline = () => {
    console.log('Push notifications declined by user');
    if (onRequestComplete) {
      onRequestComplete(false);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto bg-teal-100 dark:bg-teal-900 p-3 rounded-full mb-3">
            <Bell className="h-6 w-6 text-teal-600 dark:text-teal-300" />
          </div>
          <DialogTitle className="text-center">Stay Updated</DialogTitle>
          <DialogDescription className="text-center">
            Get notified when someone likes your posts, replies to your comments, or when there are game updates.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={handleDecline}
            className="w-full sm:w-auto"
          >
            Not now
          </Button>
          <Button 
            onClick={handleRequestPermission}
            className="w-full sm:w-auto bg-[#2DD4BF] hover:bg-[#20B2A0] text-white"
          >
            Enable notifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPermissionDialog;
