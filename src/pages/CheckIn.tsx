import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  const [step, setStep] = useState<"mood" | "questions" | "complete">("mood");
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

  const handleComplete = () => {
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

    toast({
      title: "Check-in complete! 🎉",
      description: "Your progress has been saved",
    });

    setStep("complete");
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

  if (step === "complete") {
    const recommendations = getRecommendations();
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 text-6xl">✨</div>
            <CardTitle className="text-2xl">You did great today!</CardTitle>
            <CardDescription>Here are some activities that might help</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {recommendations.map((rec) => (
                <Badge
                  key={rec}
                  variant="outline"
                  className="py-3 px-4 justify-center text-center border-primary/30"
                >
                  {rec}
                </Badge>
              ))}
            </div>
            <div className="pt-4 space-y-2">
              <Button
                onClick={() => navigate("/activities")}
                className="w-full"
              >
                Explore All Activities
              </Button>
              <Button
                onClick={() => navigate("/journal")}
                variant="outline"
                className="w-full"
              >
                Write in Journal
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
