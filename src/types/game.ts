export type WasteType = 
  | 'organic'
  | 'plastic'
  | 'paper'
  | 'glass'
  | 'metal'
  | 'ewaste'
  | 'construction';

export type ProductType = 
  | 'compost'
  | 'biogas'
  | 'plasticGranules'
  | 'cardboard'
  | 'glassBottles'
  | 'metalIngots'
  | 'recoveredMetals'
  | 'paverBlocks'
  | 'aggregates';

export type LocationId =
  | 'houses'
  | 'schools'
  | 'offices'
  | 'factories'
  | 'parks'
  | 'construction';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpgradesState {
  truckLevel: number;
  sorterLevel: number;
  recyclingLevel: number;
  storageLevel: number;
  solarPowerLevel: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  targetType: 'collect' | 'sort' | 'recycle' | 'sell' | 'greenScore';
  targetValue: number;
  currentValue: number;
  rewardMoney: number;
  rewardXP: number;
  rewardGreenScore: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'collect' | 'recycle' | 'greenScore' | 'money' | 'level';
  requirement: number;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  type: 'festival' | 'rain' | 'bonus' | 'breakdown' | 'high_demand';
  icon: string;
  multiplierWasteGen?: number;
  multiplierEfficiency?: number;
  multiplierRecycleBonus?: number;
  multiplierMarketPrice?: number;
  truckDisabled?: boolean;
  durationSeconds: number;
  startTime: number;
}

export interface GameState {
  userId: string;
  money: number;
  xp: number;
  level: number;
  levelTitle: string;
  greenScore: number;
  uncollectedWaste: Record<LocationId, Partial<Record<WasteType, number>>>;
  collectedWaste: Record<WasteType, number>;
  plantWaste: Record<WasteType, number>;
  products: Record<ProductType, number>;
  upgrades: UpgradesState;
  stats: {
    totalWasteCollected: number;
    totalWasteRecycled: number;
    totalProductsSold: number;
    totalProfit: number;
    totalCorrectSorts: number;
    totalWrongSorts: number;
    gameStartTime: string;
  };
  missions: Mission[];
  achievements: Achievement[];
  activeEvent: RandomEvent | null;
  lastDailyReset: string;
  hasCompletedTutorial: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  picture: string;
  greenScore: number;
  totalWasteRecycled: number;
  levelTitle: string;
  level: number;
  totalProfit: number;
}

export type ScreenTab =
  | 'home'
  | 'collect'
  | 'sort'
  | 'transport'
  | 'recycle'
  | 'market'
  | 'upgrade'
  | 'missions'
  | 'achievements'
  | 'greenscore'
  | 'learn'
  | 'leaderboard'
  | 'profile'
  | 'settings';
