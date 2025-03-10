
import { Capacitor } from '@capacitor/core';

/**
 * Check if we're running on a native platform (iOS/Android)
 */
export const isNative = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Check if we're running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Check if we're running on Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Check if we're running in a web browser
 */
export const isWeb = (): boolean => {
  return Capacitor.getPlatform() === 'web';
};
