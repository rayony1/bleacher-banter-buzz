
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleNotificationEvent = (event: CustomEvent<NotificationEvent['detail']>) => {
      const { title, body, type, targetId } = event.detail;
      
      const handleToastAction = () => {
        // Navigate to the appropriate page based on notification type
        switch (type) {
          case 'like':
          case 'comment':
            // Navigate to the specific post
            if (targetId) {
              navigate(`/post/${targetId}`);
            } else {
              navigate('/feed');
            }
            break;
          case 'game':
            // Navigate to the game details
            if (targetId) {
              navigate(`/scoreboard/game/${targetId}`);
            } else {
              navigate('/scoreboard');
            }
            break;
          case 'prediction':
            // Navigate to predictions
            if (targetId) {
              navigate(`/predictions/${targetId}`);
            } else {
              navigate('/predictions');
            }
            break;
          default:
            navigate('/feed');
        }
      };
      
      // Show toast notification with action button for navigation
      toast({
        title,
        description: body,
        duration: 5000,
        action: type !== 'generic' ? {
          label: "View",
          onClick: handleToastAction
        } : undefined,
      });
    };
    
    // Add event listener for custom notification events
    document.addEventListener('app:notification', handleNotificationEvent as EventListener);
    
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('app:notification', handleNotificationEvent as EventListener);
    };
  }, [toast, navigate]);
  
  // This component doesn't render anything
  return null;
};

export default InAppNotificationListener;
