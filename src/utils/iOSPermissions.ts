
import { Camera } from '@capacitor/camera';
import { PushNotifications } from '@capacitor/push-notifications';
import { toast } from "@/hooks/use-toast";

export const requestCameraPermission = async () => {
  try {
    const permission = await Camera.checkPermissions();
    
    if (permission.camera !== 'granted') {
      const request = await Camera.requestPermissions();
      return request.camera === 'granted';
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting camera permission:', error);
    return false;
  }
};

export const requestPushPermission = async () => {
  try {
    const permission = await PushNotifications.requestPermissions();
    return permission.receive === 'granted';
  } catch (error) {
    console.error('Error requesting push notification permission:', error);
    return false;
  }
};

export const checkAllPermissions = async () => {
  const camera = await requestCameraPermission();
  const push = await requestPushPermission();
  
  return {
    camera,
    push
  };
};
