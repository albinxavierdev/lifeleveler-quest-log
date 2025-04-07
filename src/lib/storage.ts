
import { Quest, Mission, Reward, UserStats } from "@/types";

// Local Storage Keys
const STATS_KEY = "lifeleveler-stats";
const QUESTS_KEY = "lifeleveler-quests";
const MISSIONS_KEY = "lifeleveler-missions";
const REWARDS_KEY = "lifeleveler-rewards";

// Default user stats
export const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  gold: 0,
  streak: 0,
};

// Helper functions
const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// User Stats
export const getUserStats = (): UserStats => {
  return getItem<UserStats>(STATS_KEY, DEFAULT_STATS);
};

export const saveUserStats = (stats: UserStats): void => {
  setItem(STATS_KEY, stats);
};

// Experience & Leveling
export const calculateXpToNextLevel = (level: number): number => {
  // Simple exponential growth formula
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

export const addXp = (amount: number): UserStats => {
  const stats = getUserStats();
  stats.xp += amount;
  
  // Level up if needed
  while (stats.xp >= stats.xpToNextLevel) {
    stats.xp -= stats.xpToNextLevel;
    stats.level += 1;
    stats.xpToNextLevel = calculateXpToNextLevel(stats.level);
  }
  
  saveUserStats(stats);
  return stats;
};

export const addGold = (amount: number): UserStats => {
  const stats = getUserStats();
  stats.gold += amount;
  saveUserStats(stats);
  return stats;
};

// Quests
export const getQuests = (): Quest[] => {
  return getItem<Quest[]>(QUESTS_KEY, []);
};

export const saveQuests = (quests: Quest[]): void => {
  setItem(QUESTS_KEY, quests);
};

export const completeQuest = (questId: string): { quest: Quest | null, stats: UserStats } => {
  const quests = getQuests();
  const quest = quests.find(q => q.id === questId);
  
  if (!quest || quest.completed) {
    return { quest: null, stats: getUserStats() };
  }
  
  quest.completed = true;
  quest.completedAt = new Date().toISOString();
  saveQuests(quests);
  
  // Add rewards
  const stats = addXp(quest.xpReward);
  if (quest.goldReward) {
    addGold(quest.goldReward);
  }
  
  return { quest, stats };
};

// Missions
export const getMissions = (): Mission[] => {
  return getItem<Mission[]>(MISSIONS_KEY, []);
};

export const saveMissions = (missions: Mission[]): void => {
  setItem(MISSIONS_KEY, missions);
};

export const completeMilestone = (missionId: string, milestoneId: string): { mission: Mission | null, stats: UserStats } => {
  const missions = getMissions();
  const mission = missions.find(m => m.id === missionId);
  
  if (!mission) {
    return { mission: null, stats: getUserStats() };
  }
  
  const milestone = mission.milestones.find(ms => ms.id === milestoneId);
  
  if (!milestone || milestone.completed) {
    return { mission, stats: getUserStats() };
  }
  
  milestone.completed = true;
  milestone.completedAt = new Date().toISOString();
  
  // Update mission progress
  const completedMilestones = mission.milestones.filter(m => m.completed).length;
  mission.progress = Math.floor((completedMilestones / mission.milestones.length) * 100);
  
  if (mission.progress === 100) {
    mission.completedAt = new Date().toISOString();
  }
  
  saveMissions(missions);
  
  // Add rewards
  const stats = addXp(milestone.xpReward);
  if (milestone.goldReward) {
    addGold(milestone.goldReward);
  }
  
  return { mission, stats };
};

// Rewards
export const getRewards = (): Reward[] => {
  return getItem<Reward[]>(REWARDS_KEY, []);
};

export const saveRewards = (rewards: Reward[]): void => {
  setItem(REWARDS_KEY, rewards);
};

export const purchaseReward = (rewardId: string): { reward: Reward | null, purchased: boolean, stats: UserStats } => {
  const rewards = getRewards();
  const reward = rewards.find(r => r.id === rewardId);
  
  if (!reward || reward.purchased) {
    return { reward, purchased: false, stats: getUserStats() };
  }
  
  const stats = getUserStats();
  
  // Check if user has enough XP and gold
  if (stats.xp < reward.xpCost || (reward.goldCost && stats.gold < reward.goldCost)) {
    return { reward, purchased: false, stats };
  }
  
  // Deduct costs
  stats.xp -= reward.xpCost;
  if (reward.goldCost) {
    stats.gold -= reward.goldCost;
  }
  
  // Mark as purchased
  reward.purchased = true;
  reward.purchasedAt = new Date().toISOString();
  
  saveUserStats(stats);
  saveRewards(rewards);
  
  return { reward, purchased: true, stats };
};

// Initialize with Default Data
export const initializeDefaultData = (): void => {
  // Only initialize if no data exists
  if (localStorage.getItem(STATS_KEY) === null) {
    saveUserStats(DEFAULT_STATS);
  }
  
  if (localStorage.getItem(QUESTS_KEY) === null) {
    const defaultQuests: Quest[] = [
      {
        id: "quest-1",
        title: "Code for 45 mins",
        description: "Spend at least 45 minutes coding on a personal project",
        xpReward: 15,
        completed: false,
        repeatable: true,
        category: "daily",
        createdAt: new Date().toISOString(),
      },
      {
        id: "quest-2",
        title: "Study for 30 mins",
        description: "Dedicate 30 minutes to learning something new",
        xpReward: 10,
        completed: false,
        repeatable: true,
        category: "daily",
        createdAt: new Date().toISOString(),
      },
      {
        id: "quest-3",
        title: "No junk food",
        description: "Avoid eating junk food for the entire day",
        xpReward: 10,
        completed: false,
        repeatable: true,
        category: "daily",
        createdAt: new Date().toISOString(),
      },
      {
        id: "quest-4",
        title: "Sleep before 12:30AM",
        description: "Get to bed before 12:30AM",
        xpReward: 10,
        completed: false,
        repeatable: true,
        category: "daily",
        createdAt: new Date().toISOString(),
      },
    ];
    saveQuests(defaultQuests);
  }
  
  if (localStorage.getItem(REWARDS_KEY) === null) {
    const defaultRewards: Reward[] = [
      {
        id: "reward-1",
        title: "Order food",
        description: "Treat yourself to a nice meal delivery",
        xpCost: 100,
        purchased: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "reward-2",
        title: "Buy accessory",
        description: "Get yourself a small accessory",
        xpCost: 200,
        purchased: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "reward-3",
        title: "Buy a watch",
        description: "Reward yourself with a new watch",
        xpCost: 600,
        goldCost: 500,
        purchased: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: "reward-4",
        title: "Buy a bike",
        description: "Get that bike you've been wanting",
        xpCost: 1500,
        goldCost: 1000,
        purchased: false,
        createdAt: new Date().toISOString(),
      },
    ];
    saveRewards(defaultRewards);
  }
};
