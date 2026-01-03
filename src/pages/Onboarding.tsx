import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ArrowRight, Sparkles, Shield, Target } from "lucide-react";

const GOALS = [
  { id: "stress", label: "Manage Stress", emoji: "🧘", description: "Find calm in daily life" },
  { id: "focus", label: "Improve Focus", emoji: "🎯", description: "Stay concentrated and productive" },
  { id: "sleep", label: "Better Sleep", emoji: "😴", description: "Rest deeply and wake refreshed" },
  { id: "energy", label: "Boost Energy", emoji: "⚡", description: "Feel more vibrant throughout the day" },
  { id: "anxiety", label: "Reduce Anxiety", emoji: "🌊", description: "Calm your racing thoughts" },
  { id: "mood", label: "Improve Mood", emoji: "🌈", description: "Feel happier and more balanced" },
  { id: "habits", label: "Build Better Habits", emoji: "✨", description: "Create positive daily routines" },
  { id: "mindfulness", label: "Practice Mindfulness", emoji: "🧠", description: "Be more present in the moment" },
];

const FEATURES = [
  { icon: Target, title: "Personalized Plan", description: "Activities tailored to your goals" },
  { icon: Sparkles, title: "Daily Check-ins", description: "Track your mood and progress" },
  { icon: Shield, title: "Safe Space", description: "Private journaling and venting" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
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
        description: "Your personalized journey is ready",
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

  // Step 0: Welcome intro
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <div className="mb-6">
            <Heart className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Welcome to MindfulMe</h1>
            <p className="text-muted-foreground text-lg">
              Your personal companion for mental wellness and self-care
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <p className="text-foreground/80">
              We're here to help you feel better, one day at a time. Whether you're dealing with stress, 
              looking to build better habits, or just want a safe space to reflect — you're in the right place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <feature.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <Button onClick={() => setStep(1)} size="lg" className="w-full max-w-xs">
            Let's Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    );
  }

  // Step 1: Goal selection
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-4">
            <span>Step 1 of 1</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">What brings you here today?</h1>
          <p className="text-muted-foreground">
            Select all that apply — we'll personalize your experience based on your goals
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-8">
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
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedGoals.includes(goal.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xl">{goal.emoji}</span>
                    <h3 className="font-semibold text-sm">{goal.label}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(0)}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isLoading || selectedGoals.length === 0}
            className="flex-1"
            size="lg"
          >
            {isLoading ? "Creating your plan..." : "Start My Journey"}
          </Button>
        </div>

        {selectedGoals.length > 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            ✨ {selectedGoals.length} goal{selectedGoals.length > 1 ? 's' : ''} selected — we'll create activities just for you
          </p>
        )}
      </Card>
    </div>
  );
}
