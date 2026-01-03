import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, AlertTriangle, CheckCircle2, Plus, Trash2, ChevronRight, Lightbulb, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ActivityCompletion from "@/components/ActivityCompletion";

const COGNITIVE_DISTORTIONS = [
  { id: "all-or-nothing", label: "All-or-Nothing Thinking", description: "Seeing things in black and white" },
  { id: "overgeneralizing", label: "Overgeneralizing", description: "Drawing broad conclusions from single events" },
  { id: "catastrophizing", label: "Catastrophizing", description: "Expecting the worst possible outcome" },
  { id: "mind-reading", label: "Mind Reading", description: "Assuming you know what others think" },
  { id: "fortune-telling", label: "Fortune Telling", description: "Predicting negative outcomes" },
  { id: "emotional-reasoning", label: "Emotional Reasoning", description: "Feeling it's true, so it must be" },
  { id: "should-statements", label: "Should Statements", description: "Rigid rules about how things should be" },
  { id: "labeling", label: "Labeling", description: "Attaching negative labels to yourself or others" },
  { id: "personalization", label: "Personalization", description: "Blaming yourself for things outside your control" },
  { id: "mental-filter", label: "Mental Filter", description: "Focusing only on negative details" },
];

const EMOTIONS = [
  "Anxious", "Sad", "Angry", "Frustrated", "Overwhelmed", 
  "Scared", "Guilty", "Ashamed", "Hopeless", "Lonely"
];

interface ThoughtRecord {
  id: string;
  situation: string;
  automatic_thought: string;
  emotions: string[];
  emotion_intensity: number;
  cognitive_distortion: string | null;
  evidence_for: string | null;
  evidence_against: string | null;
  balanced_thought: string | null;
  new_emotion_intensity: number | null;
  created_at: string;
}

interface WorryLog {
  id: string;
  worry: string;
  intensity: number;
  category: string;
  action_steps: string[];
  outcome: string | null;
  resolved: boolean;
  created_at: string;
}

