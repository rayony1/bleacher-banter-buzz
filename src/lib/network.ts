// src/lib/network.ts
import { Network } from '@capacitor/network';

export type NetworkStatus = {
  connected: boolean;
  connectionType: string;
};

let currentStatus: NetworkStatus = {
  connected: navigator.onLine,
  connectionType: 'unknown'
};

// Initialize network listeners
export const initNetworkListeners = () => {
  // Get initial status
  Network.getStatus().then(status => {
    currentStatus = status;
    notifyListeners(status);
  });

  // Setup change listener
  Network.addListener('networkStatusChange', status => {
    currentStatus = status;
    notifyListeners(status);
  });
};

// Custom listeners for application components
const listeners: ((status: NetworkStatus) => void)[] = [];

export const addNetworkListener = (callback: (status: NetworkStatus) => void): { remove: () => void } => {
  listeners.push(callback);
  // Immediately notify with current status
  callback(currentStatus);
  
  return {
    remove: () => {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  };
};

const notifyListeners = (status: NetworkStatus) => {
  listeners.forEach(listener => listener(status));
};

// Hook for React components
export const useNetworkStatus = () => {
  return currentStatus;
};

// Manual status check
export const getNetworkStatus = async (): Promise<NetworkStatus> => {
  return await Network.getStatus();
};
