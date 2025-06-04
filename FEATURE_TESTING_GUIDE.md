# Azleep UI - Feature Testing Guide

## 🎯 Features Implemented & Ready for Testing

### 1. Sleep Data Tracking ✅
**Location**: `/app/dashboard`
**What it does**: Captures sleep hours (4-9+) and quality (Bad/Okay/Good/Great)

**Testing Steps**:
1. Go to `/app/dashboard`
2. Look for the sleep questions dialog (appears automatically)
3. Select sleep hours (4, 5, 6, 7, 8, 9+)
4. Select sleep quality (Bad 😫, Okay 😐, Good 😊, Great 🤩)
5. Click "Save Sleep Data"
6. Check for success toast: "Sleep data saved successfully! 💤"
7. Verify data appears in the sleep overview chart
8. Check the "Average Sleep" card shows your data

**Expected Results**:
- Data saves to `sleep_tracking` table
- Chart displays sleep hours
- Statistics update with new data
- One record per user per day (updates if run again same day)

### 2. Daily Check-in (Mood + Stress) ✅
**Location**: `/app/check-in`
**What it does**: Captures mood selection and stress level (1-10 scale)

**Testing Steps**:
1. Go to `/app/check-in`
2. Select a mood emoji (😊 Happy, 😴 Tired, 😔 Sad, 😭 Upset, 😴 Sleepy)
3. Stress level slider appears automatically
4. Adjust stress level (1-10): "Very Relaxed" to "Extremely Stressed"
5. Click "Save My Check-in"
6. Look for success toast with mood and stress level
7. Suggestions appear after saving

**Expected Results**:
- Data saves to `mood_records` table
- Toast shows: "Mood and stress level saved! 🌙"
- Personalized suggestions appear based on mood
- Stress level recorded accurately (1-10)

### 3. Real-time Data Sync ✅
**What it does**: Syncs data across browser tabs/devices instantly

**Testing Steps**:
1. Open app in two browser tabs
2. In tab 1: Save sleep data or mood check-in
3. In tab 2: Watch for data updates (check dashboard charts)
4. Console should show: "✅ Subscribed to real-time channel"

**Expected Results**:
- Changes in one tab appear in other tabs
- No page refresh needed
- Real-time WebSocket connection active

## 🧪 Database Testing Page

**Location**: `/app/test`
**What it does**: Direct database connection testing

**Testing Steps**:
1. Go to `/app/test`
2. Sign in first (required for testing)
3. Click "Test Sleep Tracking" - inserts test sleep data
4. Click "Test Mood Tracking" - inserts test mood data
5. Click "Test Data Retrieval" - reads back your data
6. Watch results in the test results panel

**Expected Results**:
- ✅ All tests should pass
- Error messages help debug issues
- Console logs show actual data

## 📊 Data Flow Verification

### Sleep Data Flow:
```
Dashboard Sleep Dialog → sleep_tracking table → Dashboard Chart → Real-time Sync
```

### Mood Data Flow:
```
Check-in Page → mood_records table → Dashboard Display → Real-time Sync
```

## 🔧 Environment Configuration

Verify these are set in `.env`:
```env
VITE_SUPABASE_URL=https://wcthawnaarzizbfmzgqg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🚨 Troubleshooting

### Sleep Data Not Saving:
- Check browser console for errors
- Verify user is authenticated
- Run `/app/test` to test database connection
- Check Supabase dashboard for data

### Mood Data Not Saving:
- Ensure stress level is selected (1-10)
- Check for authentication
- Verify mood selection before saving
- Check console for error messages

### Real-time Not Working:
- Check console for WebSocket errors
- Verify real-time is enabled in Supabase
- Try refreshing both tabs
- Check network connectivity

### No Data in Charts:
- Verify data exists in database
- Check date formats (YYYY-MM-DD)
- Ensure user_id matches authenticated user
- Try clearing browser cache

## ✨ Success Indicators

When everything is working correctly, you should see:

1. **Sleep Tracking**: 
   - Dialog appears on dashboard
   - Data saves with success toast
   - Chart shows sleep hours over time
   - Average sleep updates

2. **Mood Check-in**:
   - Smooth mood selection
   - Stress level slider responsive
   - Save confirmation with details
   - Suggestions appear

3. **Real-time Sync**:
   - Console shows "✅ Subscribed to real-time channel"
   - Changes sync across tabs
   - No delays in updates

4. **Database Test**:
   - All tests pass (✅)
   - Data inserts and retrieves successfully
   - No authentication errors

## 🎉 Next Steps

After confirming all features work:
1. Test on different devices
2. Test with multiple users
3. Check data persistence across sessions
4. Monitor performance and loading times
5. Add more sleep/mood data for richer analytics 