// src/lib/supabase/setup.ts
import { supabase } from './client';
import { insertSampleSchools } from './schools';
import { getNetworkStatus } from '@/lib/network';

/**
 * Initialize the Supabase database with required data
 * - Check and populate schools if empty
 * - Set up RLS policies if needed
 * - Check connectivity
 */
export const initializeSupabase = async () => {
  // Check connectivity first
  try {
    const networkStatus = await getNetworkStatus();
    
    if (!networkStatus.connected) {
      console.warn('No network connection detected. Database initialization skipped.');
      return {
        success: false,
        error: 'No network connection',
        networkStatus
      };
    }
    
    // Check if we can connect to Supabase
    const { data: connectionTest, error: connectionError } = await supabase.from('schools').select('COUNT(*)');
    
    if (connectionError) {
      console.error('Could not connect to Supabase:', connectionError.message);
      return {
        success: false,
        error: connectionError.message,
        networkStatus
      };
    }
    
    console.log('Successfully connected to Supabase');
    
    // Insert sample schools if needed
    const { error: schoolsError } = await insertSampleSchools();
    
    if (schoolsError) {
      console.warn('Could not insert sample schools:', schoolsError.message);
    } else {
      console.log('Schools check completed successfully');
    }
    
    return {
      success: true,
      networkStatus
    };
  } catch (err) {
    console.error('Error initializing Supabase:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      networkStatus: await getNetworkStatus()
    };
  }
};

/**
 * Check if the RLS policies have been applied correctly
 * This can help diagnose issues related to permission problems
 */
export const checkRlsPolicies = async () => {
  try {
    // Try a query that would fail if RLS is too restrictive
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      return {
        success: false,
        error: 'RLS policy is blocking access to profiles. Please apply the updated RLS policy.',
        needsUpdate: true
      };
    }
    
    return {
      success: !error,
      error: error?.message,
      needsUpdate: error ? true : false
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      needsUpdate: true
    };
  }
};
