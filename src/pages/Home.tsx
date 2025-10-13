import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Heart, BookOpen, TrendingUp, Sparkles, Calendar } from "lucide-react";

const quotes = [
  "You are stronger than you think. One day at a time. 💜",
  "Your feelings are valid. You're doing your best, and that's enough.",
  "Small steps are still progress. Be proud of yourself today.",
  "It's okay to not be okay. Tomorrow is a fresh start.",
  "You deserve kindness, especially from yourself.",
  "Every moment is a chance to begin again.",
  "Your journey is unique. There's no right way to heal.",
  "You're not alone. You're exactly where you need to be.",
  "Be gentle with yourself. You're doing the best you can.",
  "Your story isn't over yet. Keep going. 🌟"
];

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [quote, setQuote] = useState("");
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user profile
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        
        if (profile?.username) {
          setUsername(profile.username);
        }
      }
    };

    fetchProfile();

    // Get random quote
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Get streak
    const savedStreak = localStorage.getItem("streak");
    if (savedStreak) {
      setStreak(parseInt(savedStreak));
    }
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <CardHeader className="text-center pb-3">
          <div className="mx-auto mb-3">
            <Heart className="h-12 w-12 text-primary mx-auto animate-pulse" />
          </div>
          <CardTitle className="text-3xl mb-2">
            {getGreeting()}{username ? `, ${username}` : ""}
          </CardTitle>
          <CardDescription className="text-base italic">
            "{quote}"
          </CardDescription>
        </CardHeader>
        {streak > 0 && (
          <CardContent className="text-center pb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full">
              <span className="text-2xl">🔥</span>
              <span className="font-semibold">{streak} day{streak !== 1 ? "s" : ""} strong</span>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
          onClick={() => navigate("/check-in")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <CardTitle className="text-lg">Daily Check-In</CardTitle>
                <CardDescription>How are you feeling today?</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
          onClick={() => navigate("/journal")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-secondary group-hover:scale-110 transition-transform" />
              <div>
                <CardTitle className="text-lg">Journal</CardTitle>
                <CardDescription>Write your thoughts</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
          onClick={() => navigate("/activities")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
              <div>
                <CardTitle className="text-lg">Wellness Activities</CardTitle>
                <CardDescription>Find what helps you</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg group"
          onClick={() => navigate("/progress")}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
              <div>
                <CardTitle className="text-lg">Your Progress</CardTitle>
                <CardDescription>See how far you've come</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            💜 Remember: Progress isn't linear. Every day you show up for yourself matters.
          </p>
          <Button onClick={() => navigate("/check-in")} size="lg">
            Start Your Day
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
