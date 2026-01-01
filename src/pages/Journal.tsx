import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Sparkles, Pen, Calendar, Heart, Phone, MessageCircle } from "lucide-react";
import ActivityCompletion from "@/components/ActivityCompletion";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

// Keywords that may indicate someone is struggling - show supportive resources (not diagnosis)
const SUPPORT_KEYWORDS = [
  "hurt myself", "hurting myself", "self harm", "self-harm",
  "end it all", "ending it", "want to die", "don't want to live",
  "kill myself", "suicide", "suicidal", "no reason to live"
];

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [showCompletion, setShowCompletion] = useState(false);
  const { toast } = useToast();

  // Non-diagnostic check: show support resources if keywords detected
  const showSupportResources = useMemo(() => {
    const lowerContent = currentEntry.toLowerCase();
    return SUPPORT_KEYWORDS.some(keyword => lowerContent.includes(keyword));
  }, [currentEntry]);

  useEffect(() => {
    loadEntries();
    setSelectedPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);

  const loadEntries = async () => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setEntries(data.map(e => ({
        date: e.created_at,
        content: e.content,
        prompt: e.prompt || undefined
      })));
    }
  };

  const saveEntry = async () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Entry is empty",
        description: "Write something before saving",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to save entries",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        content: currentEntry,
        prompt: selectedPrompt
      });

    if (error) {
      toast({
        title: "Error saving entry",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Entry saved! ✨",
      description: "Your thoughts are securely stored",
    });

    setCurrentEntry("");
    setSelectedPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    setShowCompletion(true);
    loadEntries();
    
    // Hide completion after 5 seconds
    setTimeout(() => setShowCompletion(false), 5000);
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
      {/* Activity Completion */}
      {showCompletion && (
        <ActivityCompletion activityName="Journaling" />
      )}

      {/* Stats Header */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Pen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground">Total Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-secondary/20">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {entries.length > 0 ? Math.floor((Date.now() - new Date(entries[entries.length - 1].date).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                </p>
                <p className="text-xs text-muted-foreground">Days Journaling</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {entries.length > 0 && entries.filter(e => {
                    const entryDate = new Date(e.date);
                    const now = new Date();
                    return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 shadow-lg">
        <CardHeader className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Your Private Journal</CardTitle>
          </div>
          <CardDescription className="text-base">
            A safe space for your thoughts. Everything stays on your device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative flex items-start gap-3 p-5 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-xl border-2 border-primary/30 shadow-sm">
            <div className="absolute top-2 right-2">
              <div className="animate-pulse">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
            </div>
            <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <p className="text-sm font-semibold text-primary">Today's Writing Prompt:</p>
              <p className="text-base text-foreground leading-relaxed">{selectedPrompt}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPrompt(prompts[Math.floor(Math.random() * prompts.length)])}
              className="hover:bg-primary/10"
            >
              ✨ New
            </Button>
          </div>

          {/* Supportive resources banner - shown when concerning language detected */}
          {showSupportResources && (
            <Alert className="border-primary/50 bg-primary/5">
              <Heart className="h-4 w-4" />
              <AlertTitle>You're not alone 💜</AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="text-sm">
                  It sounds like you might be going through a really tough time. 
                  If you need support, reaching out can help.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="tel:988" className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Call 988 Lifeline
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="sms:741741" className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      Text HOME to 741741
                    </a>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="relative">
            <Textarea
              placeholder="Let your thoughts flow freely... Write whatever comes to mind. This is your safe space."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-[250px] resize-none text-base leading-relaxed border-2 focus:border-primary/50 transition-colors"
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {currentEntry.length} characters
            </div>
          </div>

          <Button onClick={saveEntry} className="w-full" size="lg">
            <Pen className="h-4 w-4 mr-2" />
            Save Entry
          </Button>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Past Entries
            </CardTitle>
            <CardDescription>Reflecting on your journey - {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {entries.map((entry, index) => (
              <div
                key={index}
                className="p-5 bg-gradient-to-br from-card to-muted/20 border-2 rounded-xl space-y-3 hover:border-primary/40 hover:shadow-md transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    📅 {formatDate(entry.date)}
                  </Badge>
                  {entry.prompt && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-xs text-muted-foreground italic max-w-xs truncate">
                        {entry.prompt}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pl-3 border-l-4 border-primary/30">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{entry.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {entries.length === 0 && (
        <Card className="bg-gradient-to-br from-muted/50 to-accent/10 border-dashed border-2">
          <CardContent className="pt-12 pb-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your Journal Awaits</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start writing your first entry above. This is your private space to express yourself freely.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
