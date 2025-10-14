import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Sparkles, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const rewardSuggestions = [
  {
    emoji: "🍫",
    title: "Your Favorite Treat",
    description: "Get yourself that snack or drink you love",
    days: 3,
  },
  {
    emoji: "🎮",
    title: "Me Time Activity",
    description: "Watch your favorite show or play a game guilt-free",
    days: 7,
  },
  {
    emoji: "🛍️",
    title: "Small Purchase",
    description: "That item you've been eyeing - go for it!",
    days: 14,
  },
  {
    emoji: "🧖",
    title: "Self-Care Day",
    description: "Dedicate a whole day to activities that make you happy",
    days: 21,
  },
  {
    emoji: "🎉",
    title: "Social Reward",
    description: "Hang out with friends or treat someone special",
    days: 30,
  },
  {
    emoji: "🏆",
    title: "Big Achievement",
    description: "Something you've really wanted - you earned it!",
    days: 60,
  },
];

const personalizedIdeas = [
  "Extra screen time with your favorite content",
  "A new book, game, or hobby supply",
  "Permission to sleep in or take a mental health day",
  "Quality time with someone you care about",
  "A small adventure or day trip",
];

export default function Rewards() {
  const { toast } = useToast();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateStreak = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Get all activity completions ordered by date
        const { data: completions, error } = await supabase
          .from('activity_completions')
          .select('completed_at')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) throw error;

        if (!completions || completions.length === 0) {
          setCurrentStreak(0);
          setIsLoading(false);
          return;
        }

        // Calculate consecutive days
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const uniqueDates = new Set(
          completions.map(c => new Date(c.completed_at).toDateString())
        );
        
        let currentDate = new Date(today);
        
        // Check if there's activity today or yesterday (to not break streak)
        const hasActivityToday = uniqueDates.has(currentDate.toDateString());
        currentDate.setDate(currentDate.getDate() - 1);
        const hasActivityYesterday = uniqueDates.has(currentDate.toDateString());
        
        if (!hasActivityToday && !hasActivityYesterday) {
          setCurrentStreak(0);
          setIsLoading(false);
          return;
        }
        
        // Start counting from today or yesterday
        currentDate = new Date(today);
        if (!hasActivityToday) {
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        // Count consecutive days backwards
        while (uniqueDates.has(currentDate.toDateString())) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }
        
        setCurrentStreak(streak);
      } catch (error) {
        console.error('Error calculating streak:', error);
        toast({
          title: "Error",
          description: "Failed to calculate your streak",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    calculateStreak();
  }, [toast]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Gift className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Rewards</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Celebrate your progress with meaningful rewards
        </p>
        {!isLoading && (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">Current Streak: {currentStreak} days</span>
          </div>
        )}
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">You Deserve to Celebrate!</h2>
              <p className="text-muted-foreground">
                Taking care of your mental health is hard work. These milestone rewards are here to 
                remind you to celebrate your progress. Choose rewards that feel meaningful to you!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Suggestions Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {rewardSuggestions.map((reward, index) => {
          const isLocked = currentStreak < reward.days;
          return (
            <Card 
              key={index}
              className={`hover:shadow-lg transition-all hover:border-primary/30 relative ${
                isLocked ? 'opacity-60' : ''
              }`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-4xl">🔒</div>
                    <p className="text-sm font-medium text-muted-foreground px-4">
                      Unlock at {reward.days} days
                    </p>
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{reward.emoji}</div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    {reward.days} days
                  </Badge>
                </div>
                <CardTitle className="text-xl">{reward.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {reward.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Create Your Own Section */}
      <Card className="bg-gradient-to-br from-accent/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Create Your Own Rewards</h2>
          </div>
          <p className="text-muted-foreground">
            These are just suggestions! Think about what makes YOU happy and motivated. Write down 
            your own rewards and associate them with streaks that feel meaningful. The important thing is 
            to acknowledge your progress and be kind to yourself.
          </p>
          
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-lg">Ideas for personalized rewards:</h3>
            <ul className="space-y-2">
              {personalizedIdeas.map((idea, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}