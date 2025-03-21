// src/lib/notifications.ts
import { PushNotifications } from '@capacitor/push-notifications';

export const registerPushNotifications = async () => {
  try {
    const permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive !== 'granted') {
        console.log('Push notification permission denied');
        return;
      }
    }
    await PushNotifications.register();
    console.log('Push notifications registered successfully');

    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Push action performed:', notification);
    });
  } catch (error) {
    console.error('Error registering push notifications:', error);
  }
};
