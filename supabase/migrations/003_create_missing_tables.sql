-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_casts table
CREATE TABLE IF NOT EXISTS public.sleep_casts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    audio_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration INTEGER NOT NULL, -- in seconds
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    age INTEGER,
    occupation TEXT,
    bedtime_target TEXT,
    waketime_target TEXT,
    sleep_goals TEXT[],
    sleep_issues TEXT[],
    onboarding_completed BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sleep_records table (alternative to sleep_tracking)
CREATE TABLE IF NOT EXISTS public.sleep_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sleep_duration INTEGER NOT NULL, -- in hours
    sleep_quality TEXT NOT NULL CHECK (sleep_quality IN ('Bad', 'Okay', 'Good', 'Great')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sleepcast_history table
CREATE TABLE IF NOT EXISTS public.user_sleepcast_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleepcast_id UUID NOT NULL REFERENCES public.sleep_casts(id) ON DELETE CASCADE,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_seconds INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE
);

-- Create sleep_nudges table
CREATE TABLE IF NOT EXISTS public.sleep_nudges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    priority INTEGER DEFAULT 1,
    target_age_min INTEGER,
    target_age_max INTEGER,
    target_occupation TEXT[],
    target_sleep_issues TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add voice_analysis_data to mood_records if it doesn't exist
ALTER TABLE public.mood_records 
ADD COLUMN IF NOT EXISTS voice_analysis_data JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_created ON public.journal_entries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_records_user_date ON public.sleep_records(user_id, sleep_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_sleepcast_history_user ON public.user_sleepcast_history(user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_nudges_category ON public.sleep_nudges(category, priority DESC);

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username) WHERE username IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_sleep_records_user_date_unique ON public.sleep_records(user_id, sleep_date);

-- Enable RLS on all tables
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_casts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sleepcast_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_nudges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journal_entries
CREATE POLICY "Users can view their own journal entries" ON public.journal_entries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own journal entries" ON public.journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own journal entries" ON public.journal_entries
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for sleep_records  
CREATE POLICY "Users can view their own sleep records" ON public.sleep_records
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sleep records" ON public.sleep_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sleep records" ON public.sleep_records
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sleep records" ON public.sleep_records
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_sleepcast_history
CREATE POLICY "Users can view their own sleepcast history" ON public.user_sleepcast_history
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own sleepcast history" ON public.user_sleepcast_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sleepcast history" ON public.user_sleepcast_history
    FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for sleep_casts and sleep_nudges
CREATE POLICY "Anyone can view sleep casts" ON public.sleep_casts
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view sleep nudges" ON public.sleep_nudges
    FOR SELECT TO authenticated USING (true);

-- Create triggers for updated_at columns
CREATE TRIGGER update_journal_entries_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample sleep casts
INSERT INTO public.sleep_casts (title, description, audio_url, duration, category, thumbnail_url) VALUES
('Ocean Waves', 'Gentle ocean waves to help you drift off to sleep', 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav', 1800, 'Nature', null),
('Rain on Roof', 'Peaceful rain sounds for deep relaxation', 'https://www.soundjay.com/misc/sounds/rain-01.wav', 2400, 'Nature', null),
('Forest Ambience', 'Calming forest sounds with gentle breeze', 'https://www.soundjay.com/misc/sounds/forest-1.wav', 3600, 'Nature', null),
('Guided Sleep Meditation', 'A gentle guided meditation to help you fall asleep', 'https://example.com/guided-sleep.mp3', 1200, 'Meditation', null),
('Piano Lullaby', 'Soft piano melodies for peaceful sleep', 'https://example.com/piano-lullaby.mp3', 2700, 'Music', null)
ON CONFLICT DO NOTHING;

-- Insert sample sleep nudges
INSERT INTO public.sleep_nudges (title, content, category, priority) VALUES
('Wind Down Time', 'It looks like you might be stressed. Try some deep breathing exercises before bed.', 'relaxation', 1),
('Digital Detox', 'Consider putting away screens 1 hour before bedtime for better sleep quality.', 'habits', 2),
('Sleep Schedule', 'Try to maintain a consistent bedtime, even on weekends.', 'schedule', 3),
('Pre-Sleep Ritual', 'Create a calming bedtime routine to signal to your body it''s time to rest.', 'routine', 1)
ON CONFLICT DO NOTHING; 