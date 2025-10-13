import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CleanCounter() {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("cleanCounterStart");
    if (saved) {
      setStartDate(saved);
      setIsTracking(true);
    }
  }, []);

  const startCounter = () => {
    const now = new Date().toISOString();
    localStorage.setItem("cleanCounterStart", now);
    setStartDate(now);
    setIsTracking(true);
    toast({
      title: "Counter started! 💜",
      description: "You're taking an important step",
    });
  };

  const resetCounter = () => {
    if (confirm("Reset your counter? This will start from day 1 again.")) {
      const now = new Date().toISOString();
      localStorage.setItem("cleanCounterStart", now);
      setStartDate(now);
      toast({
        title: "Counter reset",
        description: "Every day is a fresh start. You've got this.",
      });
    }
  };

  const getDaysSince = () => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getHoursSince = () => {
    if (!startDate) return 0;
    const start = new Date(startDate);
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60));
  };

  const days = getDaysSince();
  const hours = getHoursSince();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <Card className="border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2">
            <Heart className="h-12 w-12 text-primary mx-auto" />
          </div>
          <CardTitle>Your Clean Counter</CardTitle>
          <CardDescription>
            Track your progress. Every moment matters.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isTracking ? (
            <>
              <div className="text-center space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="text-5xl font-bold text-primary mb-2">{days}</div>
                    <p className="text-sm text-muted-foreground">
                      {days === 1 ? "day" : "days"}
                    </p>
                  </div>
                  <div className="p-6 bg-accent/5 rounded-xl border border-accent/20">
                    <div className="text-5xl font-bold text-accent mb-2">{hours}</div>
                    <p className="text-sm text-muted-foreground">
                      {hours === 1 ? "hour" : "hours"}
                    </p>
                  </div>
                </div>

                {days >= 1 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {days >= 1 && <Badge variant="secondary">1 Day 🌱</Badge>}
                    {days >= 7 && <Badge variant="secondary">1 Week ⭐</Badge>}
                    {days >= 14 && <Badge variant="secondary">2 Weeks 💪</Badge>}
                    {days >= 30 && <Badge variant="secondary">1 Month 🎉</Badge>}
                    {days >= 90 && <Badge variant="secondary">3 Months 🏆</Badge>}
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start gap-3 p-4 bg-card rounded-lg">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Started on</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(startDate!).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Keep going</p>
                    <p className="text-sm text-muted-foreground">
                      You're stronger than you know. One day at a time.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={resetCounter}
                  className="w-full"
                >
                  Reset Counter
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                This is a private space to track your recovery journey.
              </p>
              <p className="text-sm text-muted-foreground">
                Your data stays on your device. No one else can see it.
              </p>
              <Button onClick={startCounter} className="w-full">
                Start Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            💜 You're not alone. Setbacks happen. What matters is that you keep trying.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
