import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Calendar, Flame, Heart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

const moodLabels: Record<number, string> = {
  5: "Great",
  4: "Good", 
  3: "Okay",
  2: "Low",
  1: "Struggling"
};

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

  const getMoodChartData = () => {
    const last7Days = checkIns.slice(0, 7).reverse();
    return last7Days.map((checkIn) => {
      const date = new Date(checkIn.date);
      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        mood: checkIn.mood,
        fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      };
    });
  };

  const getMoodInsights = () => {
    if (checkIns.length < 3) return null;
    
    const recentMoods = checkIns.slice(0, 7);
    const avgMood = recentMoods.reduce((acc, c) => acc + c.mood, 0) / recentMoods.length;
    const allTimeAvg = checkIns.reduce((acc, c) => acc + c.mood, 0) / checkIns.length;
    
    const trend = avgMood > allTimeAvg ? "improving" : avgMood < allTimeAvg ? "declining" : "stable";
    
    // Check wellness habits correlation
    const goodMoodDays = recentMoods.filter(c => c.mood >= 4);
    const sleepCorrelation = goodMoodDays.filter(c => c.answers.sleep).length / Math.max(goodMoodDays.length, 1);
    const movementCorrelation = goodMoodDays.filter(c => c.answers.movement).length / Math.max(goodMoodDays.length, 1);
    
    let insight = "";
    if (trend === "improving") {
      insight = "Your mood has been trending upward recently! Keep up the great work. ";
    } else if (trend === "declining") {
      insight = "Your mood has dipped lately. Remember to be gentle with yourself. ";
    } else {
      insight = "Your mood has been steady. ";
    }
    
    if (sleepCorrelation > 0.7) {
      insight += "Good sleep seems to positively affect your mood. ";
    }
    if (movementCorrelation > 0.7) {
      insight += "Movement appears to boost your mood. ";
    }
    
    if (insight === "Your mood has been steady. ") {
      insight = "Start tracking your moods and activities to discover patterns that help you feel balanced.";
    }
    
    return insight;
  };

  const chartData = getMoodChartData();
  const insights = getMoodInsights();

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold bg-gradient-to-br from-secondary to-accent bg-clip-text text-transparent">{streak}</div>
            <p className="text-xs text-muted-foreground mt-1">days in a row 🔥</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Check-Ins</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">{checkIns.length}</div>
            <p className="text-xs text-muted-foreground mt-1">wellness check-ins</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-accent">{getAverageMood()}</div>
            <p className="text-xs text-muted-foreground mt-1">out of 5 ⭐</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/15 via-secondary/15 to-accent/15 border-primary/30 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{achievements.length}</div>
            <p className="text-xs text-muted-foreground mt-1">milestones unlocked 🏆</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card className="border-primary/30 shadow-lg">
          <CardHeader className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Mood Patterns</CardTitle>
            </div>
            <CardDescription className="text-base">
              See how your habits affect your mood over time. This helps you understand what works for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  formatter={(value: number) => [moodLabels[value], "Mood"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {insights && (
              <div className="mt-6 p-5 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-xl border-2 border-accent/30">
                <div className="flex items-start gap-3">
                  <Heart className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-base mb-2">Pattern Insight</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insights}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-primary/30 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardTitle className="text-xl">Milestones & Achievements</CardTitle>
          <CardDescription>Celebrating your journey - every step counts!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {milestones.map((milestone) => {
            const isUnlocked = achievements.some((a) => a.days === milestone.days);
            return (
              <div
                key={milestone.days}
                className={`p-5 rounded-xl border-2 transition-all hover:scale-[1.02] ${
                  isUnlocked
                    ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/40 shadow-md"
                    : "bg-muted/30 border-border opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{milestone.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground">{milestone.message}</p>
                  </div>
                  {isUnlocked ? (
                    <Badge className="text-sm py-1 px-3">Unlocked! ✨</Badge>
                  ) : (
                    <Badge variant="outline" className="text-sm">{milestone.days} days</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {checkIns.length > 0 && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="text-xl">Recent Check-Ins</CardTitle>
            <CardDescription>Your mood over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {getRecentCheckIns().map((checkIn, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/50 to-accent/5 hover:scale-105 transition-transform border border-accent/20"
                >
                  <span className="text-3xl">{getMoodEmoji(checkIn.mood)}</span>
                  <span className="text-xs text-muted-foreground font-medium">
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
