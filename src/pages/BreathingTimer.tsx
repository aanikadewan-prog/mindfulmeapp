import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Phase = "inhale" | "hold" | "exhale" | "rest";

interface BreathingPhase {
  name: string;
  duration: number;
  instruction: string;
}

const breathingCycle: Record<Phase, BreathingPhase> = {
  inhale: { name: "Breathe In", duration: 4, instruction: "Slowly breathe in through your nose" },
  hold: { name: "Hold", duration: 4, instruction: "Hold your breath gently" },
  exhale: { name: "Breathe Out", duration: 6, instruction: "Slowly exhale through your mouth" },
  rest: { name: "Rest", duration: 2, instruction: "Relax and prepare for the next breath" }
};

export default function BreathingTimer() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(breathingCycle.inhale.duration);
  const [cycleCount, setCycleCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      const phases: Phase[] = ["inhale", "hold", "exhale", "rest"];
      const currentIndex = phases.indexOf(currentPhase);
      const nextIndex = (currentIndex + 1) % phases.length;
      const nextPhase = phases[nextIndex];
      
      setCurrentPhase(nextPhase);
      setTimeLeft(breathingCycle[nextPhase].duration);
      
      // Increment cycle count after completing a full cycle
      if (nextPhase === "inhale") {
        setCycleCount((prev) => prev + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentPhase]);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(breathingCycle.inhale.duration);
    setCycleCount(0);
  };

  const getCircleScale = () => {
    const phase = breathingCycle[currentPhase];
    const progress = (phase.duration - timeLeft) / phase.duration;
    
    switch (currentPhase) {
      case "inhale":
        return 1 + (progress * 0.8); // Scale from 1 to 1.8
      case "hold":
        return 1.8; // Stay at max
      case "exhale":
        return 1.8 - (progress * 0.8); // Scale from 1.8 to 1
      case "rest":
        return 1; // Stay at min
      default:
        return 1;
    }
  };

  const getCircleColor = () => {
    switch (currentPhase) {
      case "inhale":
        return "from-primary/40 via-primary/60 to-primary/80";
      case "hold":
        return "from-primary/60 via-primary/70 to-primary/80";
      case "exhale":
        return "from-secondary/40 via-secondary/60 to-secondary/80";
      case "rest":
        return "from-accent/40 via-accent/60 to-accent/80";
      default:
        return "from-primary/40 via-primary/60 to-primary/80";
    }
  };

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

      <Card className="overflow-hidden">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Mindful Breathing</CardTitle>
          <p className="text-muted-foreground">Find your calm with guided breathing</p>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {/* Breathing Circle */}
          <div className="relative flex items-center justify-center h-80">
            {/* Outer glow rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`absolute w-64 h-64 rounded-full bg-gradient-to-br ${getCircleColor()} opacity-20 blur-3xl transition-all duration-1000`}
                style={{
                  transform: `scale(${getCircleScale() * 1.2})`,
                }}
              />
            </div>
            
            {/* Main breathing circle */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-48 h-48 rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl transition-all duration-1000 flex items-center justify-center`}
                style={{
                  transform: `scale(${getCircleScale()})`,
                }}
              >
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">
                    {timeLeft}
                  </div>
                  <div className="text-sm text-white/90 font-medium">
                    seconds
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative orbiting dots */}
            <div 
              className="absolute w-56 h-56 rounded-full border border-primary/20"
              style={{
                transform: `scale(${getCircleScale() * 0.9})`,
                transition: "transform 1s ease-in-out"
              }}
            />
          </div>

          {/* Phase instruction */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-primary">
              {breathingCycle[currentPhase].name}
            </h3>
            <p className="text-muted-foreground">
              {breathingCycle[currentPhase].instruction}
            </p>
          </div>

          {/* Cycle counter */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
              <span className="text-sm font-medium">Cycles completed:</span>
              <span className="text-lg font-bold text-primary">{cycleCount}</span>
            </div>
          </div>

          {/* Completion Message */}
          {cycleCount >= 5 && (
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-2xl font-semibold mb-2">Great Job!</h3>
                <p className="text-muted-foreground">
                  You showed up for yourself today. That takes courage. 💜
                </p>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleStartPause}
              className="gap-2 min-w-32"
            >
              {isActive ? (
                <>
                  <Pause className="h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  Start
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💡 Tips for Better Practice</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Find a quiet, comfortable space</li>
                <li>• Sit with your back straight but relaxed</li>
                <li>• Focus on the movement of your breath</li>
                <li>• If your mind wanders, gently bring it back</li>
                <li>• Aim for 5-10 cycles for a calming effect</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
