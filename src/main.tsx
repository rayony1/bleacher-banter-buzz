import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerPushNotifications } from './lib/notifications'
import { initNetworkListeners } from './lib/network'
import { initializeSupabase, checkRlsPolicies } from './lib/supabase/setup'

createRoot(document.getElementById("root")!).render(<App />);

// Initialize app services
const initializeApp = async () => {
  // Initialize network listeners
  initNetworkListeners();
  
  // Initialize Supabase data and check connectivity
  const { success, error } = await initializeSupabase();
  if (!success && error) {
    console.warn(`Supabase initialization warning: ${error}`);
  }
  
  // Check RLS policies to ensure they're correctly set up
  const { success: rlsSuccess, needsUpdate } = await checkRlsPolicies();
  if (!rlsSuccess && needsUpdate) {
    console.warn('RLS policy check failed - you may need to apply the updated policies');
  }
  
  // Initialize push notifications for mobile devices
  if (window.matchMedia('(max-width: 768px)').matches) {
    // Only register on mobile devices
    registerPushNotifications();
  }
};

// Start initialization
initializeApp().catch(err => {
  console.error('Error during app initialization:', err);
});
