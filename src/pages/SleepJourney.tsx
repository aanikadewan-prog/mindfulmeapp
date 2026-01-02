import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Moon, Sun, Clock, TrendingUp, Zap, Coffee, Wine, Phone, Activity, Bed, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ActivityCompletion from "@/components/ActivityCompletion";
import { format, differenceInMinutes, subDays, startOfWeek, endOfWeek } from "date-fns";

const SLEEP_FACTORS = [
  { id: "caffeine", label: "Caffeine", icon: Coffee, tip: "Avoid 6+ hours before bed" },
  { id: "alcohol", label: "Alcohol", icon: Wine, tip: "Can disrupt sleep quality" },
  { id: "screen", label: "Screen Time", icon: Phone, tip: "Blue light affects melatonin" },
  { id: "exercise", label: "Exercise", icon: Activity, tip: "Best 4+ hours before bed" },
  { id: "stress", label: "Stress", icon: AlertCircle, tip: "Try relaxation techniques" },
  { id: "nap", label: "Napped", icon: Bed, tip: "Keep naps under 30 min" },
];

interface SleepLog {
  id: string;
  bedtime: string;
  wake_time: string;
  sleep_quality: number;
  time_to_fall_asleep: number | null;
  awakenings: number;
  notes: string | null;
  factors: string[];
  created_at: string;
}

interface SleepStats {
  avgQuality: number;
  avgDuration: number;
  avgBedtime: string;
  avgWakeTime: string;
  totalLogs: number;
}

