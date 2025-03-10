
// Re-export everything from the new modular structure
// This maintains backward compatibility with existing code
export * from './supabase/index';
export { supabase } from './supabase/client';