export default function CBTTools() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("thought-record");
  
  // Thought Record State
  const [situation, setSituation] = useState("");
  const [automaticThought, setAutomaticThought] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [emotionIntensity, setEmotionIntensity] = useState([50]);
  const [selectedDistortion, setSelectedDistortion] = useState<string | null>(null);
  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");
  const [balancedThought, setBalancedThought] = useState("");
  const [newEmotionIntensity, setNewEmotionIntensity] = useState([50]);
  const [thoughtStep, setThoughtStep] = useState(1);
  const [thoughtRecords, setThoughtRecords] = useState<ThoughtRecord[]>([]);
  
  // Worry Log State
  const [worryText, setWorryText] = useState("");
  const [worryIntensity, setWorryIntensity] = useState([5]);
  const [worryCategory, setWorryCategory] = useState("general");
  const [actionSteps, setActionSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState("");
  const [worryLogs, setWorryLogs] = useState<WorryLog[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [thoughtsRes, worriesRes] = await Promise.all([
      supabase
        .from("thought_records")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("worry_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (thoughtsRes.data) setThoughtRecords(thoughtsRes.data);
    if (worriesRes.data) setWorryLogs(worriesRes.data);
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const addActionStep = () => {
    if (newStep.trim()) {
      setActionSteps(prev => [...prev, newStep.trim()]);
      setNewStep("");
    }
  };

  const removeActionStep = (index: number) => {
    setActionSteps(prev => prev.filter((_, i) => i !== index));
  };

  const saveThoughtRecord = async () => {
    if (!situation || !automaticThought || selectedEmotions.length === 0) {
      toast({
        title: "Please fill in required fields",
        description: "Situation, thought, and at least one emotion are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("thought_records").insert({
        user_id: user.id,
        situation,
        automatic_thought: automaticThought,
        emotions: selectedEmotions,
        emotion_intensity: emotionIntensity[0],
        cognitive_distortion: selectedDistortion,
        evidence_for: evidenceFor || null,
        evidence_against: evidenceAgainst || null,
        balanced_thought: balancedThought || null,
        new_emotion_intensity: balancedThought ? newEmotionIntensity[0] : null,
      });

      if (error) throw error;

      toast({
        title: "Thought record saved! 🧠",
        description: "Great work on challenging your thoughts",
      });

      // Reset form
      setSituation("");
      setAutomaticThought("");
      setSelectedEmotions([]);
      setEmotionIntensity([50]);
      setSelectedDistortion(null);
      setEvidenceFor("");
      setEvidenceAgainst("");
      setBalancedThought("");
      setNewEmotionIntensity([50]);
      setThoughtStep(1);
      setShowCompletion(true);
      loadData();
    } catch (error) {
      console.error("Error saving thought record:", error);
      toast({
        title: "Error",
        description: "Failed to save thought record",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorryLog = async () => {
    if (!worryText.trim()) {
      toast({
        title: "Please enter your worry",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("worry_logs").insert({
        user_id: user.id,
        worry: worryText,
        intensity: worryIntensity[0],
        category: worryCategory,
        action_steps: actionSteps,
      });

      if (error) throw error;

      toast({
        title: "Worry logged! 📝",
        description: "Breaking it down into steps helps",
      });

      setWorryText("");
      setWorryIntensity([5]);
      setWorryCategory("general");
      setActionSteps([]);
      setShowCompletion(true);
      loadData();
    } catch (error) {
      console.error("Error saving worry log:", error);
      toast({
        title: "Error",
        description: "Failed to save worry log",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resolveWorry = async (id: string) => {
    try {
      await supabase.from("worry_logs").update({ resolved: true }).eq("id", id);
      toast({ title: "Worry resolved! 🎉" });
      loadData();
    } catch (error) {
      console.error("Error resolving worry:", error);
    }
  };

  const deleteWorry = async (id: string) => {
    try {
      await supabase.from("worry_logs").delete().eq("id", id);
      toast({ title: "Worry removed" });
      loadData();
    } catch (error) {
      console.error("Error deleting worry:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" onClick={() => navigate("/activities")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Activities
      </Button>

      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Cognitive Therapy Tools</h1>
        <p className="text-muted-foreground">
          Evidence-based techniques to challenge unhelpful thoughts and manage anxiety
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="thought-record">Thought Record</TabsTrigger>
          <TabsTrigger value="worry-ladder">Worry Ladder</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="thought-record" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Thought Challenging</CardTitle>
                  <CardDescription>Step {thoughtStep} of 5 - Reframe unhelpful thoughts</CardDescription>
                </div>
                <Progress value={(thoughtStep / 5) * 100} className="w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {thoughtStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">What happened? (Situation)</label>
                    <Textarea
                      placeholder="Describe the situation that triggered your thoughts..."
                      value={situation}
                      onChange={(e) => setSituation(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">What went through your mind? (Automatic Thought)</label>
                    <Textarea
                      placeholder="What thoughts popped into your head?"
                      value={automaticThought}
                      onChange={(e) => setAutomaticThought(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {thoughtStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">How did you feel? (Select emotions)</label>
                    <div className="flex flex-wrap gap-2">
                      {EMOTIONS.map((emotion) => (
                        <Badge
                          key={emotion}
                          variant={selectedEmotions.includes(emotion) ? "default" : "outline"}
                          className="cursor-pointer px-3 py-1.5"
                          onClick={() => toggleEmotion(emotion)}
                        >
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Emotion Intensity: {emotionIntensity[0]}%
                    </label>
                    <Slider
                      value={emotionIntensity}
                      onValueChange={setEmotionIntensity}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Mild</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </div>
              )}

              {thoughtStep === 3 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium mb-3 block">
                    <Lightbulb className="inline h-4 w-4 mr-1" />
                    Can you spot a thinking trap? (Cognitive Distortion)
                  </label>
                  <div className="grid gap-2">
                    {COGNITIVE_DISTORTIONS.map((distortion) => (
                      <div
                        key={distortion.id}
                        onClick={() => setSelectedDistortion(distortion.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedDistortion === distortion.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium">{distortion.label}</div>
                        <div className="text-sm text-muted-foreground">{distortion.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {thoughtStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Evidence FOR this thought
                    </label>
                    <Textarea
                      placeholder="What facts support this thought being true?"
                      value={evidenceFor}
                      onChange={(e) => setEvidenceFor(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Evidence AGAINST this thought
                    </label>
                    <Textarea
                      placeholder="What facts suggest this thought might not be entirely true?"
                      value={evidenceAgainst}
                      onChange={(e) => setEvidenceAgainst(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              )}

              {thoughtStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      <RefreshCw className="inline h-4 w-4 mr-1" />
                      Balanced Thought
                    </label>
                    <Textarea
                      placeholder="Write a more balanced, realistic way of looking at this situation..."
                      value={balancedThought}
                      onChange={(e) => setBalancedThought(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      New Emotion Intensity: {newEmotionIntensity[0]}%
                    </label>
                    <Slider
                      value={newEmotionIntensity}
                      onValueChange={setNewEmotionIntensity}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    {emotionIntensity[0] > newEmotionIntensity[0] && (
                      <p className="text-sm text-green-600 mt-2">
                        🎉 Your distress reduced by {emotionIntensity[0] - newEmotionIntensity[0]}%!
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setThoughtStep(Math.max(1, thoughtStep - 1))}
                  disabled={thoughtStep === 1}
                >
                  Back
                </Button>
                {thoughtStep < 5 ? (
                  <Button onClick={() => setThoughtStep(thoughtStep + 1)}>
                    Continue <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={saveThoughtRecord} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Record"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="worry-ladder" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Worry Ladder
              </CardTitle>
              <CardDescription>
                Break down big worries into small, actionable steps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">What's worrying you?</label>
                <Textarea
                  placeholder="Write out your worry..."
                  value={worryText}
                  onChange={(e) => setWorryText(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Intensity: {worryIntensity[0]}/10
                </label>
                <Slider
                  value={worryIntensity}
                  onValueChange={setWorryIntensity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {["general", "work", "health", "relationships", "money", "future"].map((cat) => (
                    <Badge
                      key={cat}
                      variant={worryCategory === cat ? "default" : "outline"}
                      className="cursor-pointer capitalize"
                      onClick={() => setWorryCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Break it into small steps (Worry Ladder)
                </label>
                <div className="space-y-2 mb-3">
                  {actionSteps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                      <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                      <span className="flex-1 text-sm">{step}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeActionStep(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a small, manageable step..."
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addActionStep()}
                  />
                  <Button variant="outline" onClick={addActionStep}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={saveWorryLog} 
                disabled={isLoading || !worryText.trim()}
                className="w-full"
              >
                {isLoading ? "Saving..." : "Save Worry Log"}
              </Button>
            </CardContent>
          </Card>

          {worryLogs.filter(w => !w.resolved).length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Active Worries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {worryLogs.filter(w => !w.resolved).map((log) => (
                    <div key={log.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{log.worry}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">{log.category}</Badge>
                            <span className="text-xs text-muted-foreground">Intensity: {log.intensity}/10</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => resolveWorry(log.id)}>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteWorry(log.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {log.action_steps && log.action_steps.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">Steps:</span>
                          <ol className="list-decimal list-inside ml-2">
                            {log.action_steps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Thought Records</CardTitle>
            </CardHeader>
            <CardContent>
              {thoughtRecords.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No thought records yet. Start by challenging a thought!
                </p>
              ) : (
                <div className="space-y-4">
                  {thoughtRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                        {record.emotion_intensity > (record.new_emotion_intensity || record.emotion_intensity) && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                            Improved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-1">Situation: {record.situation}</p>
                      <p className="text-sm text-muted-foreground mb-2">Thought: {record.automatic_thought}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {record.emotions.map((e) => (
                          <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                      {record.balanced_thought && (
                        <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
                          <span className="font-medium">Balanced thought:</span> {record.balanced_thought}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showCompletion && (
        <ActivityCompletion activityName="CBT Exercise" />
      )}
    </div>
  );
}