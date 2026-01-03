import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Sparkles, Heart, ArrowRight, Home, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DailyActivity {
  id: string;
  name: string;
  route: string;
  completed: boolean;
}

// Fixed ordered list of daily activities based on goals
const ACTIVITIES_BY_GOAL: Record<string, { id: string; name: string; route: string }[]> = {
  stress: [
    { id: "breathing", name: "Deep Breathing", route: "/breathing" },
    { id: "progressive", name: "Progressive Relaxation", route: "/progressive-relaxation" },
    { id: "tea", name: "Mindful Tea", route: "/tea" },
  ],
  focus: [
    { id: "breathing", name: "Focus Breathing", route: "/breathing" },
    { id: "phone-free", name: "Phone-Free Hour", route: "/phone-free" },
    { id: "journal", name: "Brain Dump Journal", route: "/journal" },
  ],
  sleep: [
    { id: "evening", name: "Evening Wind Down", route: "/evening-wind-down" },
    { id: "sleep-log", name: "Sleep Tracking", route: "/sleep-journey" },
    { id: "sounds", name: "Soothing Sounds", route: "/sounds" },
  ],
  energy: [
    { id: "walk", name: "Short Walk", route: "/short-walk" },
    { id: "stretching", name: "Gentle Stretching", route: "/gentle-stretching" },
    { id: "morning", name: "Morning Ritual", route: "/morning" },
  ],
  anxiety: [
    { id: "cbt", name: "Thought Reframing", route: "/cbt-tools" },
    { id: "breathing", name: "Calming Breath", route: "/breathing" },
    { id: "compassion", name: "Self-Compassion", route: "/self-compassion" },
  ],
  mood: [
    { id: "gratitude", name: "Gratitude Practice", route: "/gratitude" },
    { id: "journal", name: "Mood Journal", route: "/journal" },
    { id: "compassion", name: "Self-Compassion", route: "/self-compassion" },
  ],
  habits: [
    { id: "morning", name: "Morning Ritual", route: "/morning" },
    { id: "check-in", name: "Daily Check-In", route: "/check-in" },
    { id: "clean", name: "Clean Counter", route: "/clean" },
  ],
  mindfulness: [
    { id: "breathing", name: "Mindful Breathing", route: "/breathing" },
    { id: "tea", name: "Mindful Tea", route: "/tea" },
    { id: "walk", name: "Mindful Walk", route: "/short-walk" },
  ],
};

interface ActivityCompletionProps {
  activityName: string;
  onComplete?: () => void;
}

export default function ActivityCompletion({ activityName, onComplete }: ActivityCompletionProps) {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [nextActivity, setNextActivity] = useState<DailyActivity | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadDailyProgress = async (justCompletedName: string) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user preferences for goals
      const { data: prefs } = await supabase
        .from("user_preferences")
        .select("goals")
        .eq("user_id", user.id)
        .single();

      const goals = prefs?.goals || ["stress", "focus"];

      // Build ordered activities list from goals (no shuffling - maintain order)
      const activities: DailyActivity[] = [];
      const usedIds = new Set<string>();

      goals.forEach((goal: string) => {
        const goalActivities = ACTIVITIES_BY_GOAL[goal] || [];
        goalActivities.forEach(activity => {
          if (!usedIds.has(activity.id) && activities.length < 4) {
            activities.push({ ...activity, completed: false });
            usedIds.add(activity.id);
          }
        });
      });

      // Get today's completions from database
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: completions } = await supabase
        .from("activity_completions")
        .select("activity_name")
        .eq("user_id", user.id)
        .gte("completed_at", today.toISOString());

      const completedNames = completions?.map(c => c.activity_name.toLowerCase()) || [];
      
      // Also include the just-completed activity (in case DB hasn't updated yet)
      const allCompletedNames = [...completedNames, justCompletedName.toLowerCase()];

      // Mark completed activities with better matching
      const updatedActivities = activities.map(a => {
        const activityLower = a.name.toLowerCase();
        const isActivityCompleted = allCompletedNames.some(c => {
          // Exact match
          if (c === activityLower) return true;
          // Partial match (e.g., "mindful tea" matches "Mindful Tea")
          if (c.includes(activityLower) || activityLower.includes(c)) return true;
          // Match by key words
          const cWords = c.split(' ');
          const aWords = activityLower.split(' ');
          return cWords.some(cw => aWords.some(aw => cw === aw && cw.length > 3));
        });
        return { ...a, completed: isActivityCompleted };
      });

      setDailyActivities(updatedActivities);
      setTotalCount(updatedActivities.length);
      
      const completed = updatedActivities.filter(a => a.completed).length;
      setCompletedCount(completed);

      // Find next incomplete activity (in order)
      const next = updatedActivities.find(a => !a.completed);
      setNextActivity(next || null);
    } catch (error) {
      console.error("Error loading daily progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    // Trigger confetti immediately
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Save completion to database
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('activity_completions')
          .insert({
            user_id: user.id,
            activity_name: activityName
          });

        if (error) {
          console.error('Error saving activity completion:', error);
          toast.error('Could not save completion');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }

    // Set completed and load progress (pass the activity name so we count it even if DB is slow)
    setIsCompleted(true);
    await loadDailyProgress(activityName);

    if (onComplete) {
      onComplete();
    }
  };

  if (isCompleted) {
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    const allDone = completedCount >= totalCount && totalCount > 0;

    return (
      <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 animate-fade-in">
        <CardContent className="pt-6 space-y-6">
          {/* Celebration */}
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-2">
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
              <CheckCircle className="h-10 w-10 text-primary" />
              <Sparkles className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold">Amazing Job! 🎉</h3>
            <p className="text-muted-foreground">
              You completed {activityName}!
            </p>
          </div>

          {/* Daily Progress */}
          {totalCount > 0 && !isLoading && (
            <div className="bg-background/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Today's Progress</span>
                <span className="text-primary font-semibold">{completedCount} of {totalCount}</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {/* Activity checklist - in order */}
              <div className="space-y-2 pt-2">
                {dailyActivities.map((activity, index) => (
                  <div 
                    key={`${activity.id}-${index}`} 
                    className={`flex items-center gap-2 text-sm ${
                      activity.completed ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {activity.completed ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={activity.completed ? "line-through" : ""}>
                      {activity.name}
                    </span>
                    {!activity.completed && nextActivity?.id === activity.id && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-auto">
                        Up next
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-background/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Loading your progress...</p>
            </div>
          )}

          {/* Encouragement */}
          <div className="flex items-center justify-center gap-2 text-primary text-sm">
            <Heart className="h-4 w-4 fill-current" />
            <span className="font-medium">
              {allDone 
                ? "You completed all activities for today!" 
                : "Keep going, you're doing great!"}
            </span>
            <Heart className="h-4 w-4 fill-current" />
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            {nextActivity && !allDone ? (
              <Button 
                className="flex-1"
                onClick={() => navigate(nextActivity.route)}
              >
                Next: {nextActivity.name}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : allDone ? (
              <Button 
                className="flex-1"
                onClick={() => navigate("/progress")}
              >
                View Progress
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                className="flex-1"
                onClick={() => navigate("/activities")}
              >
                Browse Activities
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleComplete}
        size="lg"
        className="gap-2 px-8"
      >
        <CheckCircle className="h-5 w-5" />
        Mark as Complete
      </Button>
    </div>
  );
}
