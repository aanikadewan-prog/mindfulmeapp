import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, BookOpen, MessageCircle, TrendingUp, Sparkles, Trophy, 
  Timer, Leaf, Coffee, Sun, Smile, Smartphone, Moon, Footprints, 
  Brain, StretchHorizontal, Phone, Info, HelpCircle, Shield
} from "lucide-react";

const features = [
  {
    title: "Daily Check-In",
    icon: Smile,
    description: "Track your mood and get personalized activity recommendations based on how you're feeling.",
    howTo: "Visit the Home page and complete the daily check-in. Rate your mood and answer a few quick questions to receive tailored suggestions."
  },
  {
    title: "Journal",
    icon: BookOpen,
    description: "A private space to write your thoughts. Includes writing prompts to help you reflect.",
    howTo: "Go to Journal from the sidebar. Use the provided prompts or write freely. All entries are saved securely to your account."
  },
  {
    title: "Vent Space",
    icon: MessageCircle,
    description: "Chat with a supportive AI listener when you need to get things off your chest. No judgment, just support.",
    howTo: "Open Vent Space from the sidebar. Type or speak what's on your mind. The AI will listen and offer supportive responses."
  },
  {
    title: "Progress Tracking",
    icon: TrendingUp,
    description: "See your mood trends and activity patterns over time to understand your wellness journey.",
    howTo: "Visit Progress to view charts of your mood history, activity streaks, and check-in patterns."
  },
  {
    title: "Activities",
    icon: Sparkles,
    description: "Curated wellness activities including breathing exercises, meditation, stretching, and more.",
    howTo: "Browse Activities from the sidebar. Each activity has step-by-step guidance. Complete activities to earn rewards!"
  },
  {
    title: "Rewards",
    icon: Trophy,
    description: "Earn badges and celebrate milestones as you build healthy habits.",
    howTo: "Check the Rewards page to see your earned badges and upcoming milestones. Keep completing activities to unlock more!"
  },
  {
    title: "Clean Counter",
    icon: Heart,
    description: "Track your progress with any habit you want to maintain or break. Celebrate milestones along the way.",
    howTo: "Set your start date in Clean Counter. The app tracks your streak and celebrates milestone achievements."
  }
];

const activities = [
  { name: "Breathing Timer", icon: Timer, description: "Guided breathing exercises to calm your mind" },
  { name: "Soothing Sounds", icon: Leaf, description: "Nature and ambient sounds for relaxation" },
  { name: "Mindful Tea", icon: Coffee, description: "A guided tea-drinking meditation" },
  { name: "Morning Ritual", icon: Sun, description: "Start your day with intention" },
  { name: "Gratitude Practice", icon: Smile, description: "Reflect on what you're thankful for" },
  { name: "Self-Compassion", icon: Heart, description: "Practice kindness toward yourself" },
  { name: "Phone-Free Hour", icon: Smartphone, description: "Take a break from screens" },
  { name: "Evening Wind-Down", icon: Moon, description: "Prepare for restful sleep" },
  { name: "Short Walk", icon: Footprints, description: "Get moving with a mindful walk" },
  { name: "Progressive Relaxation", icon: Brain, description: "Release tension throughout your body" },
  { name: "Gentle Stretching", icon: StretchHorizontal, description: "Simple stretches for stress relief" },
];

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10">
          <HelpCircle className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Help & About</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about MindfulMe and how to make the most of your wellness journey.
        </p>
      </div>

      {/* Purpose Card */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" />
            <CardTitle>What is MindfulMe?</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            MindfulMe is a wellness companion app designed to support your mental health and emotional wellbeing 
            through daily check-ins, journaling, guided activities, and supportive conversations.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-card border">
              <p className="font-medium mb-1">Track</p>
              <p className="text-sm text-muted-foreground">Monitor your mood and see patterns over time</p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <p className="font-medium mb-1">Reflect</p>
              <p className="text-sm text-muted-foreground">Journal and vent in a safe, private space</p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <p className="font-medium mb-1">Grow</p>
              <p className="text-sm text-muted-foreground">Build healthy habits with guided activities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-amber-600" />
            <CardTitle className="text-amber-700 dark:text-amber-400">Important Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <strong>Not Medical Care:</strong> MindfulMe is a wellness support tool, not a substitute for 
            professional medical or mental health care. Always consult licensed professionals for clinical advice.
          </p>
          <p>
            <strong>Crisis Support:</strong> If you're in crisis or experiencing thoughts of self-harm, please 
            reach out to trained professionals. Use the crisis resources at the bottom of every page:
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="gap-1">
              <Phone className="h-3 w-3" /> Call 988 Lifeline
            </Badge>
            <Badge variant="outline" className="gap-1">
              <MessageCircle className="h-3 w-3" /> Text HOME to 741741
            </Badge>
          </div>
          <p>
            <strong>Privacy:</strong> Your journal entries and conversations are stored securely in your personal 
            account. Only you can access your data.
          </p>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>Features & How to Use</CardTitle>
          </div>
          <CardDescription>
            Learn about each feature and how to get the most out of MindfulMe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {features.map((feature, index) => (
              <AccordionItem key={index} value={`feature-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span>{feature.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-12 space-y-2">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                    <p className="text-sm font-medium mb-1">How to use:</p>
                    <p className="text-sm text-muted-foreground">{feature.howTo}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Activities Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Leaf className="h-6 w-6 text-primary" />
            <CardTitle>Available Activities</CardTitle>
          </div>
          <CardDescription>
            Explore our curated collection of wellness activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {activities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-3 rounded-lg border hover:border-primary/30 transition-colors"
              >
                <div className="p-2 rounded-lg bg-secondary/10">
                  <activity.icon className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.name}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="border-secondary/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 text-secondary" />
            <CardTitle>Getting Started</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</span>
              <div>
                <p className="font-medium">Complete your daily check-in</p>
                <p className="text-sm text-muted-foreground">Start each day by rating your mood and answering a few questions</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</span>
              <div>
                <p className="font-medium">Try a recommended activity</p>
                <p className="text-sm text-muted-foreground">Based on your check-in, we'll suggest activities that might help</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</span>
              <div>
                <p className="font-medium">Journal or vent when you need to</p>
                <p className="text-sm text-muted-foreground">Write in your journal or chat in Vent Space whenever you need support</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">4</span>
              <div>
                <p className="font-medium">Track your progress</p>
                <p className="text-sm text-muted-foreground">Watch your mood trends and earn rewards as you build healthy habits</p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}