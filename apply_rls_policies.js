import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file directory with ESM support
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials from your client.ts file
const supabaseUrl = 'https://iszezjuznvucctnlqdld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzemV6anV6bnZ1Y2N0bmxxZGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODc2NzMsImV4cCI6MjA1Njg2MzY3M30.GPUzecAuJWEEnNR8FaSd2MCfVHFsgz5o-jseTOGCP0c';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Read the SQL files
const profilesRlsSql = fs.readFileSync(
  path.join(__dirname, 'supabase/migrations/20250319_fix_profiles_rls.sql'), 
  'utf8'
);

const schoolsCommentsRlsSql = fs.readFileSync(
  path.join(__dirname, 'supabase/migrations/20250320_fix_schools_comments_rls.sql'), 
  'utf8'
);

// Function to execute the SQL
async function applyRlsPolicies() {
  console.log('Applying RLS policies...');
  
  // First apply profiles RLS
  try {
    console.log('Applying profiles RLS policies...');
    await supabase.rpc('exec_sql', { query: profilesRlsSql });
    console.log('Profiles RLS policies applied successfully!');
  } catch (error) {
    console.error('Error applying profiles RLS policies:', error);
  }
  
  // Then apply schools and comments RLS
  try {
    console.log('Applying schools and comments RLS policies...');
    await supabase.rpc('exec_sql', { query: schoolsCommentsRlsSql });
    console.log('Schools and comments RLS policies applied successfully!');
  } catch (error) {
    console.error('Error applying schools and comments RLS policies:', error);
  }
  
  console.log('RLS policy application process completed.');
}

// Execute the function
applyRlsPolicies();
