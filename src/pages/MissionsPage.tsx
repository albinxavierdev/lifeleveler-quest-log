
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Check, Plus, Target, Trash } from "lucide-react";
import { Mission, Milestone } from "@/types";
import { toast } from "@/components/ui/use-toast";

const MissionsPage = () => {
  const { missions, toggleMilestoneCompletion, addMission } = useAppContext();
  const [open, setOpen] = useState(false);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [milestones, setMilestones] = useState<Omit<Milestone, "completedAt">[]>([
    {
      id: `milestone-${Date.now()}`,
      title: "",
      xpReward: 10,
      completed: false,
    },
  ]);

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      {
        id: `milestone-${Date.now()}-${milestones.length}`,
        title: "",
        xpReward: 10,
        completed: false,
      },
    ]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "A mission needs at least one milestone",
        variant: "destructive",
      });
      return;
    }
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const handleMilestoneChange = (id: string, field: keyof Milestone, value: any) => {
    setMilestones(
      milestones.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!missionTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your mission",
        variant: "destructive",
      });
      return;
    }
    
    if (milestones.some(m => !m.title.trim())) {
      toast({
        title: "Missing milestone title",
        description: "Please provide a title for all milestones",
        variant: "destructive",
      });
      return;
    }
    
    addMission({
      title: missionTitle,
      description: missionDescription,
      milestones,
    });
    
    toast({
      title: "Mission created",
      description: "Your new mission has been created successfully",
    });
    
    // Reset form
    setMissionTitle("");
    setMissionDescription("");
    setMilestones([
      {
        id: `milestone-${Date.now()}`,
        title: "",
        xpReward: 10,
        completed: false,
      },
    ]);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container px-4 py-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Main Missions</h1>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1 h-4 w-4" />
                New Mission
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Mission</DialogTitle>
                  <DialogDescription>
                    Missions are long-term projects with multiple milestones.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Mission Title</Label>
                    <Input
                      id="title"
                      value={missionTitle}
                      onChange={e => setMissionTitle(e.target.value)}
                      placeholder="Learn a new programming language"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={missionDescription}
                      onChange={e => setMissionDescription(e.target.value)}
                      placeholder="Master the basics of Rust programming"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Milestones</Label>
                      <Button type="button" size="sm" variant="outline" onClick={handleAddMilestone}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add
                      </Button>
                    </div>
                    
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="space-y-2 rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Milestone {index + 1}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveMilestone(milestone.id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`milestone-${milestone.id}-title`}>Title</Label>
                          <Input
                            id={`milestone-${milestone.id}-title`}
                            value={milestone.title}
                            onChange={e => handleMilestoneChange(milestone.id, "title", e.target.value)}
                            placeholder="Complete first tutorial"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`milestone-${milestone.id}-xp`}>XP Reward</Label>
                          <Input
                            id={`milestone-${milestone.id}-xp`}
                            type="number"
                            min="1"
                            value={milestone.xpReward}
                            onChange={e => handleMilestoneChange(milestone.id, "xpReward", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`milestone-${milestone.id}-gold`}>Gold Reward (Optional)</Label>
                          <Input
                            id={`milestone-${milestone.id}-gold`}
                            type="number"
                            min="0"
                            value={milestone.goldReward || ""}
                            onChange={e => handleMilestoneChange(milestone.id, "goldReward", parseInt(e.target.value) || undefined)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit">Create Mission</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {missions.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
            <Target className="mb-2 h-8 w-8" />
            <h3 className="mb-1 font-semibold">No missions yet</h3>
            <p className="max-w-sm text-sm">
              Create your first mission to start tracking your long-term goals and projects.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {missions.map(mission => (
              <MissionCard 
                key={mission.id} 
                mission={mission} 
                onMilestoneToggle={toggleMilestoneCompletion} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

interface MissionCardProps {
  mission: Mission;
  onMilestoneToggle: (missionId: string, milestoneId: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onMilestoneToggle }) => {
  const completedMilestones = mission.milestones.filter(m => m.completed).length;
  
  return (
    <Card className={mission.progress === 100 ? "border-green-500/30 bg-green-950/10" : ""}>
      <CardHeader>
        <CardTitle>{mission.title}</CardTitle>
        {mission.description && (
          <CardDescription>{mission.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{completedMilestones}/{mission.milestones.length} milestones</span>
          </div>
          <ProgressBar 
            value={mission.progress} 
            max={100} 
            barClassName={
              mission.progress === 100 
                ? "bg-green-500" 
                : mission.progress > 50 
                  ? "bg-blue-500" 
                  : undefined
            }
          />
        </div>
        
        <div className="space-y-2">
          <span className="text-sm font-medium">Milestones</span>
          <div className="space-y-2">
            {mission.milestones.map(milestone => (
              <div 
                key={milestone.id} 
                className={`flex items-start space-x-2 rounded border p-3 ${
                  milestone.completed ? "border-green-500/30 bg-green-950/10" : ""
                }`}
              >
                <Checkbox 
                  id={`milestone-${milestone.id}`} 
                  checked={milestone.completed} 
                  onCheckedChange={() => onMilestoneToggle(mission.id, milestone.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`milestone-${milestone.id}`} 
                    className={`text-sm font-medium ${
                      milestone.completed ? "text-muted-foreground line-through" : ""
                    }`}
                  >
                    {milestone.title}
                  </label>
                  
                  <div className="mt-1 flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      +{milestone.xpReward} XP
                    </span>
                    {milestone.goldReward && (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                        +{milestone.goldReward} Gold
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      
      {mission.progress === 100 && (
        <CardFooter className="border-t bg-green-950/10 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Check className="mr-1 h-4 w-4 text-green-500" />
            <span>Mission Complete!</span>
            {mission.completedAt && (
              <span className="ml-1">
                • Completed on {new Date(mission.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default MissionsPage;
