import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, TrendingUp, Award, Sparkles, Trophy } from "lucide-react";
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
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card className="border-primary/30 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 -z-10" />
        <CardHeader className="text-center relative">
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
            <Heart className="h-16 w-16 text-primary mx-auto relative animate-pulse" fill="currentColor" />
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Your Clean Counter
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Track your progress. Every moment matters. 💜
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isTracking ? (
            <>
              <div className="text-center space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative p-8 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border-2 border-primary/30 shadow-lg hover:scale-105 transition-transform">
                    <div className="absolute top-3 right-3">
                      <Award className="h-5 w-5 text-primary/50" />
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-3">
                      {days}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {days === 1 ? "Day Clean" : "Days Clean"}
                    </p>
                  </div>
                  <div className="relative p-8 bg-gradient-to-br from-secondary/20 to-accent/10 rounded-2xl border-2 border-secondary/30 shadow-lg hover:scale-105 transition-transform">
                    <div className="absolute top-3 right-3">
                      <Sparkles className="h-5 w-5 text-secondary/50" />
                    </div>
                    <div className="text-6xl font-bold bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent mb-3">
                      {hours}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {hours === 1 ? "Hour Strong" : "Hours Strong"}
                    </p>
                  </div>
                </div>

                {days >= 1 && (
                  <Card className="bg-gradient-to-br from-accent/10 to-secondary/10 border-accent/30">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-center mb-4 flex items-center justify-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        Milestones Achieved
                      </h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {days >= 1 && <Badge className="text-base py-1 px-3">1 Day 🌱</Badge>}
                        {days >= 3 && <Badge className="text-base py-1 px-3">3 Days 🌟</Badge>}
                        {days >= 7 && <Badge className="text-base py-1 px-3">1 Week ⭐</Badge>}
                        {days >= 14 && <Badge className="text-base py-1 px-3">2 Weeks 💪</Badge>}
                        {days >= 30 && <Badge className="text-base py-1 px-3">1 Month 🎉</Badge>}
                        {days >= 60 && <Badge className="text-base py-1 px-3">2 Months 🔥</Badge>}
                        {days >= 90 && <Badge className="text-base py-1 px-3">3 Months 🏆</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-4 pt-4">
                <Card className="bg-gradient-to-br from-card to-muted/30 border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">Journey Started</p>
                        <p className="text-muted-foreground">
                          {new Date(startDate!).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-2 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-2">Keep Going Strong</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          You're stronger than you know. Every single day is a victory. 
                          One day at a time, one hour at a time. You've got this. 💜
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  variant="outline"
                  onClick={resetCounter}
                  className="w-full"
                  size="lg"
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
