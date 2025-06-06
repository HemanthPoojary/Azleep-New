-- Ensure sleep_tracking table exists and is properly structured
-- (This is already created in migration 001, but ensuring consistency)

-- Add missing tables that might be needed
CREATE TABLE IF NOT EXISTS public.sleep_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_hours INTEGER NOT NULL CHECK (sleep_hours >= 1 AND sleep_hours <= 12),
    sleep_quality TEXT NOT NULL CHECK (sleep_quality IN ('Bad', 'Okay', 'Good', 'Great')),
    sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies if they don't exist
DO $$ 
BEGIN
    -- Enable RLS
    ALTER TABLE public.sleep_tracking ENABLE ROW LEVEL SECURITY;
    
    -- Create policies if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can view their own sleep data') THEN
        CREATE POLICY "Users can view their own sleep data" ON public.sleep_tracking
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can insert their own sleep data') THEN
        CREATE POLICY "Users can insert their own sleep data" ON public.sleep_tracking
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can update their own sleep data') THEN
        CREATE POLICY "Users can update their own sleep data" ON public.sleep_tracking
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sleep_tracking' AND policyname = 'Users can delete their own sleep data') THEN
        CREATE POLICY "Users can delete their own sleep data" ON public.sleep_tracking
            FOR DELETE USING (auth.uid() = user_id);
    END IF;
EXCEPTION
    WHEN others THEN
        -- Policies might already exist, that's fine
        NULL;
END $$;

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_user_date ON public.sleep_tracking(user_id, sleep_date DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sleep_tracking_user_date_unique 
ON public.sleep_tracking(user_id, sleep_date);

-- Enable real-time for all relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.sleep_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sleepcast_history; 