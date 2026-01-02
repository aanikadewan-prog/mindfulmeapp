import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle2, Circle, Sparkles, RefreshCw } from "lucide-react";

interface PlanActivity {
  id: string;
  name: string;
  route: string;
  duration: string;
  category: string;
  description: string;
}

const ACTIVITIES_BY_GOAL: Record<string, PlanActivity[]> = {
  stress: [
    { id: "breathing", name: "Deep Breathing", route: "/breathing", duration: "5 min", category: "Calm", description: "Reduce stress with guided breathing" },
    { id: "progressive", name: "Progressive Relaxation", route: "/progressive-relaxation", duration: "10 min", category: "Relax", description: "Release tension from your body" },
    { id: "tea", name: "Mindful Tea", route: "/tea", duration: "10 min", category: "Mindful", description: "A peaceful tea meditation" },
  ],
  focus: [
    { id: "breathing", name: "Focus Breathing", route: "/breathing", duration: "5 min", category: "Focus", description: "Sharpen concentration" },
    { id: "phone-free", name: "Phone-Free Hour", route: "/phone-free", duration: "60 min", category: "Digital", description: "Deep focus time" },
    { id: "journal", name: "Brain Dump Journal", route: "/journal", duration: "10 min", category: "Clarity", description: "Clear your mental clutter" },
  ],
  sleep: [
    { id: "evening", name: "Evening Wind Down", route: "/evening-wind-down", duration: "15 min", category: "Sleep", description: "Prepare for restful sleep" },
    { id: "sleep-log", name: "Sleep Tracking", route: "/sleep-journey", duration: "5 min", category: "Track", description: "Log and improve your sleep" },
    { id: "sounds", name: "Soothing Sounds", route: "/sounds", duration: "10 min", category: "Relax", description: "Calming ambient sounds" },
  ],
  energy: [
    { id: "walk", name: "Short Walk", route: "/short-walk", duration: "15 min", category: "Move", description: "Boost energy with movement" },
    { id: "stretching", name: "Gentle Stretching", route: "/gentle-stretching", duration: "10 min", category: "Move", description: "Energize your body" },
    { id: "morning", name: "Morning Ritual", route: "/morning", duration: "15 min", category: "Start", description: "Begin your day right" },
  ],
  anxiety: [
    { id: "cbt", name: "Thought Reframing", route: "/cbt-tools", duration: "10 min", category: "CBT", description: "Challenge anxious thoughts" },
    { id: "breathing", name: "Calming Breath", route: "/breathing", duration: "5 min", category: "Calm", description: "Ease anxiety quickly" },
    { id: "compassion", name: "Self-Compassion", route: "/self-compassion", duration: "10 min", category: "Kind", description: "Be gentle with yourself" },
  ],
};

export function DailyPlan() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userGoals, setUserGoals] = useState<string[]>([]);
  const [dailyActivities, setDailyActivities] = useState<PlanActivity[]>([]);
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user preferences
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("goals")
        .eq("user_id", user.id)
        .single();

      const goals = prefs?.goals || ["stress", "focus"];
      setUserGoals(goals);

      // Get today's completions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: completions } = await supabase
        .from("activity_completions")
        .select("activity_name")
        .eq("user_id", user.id)
        .gte("completed_at", today.toISOString());

      setCompletedToday(completions?.map(c => c.activity_name.toLowerCase()) || []);

      // Generate personalized plan
      generatePlan(goals);
    } catch (error) {
      console.error("Error loading plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePlan = (goals: string[]) => {
    const activities: PlanActivity[] = [];
    const usedIds = new Set<string>();

    // Add activities based on user goals
    goals.forEach(goal => {
      const goalActivities = ACTIVITIES_BY_GOAL[goal] || [];
      goalActivities.forEach(activity => {
        if (!usedIds.has(activity.id) && activities.length < 5) {
          activities.push(activity);
          usedIds.add(activity.id);
        }
      });
    });

    // Shuffle for variety
    const shuffled = activities.sort(() => Math.random() - 0.5);
    setDailyActivities(shuffled.slice(0, 4));
  };

  const isCompleted = (activity: PlanActivity) => {
    return completedToday.some(c => 
      c.includes(activity.name.toLowerCase()) || 
      activity.name.toLowerCase().includes(c)
    );
  };

  const completedCount = dailyActivities.filter(a => isCompleted(a)).length;
  const progress = dailyActivities.length > 0 ? (completedCount / dailyActivities.length) * 100 : 0;

  const refreshPlan = () => {
    generatePlan(userGoals);
    toast({
      title: "Plan refreshed!",
      description: "New activities selected for you",
    });
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <div className="h-5 bg-muted rounded w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dailyActivities.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Your Daily Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Complete onboarding to get personalized recommendations!
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/onboarding")}
          >
            Set Your Goals
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Daily Plan
            </CardTitle>
            <CardDescription>
              Personalized for your goals
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={refreshPlan}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">{completedCount} of {dailyActivities.length} complete</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {dailyActivities.map((activity) => {
            const completed = isCompleted(activity);
            return (
              <div
                key={activity.id}
                onClick={() => !completed && navigate(activity.route)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  completed
                    ? "bg-primary/5 border-primary/30"
                    : "hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${completed ? "line-through text-muted-foreground" : ""}`}>
                        {activity.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {activity.duration}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {completedCount === dailyActivities.length && dailyActivities.length > 0 && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
            <span className="text-lg">🎉</span>
            <p className="text-sm font-medium text-primary mt-1">
              Daily plan complete! Great job!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}