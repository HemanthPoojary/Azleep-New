-- Create sleep_tracking table
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

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_sleep_tracking_user_date ON public.sleep_tracking(user_id, sleep_date DESC);

-- Create unique constraint to prevent duplicate entries per user per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_sleep_tracking_user_date_unique 
ON public.sleep_tracking(user_id, sleep_date);

-- Enable RLS (Row Level Security)
ALTER TABLE public.sleep_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own sleep data" ON public.sleep_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep data" ON public.sleep_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep data" ON public.sleep_tracking
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep data" ON public.sleep_tracking
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sleep_tracking_updated_at
    BEFORE UPDATE ON public.sleep_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 