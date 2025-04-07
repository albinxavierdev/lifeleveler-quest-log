
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { QuestCard } from "@/components/ui/quest-card";
import Header from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { XCircle } from "lucide-react";

const QuestsPage = () => {
  const { quests, toggleQuestCompletion } = useAppContext();

  const dailyQuests = quests.filter(quest => quest.category === "daily");
  const weeklyQuests = quests.filter(quest => quest.category === "weekly");
  const sideHustleQuests = quests.filter(quest => quest.category === "side-hustle");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container px-4 py-6 md:py-8">
        <h1 className="mb-6 text-2xl font-bold">Daily Quests</h1>
        
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="side-hustle">Side Hustle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Daily Quests</h2>
              <span className="text-sm text-muted-foreground">
                {dailyQuests.filter(q => q.completed).length}/{dailyQuests.length} completed
              </span>
            </div>
            
            {dailyQuests.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                <XCircle className="mb-2 h-6 w-6" />
                <p>No daily quests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dailyQuests.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onToggle={toggleQuestCompletion} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Weekly Quests</h2>
              <span className="text-sm text-muted-foreground">
                {weeklyQuests.filter(q => q.completed).length}/{weeklyQuests.length} completed
              </span>
            </div>
            
            {weeklyQuests.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                <XCircle className="mb-2 h-6 w-6" />
                <p>No weekly quests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {weeklyQuests.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onToggle={toggleQuestCompletion} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="side-hustle" className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Side Hustle Quests</h2>
              <span className="text-sm text-muted-foreground">
                {sideHustleQuests.filter(q => q.completed).length}/{sideHustleQuests.length} completed
              </span>
            </div>
            
            {sideHustleQuests.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
                <XCircle className="mb-2 h-6 w-6" />
                <p>No side hustle quests available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {sideHustleQuests.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onToggle={toggleQuestCompletion} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default QuestsPage;
