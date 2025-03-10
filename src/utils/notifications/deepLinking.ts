
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

/**
 * Handle deep linking to specific content based on notification type
 */
export const handleDeepLink = async (type: string, targetId: string): Promise<void> => {
  if (!Capacitor.isNativePlatform()) {
    console.log('Deep linking only supported on native platforms');
    return;
  }

  try {
    let appUrl = '';
    
    switch (type) {
      case 'like':
      case 'comment':
        appUrl = `bleacher-banter-buzz://post/${targetId}`;
        break;
      case 'game':
        appUrl = `bleacher-banter-buzz://game/${targetId}`;
        break;
      case 'prediction':
        appUrl = `bleacher-banter-buzz://prediction/${targetId}`;
        break;
      default:
        appUrl = 'bleacher-banter-buzz://feed';
    }
    
    // Use Browser.open instead of AppLauncher as it's more widely supported
    await Browser.open({ url: appUrl });
    
  } catch (error) {
    console.error('Error handling deep link:', error);
    
    try {
      // Fallback to main app URL
      await Browser.open({ url: 'bleacher-banter-buzz://feed' });
    } catch (fallbackError) {
      console.error('Failed to open fallback deep link:', fallbackError);
    }
  }
};
