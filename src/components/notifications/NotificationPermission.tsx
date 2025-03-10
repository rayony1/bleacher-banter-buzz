
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { requestPushPermissions } from '@/utils/pushNotifications';
import { toast } from '@/hooks/use-toast';

interface NotificationPermissionProps {
  onRequestComplete?: (granted: boolean) => void;
}

const NotificationPermission = ({ onRequestComplete }: NotificationPermissionProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  
  const handleRequestPermission = async () => {
    try {
      setIsRequesting(true);
      const granted = await requestPushPermissions();
      
      if (granted) {
        toast({
          title: "Notifications enabled",
          description: "You'll receive updates about your posts and games"
        });
      } else {
        toast({
          title: "Notifications disabled",
          description: "You can enable them later in settings",
          variant: "destructive"
        });
      }
      
      if (onRequestComplete) {
        onRequestComplete(granted);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Couldn't enable notifications",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsRequesting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 mb-4">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
          <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Stay updated</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Get notified about likes, comments, and game updates.
          </p>
          <Button 
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="bg-[#2DD4BF] hover:bg-[#26B8A5] text-white rounded-full"
          >
            {isRequesting ? "Requesting..." : "Enable notifications"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;
