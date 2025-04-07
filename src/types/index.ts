
export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  goldReward?: number;
  completed: boolean;
  repeatable: boolean;
  category: "daily" | "weekly" | "side-hustle";
  createdAt: string;
  completedAt?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  milestones: Milestone[];
  progress: number; // 0-100
  createdAt: string;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  xpReward: number;
  goldReward?: number;
  completed: boolean;
  completedAt?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  xpCost: number;
  goldCost?: number;
  purchased: boolean;
  purchasedAt?: string;
  createdAt: string; // Adding this missing property
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  streak: number;
  lastActiveDate?: string;
}
