import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GratitudeEntry {
  date: string;
  items: [string, string, string];
}

export default function GratitudePractice() {
  const navigate = useNavigate();
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const [item3, setItem3] = useState("");
  const [todayEntry, setTodayEntry] = useState<GratitudeEntry | null>(null);

  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`gratitude_${today}`);
    if (saved) {
      const entry = JSON.parse(saved);
      setTodayEntry(entry);
      setItem1(entry.items[0]);
      setItem2(entry.items[1]);
      setItem3(entry.items[2]);
    }
  }, []);

  const handleSave = () => {
    if (!item1.trim() || !item2.trim() || !item3.trim()) {
      toast.error("Please fill in all three items");
      return;
    }

    const today = new Date().toDateString();
    const entry: GratitudeEntry = {
      date: today,
      items: [item1.trim(), item2.trim(), item3.trim()]
    };

    localStorage.setItem(`gratitude_${today}`, JSON.stringify(entry));
    setTodayEntry(entry);
    toast.success("Your gratitude has been saved 💜");
  };

  const prompts = [
    "Maybe your bed was comfortable this morning",
    "Perhaps someone smiled at you today",
    "Maybe you ate something you enjoyed",
    "Did something make you laugh?",
    "Was the weather nice at any point?",
    "Did you have a moment of peace?",
    "Did you learn something new?",
    "Did your body do something you're thankful for?"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
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
            <Heart className="h-8 w-8 text-primary" />
            Gratitude Practice
          </CardTitle>
          <p className="text-muted-foreground">Notice three good things from today</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="item1" className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    First thing I'm grateful for:
                  </label>
                  <Textarea
                    id="item1"
                    value={item1}
                    onChange={(e) => setItem1(e.target.value)}
                    placeholder="Even tiny things count..."
                    className="min-h-20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="item2" className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Second thing I'm grateful for:
                  </label>
                  <Textarea
                    id="item2"
                    value={item2}
                    onChange={(e) => setItem2(e.target.value)}
                    placeholder="It doesn't have to be big..."
                    className="min-h-20 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="item3" className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Third thing I'm grateful for:
                  </label>
                  <Textarea
                    id="item3"
                    value={item3}
                    onChange={(e) => setItem3(e.target.value)}
                    placeholder="Small good things matter too..."
                    className="min-h-20 resize-none"
                  />
                </div>

                <Button onClick={handleSave} className="w-full" size="lg">
                  Save Today's Gratitude
                </Button>

                {todayEntry && (
                  <p className="text-sm text-center text-muted-foreground">
                    ✨ You've captured today's gratitude
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prompts */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">Need some ideas?</h4>
              <div className="grid gap-2 md:grid-cols-2">
                {prompts.map((prompt, index) => (
                  <div key={index} className="text-sm text-muted-foreground p-2 rounded bg-background/50">
                    • {prompt}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-accent/30">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💜 Why This Matters</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Gratitude practice helps retrain your brain to notice good things</li>
                <li>• Small good things matter just as much as big ones</li>
                <li>• Try to really feel appreciation for each item</li>
                <li>• Come back tomorrow and add three more</li>
                <li>• Over time, you'll naturally notice more positive moments</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
