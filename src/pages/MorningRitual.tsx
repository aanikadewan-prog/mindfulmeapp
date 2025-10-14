import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sunrise, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ActivityCompletion from "@/components/ActivityCompletion";

interface RitualStep {
  id: string;
  text: string;
  completed: boolean;
}

const initialSteps: RitualStep[] = [
  { id: "breathe", text: "Take 5 deep breaths before checking your phone", completed: false },
  { id: "stretch", text: "Stretch while still in bed", completed: false },
  { id: "forward", text: "Think of one thing you're looking forward to", completed: false },
  { id: "water", text: "Drink a glass of water", completed: false },
  { id: "fresh-air", text: "Open a window and let fresh air in", completed: false },
  { id: "intention", text: "Set a small intention for the day", completed: false },
  { id: "credit", text: "Give yourself credit for getting up", completed: false }
];

export default function MorningRitual() {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<RitualStep[]>(() => {
    const saved = localStorage.getItem("morningRitualSteps");
    if (saved) {
      const savedSteps = JSON.parse(saved);
      const lastReset = localStorage.getItem("morningRitualLastReset");
      const today = new Date().toDateString();
      
      if (lastReset !== today) {
        return initialSteps;
      }
      return savedSteps;
    }
    return initialSteps;
  });

  useEffect(() => {
    localStorage.setItem("morningRitualSteps", JSON.stringify(steps));
  }, [steps]);

  const toggleStep = (id: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const resetSteps = () => {
    setSteps(initialSteps);
    localStorage.setItem("morningRitualLastReset", new Date().toDateString());
    toast.success("Morning ritual reset! Start fresh 🌅");
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate("/activities")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Sunrise className="h-8 w-8" />
                Morning Ritual
              </CardTitle>
              <p className="text-muted-foreground mt-2">Start your day with intention</p>
            </div>
            <Button variant="outline" size="sm" onClick={resetSteps} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-primary">
                {completedCount} of {steps.length} complete
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={step.id}
                      checked={step.completed}
                      onCheckedChange={() => toggleStep(step.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={step.id}
                      className={`flex-1 cursor-pointer leading-relaxed ${
                        step.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      <span className="font-semibold text-primary mr-2">{index + 1}.</span>
                      {step.text}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Completion Message */}
          {completedCount === steps.length && (
            <ActivityCompletion activityName="Morning Ritual" />
          )}

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💡 Morning Mindfulness Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Do these steps in order for the best effect</li>
                <li>• Don't rush - even 10 minutes makes a difference</li>
                <li>• The checklist resets daily to help build the habit</li>
                <li>• Your morning sets the tone for your whole day</li>
                <li>• Be gentle with yourself if you miss a step</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