export default function SleepJourney() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [bedtime, setBedtime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [sleepQuality, setSleepQuality] = useState([3]);
  const [timeToFallAsleep, setTimeToFallAsleep] = useState([15]);
  const [awakenings, setAwakenings] = useState([0]);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  
  const [sleepLogs, setSleepLogs] = useState<SleepLog[]>([]);
  const [stats, setStats] = useState<SleepStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [activeTab, setActiveTab] = useState("log");

  useEffect(() => {
    loadData();
    setDefaultTimes();
  }, []);

  const setDefaultTimes = () => {
    const now = new Date();
    const lastNight = new Date(now);
    lastNight.setDate(lastNight.getDate() - 1);
    lastNight.setHours(22, 30, 0, 0);
    
    const thisMorning = new Date(now);
    thisMorning.setHours(7, 0, 0, 0);
    
    setBedtime(format(lastNight, "yyyy-MM-dd'T'HH:mm"));
    setWakeTime(format(thisMorning, "yyyy-MM-dd'T'HH:mm"));
  };

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const weekAgo = subDays(new Date(), 7);
    
    const { data } = await supabase
      .from("sleep_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("created_at", weekAgo.toISOString())
      .order("bedtime", { ascending: false });

    if (data && data.length > 0) {
      setSleepLogs(data);
      calculateStats(data);
    }
  };

  const calculateStats = (logs: SleepLog[]) => {
    if (logs.length === 0) return;

    const avgQuality = logs.reduce((sum, log) => sum + log.sleep_quality, 0) / logs.length;
    
    const durations = logs.map(log => {
      const bed = new Date(log.bedtime);
      const wake = new Date(log.wake_time);
      return differenceInMinutes(wake, bed) / 60;
    });
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

    const bedtimes = logs.map(log => {
      const d = new Date(log.bedtime);
      return d.getHours() * 60 + d.getMinutes();
    });
    const avgBedMinutes = bedtimes.reduce((a, b) => a + b, 0) / bedtimes.length;
    const avgBedHours = Math.floor(avgBedMinutes / 60);
    const avgBedMins = Math.round(avgBedMinutes % 60);

    const wakeTimes = logs.map(log => {
      const d = new Date(log.wake_time);
      return d.getHours() * 60 + d.getMinutes();
    });
    const avgWakeMinutes = wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length;
    const avgWakeHours = Math.floor(avgWakeMinutes / 60);
    const avgWakeMins = Math.round(avgWakeMinutes % 60);

    setStats({
      avgQuality: Math.round(avgQuality * 10) / 10,
      avgDuration: Math.round(avgDuration * 10) / 10,
      avgBedtime: `${avgBedHours.toString().padStart(2, '0')}:${avgBedMins.toString().padStart(2, '0')}`,
      avgWakeTime: `${avgWakeHours.toString().padStart(2, '0')}:${avgWakeMins.toString().padStart(2, '0')}`,
      totalLogs: logs.length,
    });
  };

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(f => f !== factorId)
        : [...prev, factorId]
    );
  };

  const saveSleepLog = async () => {
    if (!bedtime || !wakeTime) {
      toast({
        title: "Please enter bedtime and wake time",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("sleep_logs").insert({
        user_id: user.id,
        bedtime: new Date(bedtime).toISOString(),
        wake_time: new Date(wakeTime).toISOString(),
        sleep_quality: sleepQuality[0],
        time_to_fall_asleep: timeToFallAsleep[0],
        awakenings: awakenings[0],
        factors: selectedFactors,
        notes: notes || null,
      });

      if (error) throw error;

      toast({
        title: "Sleep logged! 🌙",
        description: "Keep tracking to see your patterns",
      });

      setShowCompletion(true);
      setSelectedFactors([]);
      setNotes("");
      loadData();
    } catch (error) {
      console.error("Error saving sleep log:", error);
      toast({
        title: "Error",
        description: "Failed to save sleep log",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSleepDuration = () => {
    if (!bedtime || !wakeTime) return null;
    const bed = new Date(bedtime);
    const wake = new Date(wakeTime);
    const mins = differenceInMinutes(wake, bed);
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return { hours, minutes, total: mins };
  };

  const getQualityLabel = (quality: number) => {
    const labels = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];
    return labels[quality] || "";
  };

  const getQualityColor = (quality: number) => {
    if (quality <= 2) return "text-red-500";
    if (quality <= 3) return "text-amber-500";
    return "text-green-500";
  };

  const getSleepRecommendation = () => {
    const duration = getSleepDuration();
    if (!duration) return null;
    
    const recommendations: string[] = [];
    
    if (duration.total < 420) { // Less than 7 hours
      recommendations.push("Try to get 7-9 hours of sleep for optimal health");
    }
    if (timeToFallAsleep[0] > 30) {
      recommendations.push("Consider a wind-down routine 30 mins before bed");
    }
    if (selectedFactors.includes("caffeine")) {
      recommendations.push("Avoid caffeine 6+ hours before bedtime");
    }
    if (selectedFactors.includes("screen")) {
      recommendations.push("Put screens away 1 hour before sleep");
    }
    if (awakenings[0] > 2) {
      recommendations.push("Multiple awakenings may indicate sleep environment issues");
    }

    return recommendations;
  };

  const duration = getSleepDuration();
  const recommendations = getSleepRecommendation();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/activities")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Activities
      </Button>

      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
          <Moon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Sleep Journey</h1>
        <p className="text-muted-foreground">
          Track your sleep patterns and improve your rest
        </p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border-indigo-200/50">
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.avgDuration}h
              </div>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200/50">
            <CardContent className="pt-4 text-center">
              <div className={`text-2xl font-bold ${getQualityColor(Math.round(stats.avgQuality))}`}>
                {stats.avgQuality}/5
              </div>
              <p className="text-xs text-muted-foreground">Avg Quality</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Moon className="h-4 w-4" /> {stats.avgBedtime}
              </div>
              <p className="text-xs text-muted-foreground">Avg Bedtime</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-2xl font-bold flex items-center justify-center gap-1">
                <Sun className="h-4 w-4" /> {stats.avgWakeTime}
              </div>
              <p className="text-xs text-muted-foreground">Avg Wake Time</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="log">Log Sleep</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="tips">Sleep Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Last Night's Sleep</CardTitle>
              <CardDescription>Track your sleep to discover patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Moon className="h-4 w-4" /> Bedtime
                  </label>
                  <input
                    type="datetime-local"
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Sun className="h-4 w-4" /> Wake Time
                  </label>
                  <input
                    type="datetime-local"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background"
                  />
                </div>
              </div>

              {duration && (
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    {duration.hours}h {duration.minutes}m
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">total sleep</span>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Sleep Quality: {getQualityLabel(sleepQuality[0])}
                </label>
                <Slider
                  value={sleepQuality}
                  onValueChange={setSleepQuality}
                  min={1}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Very Poor</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Time to fall asleep: ~{timeToFallAsleep[0]} minutes
                </label>
                <Slider
                  value={timeToFallAsleep}
                  onValueChange={setTimeToFallAsleep}
                  min={0}
                  max={120}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Night awakenings: {awakenings[0]}
                </label>
                <Slider
                  value={awakenings}
                  onValueChange={setAwakenings}
                  min={0}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Factors that may have affected your sleep
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SLEEP_FACTORS.map((factor) => (
                    <div
                      key={factor.id}
                      onClick={() => toggleFactor(factor.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                        selectedFactors.includes(factor.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <factor.icon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">{factor.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <Textarea
                  placeholder="Any other observations about your sleep..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {recommendations && recommendations.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Quick Tips
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={saveSleepLog} disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Sleep Log"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Sleep Patterns
              </CardTitle>
              <CardDescription>Last 7 days of sleep data</CardDescription>
            </CardHeader>
            <CardContent>
              {sleepLogs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Start logging your sleep to see insights here!
                </p>
              ) : (
                <div className="space-y-4">
                  {sleepLogs.map((log) => {
                    const bed = new Date(log.bedtime);
                    const wake = new Date(log.wake_time);
                    const durationMins = differenceInMinutes(wake, bed);
                    const hours = Math.floor(durationMins / 60);
                    const mins = durationMins % 60;

                    return (
                      <div key={log.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {format(new Date(log.bedtime), "EEE, MMM d")}
                          </span>
                          <Badge variant="outline" className={getQualityColor(log.sleep_quality)}>
                            {getQualityLabel(log.sleep_quality)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>
                            <Moon className="h-3 w-3 inline mr-1" />
                            {format(bed, "h:mm a")}
                          </div>
                          <div>
                            <Sun className="h-3 w-3 inline mr-1" />
                            {format(wake, "h:mm a")}
                          </div>
                          <div>
                            <Clock className="h-3 w-3 inline mr-1" />
                            {hours}h {mins}m
                          </div>
                        </div>
                        {log.factors && log.factors.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {log.factors.map((f) => (
                              <Badge key={f} variant="secondary" className="text-xs capitalize">
                                {f}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🌙 Wind-Down Routine</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Start dimming lights 1-2 hours before bed</p>
                <p>• Take a warm bath or shower</p>
                <p>• Read a physical book (not screens)</p>
                <p>• Practice gentle stretching or yoga</p>
                <p>• Use the Evening Wind Down activity</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => navigate("/evening-wind-down")}
                >
                  Try Evening Wind Down
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🛏️ Sleep Environment</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Keep room cool (65-68°F / 18-20°C)</p>
                <p>• Make it as dark as possible</p>
                <p>• Use white noise if needed</p>
                <p>• Reserve bed for sleep only</p>
                <p>• Keep phones outside bedroom</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => navigate("/sounds")}
                >
                  Try Soothing Sounds
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">☀️ Daytime Habits</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Get morning sunlight exposure</p>
                <p>• Exercise regularly (not too late)</p>
                <p>• Limit caffeine after 2pm</p>
                <p>• Avoid long or late naps</p>
                <p>• Keep consistent wake times</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">😴 If You Can't Sleep</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Don't watch the clock</p>
                <p>• If awake 20+ min, get up</p>
                <p>• Do something boring in dim light</p>
                <p>• Try progressive muscle relaxation</p>
                <p>• Practice 4-7-8 breathing</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => navigate("/breathing")}
                >
                  Try Breathing Exercise
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {showCompletion && (
        <ActivityCompletion activityName="Sleep Tracking" />
      )}
    </div>
  );
}