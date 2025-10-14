import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const GOALS = [
  { id: "stress", label: "Manage Stress", emoji: "🧘", description: "Find calm in daily life" },
  { id: "focus", label: "Improve Focus", emoji: "🎯", description: "Stay concentrated and productive" },
  { id: "sleep", label: "Better Sleep", emoji: "😴", description: "Rest deeply and wake refreshed" },
  { id: "energy", label: "Boost Energy", emoji: "⚡", description: "Feel more vibrant throughout the day" },
  { id: "anxiety", label: "Reduce Anxiety", emoji: "🌊", description: "Calm your racing thoughts" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleComplete = async () => {
    if (selectedGoals.length === 0) {
      toast({
        title: "Please select at least one goal",
        description: "Choose what you'd like to work on",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("user_preferences")
        .insert({
          user_id: user.id,
          goals: selectedGoals,
          topics: selectedGoals,
          onboarding_completed: true,
        });

      if (error) throw error;

      toast({
        title: "Welcome! 🎉",
        description: "Your personalized plan is ready",
      });

      navigate("/");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome! Let's personalize your journey</h1>
          <p className="text-muted-foreground">What would you like to work on? (Select all that apply)</p>
        </div>

        <div className="space-y-4 mb-8">
          {GOALS.map((goal) => (
            <div
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedGoals.includes(goal.id)
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedGoals.includes(goal.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{goal.emoji}</span>
                    <h3 className="font-semibold">{goal.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleComplete}
          disabled={isLoading || selectedGoals.length === 0}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Creating your plan..." : "Start Your Journey"}
        </Button>
      </Card>
    </div>
  );
}
