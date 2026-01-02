-- Create thought_records table for CBT thought challenging
CREATE TABLE public.thought_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  situation TEXT NOT NULL,
  automatic_thought TEXT NOT NULL,
  emotions TEXT[] NOT NULL DEFAULT '{}',
  emotion_intensity INTEGER NOT NULL DEFAULT 50,
  cognitive_distortion TEXT,
  evidence_for TEXT,
  evidence_against TEXT,
  balanced_thought TEXT,
  new_emotion_intensity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create worry_logs table for worry ladder and tracking
CREATE TABLE public.worry_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  worry TEXT NOT NULL,
  intensity INTEGER NOT NULL DEFAULT 5,
  category TEXT DEFAULT 'general',
  action_steps TEXT[] DEFAULT '{}',
  outcome TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sleep_logs table for sleep tracking
CREATE TABLE public.sleep_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bedtime TIMESTAMP WITH TIME ZONE NOT NULL,
  wake_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sleep_quality INTEGER NOT NULL,
  time_to_fall_asleep INTEGER,
  awakenings INTEGER DEFAULT 0,
  notes TEXT,
  factors TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_plans table for personalized pathways
CREATE TABLE public.daily_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activities JSONB NOT NULL DEFAULT '[]',
  completed_activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

-- Enable RLS on all tables
ALTER TABLE public.thought_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for thought_records
CREATE POLICY "Users can view own thought records" ON public.thought_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own thought records" ON public.thought_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own thought records" ON public.thought_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own thought records" ON public.thought_records FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for worry_logs
CREATE POLICY "Users can view own worry logs" ON public.worry_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own worry logs" ON public.worry_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own worry logs" ON public.worry_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own worry logs" ON public.worry_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for sleep_logs
CREATE POLICY "Users can view own sleep logs" ON public.sleep_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own sleep logs" ON public.sleep_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sleep logs" ON public.sleep_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own sleep logs" ON public.sleep_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for daily_plans
CREATE POLICY "Users can view own daily plans" ON public.daily_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own daily plans" ON public.daily_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily plans" ON public.daily_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily plans" ON public.daily_plans FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_thought_records_user_id ON public.thought_records(user_id);
CREATE INDEX idx_worry_logs_user_id ON public.worry_logs(user_id);
CREATE INDEX idx_sleep_logs_user_id ON public.sleep_logs(user_id);
CREATE INDEX idx_sleep_logs_bedtime ON public.sleep_logs(bedtime);
CREATE INDEX idx_daily_plans_user_date ON public.daily_plans(user_id, plan_date);