import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface Stretch {
  id: number;
  name: string;
  emoji: string;
  duration: number; // seconds to hold
  instructions: string[];
  benefits: string;
}

const stretches: Stretch[] = [
  {
    id: 1,
    name: "Overhead Reach",
    emoji: "🙆",
    duration: 20,
    instructions: [
      "Stand with feet hip-width apart",
      "Reach both arms overhead",
      "Interlace your fingers and flip palms up",
      "Stretch gently upward, lengthening your spine",
      "Take deep breaths"
    ],
    benefits: "Opens chest and shoulders"
  },
  {
    id: 2,
    name: "Side Bend",
    emoji: "🤸",
    duration: 20,
    instructions: [
      "Keep feet planted, arms overhead",
      "Lean gently to the right side",
      "Feel the stretch along your left side",
      "Hold, then switch to the left",
      "Keep hips facing forward"
    ],
    benefits: "Stretches obliques and waist"
  },
  {
    id: 3,
    name: "Forward Fold",
    emoji: "🙇",
    duration: 30,
    instructions: [
      "Stand with feet hip-width apart",
      "Slowly bend forward from your hips",
      "Let your arms dangle or touch toes/knees",
      "Don't force it - go as far as comfortable",
      "Feel the stretch in hamstrings and lower back"
    ],
    benefits: "Releases lower back and hamstrings"
  },
  {
    id: 4,
    name: "Shoulder Rolls",
    emoji: "💆",
    duration: 20,
    instructions: [
      "Stand tall, arms by your sides",
      "Roll shoulders backward in large circles",
      "Do 5 slow rolls backward",
      "Then 5 slow rolls forward",
      "Notice tension melting away"
    ],
    benefits: "Releases shoulder tension"
  },
  {
    id: 5,
    name: "Gentle Twist",
    emoji: "🌀",
    duration: 30,
    instructions: [
      "Sit comfortably in a chair or on floor",
      "Place right hand on left knee",
      "Left hand behind you",
      "Gently twist to the left, looking over shoulder",
      "Hold, breathe, then switch sides"
    ],
    benefits: "Improves spine mobility"
  },
  {
    id: 6,
    name: "Neck Rolls",
    emoji: "😌",
    duration: 30,
    instructions: [
      "Sit or stand comfortably",
      "Drop right ear toward right shoulder",
      "Hold for 5 breaths",
      "Slowly roll head forward, then to left",
      "Move gently - never force"
    ],
    benefits: "Relieves neck tension"
  },
  {
    id: 7,
    name: "Hip Circles",
    emoji: "💃",
    duration: 20,
    instructions: [
      "Stand with hands on hips",
      "Make slow, wide circles with your hips",
      "5 circles clockwise",
      "5 circles counter-clockwise",
      "Keep movements smooth and controlled"
    ],
    benefits: "Loosens hip joints"
  },
  {
    id: 8,
    name: "Final Relaxation",
    emoji: "🧘",
    duration: 30,
    instructions: [
      "Stand tall, feet together",
      "Take 3 deep, slow breaths",
      "Notice how your body feels now",
      "Appreciate the movement you just gave yourself",
      "Smile - you did great!"
    ],
    benefits: "Centers and calms"
  }
];

