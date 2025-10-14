import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Star, Sparkles, Award } from "lucide-react";

interface Reward {
  id: string;
  reward_type: string;
  reward_name: string;
  description: string;
  earned_at: string;
}

const allRewards = [
  { type: 'streak_3', name: '3-Day Warrior', description: 'Check in for 3 days straight', icon: Star },
  { type: 'streak_7', name: 'Week Champion', description: 'Check in for 7 days straight', icon: Award },
  { type: 'streak_30', name: 'Monthly Master', description: 'Check in for 30 days straight', icon: Trophy },
  { type: 'first_vent', name: 'Opening Up', description: 'Complete your first vent session', icon: Sparkles },
  { type: 'journal_5', name: 'Thoughtful Writer', description: 'Write 5 journal entries', icon: Sparkles },
];

export default function Rewards() {
  const [earnedRewards, setEarnedRewards] = useState<Reward[]>([]);

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    const { data, error } = await supabase
      .from('user_rewards')
      .select('*')
      .order('earned_at', { ascending: false });
    
    if (!error && data) {
      setEarnedRewards(data);
    }
  };

  const hasEarned = (type: string) => earnedRewards.some(r => r.reward_type === type);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Your Rewards</CardTitle>
              <CardDescription>
                Celebrate your wellness journey milestones
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {allRewards.map((reward) => {
          const earned = earnedRewards.find(r => r.reward_type === reward.type);
          const Icon = reward.icon;
          
          return (
            <Card
              key={reward.type}
              className={`transition-all ${
                earned
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-secondary/10'
                  : 'opacity-50 grayscale'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-8 w-8 ${earned ? 'text-primary' : 'text-muted-foreground'}`} />
                    <div>
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {reward.description}
                      </CardDescription>
                    </div>
                  </div>
                  {earned && (
                    <Badge variant="secondary">
                      Earned
                    </Badge>
                  )}
                </div>
              </CardHeader>
              {earned && (
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Earned on {new Date(earned.earned_at).toLocaleDateString()}
                  </p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Sparkles className="h-12 w-12 text-primary mx-auto" />
            <h3 className="font-semibold text-lg">Keep Going!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Every check-in, every journal entry, every moment of self-care counts.
              You're building a healthier relationship with yourself. 💜
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
