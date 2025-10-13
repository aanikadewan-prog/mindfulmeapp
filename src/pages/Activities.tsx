import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Wind, Pen, Music, Coffee, Smartphone, Users, Mountain, Book, Palette, Sunrise, Moon, Waves, Leaf, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Activity {
  icon: any;
  title: string;
  description: string;
  category: string;
  color: string;
  instructions: string[];
  duration: string;
}

const activities: Activity[] = [
  {
    icon: Wind,
    title: "Breathing Exercise",
    description: "5-minute guided breathing for calm",
    category: "Mindful",
    color: "text-accent",
    duration: "5 min",
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes or soften your gaze",
      "Breathe in slowly through your nose for 4 counts",
      "Hold your breath gently for 4 counts",
      "Exhale slowly through your mouth for 6 counts",
      "Repeat for 5 minutes, focusing only on your breath",
      "Notice how your body feels more relaxed"
    ]
  },
  {
    icon: Music,
    title: "Soothing Sounds",
    description: "Nature sounds and calming music",
    category: "Mindful",
    color: "text-primary",
    duration: "10-20 min",
    instructions: [
      "Find a quiet, comfortable space",
      "Use headphones for the best experience",
      "Search YouTube for: rain sounds, ocean waves, or lo-fi music",
      "Close your eyes and let the sounds wash over you",
      "Try not to think about anything specific",
      "Just be present with the sounds",
      "Stay for at least 10 minutes"
    ]
  },
  {
    icon: Heart,
    title: "Gentle Stretching",
    description: "Easy movements to release tension",
    category: "Movement",
    color: "text-secondary",
    duration: "10 min",
    instructions: [
      "Start with neck rolls - 5 in each direction",
      "Roll your shoulders back 10 times",
      "Reach your arms up high and stretch to each side",
      "Do some gentle twists from side to side",
      "Stretch your legs - touch your toes if you can",
      "Don't force anything - just gentle movements",
      "Notice where you were holding tension"
    ]
  },
  {
    icon: Mountain,
    title: "Short Walk",
    description: "Get outside, even for 10 minutes",
    category: "Movement",
    color: "text-accent",
    duration: "10-30 min",
    instructions: [
      "Put on comfortable shoes",
      "Step outside - around your block is perfect",
      "Leave your phone on silent or at home",
      "Walk at a comfortable pace",
      "Notice 5 things you can see",
      "Take deep breaths of fresh air",
      "There's no destination - just walk and be present"
    ]
  },
  {
    icon: Pen,
    title: "Free Writing",
    description: "Let your thoughts flow on paper",
    category: "Creative",
    color: "text-primary",
    duration: "10-15 min",
    instructions: [
      "Grab a pen and paper (or use the Journal page)",
      "Set a timer for 10 minutes",
      "Write whatever comes to mind - don't stop",
      "Don't worry about spelling or grammar",
      "No one will read this but you",
      "Let your thoughts flow freely",
      "When the timer goes off, take a deep breath"
    ]
  },
  {
    icon: Palette,
    title: "Art & Doodling",
    description: "Express yourself with colors",
    category: "Creative",
    color: "text-secondary",
    duration: "15-30 min",
    instructions: [
      "Get paper and any coloring tools (crayons, markers, pencils)",
      "Don't plan what to draw",
      "Just start making marks on the paper",
      "Use colors that feel right in the moment",
      "Draw patterns, shapes, or whatever flows",
      "This isn't about making 'good art'",
      "It's about expressing what's inside"
    ]
  },
  {
    icon: Users,
    title: "Connect",
    description: "Text a friend or family member",
    category: "Social",
    color: "text-accent",
    duration: "5-10 min",
    instructions: [
      "Think of someone who makes you feel safe",
      "Send them a simple message",
      "You don't have to explain everything",
      "Even 'hey, thinking of you' is enough",
      "Or share something funny you saw",
      "Connection doesn't have to be deep to help",
      "Just reaching out matters"
    ]
  },
  {
    icon: Coffee,
    title: "Mindful Tea",
    description: "Slow down with a warm drink",
    category: "Mindful",
    color: "text-primary",
    duration: "15 min",
    instructions: [
      "Make your favorite warm drink (tea, hot chocolate, etc.)",
      "While it's brewing, take 3 deep breaths",
      "Find a cozy spot to sit",
      "Hold the warm cup in your hands",
      "Notice the temperature, the smell, the color",
      "Take small sips and really taste it",
      "Let this be a moment just for you"
    ]
  },
  {
    icon: Book,
    title: "Read",
    description: "Get lost in a good story",
    category: "Creative",
    color: "text-secondary",
    duration: "20-30 min",
    instructions: [
      "Pick a book you enjoy (fiction works great)",
      "Find a comfortable spot",
      "Read for at least 15 minutes",
      "Let yourself get absorbed in the story",
      "This gives your mind a break from your own thoughts",
      "Notice how you feel after reading",
      "It's okay to escape for a while"
    ]
  },
  {
    icon: Sunrise,
    title: "Morning Ritual",
    description: "Start your day with intention",
    category: "Mindful",
    color: "text-accent",
    duration: "10 min",
    instructions: [
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
    color: "text-primary",
    duration: "30 min",
    instructions: [
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
    icon: Waves,
    title: "Progressive Relaxation",
    description: "Release physical tension",
    category: "Movement",
    color: "text-secondary",
    duration: "10-15 min",
    instructions: [
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
    icon: Leaf,
    title: "Gratitude Practice",
    description: "Notice three good things",
    category: "Mindful",
    color: "text-accent",
    duration: "5 min",
    instructions: [
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
    icon: Sparkles,
    title: "Self-Compassion",
    description: "Be kind to yourself",
    category: "Mindful",
    color: "text-primary",
    duration: "5-10 min",
    instructions: [
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
    icon: Smartphone,
    title: "Digital Detox",
    description: "Take a break from screens",
    category: "Mindful",
    color: "text-secondary",
    duration: "30-60 min",
    instructions: [
      "Put your phone in another room",
      "Set a timer for 30-60 minutes",
      "Do something that doesn't involve a screen",
      "Draw, read, walk, stretch, or just sit",
      "Notice if you feel the urge to check your phone",
      "That's normal - just notice it and let it pass",
      "See how you feel after the break"
    ]
  },
];

const categories = Array.from(new Set(activities.map((a) => a.category)));

export default function Activities() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

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
                    onClick={() => setSelectedActivity(activity)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <activity.icon className={`h-6 w-6 ${activity.color} group-hover:scale-110 transition-transform`} />
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
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedActivity && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <selectedActivity.icon className={`h-8 w-8 ${selectedActivity.color}`} />
                  <div className="flex-1">
                    <DialogTitle className="text-2xl">{selectedActivity.title}</DialogTitle>
                    <DialogDescription className="text-base mt-1">
                      {selectedActivity.description}
                    </DialogDescription>
                  </div>
                  <Badge>{selectedActivity.duration}</Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="space-y-3">
                  {selectedActivity.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        {index + 1}
                      </div>
                      <p className="pt-1 text-sm leading-relaxed">{instruction}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t space-y-2">
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
