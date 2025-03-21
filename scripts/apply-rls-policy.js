#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the SQL migration file
const migrationFile = path.join(__dirname, '../supabase/migrations/20250319_fix_profiles_rls.sql');

console.log('\n🔐 Bleacher Banter Buzz RLS Policy Update Tool 🔐\n');
console.log('This script will help you update the RLS policy for the profiles table.\n');
console.log('Before proceeding, make sure:');
console.log('1. You have the Supabase CLI installed');
console.log('2. You are logged in to your Supabase project');
console.log('3. You have connectivity to your Supabase project\n');

rl.question('Do you want to proceed? (y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'y') {
    console.log('Operation cancelled.');
    rl.close();
    return;
  }

  try {
    // Read SQL file
    const sqlContent = fs.readFileSync(migrationFile, 'utf8');
    console.log('\nSQL migration to be applied:');
    console.log('----------------------------');
    console.log(sqlContent);
    console.log('----------------------------\n');

    rl.question('Apply this migration to your Supabase database? (y/n): ', (confirm) => {
      if (confirm.toLowerCase() !== 'y') {
        console.log('Operation cancelled.');
        rl.close();
        return;
      }

      console.log('\nApplying RLS policy changes...');
      
      try {
        // You can execute the migration using Supabase CLI
        // This is commented out as it depends on the user's Supabase setup
        // execSync(`supabase db execute --file ${migrationFile}`, { stdio: 'inherit' });
        
        console.log('\n✅ Alternative Application Methods:');
        console.log('1. Using Supabase CLI:');
        console.log(`   supabase db execute --file ${migrationFile}`);
        console.log('\n2. Using Supabase Dashboard:');
        console.log('   - Navigate to your Supabase project dashboard');
        console.log('   - Go to "SQL Editor"');
        console.log('   - Copy the SQL content above');
        console.log('   - Paste into the SQL Editor and run it');
        
        console.log('\n🔄 RLS policy update instructions generated successfully!');
      } catch (execError) {
        console.error('\n❌ Error executing migration:', execError.message);
        console.log('\nYou can manually apply the migration:');
        console.log('1. Open the Supabase dashboard');
        console.log('2. Navigate to the SQL Editor');
        console.log('3. Paste the SQL content from the migration file');
        console.log('4. Execute the SQL query');
      }
      
      rl.close();
    });
  } catch (error) {
    console.error('\n❌ Error reading migration file:', error.message);
    rl.close();
  }
});

// Make the script executable
try {
  if (process.platform !== 'win32') {
    fs.chmodSync(__filename, '755');
  }
} catch (error) {
  console.warn('Could not make script executable:', error.message);
}
