import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Wind, Music, Coffee, Mountain, Sunrise, Moon, Waves, Leaf, Sparkles, BookOpen, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Activity {
  icon: any;
  title: string;
  description: string;
  category: string;
  duration: string;
  steps: string[];
  hasAlternative?: boolean;
  alternative?: {
    title: string;
    steps: string[];
  };
}

const activities: Activity[] = [
  {
    icon: Wind,
    title: "Breathing Exercise",
    description: "5-minute guided breathing for calm",
    category: "Mindful",
    duration: "5 min",
    hasAlternative: true,
    steps: [
      "Find a comfortable seated position",
      "Close your eyes gently",
      "Breathe in slowly for 4 counts",
      "Hold for 4 counts",
      "Breathe out for 6 counts",
      "Repeat this cycle 5-10 times",
      "Notice how your body feels more relaxed"
    ],
    alternative: {
      title: "Box Breathing",
      steps: [
        "Sit comfortably and relax your shoulders",
        "Breathe in for 4 counts",
        "Hold for 4 counts",
        "Breathe out for 4 counts",
        "Hold empty for 4 counts",
        "Repeat 4-5 times"
      ]
    }
  },
  {
    icon: Music,
    title: "Soothing Sounds",
    description: "Nature sounds and calming music",
    category: "Mindful",
    duration: "10-20 min",
    hasAlternative: true,
    steps: [
      "Put on headphones if possible",
      "Choose nature sounds (rain, ocean, forest)",
      "Close your eyes and listen",
      "Let the sounds wash over you",
      "Focus on different layers of sound",
      "Stay present with the experience"
    ],
    alternative: {
      title: "Uplifting Music",
      steps: [
        "Create a playlist of songs that make you feel good",
        "Choose upbeat, positive music",
        "Sing along if you feel like it",
        "Move your body to the rhythm",
        "Let the music lift your mood"
      ]
    }
  },
  {
    icon: Coffee,
    title: "Mindful Tea",
    description: "Slow down with a warm drink",
    category: "Mindful",
    duration: "15 min",
    steps: [
      "Make your favorite warm drink",
      "While it's brewing, take 3 deep breaths",
      "Find a cozy spot to sit",
      "Hold the warm cup in your hands",
      "Notice the temperature, smell, color",
      "Take small sips and really taste it",
      "Let this be a moment just for you"
    ]
  },
  {
    icon: Sunrise,
    title: "Morning Ritual",
    description: "Start your day with intention",
    category: "Mindful",
    duration: "10 min",
    steps: [
      "Before checking your phone, take 5 deep breaths",
      "Stretch while still in bed",
      "Think of one thing you're looking forward to",
      "Drink a glass of water",
      "Open a window and let fresh air in",
      "Set a small intention for the day",
      "Give yourself credit for getting up"
    ]
  },
  {
    icon: Moon,
    title: "Evening Wind-Down",
    description: "Prepare for restful sleep",
    category: "Mindful",
    duration: "30 min",
    steps: [
      "An hour before bed, dim the lights",
      "Put your phone on silent and across the room",
      "Do something calming (read, stretch, listen to music)",
      "Write down any worries - get them out of your head",
      "Practice your breathing exercise",
      "Your thoughts will still be there tomorrow",
      "Focus on rest now"
    ]
  },
  {
    icon: Sparkles,
    title: "Self-Compassion",
    description: "Be kind to yourself",
    category: "Mindful",
    duration: "5-10 min",
    steps: [
      "Put your hand on your heart",
      "Take a deep breath",
      "Say: 'I'm doing my best'",
      "Say: 'It's okay to struggle'",
      "Say: 'I deserve kindness, especially from myself'",
      "Repeat as many times as you need",
      "You would comfort a friend - comfort yourself too"
    ]
  },
  {
    icon: Leaf,
    title: "Gratitude Practice",
    description: "Notice three good things",
    category: "Mindful",
    duration: "5 min",
    steps: [
      "Think of 3 things from today (even tiny things)",
      "Maybe your bed was comfortable",
      "Or someone smiled at you",
      "Or you ate something you enjoyed",
      "Say them out loud or write them down",
      "Really feel appreciation for each one",
      "Small good things matter too"
    ]
  },
  {
    icon: Heart,
    title: "Gentle Stretching",
    description: "Easy movements to release tension",
    category: "Movement",
    duration: "10 min",
    hasAlternative: true,
    steps: [
      "Stand with feet hip-width apart",
      "Reach arms overhead and stretch",
      "Gently roll your shoulders back",
      "Touch your toes (or knees)",
      "Twist gently side to side",
      "Roll your neck slowly",
      "Take deep breaths throughout"
    ],
    alternative: {
      title: "Dance It Out",
      steps: [
        "Put on your favorite upbeat song",
        "Move your body however feels good",
        "Don't worry about looking silly",
        "Dance for at least one full song",
        "Let loose and have fun!"
      ]
    }
  },
  {
    icon: Mountain,
    title: "Short Walk",
    description: "Get outside, even for 10 minutes",
    category: "Movement",
    duration: "10-30 min",
    hasAlternative: true,
    steps: [
      "Put on comfortable shoes",
      "Step outside your door",
      "Walk at a comfortable pace",
      "Notice your surroundings",
      "Take deep breaths of fresh air",
      "Even 10 minutes counts!",
      "Return when you're ready"
    ],
    alternative: {
      title: "Window Observation",
      steps: [
        "If you can't go outside, that's okay!",
        "Sit by a window",
        "Watch the world go by for 10 minutes",
        "Notice the sky, trees, people, weather",
        "Take deep breaths while observing"
      ]
    }
  },
  {
    icon: Waves,
    title: "Progressive Relaxation",
    description: "Release physical tension",
    category: "Movement",
    duration: "10-15 min",
    steps: [
      "Lie down in a comfortable position",
      "Starting with your toes, tense them for 5 seconds",
      "Then release and feel the relaxation",
      "Move up to your legs, then stomach, then arms",
      "Tense and release each muscle group",
      "End with your face and jaw",
      "Notice how much lighter your body feels"
    ]
  },
  {
    icon: Smartphone,
    title: "Phone-Free Hour",
    description: "Take a mindful break from your phone",
    category: "Digital Wellness",
    duration: "60 min",
    hasAlternative: true,
    steps: [
      "Choose a time when you don't need your phone",
      "Turn it off or put it in another room",
      "Set a gentle timer (not on your phone!)",
      "Do something you enjoy offline",
      "Notice if you feel the urge to check it - that's totally normal",
      "Sit with that feeling for a moment",
      "See how you feel after the hour"
    ],
    alternative: {
      title: "30-Minute Reset",
      steps: [
        "Start with just 30 minutes if an hour feels too long",
        "Put your phone on airplane mode",
        "Keep it out of reach",
        "Do a calming activity (read, draw, walk)",
        "Notice how it feels to be unplugged",
        "You're not missing out - you're taking care of yourself"
      ]
    }
  },
  {
    icon: Sparkles,
    title: "Social Media Pause",
    description: "Gentle break from scrolling",
    category: "Digital Wellness",
    duration: "varies",
    hasAlternative: true,
    steps: [
      "Pick one app to take a break from today",
      "Log out of it (not delete - just log out)",
      "Notice when you automatically reach for it",
      "That's not bad - it's just a habit",
      "When you notice, try one of the mindful activities instead",
      "See how you feel at the end of the day",
      "You can always log back in - this is just an experiment"
    ],
    alternative: {
      title: "Set Time Limits",
      steps: [
        "Use your phone's built-in timer for social apps",
        "Set it to 30 minutes per app per day",
        "When the time's up, take a 5-minute break",
        "Do some stretches or breathing",
        "This isn't about restriction - it's about awareness",
        "You're learning what works for you"
      ]
    }
  }
];

