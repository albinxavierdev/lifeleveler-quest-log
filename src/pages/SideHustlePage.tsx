
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QuestCard } from "@/components/ui/quest-card";
import { Plus, Briefcase, TrendingUp, DollarSign } from "lucide-react";
import { Quest } from "@/types";
import { toast } from "@/components/ui/use-toast";

const SideHustlePage = () => {
  const { quests, toggleQuestCompletion } = useAppContext();
  const [open, setOpen] = useState(false);
  const [questTitle, setQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [xpReward, setXpReward] = useState(10);
  const [goldReward, setGoldReward] = useState<number | undefined>(undefined);

  const sideHustleQuests = quests.filter(quest => quest.category === "side-hustle");
  
  // Group quests by week
  const weeklyQuests: Record<string, Quest[]> = {};
  
  sideHustleQuests.forEach(quest => {
    const createdDate = new Date(quest.createdAt);
    const weekStart = new Date(createdDate);
    weekStart.setDate(createdDate.getDate() - createdDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekKey = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
    
    if (!weeklyQuests[weekKey]) {
      weeklyQuests[weekKey] = [];
    }
    
    weeklyQuests[weekKey].push(quest);
  });
  
  // Sort weeks in descending order (most recent first)
  const sortedWeeks = Object.keys(weeklyQuests).sort((a, b) => {
    const dateA = new Date(a.split(" - ")[0]);
    const dateB = new Date(b.split(" - ")[0]);
    return dateB.getTime() - dateA.getTime();
  });

  const handleAddTask = () => {
    if (!questTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your side hustle task",
        variant: "destructive",
      });
      return;
    }
    
    const newQuest: Omit<Quest, "id"> = {
      title: questTitle,
      description: questDescription,
      xpReward,
      goldReward,
      completed: false,
      repeatable: false,
      category: "side-hustle",
      createdAt: new Date().toISOString(),
    };
    
    // Add to quests in localStorage
    const existingQuests = JSON.parse(localStorage.getItem("lifeleveler-quests") || "[]");
    const updatedQuests = [
      ...existingQuests,
      {
        ...newQuest,
        id: `quest-${Date.now()}`,
      },
    ];
    
    localStorage.setItem("lifeleveler-quests", JSON.stringify(updatedQuests));
    
    // Refresh quests from localStorage
    window.location.reload();
    
    // Reset form
    setQuestTitle("");
    setQuestDescription("");
    setXpReward(10);
    setGoldReward(undefined);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container px-4 py-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Side Hustle Tracker</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Side Hustle Task</DialogTitle>
                <DialogDescription>
                  Add a new side hustle task or milestone you've completed.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={questTitle}
                    onChange={e => setQuestTitle(e.target.value)}
                    placeholder="Sent freelance pitch"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={questDescription}
                    onChange={e => setQuestDescription(e.target.value)}
                    placeholder="Reached out to 3 potential clients"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="xp">XP Reward</Label>
                  <Input
                    id="xp"
                    type="number"
                    min="1"
                    value={xpReward}
                    onChange={e => setXpReward(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gold">Gold Reward (Optional)</Label>
                  <Input
                    id="gold"
                    type="number"
                    min="0"
                    value={goldReward || ""}
                    onChange={e => setGoldReward(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="1000"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" onClick={handleAddTask}>
                  Add Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {sortedWeeks.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
            <Briefcase className="mb-2 h-8 w-8" />
            <h3 className="mb-1 font-semibold">No side hustle tasks yet</h3>
            <p className="max-w-sm text-sm">
              Log your side hustle activities and track your progress over time.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {sortedWeeks.map(weekKey => {
              const weekQuests = weeklyQuests[weekKey];
              const completedQuests = weekQuests.filter(q => q.completed);
              
              const totalXP = completedQuests.reduce((sum, q) => sum + q.xpReward, 0);
              const totalGold = completedQuests.reduce((sum, q) => sum + (q.goldReward || 0), 0);
              
              return (
                <div key={weekKey} className="space-y-4">
                  <div className="flex flex-col items-start justify-between border-b pb-2 sm:flex-row sm:items-center">
                    <h2 className="text-xl font-semibold">{weekKey}</h2>
                    
                    <div className="mt-2 flex space-x-4 sm:mt-0">
                      <div className="flex items-center text-sm">
                        <TrendingUp className="mr-1 h-4 w-4 text-blue-500" />
                        <span className="font-medium">{totalXP}</span>
                        <span className="ml-1 text-muted-foreground">XP</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <DollarSign className="mr-1 h-4 w-4 text-amber-500" />
                        <span className="font-medium">{totalGold}</span>
                        <span className="ml-1 text-muted-foreground">Gold</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {weekQuests.map(quest => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        onToggle={toggleQuestCompletion}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default SideHustlePage;
