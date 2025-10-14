-- Create activity completions table to track daily activity logs
CREATE TABLE public.activity_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_name TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_completions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own completions" 
ON public.activity_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own completions" 
ON public.activity_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_activity_completions_user_date ON public.activity_completions(user_id, completed_at);