import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Users, Activity, TrendingUp, BarChart, Calendar, BarChart3 } from "lucide-react";

interface AnalyticsData {
  total_users: number;
  active_today: number;
  active_this_week: number;
  total_check_ins: number;
  total_activities_completed: number;
  avg_mood: number;
  updated_at: string;
}

interface DailyUser {
  date: string;
  count: number;
}

interface ActivityUsage {
  activity_name: string;
  completion_count: number;
}

export default function Analytics() {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dailyUsers, setDailyUsers] = useState<DailyUser[]>([]);
  const [activityUsage, setActivityUsage] = useState<ActivityUsage[]>([]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError && roleError.code !== 'PGRST116') {
        throw roleError;
      }

      setIsAdmin(!!roleData);
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

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

  const fetchDailyUsers = async () => {
    try {
      // Get unique users per day from activity completions for the last 30 days
      const { data, error } = await supabase
        .from('activity_completions')
        .select('completed_at, user_id')
        .gte('completed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Group by date and count unique users
      const dailyMap = new Map<string, Set<string>>();
      data?.forEach(item => {
        const date = new Date(item.completed_at).toLocaleDateString();
        if (!dailyMap.has(date)) {
          dailyMap.set(date, new Set());
        }
        dailyMap.get(date)!.add(item.user_id);
      });

      const dailyData: DailyUser[] = Array.from(dailyMap.entries())
        .map(([date, users]) => ({
          date,
          count: users.size
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setDailyUsers(dailyData);
    } catch (error) {
      console.error('Error fetching daily users:', error);
    }
  };

  const fetchActivityUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_completions')
        .select('activity_name');

      if (error) throw error;

      // Count completions per activity
      const usageMap = new Map<string, number>();
      data?.forEach(item => {
        const count = usageMap.get(item.activity_name) || 0;
        usageMap.set(item.activity_name, count + 1);
      });

      const usageData: ActivityUsage[] = Array.from(usageMap.entries())
        .map(([activity_name, completion_count]) => ({
          activity_name,
          completion_count
        }))
        .sort((a, b) => b.completion_count - a.completion_count);

      setActivityUsage(usageData);
    } catch (error) {
      console.error('Error fetching activity usage:', error);
    }
  };

  useEffect(() => {
    checkAdminAccess().then(() => {
      fetchAnalytics();
      fetchDailyUsers();
      fetchActivityUsage();
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold">Access Restricted</h2>
          <p className="text-muted-foreground">
            This analytics dashboard is only available to administrators.
          </p>
        </div>
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

        {/* Daily Active Users */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Active Users (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyUsers.length > 0 ? (
              <div className="space-y-2">
                {dailyUsers.slice(-7).map((day) => (
                  <div key={day.date} className="flex items-center justify-between p-3 rounded bg-muted/50">
                    <span className="text-sm font-medium">{day.date}</span>
                    <span className="text-sm font-bold text-primary">{day.count} users</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No activity data available</p>
            )}
          </CardContent>
        </Card>

        {/* Most Used Activities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Most Popular Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityUsage.length > 0 ? (
              <div className="space-y-3">
                {activityUsage.map((activity, index) => (
                  <div key={activity.activity_name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {index + 1}. {activity.activity_name}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {activity.completion_count} completions
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ 
                          width: `${(activity.completion_count / activityUsage[0].completion_count) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No activity data available</p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Last updated: {analytics?.updated_at ? new Date(analytics.updated_at).toLocaleString() : 'Never'}
          </p>
          <Button onClick={() => { fetchAnalytics(); fetchDailyUsers(); fetchActivityUsage(); }} variant="outline">
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}