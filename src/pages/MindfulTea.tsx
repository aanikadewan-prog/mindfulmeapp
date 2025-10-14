import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Thermometer, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ActivityCompletion from "@/components/ActivityCompletion";

interface Tea {
  name: string;
  type: string;
  emoji: string;
  benefits: string[];
  temperature: string;
  steepTime: string;
  description: string;
  bestFor: string;
}

const teas: Tea[] = [
  {
    name: "Chamomile",
    type: "Herbal",
    emoji: "🌼",
    benefits: ["Promotes relaxation", "Helps with sleep", "Reduces anxiety"],
    temperature: "200°F (93°C)",
    steepTime: "5-7 minutes",
    description: "A gentle, floral tea perfect for winding down",
    bestFor: "Evening relaxation"
  },
  {
    name: "Green Tea",
    type: "Traditional",
    emoji: "🍵",
    benefits: ["Gentle energy boost", "Rich in antioxidants", "Improves focus"],
    temperature: "175°F (80°C)",
    steepTime: "2-3 minutes",
    description: "Light and refreshing with subtle grassy notes",
    bestFor: "Morning mindfulness"
  },
  {
    name: "Lavender",
    type: "Herbal",
    emoji: "💜",
    benefits: ["Calms the mind", "Reduces stress", "Improves mood"],
    temperature: "200°F (93°C)",
    steepTime: "5-6 minutes",
    description: "Soothing floral tea with a distinctive aroma",
    bestFor: "Stress relief"
  },
  {
    name: "Peppermint",
    type: "Herbal",
    emoji: "🌿",
    benefits: ["Refreshes the mind", "Aids digestion", "Clears sinuses"],
    temperature: "200°F (93°C)",
    steepTime: "5-7 minutes",
    description: "Crisp and cooling with a refreshing menthol taste",
    bestFor: "Afternoon pick-me-up"
  },
  {
    name: "Rooibos",
    type: "Herbal",
    emoji: "🍂",
    benefits: ["Naturally caffeine-free", "Sweet and smooth", "Rich in minerals"],
    temperature: "200°F (93°C)",
    steepTime: "5-7 minutes",
    description: "Naturally sweet red tea from South Africa",
    bestFor: "Any time of day"
  },
  {
    name: "Lemon Balm",
    type: "Herbal",
    emoji: "🍋",
    benefits: ["Eases anxiety", "Promotes calmness", "Uplifts mood"],
    temperature: "200°F (93°C)",
    steepTime: "5-10 minutes",
    description: "Mild citrus flavor with calming properties",
    bestFor: "Anxiety relief"
  }
];

export default function MindfulTea() {
  const navigate = useNavigate();
  const [selectedTea, setSelectedTea] = useState<Tea | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate("/activities")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Coffee className="h-8 w-8" />
            Mindful Tea Guide
          </CardTitle>
          <p className="text-muted-foreground">Choose your perfect tea and brew it mindfully</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tea Selection Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teas.map((tea) => (
              <Card
                key={tea.name}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTea?.name === tea.name
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedTea(tea)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{tea.emoji}</div>
                    <Badge variant="secondary">{tea.type}</Badge>
                  </div>
                  <CardTitle className="text-xl">{tea.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{tea.description}</p>
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <span className="font-medium">Best for:</span>
                    <span>{tea.bestFor}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Tea Details */}
          {selectedTea && (
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <CardContent className="pt-6 space-y-4">
                <div className="text-center">
                  <div className="text-5xl mb-2">{selectedTea.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-1">{selectedTea.name}</h3>
                  <p className="text-muted-foreground">{selectedTea.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Temperature</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedTea.temperature}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold">Steep Time</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedTea.steepTime}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {selectedTea.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-accent/50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-3">🫖 Mindful Brewing Steps</h4>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2"><span className="font-semibold text-primary">1.</span> Boil water to the right temperature</li>
                      <li className="flex gap-2"><span className="font-semibold text-primary">2.</span> While it heats, take 3 deep breaths</li>
                      <li className="flex gap-2"><span className="font-semibold text-primary">3.</span> Add tea and pour the water slowly</li>
                      <li className="flex gap-2"><span className="font-semibold text-primary">4.</span> Watch the color change as it steeps</li>
                      <li className="flex gap-2"><span className="font-semibold text-primary">5.</span> Inhale the aroma - notice what you smell</li>
                      <li className="flex gap-2"><span className="font-semibold text-primary">6.</span> Remove the tea and find a cozy spot</li>
                      <li className="flex gap-2"><span className="font-semibold text-primary">7.</span> Hold the warm cup and appreciate this moment</li>
                    </ol>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          )}

          {/* General Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💜 Making Tea a Mindful Practice</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Treat tea preparation as a mini-meditation</li>
                <li>• Put your phone away during your tea time</li>
                <li>• Notice the temperature, smell, and taste</li>
                <li>• Take small sips and really taste each one</li>
                <li>• This is your moment - there's no rush</li>
              </ul>
            </CardContent>
          </Card>

          {/* Activity Completion */}
          <ActivityCompletion activityName="Mindful Tea" />
        </CardContent>
      </Card>
    </div>
  );
}
