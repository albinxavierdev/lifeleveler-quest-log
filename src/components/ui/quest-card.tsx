
import * as React from "react";
import { Check, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Quest } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestCardProps {
  quest: Quest;
  onToggle: (id: string) => void;
  className?: string;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onToggle, className }) => {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", 
      quest.completed ? "border-green-500/50 bg-green-950/10" : "",
      className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={cn(quest.completed ? "text-muted-foreground line-through" : "")}>
              {quest.title}
            </CardTitle>
            {quest.description && (
              <CardDescription className="mt-1">{quest.description}</CardDescription>
            )}
          </div>
          <Checkbox 
            id={`quest-${quest.id}`}
            checked={quest.completed}
            onCheckedChange={() => onToggle(quest.id)}
            className="h-5 w-5 mt-1"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-sm">
          {quest.xpReward > 0 && (
            <div className="flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              +{quest.xpReward} XP
            </div>
          )}
          {quest.goldReward && quest.goldReward > 0 && (
            <div className="flex items-center rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500">
              +{quest.goldReward} Gold
            </div>
          )}
          {quest.category === "daily" && (
            <div className="flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
              Daily
            </div>
          )}
          {quest.category === "weekly" && (
            <div className="flex items-center rounded-full bg-purple-500/10 px-2 py-1 text-xs font-medium text-purple-500">
              Weekly
            </div>
          )}
          {quest.category === "side-hustle" && (
            <div className="flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-500">
              Side Hustle
            </div>
          )}
        </div>
      </CardContent>
      {quest.completed && (
        <CardFooter className="border-t bg-green-950/20 py-2 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Check className="h-3 w-3" />
            <span>Completed</span>
            {quest.completedAt && (
              <span>
                {" • "}
                {new Date(quest.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export { QuestCard };
