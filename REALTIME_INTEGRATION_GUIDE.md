# Azleep UI - Supabase Real-time Integration Guide

## Overview

This guide explains how to set up and use the real-time Supabase integration for the Azleep UI. All user interactions are now automatically saved to Supabase with real-time synchronization across devices.

## Setup Instructions

### 1. Run Database Migrations

First, you need to run the database migrations to create all the necessary tables:

```bash
# Using Supabase Dashboard (Recommended)
# 1. Go to https://supabase.com/dashboard
# 2. Select your project: wcthawnaarzizbfmzgqg
# 3. Go to SQL Editor
# 4. Run the following migrations in order:
```

**Migration 1:** `supabase/migrations/001_create_sleep_tracking.sql`
**Migration 2:** `supabase/migrations/002_create_mood_records.sql`
**Migration 3:** `supabase/migrations/003_create_missing_tables.sql`
**Migration 4:** `supabase/migrations/004_update_schema_consistency.sql`

### 2. Environment Variables

Ensure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://wcthawnaarzizbfmzgqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjdGhhd25hYXJ6aXpiZm16Z3FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDEzNTEsImV4cCI6MjA2NDM3NzM1MX0.4O8OBEuren7j0B4Zw1vIIEi8tLsbfq9rfOC3DC_D2cU
```

## Features Implemented

### 1. Real-time Data Synchronization

- **Automatic sync**: All user data changes are immediately synchronized across devices
- **Live updates**: Changes made on one device appear instantly on other devices
- **Connection status**: Users can see their real-time connection status

### 2. Auto-save Functionality

All user interactions are automatically saved:

#### Daily Check-in (Mood Tracking)
- Mood selections are saved immediately
- Includes stress level and timestamping
- Real-time feedback with toast notifications

#### Journal Entries
- **Auto-save**: Content is saved automatically after 2 seconds of inactivity
- **Manual save**: Users can manually save and clear the editor
- **Progress indicator**: Shows save status (saving, saved, error)
- **Mood tagging**: Journal entries include mood metadata

#### Sleep Tracking
- Sleep hours and quality ratings saved to database
- One record per user per day (upsert functionality)
- Historical data available for analytics

#### Sleep Cast Playback
- **Progress tracking**: Playback progress saved every 30 seconds
- **Completion tracking**: Marks sleep casts as completed
- **History**: Maintains listening history for recommendations

### 3. Database Schema

The following tables are created and managed:

```sql
- user_profiles: User settings, preferences, onboarding status
- journal_entries: All journal content with mood metadata
- mood_records: Daily mood check-ins with stress levels
- sleep_tracking: Sleep hours and quality data
- sleep_records: Alternative sleep data structure
- sleep_casts: Sleep cast content library
- user_sleepcast_history: User listening history and progress
- sleep_nudges: Personalized recommendations
```

### 4. Row Level Security (RLS)

- All tables have RLS enabled
- Users can only access their own data
- Authenticated users required for most operations
- Public read access for sleep casts and nudges

## Usage Examples

### Component Integration

#### Using Auto-save in Components

```tsx
import { AutoSaveIndicator } from '@/components/AutoSaveIndicator';

const MyComponent = () => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error' | 'idle'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  return (
    <div>
      <AutoSaveIndicator 
        status={autoSaveStatus}
        lastSaved={lastSaved}
        isConnected={true}
      />
    </div>
  );
};
```

#### Using Sleep Cast Tracking

```tsx
import { useSleepcastTracking } from '@/hooks/useSleepcastTracking';

const SleepCastPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sleepcastId = 'ocean-waves-123';

  useSleepcastTracking({
    sleepcastId,
    isPlaying,
    audioRef
  });

  // Component JSX...
};
```

### Real-time Hooks

#### Basic Real-time Sync

The main App component automatically sets up real-time synchronization for all authenticated users:

```tsx
// Automatically included in App.tsx
const RealtimeSync = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Sets up real-time channels for:
    // - sleep_tracking
    // - mood_records  
    // - journal_entries
    // - user_profiles
  }, [user]);
};
```

## Testing the Integration

### 1. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

### 2. Test Scenarios

1. **Mood Check-in**: Go to `/app/check-in` and select a mood
2. **Journal Entry**: Go to `/app/journal` and start typing (watch auto-save indicator)
3. **Sleep Tracking**: Go to `/app/dashboard` and log sleep data
4. **Sleep Cast**: Go to `/app/sleep-cast` and play audio (progress tracking)

### 3. Multi-device Testing

1. Open the app in two browser windows/tabs
2. Make changes in one window
3. Observe real-time updates in the other window

## Monitoring and Debugging

### 1. Browser Console

Real-time events are logged to the console:

```
✅ Subscribed to real-time channel 1
Sleep tracking change: { eventType: 'INSERT', new: {...} }
```

### 2. Supabase Dashboard

Monitor real-time activity in the Supabase dashboard:
- Go to Database → Tables to see data
- Use the SQL Editor to query data
- Check the Logs section for errors

### 3. Network Tab

Watch for WebSocket connections to Supabase for real-time features.

## Performance Considerations

### 1. Auto-save Debouncing

- Journal auto-save waits 2 seconds after user stops typing
- Prevents excessive API calls
- Users see immediate feedback

### 2. Real-time Channel Management

- Channels are properly cleaned up on component unmount
- User-specific filters prevent unnecessary data processing
- Connection status monitoring

### 3. Optimistic Updates

- UI updates immediately (optimistic updates)
- Rollback on errors
- Graceful error handling

## Troubleshooting

### Common Issues

1. **Real-time not working**: Check browser console for WebSocket errors
2. **Auto-save failing**: Verify user authentication and network connection
3. **Data not syncing**: Check Supabase RLS policies and user permissions

### Error Handling

- All database operations include try-catch blocks
- User-friendly error messages via toast notifications
- Graceful degradation when offline

## Next Steps

1. **Enhanced offline support**: Implement proper offline storage and sync
2. **Conflict resolution**: Handle concurrent edits across devices
3. **Performance optimization**: Implement data pagination and caching
4. **Advanced analytics**: Add more detailed user behavior tracking

---

🎉 **Congratulations!** Your Azleep UI now has full real-time Supabase integration with automatic saving and cross-device synchronization. 