# Sleep Tracking Database Setup

Your sleep tracking tables are ready to be created! Here are 3 ways to run the migrations:

## Option 1: Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `wcthawnaarzizbfmzgqg`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `supabase/migrations/001_create_sleep_tracking.sql`
5. Click **Run** to execute
6. Then copy and paste the contents of `supabase/migrations/002_create_mood_records.sql`
7. Click **Run** to execute

## Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Apply the migrations
supabase db push

# Or run them individually
psql -h db.wcthawnaarzizbfmzgqg.supabase.co -p 5432 -d postgres -U postgres -f supabase/migrations/001_create_sleep_tracking.sql
psql -h db.wcthawnaarzizbfmzgqg.supabase.co -p 5432 -d postgres -U postgres -f supabase/migrations/002_create_mood_records.sql
```

## Option 3: JavaScript Client

Run this in your browser console or create a temporary script:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://wcthawnaarzizbfmzgqg.supabase.co',
  'your_service_role_key_here' // Use the secret key you provided
)

// Copy the SQL from the migration files and run with supabase.rpc()
```

## What These Tables Do

### `sleep_tracking` table:
- Stores sleep hours (4, 5, 6, 7, 8, 9+)
- Stores sleep quality (Bad, Okay, Good, Great)  
- One entry per user per day
- Secure with Row Level Security

### `mood_records` table:
- Stores mood data for the dashboard
- Includes stress level tracking
- Used for analytics and charts

## Verification

After running the migrations, your sleep tracking interface will work! Users can:
1. See the "Good Morning Sleepyhead!" dialog
2. Select sleep hours and quality
3. Click "Save Sleep Data"
4. Data gets stored in your Supabase database
5. View sleep analytics on the dashboard

The `Dashboard.tsx` component is already updated to use these new tables. 