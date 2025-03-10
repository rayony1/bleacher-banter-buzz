
import { Capacitor } from '@capacitor/core';
import { AppLauncher } from '@capacitor/app-launcher';

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
    
    await AppLauncher.openUrl({ url: appUrl });
    
  } catch (error) {
    console.error('Error handling deep link:', error);
    
    try {
      await AppLauncher.openUrl({ url: 'bleacher-banter-buzz://feed' });
    } catch (fallbackError) {
      console.error('Failed to open fallback deep link:', fallbackError);
    }
  }
};
