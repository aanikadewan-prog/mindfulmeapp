import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Waves, Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import ActivityCompletion from "@/components/ActivityCompletion";

interface BodyPart {
  id: number;
  name: string;
  instruction: string;
  duration: number; // seconds for tension + release
  position: string; // for visual positioning
}

const bodyParts: BodyPart[] = [
  {
    id: 1,
    name: "Toes & Feet",
    instruction: "Curl your toes tightly... hold... and release. Feel the tension melt away.",
    duration: 10,
    position: "bottom"
  },
  {
    id: 2,
    name: "Calves & Legs",
    instruction: "Point your toes, tense your calves... hold... and let go. Notice the difference.",
    duration: 10,
    position: "lower"
  },
  {
    id: 3,
    name: "Thighs & Hips",
    instruction: "Squeeze your thighs together... hold tight... and release completely.",
    duration: 10,
    position: "lower-mid"
  },
  {
    id: 4,
    name: "Stomach",
    instruction: "Pull your stomach in tight... hold... and let it soften and relax.",
    duration: 10,
    position: "middle"
  },
  {
    id: 5,
    name: "Chest & Back",
    instruction: "Take a deep breath, hold it... and exhale slowly, releasing all tension.",
    duration: 12,
    position: "middle"
  },
  {
    id: 6,
    name: "Hands & Arms",
    instruction: "Make tight fists, tense your arms... hold... and let your hands open, arms heavy.",
    duration: 10,
    position: "upper-mid"
  },
  {
    id: 7,
    name: "Shoulders",
    instruction: "Raise your shoulders to your ears... hold... and let them drop, feeling the release.",
    duration: 10,
    position: "upper"
  },
  {
    id: 8,
    name: "Neck",
    instruction: "Gently press your head back... hold... and let your neck relax completely.",
    duration: 10,
    position: "upper"
  },
  {
    id: 9,
    name: "Face & Jaw",
    instruction: "Scrunch your face tight, clench your jaw... hold... and let everything soften.",
    duration: 10,
    position: "top"
  },
  {
    id: 10,
    name: "Full Body Scan",
    instruction: "Take a moment to notice how much lighter your body feels. Every muscle relaxed.",
    duration: 15,
    position: "full"
  }
];

export default function ProgressiveRelaxation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(bodyParts[0].duration);
  const [completedParts, setCompletedParts] = useState<number[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setCompletedParts([...completedParts, currentStep]);
      
      if (currentStep < bodyParts.length - 1) {
        setCurrentStep(currentStep + 1);
        setTimeLeft(bodyParts[currentStep + 1].duration);
      } else {
        setIsActive(false);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentStep, completedParts]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTimeLeft(bodyParts[0].duration);
    setCompletedParts([]);
  };

  const skipStep = () => {
    if (currentStep < bodyParts.length - 1) {
      setCompletedParts([...completedParts, currentStep]);
      setCurrentStep(currentStep + 1);
      setTimeLeft(bodyParts[currentStep + 1].duration);
    }
  };

  const progress = ((bodyParts[currentStep].duration - timeLeft) / bodyParts[currentStep].duration) * 100;
  const overallProgress = ((currentStep + (completedParts.includes(currentStep) ? 1 : 0)) / bodyParts.length) * 100;
  const isComplete = currentStep === bodyParts.length - 1 && completedParts.includes(currentStep);

  const getBodyPartColor = (index: number) => {
    if (completedParts.includes(index)) {
      return "bg-primary/30 border-primary/50";
    } else if (index === currentStep) {
      return "bg-accent/40 border-accent/70 animate-pulse";
    } else {
      return "bg-muted/30 border-muted";
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
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
                <Waves className="h-8 w-8" />
                Progressive Muscle Relaxation
              </CardTitle>
              <p className="text-muted-foreground mt-2">Release physical tension - follow along with each body part</p>
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
                {completedParts.length + (isComplete ? 1 : 0)} / {bodyParts.length} body parts
              </Badge>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Visual Body Map */}
            <Card className="bg-gradient-to-br from-muted/50 to-accent/10">
              <CardContent className="pt-8 pb-8">
                <div className="relative h-96 flex flex-col items-center justify-between">
                  {/* Head */}
                  <div className={`w-16 h-16 rounded-full border-4 transition-all ${getBodyPartColor(8)} ${currentStep === 8 ? 'scale-110' : ''}`}>
                    <div className="text-2xl text-center mt-3">😌</div>
                  </div>

                  {/* Neck */}
                  <div className={`w-12 h-8 rounded border-4 transition-all ${getBodyPartColor(7)}`} />

                  {/* Shoulders */}
                  <div className={`w-32 h-12 rounded-lg border-4 transition-all ${getBodyPartColor(6)}`} />

                  {/* Chest/Arms */}
                  <div className="flex gap-4">
                    <div className={`w-8 h-24 rounded-lg border-4 transition-all ${getBodyPartColor(5)}`} />
                    <div className={`w-16 h-24 rounded-lg border-4 transition-all ${getBodyPartColor(4)}`} />
                    <div className={`w-8 h-24 rounded-lg border-4 transition-all ${getBodyPartColor(5)}`} />
                  </div>

                  {/* Hips/Thighs */}
                  <div className="flex gap-2">
                    <div className={`w-14 h-20 rounded-lg border-4 transition-all ${getBodyPartColor(2)}`} />
                    <div className={`w-14 h-20 rounded-lg border-4 transition-all ${getBodyPartColor(2)}`} />
                  </div>

                  {/* Legs */}
                  <div className="flex gap-2">
                    <div className={`w-10 h-24 rounded-lg border-4 transition-all ${getBodyPartColor(1)}`} />
                    <div className={`w-10 h-24 rounded-lg border-4 transition-all ${getBodyPartColor(1)}`} />
                  </div>

                  {/* Feet */}
                  <div className="flex gap-2">
                    <div className={`w-12 h-8 rounded-full border-4 transition-all ${getBodyPartColor(0)}`} />
                    <div className={`w-12 h-8 rounded-full border-4 transition-all ${getBodyPartColor(0)}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30">
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-4">
                    <div>
                      <Badge className="mb-3">Step {currentStep + 1} of {bodyParts.length}</Badge>
                      <h3 className="text-2xl font-bold mb-2">{bodyParts[currentStep].name}</h3>
                    </div>

                    <div className="text-5xl font-bold text-primary text-center">
                      {timeLeft}s
                    </div>

                    <Progress value={progress} className="h-3" />

                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {bodyParts[currentStep].instruction}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                {!isComplete && (
                  <>
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className="gap-2 flex-1"
                    >
                      {isActive ? (
                        <>
                          <Pause className="h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          {completedParts.length > 0 ? "Resume" : "Start"}
                        </>
                      )}
                    </Button>
                    {isActive && (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={skipStep}
                      >
                        Skip
                      </Button>
                    )}
                  </>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetExercise}
                  className="gap-2"
                >
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </Button>
              </div>

              {/* Completion */}
              {isComplete && (
                <ActivityCompletion activityName="Progressive Muscle Relaxation" />
              )}
            </div>
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💡 Tips for Best Results</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lie down in a comfortable position</li>
                <li>• Tense each muscle group for 5 seconds, then release completely</li>
                <li>• Pay attention to the contrast between tension and relaxation</li>
                <li>• Breathe steadily throughout - don't hold your breath</li>
                <li>• If something hurts, skip that muscle group</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
