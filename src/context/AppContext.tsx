
import React, { createContext, useContext, useEffect, useState } from "react";
import { Quest, Mission, Reward, UserStats } from "@/types";
import {
  getUserStats,
  saveUserStats,
  getQuests,
  saveQuests,
  getMissions,
  saveMissions,
  getRewards,
  saveRewards,
  completeQuest,
  completeMilestone,
  purchaseReward,
  addXp,
  addGold,
  initializeDefaultData,
} from "@/lib/storage";

interface AppContextType {
  stats: UserStats;
  quests: Quest[];
  missions: Mission[];
  rewards: Reward[];
  isLoading: boolean;
  toggleQuestCompletion: (questId: string) => void;
  toggleMilestoneCompletion: (missionId: string, milestoneId: string) => void;
  purchaseRewardItem: (rewardId: string) => boolean;
  addMission: (mission: Omit<Mission, "id" | "createdAt" | "progress">) => void;
  resetDailyQuests: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    initializeDefaultData();
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    setStats(getUserStats());
    setQuests(getQuests());
    setMissions(getMissions());
    setRewards(getRewards());
    setIsLoading(false);
  };

  // Check for streak
  useEffect(() => {
    if (!stats) return;

    const today = new Date().toLocaleDateString();
    const lastActive = stats.lastActiveDate 
      ? new Date(stats.lastActiveDate).toLocaleDateString() 
      : null;

    if (lastActive !== today) {
      const updatedStats = { ...stats, lastActiveDate: new Date().toISOString() };
      
      // Check if last active was yesterday to maintain streak
      if (lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toLocaleDateString();
        
        if (lastActive !== yesterdayString) {
          // Reset streak if not consecutive days
          updatedStats.streak = 1;
        } else {
          // Increment streak for consecutive days
          updatedStats.streak += 1;
        }
      } else {
        // First time using the app
        updatedStats.streak = 1;
      }
      
      setStats(updatedStats);
      saveUserStats(updatedStats);
    }
  }, [stats]);

  // Quest completion
  const toggleQuestCompletion = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    if (quest.completed) {
      // Uncomplete the quest (remove rewards)
      const updatedQuests = quests.map(q => 
        q.id === questId ? { ...q, completed: false, completedAt: undefined } : q
      );
      setQuests(updatedQuests);
      saveQuests(updatedQuests);
      
      // Remove XP and gold rewards (if any)
      if (stats) {
        const updatedStats = { ...stats };
        updatedStats.xp = Math.max(0, updatedStats.xp - quest.xpReward);
        if (quest.goldReward) {
          updatedStats.gold = Math.max(0, updatedStats.gold - quest.goldReward);
        }
        setStats(updatedStats);
        saveUserStats(updatedStats);
      }
    } else {
      // Complete the quest
      const { quest: updatedQuest, stats: updatedStats } = completeQuest(questId);
      if (updatedQuest) {
        const updatedQuests = quests.map(q => 
          q.id === questId ? updatedQuest : q
        );
        setQuests(updatedQuests);
        setStats(updatedStats);
      }
    }
  };

  // Milestone completion
  const toggleMilestoneCompletion = (missionId: string, milestoneId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const milestone = mission.milestones.find(ms => ms.id === milestoneId);
    if (!milestone) return;

    if (milestone.completed) {
      // Uncomplete the milestone
      const updatedMilestones = mission.milestones.map(ms => 
        ms.id === milestoneId ? { ...ms, completed: false, completedAt: undefined } : ms
      );
      
      const completedMilestones = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.floor((completedMilestones / updatedMilestones.length) * 100);
      
      const updatedMission = { 
        ...mission, 
        milestones: updatedMilestones, 
        progress,
        completedAt: progress === 100 ? mission.completedAt : undefined
      };
      
      const updatedMissions = missions.map(m => 
        m.id === missionId ? updatedMission : m
      );
      
      setMissions(updatedMissions);
      saveMissions(updatedMissions);
      
      // Remove XP and gold rewards
      if (stats) {
        const updatedStats = { ...stats };
        updatedStats.xp = Math.max(0, updatedStats.xp - milestone.xpReward);
        if (milestone.goldReward) {
          updatedStats.gold = Math.max(0, updatedStats.gold - milestone.goldReward);
        }
        setStats(updatedStats);
        saveUserStats(updatedStats);
      }
    } else {
      // Complete the milestone
      const { mission: updatedMission, stats: updatedStats } = completeMilestone(missionId, milestoneId);
      if (updatedMission) {
        const updatedMissions = missions.map(m => 
          m.id === missionId ? updatedMission : m
        );
        setMissions(updatedMissions);
        setStats(updatedStats);
      }
    }
  };

  // Purchase reward
  const purchaseRewardItem = (rewardId: string): boolean => {
    const { reward, purchased, stats: updatedStats } = purchaseReward(rewardId);
    if (purchased && reward) {
      const updatedRewards = rewards.map(r => 
        r.id === rewardId ? reward : r
      );
      setRewards(updatedRewards);
      setStats(updatedStats);
      return true;
    }
    return false;
  };

  // Add new mission
  const addMission = (mission: Omit<Mission, "id" | "createdAt" | "progress">) => {
    const newMission: Mission = {
      ...mission,
      id: `mission-${Date.now()}`,
      createdAt: new Date().toISOString(),
      progress: 0,
    };
    
    const updatedMissions = [...missions, newMission];
    setMissions(updatedMissions);
    saveMissions(updatedMissions);
  };

  // Reset daily quests (typically called at midnight)
  const resetDailyQuests = () => {
    const updatedQuests = quests.map(quest => {
      if (quest.repeatable && quest.category === "daily") {
        return { ...quest, completed: false, completedAt: undefined };
      }
      return quest;
    });
    
    setQuests(updatedQuests);
    saveQuests(updatedQuests);
  };

  if (isLoading || !stats) {
    return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        stats,
        quests,
        missions,
        rewards,
        isLoading,
        toggleQuestCompletion,
        toggleMilestoneCompletion,
        purchaseRewardItem,
        addMission,
        resetDailyQuests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
