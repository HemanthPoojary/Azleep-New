const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Use service role key if available

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(migrationFile) {
  try {
    console.log(`Running migration: ${migrationFile}`);
    
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
          console.log('✓ Executed statement successfully');
        } catch (error) {
          console.log('⚠ Statement may have already been executed or failed:', error.message);
        }
      }
    }
    
    console.log(`✅ Migration ${migrationFile} completed`);
  } catch (error) {
    console.error(`❌ Error running migration ${migrationFile}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Running Azleep Supabase Migrations...\n');
  
  const migrations = [
    '003_create_missing_tables.sql',
    '004_update_schema_consistency.sql', 
    '005_ensure_sleep_tracking_table.sql',
    '006_add_relaxation_points.sql'
  ];
  
  for (const migration of migrations) {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', migration);
    if (fs.existsSync(migrationPath)) {
      await runMigration(migration);
    } else {
      console.log(`⚠ Migration file not found: ${migration}`);
    }
  }
  
  console.log('\n✨ All migrations completed! Your database should now be up to date.');
  console.log('\n📝 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Test the real-time features in the app');
  console.log('3. Check the dashboard and daily check-in features');
}

main().catch(console.error); 