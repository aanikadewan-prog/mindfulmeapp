import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar, Flame } from "lucide-react";

interface CheckIn {
  date: string;
  mood: number;
  answers: Record<string, boolean>;
}

const milestones = [
  { days: 3, emoji: "🌱", title: "Great Start!", message: "Three days of self-care!" },
  { days: 7, emoji: "⭐", title: "One Week!", message: "You're building a habit!" },
  { days: 14, emoji: "💪", title: "Two Weeks!", message: "Your consistency is inspiring!" },
  { days: 30, emoji: "🎉", title: "One Month!", message: "You're incredible!" },
  { days: 60, emoji: "🏆", title: "Two Months!", message: "You're a wellness champion!" },
];

export default function Progress() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<typeof milestones>([]);

  useEffect(() => {
    const saved = localStorage.getItem("checkIns");
    if (saved) {
      setCheckIns(JSON.parse(saved));
    }

    const savedStreak = localStorage.getItem("streak");
    const currentStreak = savedStreak ? parseInt(savedStreak) : 0;
    setStreak(currentStreak);

    const earned = milestones.filter((m) => currentStreak >= m.days);
    setAchievements(earned);
  }, []);

  const getAverageMood = () => {
    if (checkIns.length === 0) return 0;
    const sum = checkIns.reduce((acc, c) => acc + c.mood, 0);
    return (sum / checkIns.length).toFixed(1);
  };

  const getRecentCheckIns = () => {
    return checkIns.slice(0, 7).reverse();
  };

  const getMoodEmoji = (mood: number) => {
    const emojis = ["😢", "😔", "😐", "🙂", "😊"];
    return emojis[mood - 1] || "😐";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{streak}</div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-Ins</CardTitle>
            <Calendar className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{checkIns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">wellness check-ins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{getAverageMood()}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 5</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{achievements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">milestones unlocked</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Milestones & Achievements</CardTitle>
          <CardDescription>Celebrating your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {milestones.map((milestone) => {
            const isUnlocked = achievements.some((a) => a.days === milestone.days);
            return (
              <div
                key={milestone.days}
                className={`p-4 rounded-lg border transition-all ${
                  isUnlocked
                    ? "bg-primary/5 border-primary/30"
                    : "bg-muted/30 border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{milestone.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.message}</p>
                  </div>
                  {isUnlocked ? (
                    <Badge variant="secondary">Unlocked! ✨</Badge>
                  ) : (
                    <Badge variant="outline">{milestone.days} days</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {checkIns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-Ins</CardTitle>
            <CardDescription>Your mood over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {getRecentCheckIns().map((checkIn, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl">{getMoodEmoji(checkIn.mood)}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(checkIn.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
