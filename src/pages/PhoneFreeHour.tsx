import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, RotateCcw, Smartphone, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function PhoneFreeHour() {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(60); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedSessions = localStorage.getItem(`phoneFree_${today}`);
    if (savedSessions) {
      setSessionsToday(parseInt(savedSessions));
    }
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    setIsActive(false);
    setIsComplete(true);
    const today = new Date().toDateString();
    const newCount = sessionsToday + 1;
    setSessionsToday(newCount);
    localStorage.setItem(`phoneFree_${today}`, newCount.toString());
    toast.success("🎉 Phone-free time complete! You did it!");
  };

  const toggleTimer = () => {
    if (!isActive && timeLeft === duration * 60) {
      toast.success("Timer started! Put your phone away 📱");
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setIsComplete(false);
  };

  const changeDuration = (minutes: number) => {
    if (!isActive) {
      setDuration(minutes);
      setTimeLeft(minutes * 60);
      setIsComplete(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const motivationalMessages = [
    "Your focus is a gift to yourself 🎁",
    "You're building a healthier relationship with technology 💪",
    "Every minute counts - you're doing great! ⭐",
    "This time is yours - enjoy the freedom 🦋",
    "You're stronger than the urge to check 💜"
  ];

  const currentMessage = motivationalMessages[Math.floor((progress / 20)) % motivationalMessages.length];

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

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Smartphone className="h-8 w-8" />
            Phone-Free Time
          </CardTitle>
          <p className="text-muted-foreground">Take a mindful break from your device</p>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {/* Duration Selection */}
          {!isActive && !isComplete && (
            <div className="flex justify-center gap-3 flex-wrap">
              {[15, 30, 60, 90].map((min) => (
                <Button
                  key={min}
                  variant={duration === min ? "default" : "outline"}
                  onClick={() => changeDuration(min)}
                  size="lg"
                >
                  {min} min
                </Button>
              ))}
            </div>
          )}

          {/* Timer Display */}
          <div className="relative flex items-center justify-center h-80">
            {/* Progress Ring */}
            <svg className="absolute w-72 h-72 transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="140"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              <circle
                cx="144"
                cy="144"
                r="140"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className="text-primary transition-all duration-1000"
                style={{
                  strokeDasharray: `${2 * Math.PI * 140}`,
                  strokeDashoffset: `${2 * Math.PI * 140 * (1 - progress / 100)}`,
                }}
              />
            </svg>

            {/* Timer Center */}
            <div className="relative z-10 text-center">
              {isComplete ? (
                <div className="space-y-2">
                  <CheckCircle2 className="h-24 w-24 text-primary mx-auto animate-scale-in" />
                  <div className="text-2xl font-bold text-primary">Complete!</div>
                </div>
              ) : (
                <>
                  <div className="text-6xl font-bold mb-2">
                    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {isActive ? "Time remaining" : "Ready to start"}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Motivational Message */}
          {isActive && !isComplete && (
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 animate-fade-in">
              <CardContent className="pt-6 text-center">
                <p className="text-lg font-medium text-muted-foreground">
                  {currentMessage}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
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
                    Start
                  </>
                )}
              </Button>
            )}
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          </div>

          {/* Sessions Today */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {sessionsToday} {sessionsToday === 1 ? "session" : "sessions"} completed today 🌟
            </Badge>
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">📱 Make It Count</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Put your phone in another room or out of sight</li>
                <li>• Tell someone you're taking phone-free time</li>
                <li>• Have an activity planned (read, walk, stretch)</li>
                <li>• Notice when you want to check - that's normal!</li>
                <li>• The urge will pass - you're building new habits</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
