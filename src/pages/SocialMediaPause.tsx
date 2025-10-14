import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Sparkles, Instagram, Facebook, Hash, Youtube, MessageCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SocialApp {
  id: string;
  name: string;
  icon: any;
  color: string;
  isPaused: boolean;
}

const defaultApps: SocialApp[] = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500", isPaused: false },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-400", isPaused: false },
  { id: "twitter", name: "X (Twitter)", icon: Hash, color: "from-gray-800 to-gray-600", isPaused: false },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-600 to-red-400", isPaused: false },
  { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "from-gray-800 to-cyan-400", isPaused: false },
  { id: "snapchat", name: "Snapchat", icon: MessageCircle, color: "from-yellow-400 to-yellow-300", isPaused: false }
];

export default function SocialMediaPause() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<SocialApp[]>(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`socialPause_${today}`);
    return saved ? JSON.parse(saved) : defaultApps;
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(`socialPause_${today}`, JSON.stringify(apps));
  }, [apps]);

  const toggleApp = (id: string) => {
    setApps(apps.map(app => {
      if (app.id === id) {
        const newPaused = !app.isPaused;
        if (newPaused) {
          toast.success(`${app.name} paused! You're taking care of yourself 💜`);
        } else {
          toast.info(`${app.name} resumed`);
        }
        return { ...app, isPaused: newPaused };
      }
      return app;
    }));
  };

  const pausedCount = apps.filter(app => app.isPaused).length;
  const progress = (pausedCount / apps.length) * 100;

  const resetDaily = () => {
    setApps(defaultApps);
    toast.info("Reset for a fresh start");
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Sparkles className="h-8 w-8" />
                Social Media Pause
              </CardTitle>
              <p className="text-muted-foreground mt-2">Gentle break from scrolling</p>
            </div>
            <Button variant="outline" size="sm" onClick={resetDaily}>
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pb-8">
          {/* Progress */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Apps Paused Today</span>
                  <Badge variant="secondary" className="text-lg px-3">
                    {pausedCount} / {apps.length}
                  </Badge>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {pausedCount > 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Great job creating space for yourself! 🌟
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* App Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card
                key={app.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  app.isPaused
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50 opacity-60"
                }`}
                onClick={() => toggleApp(app.id)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${app.color}`}>
                        <app.icon className="h-6 w-6 text-white" />
                      </div>
                      <Checkbox
                        checked={app.isPaused}
                        onCheckedChange={() => toggleApp(app.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {app.isPaused ? "On pause ✓" : "Click to pause"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Encouragement */}
          <Card className="bg-gradient-to-br from-accent/20 to-secondary/20 border-accent/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h4 className="font-semibold">This Isn't About Restriction</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    It's about awareness and choice. You're learning what works for you. 
                    You can always log back in - this is just an experiment to see how you feel 
                    with a bit more space from these apps.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💡 Making Your Pause Successful</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Log out (don't delete) - makes it harder to automatically open</li>
                <li>• Notice when you reach for the app - that's awareness!</li>
                <li>• Try a mindful activity instead when the urge hits</li>
                <li>• Check in at the end of the day - how do you feel?</li>
                <li>• Set time limits if complete pause feels too much</li>
                <li>• Remember: FOMO is real but temporary</li>
              </ul>
            </CardContent>
          </Card>

          {/* Alternative Option */}
          <Card className="border-primary/30">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3">Alternative: Set Time Limits</h4>
              <p className="text-sm text-muted-foreground mb-3">
                If pausing completely feels too hard, use your phone's built-in timer 
                to set 30-minute daily limits per app. When time's up, take a 5-minute 
                break to stretch or breathe before deciding if you want to continue.
              </p>
              <p className="text-xs text-muted-foreground italic">
                This isn't about restriction - it's about learning what works for you.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
