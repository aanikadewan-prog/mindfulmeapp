import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Sparkles, Heart } from "lucide-react";
import confetti from "canvas-confetti";

interface ActivityCompletionProps {
  activityName: string;
  onComplete?: () => void;
}

export default function ActivityCompletion({ activityName, onComplete }: ActivityCompletionProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onComplete) {
      onComplete();
    }
  };

  if (isCompleted) {
    return (
      <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 animate-fade-in">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center gap-2">
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            <CheckCircle className="h-12 w-12 text-primary" />
            <Sparkles className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <h3 className="text-3xl font-bold">Amazing Job! 🎉</h3>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            You completed {activityName}! You showed up for yourself today, and that takes real courage.
          </p>
          <div className="flex items-center justify-center gap-2 text-primary">
            <Heart className="h-5 w-5 fill-current" />
            <span className="font-medium">Keep going, you're doing great!</span>
            <Heart className="h-5 w-5 fill-current" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleComplete}
        size="lg"
        className="gap-2 px-8"
      >
        <CheckCircle className="h-5 w-5" />
        Mark as Complete
      </Button>
    </div>
  );
}
