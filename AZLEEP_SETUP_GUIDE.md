# Azleep UI - Supabase Real-time Integration Setup Guide

This guide will help you set up and run the complete Azleep application with full real-time Supabase integration.

## 🚀 Quick Start

### 1. Environment Setup

Make sure your `.env` file has the correct Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Migration

Since Supabase CLI might not be available, run the database migration script:

```bash
# Install dependencies if not already done
npm install

# Run the migration script to set up all tables
node run-migration.js
```

Alternatively, you can manually run the SQL migrations in your Supabase dashboard:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of each migration file in order:
   - `supabase/migrations/003_create_missing_tables.sql`
   - `supabase/migrations/004_update_schema_consistency.sql`
   - `supabase/migrations/005_ensure_sleep_tracking_table.sql`
   - `supabase/migrations/006_add_relaxation_points.sql`

### 3. Start the Application

```bash
npm run dev
```

## ✨ What's New - Real-time Features

### 🔄 Auto-Save Functionality
- **Journal Entries**: Auto-save after 2 seconds of inactivity
- **Mood Tracking**: Instant save when mood or stress level is selected
- **Sleep Data**: Real-time saving and synchronization
- **Sleep Cast Progress**: Automatic progress tracking

### 📊 Enhanced Daily Check-in
- **Mood Selection**: 5 different mood options with visual feedback
- **Stress Level Slider**: 1-10 scale with descriptive labels
- **Auto-save Indicator**: Visual feedback showing save status
- **Relaxation Points**: Earn points for daily activities

### 🏆 Relaxation Points System
- **Daily Check-in**: +10 points
- **Journal Entry**: +15 points (if >50 characters)
- **Streak Tracking**: Daily activity streaks
- **Achievement Notifications**: Toast notifications for milestones

### 💾 Real-time Database Tables

The following tables are created and synchronized in real-time:

1. **`sleep_tracking`** - Sleep hours, quality, bedtime/wake time
2. **`mood_records`** - Daily mood and stress level tracking
3. **`journal_entries`** - Personal reflections and conversations
4. **`user_profiles`** - Enhanced with relaxation points and streaks
5. **`sleep_casts`** - Audio content for sleep
6. **`user_sleepcast_history`** - Progress tracking
7. **`sleep_nudges`** - Personalized suggestions

## 🔧 Technical Implementation

### Real-time Sync
The app uses Supabase real-time subscriptions to sync data across:
- Sleep tracking entries
- Mood records
- Journal entries
- User profiles

### Auto-Save Components
- **AutoSaveIndicator**: Shows saving status (idle/saving/saved/error)
- **Debounced saving**: Prevents excessive API calls
- **Error handling**: Graceful failure recovery

### Enhanced UI Components
- **VoiceJournal**: Auto-save with conversation flow
- **DailyCheckInPage**: Stress level collection with slider
- **Dashboard**: Updated to use `sleep_tracking` table

## 📱 User Experience Features

### Visual Feedback
- Save status indicators throughout the app
- Loading states during data operations
- Toast notifications for user actions
- Progress tracking for long operations

### Data Persistence
- All user interactions automatically saved
- Real-time synchronization across devices
- Offline-friendly with retry mechanisms
- Consistent data across sessions

## 🔍 Testing the Integration

### 1. Daily Check-in Flow
1. Navigate to `/app/check-in`
2. Select a mood (should auto-save)
3. Adjust stress level slider (should auto-save)
4. Check the auto-save indicator
5. Complete check-in to earn relaxation points

### 2. Journal Auto-save
1. Go to `/app/journal`
2. Start typing in the voice journal
3. Pause for 2 seconds - should see "Saving..." then "Saved"
4. Check database for the journal entry

### 3. Sleep Data Tracking
1. Visit `/app/dashboard`
2. Answer sleep quality questions
3. Data should save to `sleep_tracking` table
4. Check real-time updates in the dashboard

### 4. Relaxation Points
1. Complete various activities (check-in, journaling)
2. Watch for point notifications
3. Check streak tracking in user profile

## 🐛 Troubleshooting

### Common Issues

**1. Migration Errors**
- Ensure Supabase environment variables are correct
- Check if tables already exist before running migrations
- Use Supabase dashboard SQL editor as fallback

**2. Real-time Not Working**
- Verify Supabase URL and keys
- Check browser console for connection errors
- Ensure real-time is enabled in Supabase project

**3. Auto-save Issues**
- Check network connectivity
- Verify user authentication
- Look for console errors during save operations

**4. TypeScript Errors**
- Run `npm run type-check` to identify issues
- Ensure database types are up to date
- Check import statements for missing components

### Performance Tips
- Auto-save debouncing reduces API calls
- Real-time subscriptions are automatically cleaned up
- Large journal entries are handled efficiently
- Background sync doesn't block UI interactions

## 📚 Next Steps

### Enhanced Features to Consider
1. **Offline Support**: Cache data locally when offline
2. **Push Notifications**: Bedtime reminders and streak notifications
3. **Data Export**: Allow users to export their sleep and mood data
4. **Advanced Analytics**: Sleep pattern analysis and insights
5. **Social Features**: Share achievements and progress

### Development Workflow
1. Test new features in development environment
2. Run migrations safely in staging before production
3. Monitor real-time performance in production
4. Regularly backup user data

## 💬 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project configuration
3. Test individual components in isolation
4. Review the migration files for any syntax errors

The app now provides a complete real-time experience with automatic data persistence, user engagement tracking, and seamless synchronization across all features.

Happy coding! 🌙✨ 