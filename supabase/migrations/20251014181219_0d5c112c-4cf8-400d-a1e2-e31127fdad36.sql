-- Add user preferences table for personalization
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goals TEXT[] NOT NULL DEFAULT '{}', -- stress, focus, sleep, energy, anxiety
  topics TEXT[] NOT NULL DEFAULT '{}',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  daily_plan_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add analytics table for app creators
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_users INTEGER NOT NULL DEFAULT 0,
  active_today INTEGER NOT NULL DEFAULT 0,
  active_this_week INTEGER NOT NULL DEFAULT 0,
  total_check_ins INTEGER NOT NULL DEFAULT 0,
  total_activities_completed INTEGER NOT NULL DEFAULT 0,
  avg_mood DECIMAL(3,2),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert initial row
INSERT INTO public.user_analytics (id) VALUES (gen_random_uuid());

-- Function to update analytics
CREATE OR REPLACE FUNCTION public.update_user_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE user_analytics SET
    total_users = (SELECT COUNT(DISTINCT id) FROM auth.users),
    active_today = (SELECT COUNT(DISTINCT user_id) FROM check_ins WHERE created_at >= CURRENT_DATE),
    active_this_week = (SELECT COUNT(DISTINCT user_id) FROM check_ins WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'),
    total_check_ins = (SELECT COUNT(*) FROM check_ins),
    avg_mood = (SELECT AVG(mood) FROM check_ins),
    updated_at = now();
END;
$$;

-- Trigger to update preferences timestamp
CREATE OR REPLACE FUNCTION public.update_preferences_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_preferences_timestamp
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_preferences_timestamp();