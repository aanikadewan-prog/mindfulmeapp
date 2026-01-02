import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Target, Plus, Trash2, Calendar, Sparkles, Trophy, 
  CheckCircle2, Circle, PartyPopper
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import confetti from "canvas-confetti";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  category: string;
  target_date: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

const categories = [
  { value: "health", label: "Health & Fitness", emoji: "💪" },
  { value: "career", label: "Career & Education", emoji: "📚" },
  { value: "finance", label: "Finance", emoji: "💰" },
  { value: "relationships", label: "Relationships", emoji: "❤️" },
  { value: "personal", label: "Personal Growth", emoji: "🌱" },
  { value: "hobbies", label: "Hobbies & Fun", emoji: "🎨" },
  { value: "general", label: "General", emoji: "⭐" },
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "general",
    target_date: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("completed", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setGoals(data);
    }
    setIsLoading(false);
  };

  const addGoal = async () => {
    if (!newGoal.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("goals").insert({
      user_id: user.id,
      title: newGoal.title.trim(),
      description: newGoal.description.trim() || null,
      category: newGoal.category,
      target_date: newGoal.target_date || null,
    });

    if (error) {
      toast({
        title: "Error adding goal",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Goal added! 🎯",
      description: "You're on your way to achieving great things",
    });

    setNewGoal({ title: "", description: "", category: "general", target_date: "" });
    setIsDialogOpen(false);
    loadGoals();
  };

  const toggleGoal = async (goal: Goal) => {
    const newCompleted = !goal.completed;
    
    const { error } = await supabase
      .from("goals")
      .update({ 
        completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", goal.id);

    if (error) {
      toast({
        title: "Error updating goal",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    if (newCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Goal completed! 🎉",
        description: "Amazing work! Keep it up!",
      });
    }

    loadGoals();
  };

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", goalId);

    if (error) {
      toast({
        title: "Error deleting goal",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Goal removed",
      description: "Goal has been deleted",
    });

    loadGoals();
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[6];
  };

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const completionRate = goals.length > 0 
    ? Math.round((completedGoals.length / goals.length) * 100) 
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Target className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Goals & Resolutions</h1>
            <p className="text-muted-foreground">Track your aspirations and celebrate progress</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Goal</DialogTitle>
              <DialogDescription>
                Set a goal or New Year's resolution to work towards
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Exercise 3 times a week"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details about your goal..."
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newGoal.category} 
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.emoji} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_date">Target Date (optional)</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addGoal}>
                <Sparkles className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeGoals.length}</p>
                <p className="text-xs text-muted-foreground">Active Goals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-secondary/20">
                <Trophy className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedGoals.length}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <PartyPopper className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completionRate}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Circle className="h-5 w-5 text-primary" />
            Active Goals
          </CardTitle>
          <CardDescription>
            {activeGoals.length === 0 
              ? "No active goals yet. Add one to get started!" 
              : `You have ${activeGoals.length} goal${activeGoals.length > 1 ? 's' : ''} to work on`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeGoals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">Set your first goal above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map(goal => {
                const catInfo = getCategoryInfo(goal.category);
                return (
                  <div
                    key={goal.id}
                    className="flex items-start gap-3 p-4 rounded-lg border hover:border-primary/30 transition-colors group"
                  >
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleGoal(goal)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{goal.title}</p>
                        <Badge variant="secondary" className="text-xs">
                          {catInfo.emoji} {catInfo.label}
                        </Badge>
                      </div>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                      {goal.target_date && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>Target: {formatDate(goal.target_date)}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card className="border-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-secondary" />
              Completed Goals
            </CardTitle>
            <CardDescription>
              Celebrate what you've achieved! 🎉
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map(goal => {
                const catInfo = getCategoryInfo(goal.category);
                return (
                  <div
                    key={goal.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-secondary/5 group"
                  >
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleGoal(goal)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium line-through text-muted-foreground">{goal.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {catInfo.emoji} {catInfo.label}
                        </Badge>
                      </div>
                      {goal.completed_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ✓ Completed {formatDate(goal.completed_at)}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}