import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Moon, Check, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface Step {
  id: number;
  title: string;
  duration: number; // in seconds
  instruction: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Dim the Lights",
    duration: 30,
    instruction: "Take a moment to dim your lights or turn on warm, soft lighting. Let your eyes adjust to the gentle glow.",
    icon: "💡"
  },
  {
    id: 2,
    title: "Put Phone Away",
    duration: 30,
    instruction: "Place your phone on silent and across the room. You won't need it for the next 30 minutes.",
    icon: "📱"
  },
  {
    id: 3,
    title: "Comfortable Position",
    duration: 30,
    instruction: "Find a cozy spot. Get comfortable. Maybe grab a blanket or adjust your pillows.",
    icon: "🛋️"
  },
  {
    id: 4,
    title: "Deep Breathing",
    duration: 120,
    instruction: "Close your eyes. Breathe in slowly for 4 counts. Hold for 4. Exhale for 6. Repeat this several times.",
    icon: "🌬️"
  },
  {
    id: 5,
    title: "Release the Day",
    duration: 180,
    instruction: "Think about your day. Acknowledge any worries. Imagine placing them in a box to deal with tomorrow. They'll still be there - but not right now.",
    icon: "📦"
  },
  {
    id: 6,
    title: "Calming Activity",
    duration: 600,
    instruction: "Do something peaceful: read a few pages, listen to soft music, or do gentle stretches. Whatever feels calming to you.",
    icon: "📖"
  },
  {
    id: 7,
    title: "Final Breathing",
    duration: 120,
    instruction: "One more round of deep breathing. Feel your body relax. Your thoughts will be there tomorrow. Focus on rest now.",
    icon: "😌"
  }
];

export default function EveningWindDown() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(steps[0].duration);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next step
      if (soundEnabled) {
        // Play completion sound
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUqjl8bllHQU3k9n0yoMrBSh+zPLaizsKE2S56+mjUBELTKXh8bllHgU3lNn0yoMrBSh+zPLaizsKE2S56+mjUBELTKXh8bllHgU3lNn0yoMrBSh+zPLaizsKE2S56+mjUBELTKXh8bllHgU3lNn0');
      }
      
      setCompletedSteps([...completedSteps, currentStep]);
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeLeft(steps[currentStep + 1].duration);
      } else {
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentStep, completedSteps, soundEnabled]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
      setTimeLeft(steps[currentStep + 1].duration);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTimeLeft(steps[0].duration);
    setIsActive(false);
    setCompletedSteps([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((steps[currentStep].duration - timeLeft) / steps[currentStep].duration) * 100;
  const overallProgress = ((currentStep + (completedSteps.includes(currentStep) ? 1 : 0)) / steps.length) * 100;

  const isComplete = currentStep === steps.length - 1 && completedSteps.includes(currentStep);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate("/activities")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Button>

      <Card className="border-primary/30 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Moon className="h-8 w-8" />
                Evening Wind-Down
              </CardTitle>
              <p className="text-muted-foreground mt-2">Prepare for restful sleep - follow along</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8 pt-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <Badge variant="secondary">
                {completedSteps.length + (isComplete ? 1 : 0)} / {steps.length} steps
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Current Step Display */}
          <Card className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="text-8xl animate-pulse">
                  {steps[currentStep].icon}
                </div>

                {/* Step Title */}
                <div>
                  <Badge className="mb-3">Step {currentStep + 1} of {steps.length}</Badge>
                  <h2 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h2>
                </div>

                {/* Timer */}
                <div className="text-6xl font-bold text-primary">
                  {formatTime(timeLeft)}
                </div>

                {/* Progress for current step */}
                <Progress value={progress} className="h-3" />

                {/* Instruction */}
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                  {steps[currentStep].instruction}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {!isActive && !isComplete && (
              <Button size="lg" onClick={handleStart} className="min-w-32">
                {completedSteps.length > 0 ? "Resume" : "Start"}
              </Button>
            )}
            {isActive && (
              <>
                <Button size="lg" variant="secondary" onClick={handlePause}>
                  Pause
                </Button>
                <Button size="lg" variant="outline" onClick={handleSkip}>
                  Skip Step
                </Button>
              </>
            )}
            <Button size="lg" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>

          {/* Completion Message */}
          {isComplete && (
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl mb-3">✨</div>
                <h3 className="text-2xl font-semibold mb-2">Wind-Down Complete!</h3>
                <p className="text-muted-foreground">
                  You've prepared your mind and body for rest. Sleep well. 💜
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step Timeline */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      index === currentStep
                        ? "bg-primary/20 border-2 border-primary/40"
                        : completedSteps.includes(index)
                        ? "bg-accent/10 border border-accent/30"
                        : "bg-background/50 border border-border"
                    }`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border-2">
                      {completedSteps.includes(index) ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(step.duration)}</p>
                    </div>
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
