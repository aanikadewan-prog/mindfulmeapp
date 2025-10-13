import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Sparkles } from "lucide-react";

const prompts = [
  "What made you smile today?",
  "What's something you're grateful for?",
  "Describe a challenge you faced and how you handled it",
  "What's one thing you'd like to let go of?",
  "What makes you feel most like yourself?",
  "If you could tell your future self something, what would it be?",
];

interface JournalEntry {
  date: string;
  content: string;
  prompt?: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("journalEntries");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
    setSelectedPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const saveEntry = () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Entry is empty",
        description: "Write something before saving",
        variant: "destructive",
      });
      return;
    }

    const newEntry: JournalEntry = {
      date: new Date().toISOString(),
      content: currentEntry,
      prompt: selectedPrompt,
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries));

    toast({
      title: "Entry saved! ✨",
      description: "Your thoughts are safe with us",
    });

    setCurrentEntry("");
    setSelectedPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Your Private Journal</CardTitle>
          </div>
          <CardDescription>
            A safe space for your thoughts. Everything stays on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium">Today's prompt:</p>
              <p className="text-sm text-muted-foreground">{selectedPrompt}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPrompt(prompts[Math.floor(Math.random() * prompts.length)])}
            >
              New
            </Button>
          </div>

          <Textarea
            placeholder="Start writing..."
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            className="min-h-[200px] resize-none"
          />

          <Button onClick={saveEntry} className="w-full">
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Past Entries</CardTitle>
            <CardDescription>Reflecting on your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="p-4 bg-card border rounded-lg space-y-2 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {formatDate(entry.date)}
                  </Badge>
                  {entry.prompt && (
                    <span className="text-xs text-muted-foreground italic">
                      "{entry.prompt}"
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
