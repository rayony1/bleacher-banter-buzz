
import { Network } from '@capacitor/network';

/**
 * Default timeout for network requests (in milliseconds)
 */
const DEFAULT_TIMEOUT = 10000; // 10 seconds

/**
 * Maximum number of retry attempts for network operations
 */
const MAX_RETRIES = 3;

/**
 * Check if the device is online with advanced validation
 * @param timeout Optional timeout in milliseconds
 * @returns Promise resolving to boolean indicating online status
 */
export const isOnline = async (timeout = DEFAULT_TIMEOUT): Promise<boolean> => {
  try {
    // First get the status from Capacitor Network plugin
    const status = await Network.getStatus();
    
    if (!status.connected) {
      return false; // If device reports as offline, don't bother checking further
    }
    
    // Further validate by making a small network request with timeout
    // This helps detect cases where the device thinks it's online but has no actual connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      // Try to fetch a tiny resource from Supabase to validate real connectivity
      // Use cache-busting query parameter to prevent cached responses
      const response = await fetch(
        'https://iszezjuznvucctnlqdld.supabase.co/ping?cache=' + Date.now(),
        { 
          method: 'HEAD',
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Network validation request failed:', error);
      
      // Still consider online if it's just a timeout but Capacitor reports connected
      // This handles cases where the test endpoint might be down but internet works
      return error.name === 'AbortError' ? status.connected : false;
    }
  } catch (error) {
    console.error('Error checking network status:', error);
    return false;
  }
};

/**
 * Retry a network operation with exponential backoff
 * @param operation Function to retry
 * @param maxRetries Maximum number of retry attempts
 * @returns Promise resolving to the operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>, 
  maxRetries = MAX_RETRIES
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries}):`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Calculate backoff time: 2^attempt * 1000ms (1s, 2s, 4s, etc.)
        const backoffTime = Math.min(Math.pow(2, attempt) * 1000, 10000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }
  
  throw lastError;
};

/**
 * Initialize network status listener with improved reliability
 * @param onlineCallback Called when connection is restored
 * @param offlineCallback Called when connection is lost
 * @returns Cleanup function
 */
export const initNetworkListener = (
  onlineCallback: () => void,
  offlineCallback: () => void
) => {
  let isCurrentlyOnline = navigator.onLine;
  let checkingStatus = false;
  
  // Function to validate connection status with retry logic
  const validateConnectionStatus = async () => {
    if (checkingStatus) return; // Prevent concurrent checks
    
    checkingStatus = true;
    try {
      const online = await retryWithBackoff(
        () => isOnline(), 
        2 // Use fewer retries for status check to be more responsive
      );
      
      if (online !== isCurrentlyOnline) {
        isCurrentlyOnline = online;
        if (online) {
          onlineCallback();
        } else {
          offlineCallback();
        }
      }
    } catch (error) {
      console.error('Error validating connection status:', error);
      // If validation fails, assume we're offline
      if (isCurrentlyOnline) {
        isCurrentlyOnline = false;
        offlineCallback();
      }
    } finally {
      checkingStatus = false;
    }
  };
  
  // Set up periodic connection check (every 30s)
  const periodicCheckId = setInterval(validateConnectionStatus, 30000);
  
  // Register for Capacitor network events with debounce
  let debounceTimeout: number | null = null;
  const debouncedStatusChange = (status: { connected: boolean }) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Debounce network changes to avoid rapid flapping
    debounceTimeout = setTimeout(() => {
      console.log('Network status changed:', status.connected);
      validateConnectionStatus();
    }, 1000) as unknown as number;
  };
  
  // Get the promise for the listener handle
  const handlePromise = Network.addListener('networkStatusChange', debouncedStatusChange);
  
  // Do initial connection check
  validateConnectionStatus();
  
  // Return a cleanup function that properly removes all listeners
  return () => {
    handlePromise.then(handle => handle.remove());
    clearInterval(periodicCheckId);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  };
};
