import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Users, Activity, TrendingUp, BarChart } from "lucide-react";

interface AnalyticsData {
  total_users: number;
  active_today: number;
  active_this_week: number;
  total_check_ins: number;
  total_activities_completed: number;
  avg_mood: number;
  updated_at: string;
}

export default function Analytics() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      // Update analytics first
      const { error: updateError } = await supabase.rpc('update_user_analytics');
      if (updateError) throw updateError;

      // Fetch analytics data
      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .single();

      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics?.total_users || 0,
      icon: Users,
      description: "All registered users",
      color: "text-blue-500",
    },
    {
      title: "Active Today",
      value: analytics?.active_today || 0,
      icon: Activity,
      description: "Users who checked in today",
      color: "text-green-500",
    },
    {
      title: "Active This Week",
      value: analytics?.active_this_week || 0,
      icon: TrendingUp,
      description: "Users active in the last 7 days",
      color: "text-purple-500",
    },
    {
      title: "Total Check-ins",
      value: analytics?.total_check_ins || 0,
      icon: BarChart,
      description: "All-time check-ins",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your app's growth and user engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Engagement Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Average Mood Score</span>
              <span className="text-2xl font-bold">
                {analytics?.avg_mood ? analytics.avg_mood.toFixed(1) : 'N/A'} / 10
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <span className="font-medium">Activities Completed</span>
              <span className="text-2xl font-bold">{analytics?.total_activities_completed || 0}</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {analytics?.updated_at ? new Date(analytics.updated_at).toLocaleString() : 'Never'}
          </p>
          <Button onClick={fetchAnalytics} variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}
