-- Create mood_records table
CREATE TABLE IF NOT EXISTS public.mood_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL,
    stress_level INTEGER DEFAULT 5 CHECK (stress_level >= 1 AND stress_level <= 10),
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_records_user_date ON public.mood_records(user_id, recorded_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.mood_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own mood data" ON public.mood_records
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood data" ON public.mood_records
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood data" ON public.mood_records
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood data" ON public.mood_records
    FOR DELETE USING (auth.uid() = user_id); 