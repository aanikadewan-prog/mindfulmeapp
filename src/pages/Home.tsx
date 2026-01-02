import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Heart, BookOpen, TrendingUp, Sparkles, Calendar, Sun, Target } from "lucide-react";
import beachHero from "@/assets/beach-hero.jpg";

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
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);

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
      {/* Hero Section with Beach Background */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${beachHero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/80" />
        
        <div className="relative z-10 px-6 py-12 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
            <Sun className="h-8 w-8 text-primary-foreground drop-shadow-lg" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2 text-primary-foreground drop-shadow-md">
            {getGreeting()}{username ? `, ${username}` : ""}! 👋
          </h1>
          
          <p className="text-lg text-primary-foreground/90 italic max-w-md mx-auto drop-shadow-sm">
            "{quote}"
          </p>
          
          {streak > 0 && (
            <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-card/90 backdrop-blur-sm rounded-full shadow-md">
              <span className="text-2xl">🔥</span>
              <span className="font-semibold text-foreground">{streak} day{streak !== 1 ? "s" : ""} strong!</span>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Message */}
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="py-5 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Heart className="h-5 w-5 text-primary animate-pulse" />
            <span>Welcome to your peaceful space. Take a deep breath and begin when you're ready.</span>
            <Heart className="h-5 w-5 text-primary animate-pulse" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group bg-card/95"
          onClick={() => navigate("/check-in")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Daily Check-In</CardTitle>
                <CardDescription>How are you feeling?</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group bg-card/95"
          onClick={() => navigate("/journal")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">Journal</CardTitle>
                <CardDescription>Write your thoughts</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group bg-card/95"
          onClick={() => navigate("/activities")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Activities</CardTitle>
                <CardDescription>Find what helps you</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group bg-card/95"
          onClick={() => navigate("/goals")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Goals</CardTitle>
                <CardDescription>Track your resolutions</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group bg-card/95"
          onClick={() => navigate("/progress")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>See how far you've come</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 group bg-card/95"
          onClick={() => navigate("/vent")}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-secondary/20 group-hover:bg-secondary/30 transition-colors">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-lg">Talk It Out</CardTitle>
                <CardDescription>Vent and feel heard</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-5 text-lg">
            🌊 Like the ocean, peace comes in waves. Let today be a gentle one.
          </p>
          <Button onClick={() => navigate("/check-in")} size="lg" className="px-8 shadow-md hover:shadow-lg transition-shadow">
            Begin Your Day
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
