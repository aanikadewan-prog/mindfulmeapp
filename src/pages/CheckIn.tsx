import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const moods = [
  { emoji: "😊", label: "Great", value: 5, color: "bg-accent" },
  { emoji: "🙂", label: "Good", value: 4, color: "bg-primary/70" },
  { emoji: "😐", label: "Okay", value: 3, color: "bg-muted" },
  { emoji: "😔", label: "Low", value: 2, color: "bg-secondary/70" },
  { emoji: "😢", label: "Struggling", value: 1, color: "bg-destructive/70" },
];

const questions = [
  { id: "sleep", label: "Did you get enough sleep?", emoji: "😴" },
  { id: "hydration", label: "Are you staying hydrated?", emoji: "💧" },
  { id: "movement", label: "Did you move your body today?", emoji: "🏃" },
  { id: "social", label: "Did you connect with someone?", emoji: "💬" },
];

export default function CheckIn() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<"mood" | "questions" | "loading" | "complete">("mood");
  const [aiRecommendations, setAiRecommendations] = useState<{
    message: string;
    activities: string[];
    reasoning: string;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };

  const handleContinue = () => {
    if (selectedMood === null) {
      toast({
        title: "Please select your mood",
        description: "Let us know how you're feeling today",
        variant: "destructive",
      });
      return;
    }
    setStep("questions");
  };

  const toggleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleComplete = async () => {
    const checkIn = {
      date: new Date().toISOString(),
      mood: selectedMood,
      answers,
    };

    const existingData = localStorage.getItem("checkIns");
    const checkIns = existingData ? JSON.parse(existingData) : [];
    checkIns.push(checkIn);
    localStorage.setItem("checkIns", JSON.stringify(checkIns));

    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem("lastCheckIn");
    const streak = localStorage.getItem("streak");
    
    if (lastCheckIn !== today) {
      const newStreak = lastCheckIn === new Date(Date.now() - 86400000).toDateString() 
        ? (parseInt(streak || "0") + 1).toString()
        : "1";
      localStorage.setItem("streak", newStreak);
      localStorage.setItem("lastCheckIn", today);
    }

    // Show loading state
    setStep("loading");

    // Get AI recommendations
    try {
      const { data, error } = await supabase.functions.invoke("recommend-activities", {
        body: { mood: selectedMood, answers }
      });

      if (error) throw error;

      setAiRecommendations(data);
      setStep("complete");

      toast({
        title: "Check-in complete! 🎉",
        description: "Got personalized recommendations for you",
      });
    } catch (error) {
      console.error("Error getting recommendations:", error);
      // Fallback to basic recommendations
      setStep("complete");
      toast({
        title: "Check-in complete! 🎉",
        description: "Your progress has been saved",
      });
    }
  };

  const getRecommendations = () => {
    if (selectedMood === null) return [];
    
    if (selectedMood <= 2) {
      return ["Gentle breathing", "Soothing music", "Talk to someone", "Self-compassion"];
    } else if (selectedMood === 3) {
      return ["Short walk", "Light stretching", "Journaling", "Creative activity"];
    } else {
      return ["Fun activity", "Connect with friends", "Creative project", "Physical exercise"];
    }
  };

  // Map activity names to routes
  const activityRoutes: Record<string, string> = {
    "Breathing Timer": "/breathing",
    "Gentle Stretching": "/gentle-stretching",
    "Progressive Relaxation": "/progressive-relaxation",
    "Morning Ritual": "/morning-ritual",
    "Mindful Tea": "/mindful-tea",
    "Short Walk": "/short-walk",
    "Soothing Sounds": "/soothing-sounds",
    "Gratitude Practice": "/gratitude",
    "Self-Compassion": "/self-compassion",
    "Phone-Free Hour": "/phone-free",
    "Social Media Pause": "/social-media-pause",
    "Evening Wind-Down": "/evening-wind-down",
    "Journal": "/journal"
  };

  if (step === "loading") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Card className="border-primary/20 shadow-lg">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg text-muted-foreground">
                Finding the best activities for you...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "complete") {
    const recommendations = aiRecommendations || { 
      message: "Thanks for checking in today 💜",
      activities: getRecommendations(),
      reasoning: "These activities might help support your wellbeing."
    };
    
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 text-6xl">✨</div>
            <CardTitle className="text-2xl">{recommendations.message}</CardTitle>
            <CardDescription className="text-base mt-2">{recommendations.reasoning}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground text-center mb-3">
                Recommended for you right now:
              </p>
              <div className="grid gap-2">
                {recommendations.activities.map((activity) => (
                  <Button
                    key={activity}
                    variant="outline"
                    onClick={() => {
                      const route = activityRoutes[activity];
                      if (route) {
                        navigate(route);
                      } else {
                        navigate("/activities");
                      }
                    }}
                    className="w-full justify-start text-left h-auto py-3 px-4 border-primary/30 hover:bg-primary/10"
                  >
                    <span className="font-medium">{activity}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="pt-4 space-y-2 border-t">
              <Button
                onClick={() => navigate("/activities")}
                variant="secondary"
                className="w-full"
              >
                See All Activities
              </Button>
              <Button
                onClick={() => {
                  setSelectedMood(null);
                  setAnswers({});
                  setStep("mood");
                  setAiRecommendations(null);
                }}
                variant="outline"
                className="w-full"
              >
                Check In Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Quick wellness check</CardTitle>
            <CardDescription>These small things make a big difference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-2xl">{q.emoji}</span>
                  <span>{q.label}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={answers[q.id] === true ? "default" : "outline"}
                    onClick={() => toggleAnswer(q.id, true)}
                    className="flex-1"
                  >
                    Yes
                  </Button>
                  <Button
                    variant={answers[q.id] === false ? "default" : "outline"}
                    onClick={() => toggleAnswer(q.id, false)}
                    className="flex-1"
                  >
                    Not yet
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={handleComplete} className="w-full mt-6">
              Complete Check-In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
          <CardDescription>Choose the mood that fits best</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:scale-105 ${
                  selectedMood === mood.value
                    ? `${mood.color} ring-2 ring-primary shadow-lg`
                    : "bg-card hover:bg-muted"
                }`}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className="text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>
          <Button onClick={handleContinue} className="w-full" disabled={selectedMood === null}>
            Continue
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            💜 Remember: All feelings are valid. You're doing your best, and that's enough.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
