
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

interface NotificationPermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationPermissionDialog = ({ 
  open, 
  onOpenChange 
}: NotificationPermissionDialogProps) => {
  const { requestPermission } = usePushNotifications();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleEnableNotifications = async () => {
    try {
      setIsRequesting(true);
      await requestPermission();
      onOpenChange(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-[#2DD4BF]/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <Bell className="h-8 w-8 text-[#2DD4BF]" />
          </div>
          <DialogTitle className="text-center">Stay Up-to-Date</DialogTitle>
          <DialogDescription className="text-center">
            Get notified when someone likes your posts, comments on your content, or when game scores are updated.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="w-full sm:w-auto"
            disabled={isRequesting}
          >
            Not Now
          </Button>
          <Button
            onClick={handleEnableNotifications}
            className="w-full sm:w-auto bg-[#2DD4BF] hover:bg-[#26B8A5] text-white"
            disabled={isRequesting}
          >
            {isRequesting ? "Requesting..." : "Enable Notifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationPermissionDialog;
