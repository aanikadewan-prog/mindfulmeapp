-- Create table for journal entries
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for gratitude entries
CREATE TABLE public.gratitude_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for morning ritual progress
CREATE TABLE public.morning_ritual_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  steps JSONB NOT NULL,
  last_reset_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for clean counter data
CREATE TABLE public.clean_counter_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gratitude_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.morning_ritual_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clean_counter_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for journal_entries
CREATE POLICY "Users can view own journal entries"
ON public.journal_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal entries"
ON public.journal_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries"
ON public.journal_entries
FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for gratitude_entries
CREATE POLICY "Users can view own gratitude entries"
ON public.gratitude_entries
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own gratitude entries"
ON public.gratitude_entries
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own gratitude entries"
ON public.gratitude_entries
FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for morning_ritual_progress
CREATE POLICY "Users can view own morning ritual progress"
ON public.morning_ritual_progress
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own morning ritual progress"
ON public.morning_ritual_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own morning ritual progress"
ON public.morning_ritual_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for clean_counter_data
CREATE POLICY "Users can view own clean counter data"
ON public.clean_counter_data
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own clean counter data"
ON public.clean_counter_data
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clean counter data"
ON public.clean_counter_data
FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_gratitude_entries_user_id ON public.gratitude_entries(user_id);
CREATE INDEX idx_gratitude_entries_created_at ON public.gratitude_entries(created_at DESC);
CREATE INDEX idx_morning_ritual_progress_user_id ON public.morning_ritual_progress(user_id);
CREATE INDEX idx_clean_counter_data_user_id ON public.clean_counter_data(user_id);