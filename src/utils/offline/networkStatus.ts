
import { Network } from '@capacitor/network';

/**
 * Check if the device is online
 */
export const isOnline = async (): Promise<boolean> => {
  const status = await Network.getStatus();
  return status.connected;
};

/**
 * Initialize network status listener
 * @param onlineCallback Called when connection is restored
 * @param offlineCallback Called when connection is lost
 */
export const initNetworkListener = (
  onlineCallback: () => void,
  offlineCallback: () => void
) => {
  // Get the promise for the listener handle
  const handlePromise = Network.addListener('networkStatusChange', (status) => {
    console.log('Network status changed:', status.connected);
    if (status.connected) {
      onlineCallback();
    } else {
      offlineCallback();
    }
  });
  
  // Return a cleanup function that properly removes the listener
  return () => {
    handlePromise.then(handle => handle.remove());
  };
};