export default function GentleStretching() {
  const navigate = useNavigate();
  const [currentStretch, setCurrentStretch] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(stretches[0].duration);
  const [completedStretches, setCompletedStretches] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setCompletedStretches([...completedStretches, currentStretch]);
      
      if (currentStretch < stretches.length - 1) {
        setCurrentStretch(currentStretch + 1);
        setTimeLeft(stretches[currentStretch + 1].duration);
      } else {
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentStretch, completedStretches]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetRoutine = () => {
    setIsActive(false);
    setCurrentStretch(0);
    setTimeLeft(stretches[0].duration);
    setCompletedStretches([]);
  };

  const nextStretch = () => {
    if (currentStretch < stretches.length - 1) {
      setCompletedStretches([...completedStretches, currentStretch]);
      setCurrentStretch(currentStretch + 1);
      setTimeLeft(stretches[currentStretch + 1].duration);
      setIsActive(false);
    }
  };

  const prevStretch = () => {
    if (currentStretch > 0) {
      setCurrentStretch(currentStretch - 1);
      setTimeLeft(stretches[currentStretch - 1].duration);
      setIsActive(false);
    }
  };

  const progress = ((stretches[currentStretch].duration - timeLeft) / stretches[currentStretch].duration) * 100;
  const overallProgress = ((currentStretch + (completedStretches.includes(currentStretch) ? 1 : 0)) / stretches.length) * 100;
  const isComplete = currentStretch === stretches.length - 1 && completedStretches.includes(currentStretch);

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
          <CardTitle className="text-3xl flex items-center gap-2">
            <Heart className="h-8 w-8" />
            Gentle Stretching
          </CardTitle>
          <p className="text-muted-foreground mt-2">10-minute routine to release tension - follow along</p>
        </CardHeader>
        <CardContent className="space-y-6 pb-8 pt-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Routine Progress</span>
              <Badge variant="secondary">
                {completedStretches.length + (isComplete ? 1 : 0)} / {stretches.length} stretches
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          {/* Current Stretch Display */}
          <Card className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                {/* Emoji */}
                <div className="text-9xl animate-pulse">
                  {stretches[currentStretch].emoji}
                </div>

                {/* Stretch Name */}
                <div>
                  <Badge className="mb-3">Stretch {currentStretch + 1} of {stretches.length}</Badge>
                  <h2 className="text-3xl font-bold mb-2">{stretches[currentStretch].name}</h2>
                  <p className="text-sm text-muted-foreground italic">
                    {stretches[currentStretch].benefits}
                  </p>
                </div>

                {/* Timer */}
                <div>
                  <div className="text-6xl font-bold text-primary mb-2">
                    {timeLeft}s
                  </div>
                  <Progress value={progress} className="h-3 max-w-md mx-auto" />
                </div>

                {/* Instructions */}
                <Card className="bg-background/50 max-w-2xl mx-auto">
                  <CardContent className="pt-6">
                    <ol className="space-y-3 text-left">
                      {stretches[currentStretch].instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                            {index + 1}
                          </span>
                          <span className="text-sm leading-relaxed pt-0.5">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="lg"
              onClick={prevStretch}
              disabled={currentStretch === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              Previous
            </Button>

            {!isComplete && (
              <Button
                size="lg"
                onClick={toggleTimer}
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
                    {timeLeft === stretches[currentStretch].duration ? "Start" : "Resume"}
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={nextStretch}
              disabled={currentStretch === stretches.length - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={resetRoutine}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Completion */}
          {isComplete && (
            <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50">
              <CardContent className="pt-6 text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-2xl font-semibold mb-2">Routine Complete!</h3>
                <p className="text-muted-foreground">
                  You took 10 minutes for yourself. Your body thanks you! 💜
                </p>
              </CardContent>
            </Card>
          )}

          {/* Stretch Progress Indicators */}
          <div className="flex gap-2 justify-center flex-wrap">
            {stretches.map((stretch, index) => (
              <button
                key={stretch.id}
                onClick={() => {
                  setCurrentStretch(index);
                  setTimeLeft(stretch.duration);
                  setIsActive(false);
                }}
                className={`w-12 h-12 rounded-full border-2 text-2xl transition-all ${
                  index === currentStretch
                    ? "border-primary bg-primary/20 scale-110"
                    : completedStretches.includes(index)
                    ? "border-accent bg-accent/10"
                    : "border-muted bg-background opacity-60 hover:opacity-100"
                }`}
                title={stretch.name}
              >
                {stretch.emoji}
              </button>
            ))}
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💡 Stretching Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Never force a stretch - go only as far as comfortable</li>
                <li>• Breathe deeply throughout - don't hold your breath</li>
                <li>• You should feel mild tension, not pain</li>
                <li>• Take your time - this is your moment</li>
                <li>• Listen to your body - skip anything that hurts</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
