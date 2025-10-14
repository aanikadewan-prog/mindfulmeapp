import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActivityCompletion from "@/components/ActivityCompletion";

const affirmations = [
  {
    main: "I'm doing my best",
    description: "And my best is enough, even when it doesn't feel like it"
  },
  {
    main: "It's okay to struggle",
    description: "Struggling doesn't mean failing. It means I'm trying"
  },
  {
    main: "I deserve kindness",
    description: "Especially from myself. I am worthy of my own compassion"
  },
  {
    main: "I am not my thoughts",
    description: "My thoughts are just thoughts. They don't define me"
  },
  {
    main: "This feeling will pass",
    description: "Nothing lasts forever. Better moments are coming"
  },
  {
    main: "I am enough",
    description: "Right now, exactly as I am, I am enough"
  },
  {
    main: "I'm allowed to rest",
    description: "Rest is not weakness. It's how I recharge"
  },
  {
    main: "I can ask for help",
    description: "Asking for support is brave, not weak"
  }
];

export default function SelfCompassion() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [breathCount, setBreathCount] = useState(0);

  const currentAffirmation = affirmations[currentIndex];

  const nextAffirmation = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
    setBreathCount(0);
  };

  const incrementBreath = () => {
    setBreathCount((prev) => prev + 1);
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
        <CardHeader className="text-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            Self-Compassion
          </CardTitle>
          <p className="text-muted-foreground">Be kind to yourself - you deserve it</p>
        </CardHeader>
        <CardContent className="space-y-8 pb-8 pt-8">
          {/* Breathing Hearts Animation */}
          <div className="relative flex items-center justify-center h-64">
            {/* Outer hearts */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                  opacity: 0.2
                }}
              >
                <Heart
                  className="h-12 w-12 text-primary fill-primary"
                  style={{
                    transform: `rotate(${i * 60}deg) translateY(-${80 + i * 10}px)`
                  }}
                />
              </div>
            ))}
            
            {/* Center heart */}
            <div className="relative z-10 animate-pulse">
              <Heart className="h-32 w-32 text-primary fill-primary drop-shadow-2xl" />
            </div>
          </div>

          {/* Affirmation Card */}
          <Card className="bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-primary/30 shadow-xl">
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                  "{currentAffirmation.main}"
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {currentAffirmation.description}
                </p>
              </div>

              {/* Breath Counter */}
              <div className="flex items-center justify-center gap-4 py-4">
                <Button
                  size="lg"
                  onClick={incrementBreath}
                  className="gap-2 shadow-lg"
                >
                  <Heart className="h-5 w-5" />
                  Take a Breath
                </Button>
                {breathCount > 0 && (
                  <div className="animate-scale-in">
                    <span className="text-2xl font-bold text-primary">{breathCount}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {breathCount === 1 ? "breath" : "breaths"}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-primary/20">
                <Button
                  variant="outline"
                  onClick={nextAffirmation}
                  className="gap-2"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5" />
                  Next Affirmation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-4 text-center">💜 How to Practice</h4>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">1.</span>
                  <span>Place your hand on your heart</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">2.</span>
                  <span>Read the affirmation out loud or in your mind</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">3.</span>
                  <span>Click "Take a Breath" and breathe deeply</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">4.</span>
                  <span>Repeat the affirmation as many times as you need</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary min-w-6">5.</span>
                  <span>Move to the next when you're ready</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Reminder */}
          <Card className="bg-gradient-to-br from-accent/20 to-secondary/20 border-accent/30">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground leading-relaxed">
                You would comfort a friend going through this - <br />
                <span className="font-semibold text-foreground">comfort yourself too.</span>
              </p>
            </CardContent>
          </Card>

          {/* Activity Completion */}
          <ActivityCompletion activityName="Self-Compassion" />
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-20px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
