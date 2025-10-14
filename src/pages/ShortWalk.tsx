import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mountain, Play, Pause, RotateCcw, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

interface MindfulPrompt {
  sense: string;
  prompt: string;
  icon: string;
}

const prompts: MindfulPrompt[] = [
  { sense: "See", prompt: "Notice 3 things you can see. Colors, shapes, movement...", icon: "👁️" },
  { sense: "Hear", prompt: "Listen for 3 sounds. Birds? Wind? Distant traffic?", icon: "👂" },
  { sense: "Feel", prompt: "Notice 3 sensations. The breeze? Ground beneath your feet?", icon: "✋" },
  { sense: "Breathe", prompt: "Take 3 deep breaths. Feel the fresh air filling your lungs.", icon: "🌬️" },
  { sense: "Observe", prompt: "Look at something closely. Really see its details.", icon: "🔍" }
];

export default function ShortWalk() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(10); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [checkedPrompts, setCheckedPrompts] = useState<number[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsComplete(true);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Change prompt every 2 minutes
      if (timeLeft % 120 === 0 && timeLeft !== duration * 60) {
        setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
      }
    } else {
      if (interval!) clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, duration]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetWalk = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsComplete(false);
    setCurrentPromptIndex(0);
    setCheckedPrompts([]);
  };

  const changeDuration = (mins: number) => {
    if (!isActive) {
      setDuration(mins);
      setTimeLeft(mins * 60);
      setIsComplete(false);
    }
  };

  const togglePromptCheck = (index: number) => {
    setCheckedPrompts(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

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
            <Mountain className="h-8 w-8" />
            Mindful Walk
          </CardTitle>
          <p className="text-muted-foreground mt-2">Even 10 minutes counts - be present outdoors</p>
        </CardHeader>
        <CardContent className="space-y-6 pb-8 pt-6">
          {/* Duration Selection */}
          {!isActive && !isComplete && (
            <div className="flex justify-center gap-3 flex-wrap">
              {[5, 10, 15, 20, 30].map((mins) => (
                <Button
                  key={mins}
                  variant={duration === mins ? "default" : "outline"}
                  onClick={() => changeDuration(mins)}
                  size="lg"
                >
                  {mins} min
                </Button>
              ))}
            </div>
          )}

          {/* Timer Display */}
          <Card className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                {/* Animated walking icon */}
                <div className="text-8xl animate-bounce">
                  🚶
                </div>

                {/* Timer */}
                <div>
                  <div className="text-6xl font-bold text-primary mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isActive ? "Keep walking..." : isComplete ? "Walk complete!" : "Ready to start"}
                  </p>
                </div>

                {/* Progress */}
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Current Mindfulness Prompt */}
          {isActive && !isComplete && (
            <Card className="bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/30 animate-fade-in">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-5xl">{prompts[currentPromptIndex].icon}</div>
                  <Badge className="text-base">{prompts[currentPromptIndex].sense}</Badge>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {prompts[currentPromptIndex].prompt}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
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
                    {timeLeft === duration * 60 ? "Start Walk" : "Resume"}
                  </>
                )}
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={resetWalk}
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
                <h3 className="text-2xl font-semibold mb-2">Walk Complete!</h3>
                <p className="text-muted-foreground">
                  You got outside and moved your body. That's a win! 💪
                </p>
              </CardContent>
            </Card>
          )}

          {/* Mindfulness Checklist */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4 text-center">Mindfulness Checklist</h4>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Try to notice these during your walk
              </p>
              <div className="space-y-3">
                {prompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => togglePromptCheck(index)}
                    className={`w-full flex items-start gap-3 p-4 rounded-lg transition-all text-left ${
                      checkedPrompts.includes(index)
                        ? "bg-primary/10 border-2 border-primary/40"
                        : "bg-background border-2 border-border hover:border-primary/30"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                      checkedPrompts.includes(index) ? "bg-primary border-primary" : "border-muted-foreground"
                    }`}>
                      {checkedPrompts.includes(index) && <Check className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm flex items-center gap-2">
                        <span className="text-xl">{prompt.icon}</span>
                        {prompt.sense}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{prompt.prompt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-accent/10">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                💡 Can't go outside right now? That's okay! Sit by a window and observe for 10 minutes. 
                Notice the sky, trees, people, weather. Taking this time still counts.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
