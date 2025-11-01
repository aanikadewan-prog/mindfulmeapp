import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ActivityCompletion from "@/components/ActivityCompletion";
import { supabase } from "@/integrations/supabase/client";

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
    loadTodayEntry();
  }, []);

  const loadTodayEntry = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('gratitude_entries')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (!error && data && data.length === 3) {
      setItem1(data[2].entry);
      setItem2(data[1].entry);
      setItem3(data[0].entry);
      setTodayEntry({
        date: new Date().toDateString(),
        items: [data[2].entry, data[1].entry, data[0].entry]
      });
    }
  };

  const handleSave = async () => {
    if (!item1.trim() || !item2.trim() || !item3.trim()) {
      toast.error("Please fill in all three items");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to save your gratitude");
      return;
    }

    // Delete today's entries first
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('gratitude_entries')
      .delete()
      .gte('created_at', `${today}T00:00:00`)
      .lte('created_at', `${today}T23:59:59`)
      .eq('user_id', user.id);

    // Insert new entries
    const { error } = await supabase
      .from('gratitude_entries')
      .insert([
        { user_id: user.id, entry: item1.trim() },
        { user_id: user.id, entry: item2.trim() },
        { user_id: user.id, entry: item3.trim() }
      ]);

    if (error) {
      toast.error("Error saving gratitude. Please try again.");
      return;
    }

    const entry: GratitudeEntry = {
      date: new Date().toDateString(),
      items: [item1.trim(), item2.trim(), item3.trim()]
    };

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
                  <ActivityCompletion activityName="Gratitude Practice" />
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
