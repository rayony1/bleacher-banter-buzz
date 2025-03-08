
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your Supabase URL and anon key
const supabaseUrl = 'https://iszezjuznvucctnlqdld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzemV6anV6bnZ1Y2N0bmxxZGxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODc2NzMsImV4cCI6MjA1Njg2MzY3M30.GPUzecAuJWEEnNR8FaSd2MCfVHFsgz5o-jseTOGCP0c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