const categories = Array.from(new Set(activities.map((a) => a.category)));

export default function Activities() {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showAlternative, setShowAlternative] = useState(false);

  const handleActivityClick = (activity: Activity) => {
    // Route to dedicated pages for enhanced activities
    const routeMap: Record<string, string> = {
      "Breathing Exercise": "/breathing",
      "Soothing Sounds": "/sounds",
      "Mindful Tea": "/tea",
      "Morning Ritual": "/morning",
      "Gratitude Practice": "/gratitude"
    };

    const route = routeMap[activity.title];
    if (route) {
      navigate(route);
    } else {
      setSelectedActivity(activity);
      setShowAlternative(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        <Card>
          <CardHeader>
            <CardTitle>Wellness Activities</CardTitle>
            <CardDescription>Click any activity for step-by-step instructions</CardDescription>
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
                    className="hover:border-primary/50 transition-all cursor-pointer hover:shadow-lg group"
                    onClick={() => handleActivityClick(activity)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <activity.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                        <Badge variant="secondary" className="text-xs">
                          {activity.duration}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{activity.description}</CardDescription>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        Start Activity
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <BookOpen className="h-10 w-10 text-primary flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">Need More Ideas?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Keep track of what works for you in your private journal. Write down your thoughts, feelings, or create your own custom activities.
                </p>
                <Button asChild size="lg">
                  <a href="/journal">Go to Journal</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedActivity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <selectedActivity.icon className="h-8 w-8 text-primary" />
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">
                      {showAlternative && selectedActivity.alternative 
                        ? selectedActivity.alternative.title 
                        : selectedActivity.title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      {selectedActivity.description}
                    </DialogDescription>
                  </div>
                  <Badge>{selectedActivity.duration}</Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  {(showAlternative && selectedActivity.alternative 
                    ? selectedActivity.alternative.steps 
                    : selectedActivity.steps).map((step, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
                  {selectedActivity.hasAlternative && (
                    <Button
                      variant="outline"
                      onClick={() => setShowAlternative(!showAlternative)}
                      className="w-full"
                    >
                      {showAlternative ? "← Show Original Option" : "Try Option B →"}
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedActivity(null)}
                    className="w-full"
                  >
                    I'm Ready to Start
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    💜 Take your time. There's no rush. You've got this.
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
