import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Wind, Pen, Music, Coffee, Smartphone, Users, Mountain, Book, Palette, Sunrise, Moon, Waves, Leaf, Sparkles } from "lucide-react";

const activities = [
  {
    icon: Wind,
    title: "Breathing Exercise",
    description: "5-minute guided breathing for calm",
    category: "Mindful",
    color: "text-accent",
  },
  {
    icon: Music,
    title: "Soothing Sounds",
    description: "Nature sounds and calming music",
    category: "Mindful",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Gentle Stretching",
    description: "Easy movements to release tension",
    category: "Movement",
    color: "text-secondary",
  },
  {
    icon: Mountain,
    title: "Short Walk",
    description: "Get outside, even for 10 minutes",
    category: "Movement",
    color: "text-accent",
  },
  {
    icon: Pen,
    title: "Free Writing",
    description: "Let your thoughts flow on paper",
    category: "Creative",
    color: "text-primary",
  },
  {
    icon: Palette,
    title: "Art & Doodling",
    description: "Express yourself with colors",
    category: "Creative",
    color: "text-secondary",
  },
  {
    icon: Users,
    title: "Connect",
    description: "Text a friend or family member",
    category: "Social",
    color: "text-accent",
  },
  {
    icon: Coffee,
    title: "Mindful Tea",
    description: "Slow down with a warm drink",
    category: "Mindful",
    color: "text-primary",
  },
  {
    icon: Book,
    title: "Read",
    description: "Get lost in a good story",
    category: "Creative",
    color: "text-secondary",
  },
  {
    icon: Sunrise,
    title: "Morning Ritual",
    description: "Start your day with intention",
    category: "Mindful",
    color: "text-accent",
  },
  {
    icon: Moon,
    title: "Evening Wind-Down",
    description: "Prepare for restful sleep",
    category: "Mindful",
    color: "text-primary",
  },
  {
    icon: Waves,
    title: "Progressive Relaxation",
    description: "Release physical tension",
    category: "Movement",
    color: "text-secondary",
  },
  {
    icon: Leaf,
    title: "Gratitude Practice",
    description: "Notice three good things",
    category: "Mindful",
    color: "text-accent",
  },
  {
    icon: Sparkles,
    title: "Self-Compassion",
    description: "Be kind to yourself",
    category: "Mindful",
    color: "text-primary",
  },
  {
    icon: Smartphone,
    title: "Digital Detox",
    description: "Take a break from screens",
    category: "Mindful",
    color: "text-secondary",
  },
];

const categories = Array.from(new Set(activities.map((a) => a.category)));

export default function Activities() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Wellness Activities</CardTitle>
          <CardDescription>Choose what feels right for you today</CardDescription>
        </CardHeader>
      </Card>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30">
              {category}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activities
              .filter((a) => a.category === category)
              .map((activity) => (
                <Card
                  key={activity.title}
                  className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <activity.icon className={`h-6 w-6 ${activity.color}`} />
                    </div>
                    <CardTitle className="text-lg">{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
