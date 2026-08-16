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
  truckLevel: number; // 1: 100kg, 2: 250kg, 3: 500kg
  sorterLevel: number; // 1: Manual, 2: Improved, 3: Smart Sorter
  recyclingLevel: number; // 1: Basic, 2: Improved, 3: Advanced
  storageLevel: number; // 1: 500kg, 2: 1200kg, 3: 3000kg
  solarPowerLevel: number; // 0: None, 1: Basic Solar, 2: Solar Farm (Reduces costs, adds Green Score)
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
  level: number; // 1 to 5
  levelTitle: string; // Village, Town, City, Smart City, Green City
  greenScore: number; // 0 to 100
  
  // Storage Inventories
  uncollectedWaste: Record<LocationId, Partial<Record<WasteType, number>>>;
  collectedWaste: Record<WasteType, number>; // in player temporary warehouse
  plantWaste: Record<WasteType, number>; // in recycling plants ready to process
  products: Record<ProductType, number>; // finished goods ready to sell

  // Upgrades
  upgrades: UpgradesState;

  // Stats
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
