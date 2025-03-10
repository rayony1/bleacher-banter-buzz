
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationEvent {
  detail: {
    title: string;
    body: string;
    type: string;
    targetId: string;
  };
}

const InAppNotificationListener = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const handleNotificationEvent = (event: CustomEvent<NotificationEvent['detail']>) => {
      const { title, body } = event.detail;
      
      toast({
        title,
        description: body,
        duration: 5000, // Display for 5 seconds
      });
    };
    
    // Add event listener for custom notification events
    document.addEventListener('app:notification', handleNotificationEvent as EventListener);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('app:notification', handleNotificationEvent as EventListener);
    };
  }, [toast]);
  
  // This component doesn't render anything
  return null;
};

export default InAppNotificationListener;
