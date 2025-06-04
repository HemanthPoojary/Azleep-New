-- Add relaxation points and streak tracking to user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS relaxation_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_relaxation_points ON user_profiles(relaxation_points);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_activity ON user_profiles(last_activity_date);

-- Add sleep_tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS sleep_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sleep_hours DECIMAL(3,1),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
  bedtime TIME,
  wake_time TIME,
  notes TEXT,
  mood_before_sleep TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create unique constraint to prevent duplicate entries per day per user
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_user_sleep_date') THEN
        ALTER TABLE sleep_tracking ADD CONSTRAINT unique_user_sleep_date UNIQUE (user_id, sleep_date);
    END IF;
END $$;

-- Enable RLS on sleep_tracking
ALTER TABLE sleep_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for sleep_tracking
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can view own sleep data') THEN
        CREATE POLICY "Users can view own sleep data" ON sleep_tracking
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can insert own sleep data') THEN
        CREATE POLICY "Users can insert own sleep data" ON sleep_tracking
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can update own sleep data') THEN
        CREATE POLICY "Users can update own sleep data" ON sleep_tracking
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can delete own sleep data') THEN
        CREATE POLICY "Users can delete own sleep data" ON sleep_tracking
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Add indexes for sleep_tracking
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_user_id ON sleep_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_sleep_date ON sleep_tracking(sleep_date);
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_user_date ON sleep_tracking(user_id, sleep_date);

-- Enable real-time for sleep_tracking
ALTER PUBLICATION supabase_realtime ADD TABLE sleep_tracking; 