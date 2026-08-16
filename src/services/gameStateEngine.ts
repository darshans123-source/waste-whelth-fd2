import { GameState, Mission, Achievement, WasteType, ProductType, LocationId, LeaderboardEntry } from '../types/game';

export const LEVEL_DEFINITIONS = [
  { level: 1, title: '🏡 Village', minXP: 0, minMoney: 0, minRecycled: 0 },
  { level: 2, title: '🏘️ Town', minXP: 300, minMoney: 8000, minRecycled: 150 },
  { level: 3, title: '🏙️ City', minXP: 1000, minMoney: 20000, minRecycled: 500 },
  { level: 4, title: '🌆 Smart City', minXP: 2500, minMoney: 45000, minRecycled: 1200 },
  { level: 5, title: '🌍 Green City', minXP: 6000, minMoney: 100000, minRecycled: 3000 },
];

export const PRODUCT_BASE_PRICES: Record<ProductType, number> = {
  compost: 500,
  biogas: 700,
  plasticGranules: 800,
  cardboard: 600,
  glassBottles: 650,
  metalIngots: 1000,
  recoveredMetals: 1200,
  paverBlocks: 900,
  aggregates: 750,
};

export const UPGRADE_PRICES: Record<string, Record<number, any>> = {
  truck: {
    2: { cost: 3000, name: 'Medium Truck', capacity: 250 },
    3: { cost: 8000, name: 'Large Truck', capacity: 500 },
  },
  sorter: {
    2: { cost: 2500, name: 'Improved Sorter', bonusMultiplier: 1.25 },
    3: { cost: 7000, name: 'Smart AI Sorter', bonusMultiplier: 1.6 },
  },
  recycling: {
    2: { cost: 4000, name: 'Improved Industrial Plant', yieldRate: 0.85 },
    3: { cost: 12000, name: 'Advanced High-Tech Facility', yieldRate: 0.95 },
  },
  storage: {
    2: { cost: 2000, name: 'Medium Warehouse', capacity: 1200 },
    3: { cost: 5000, name: 'Industrial Hub Storage', capacity: 3000 },
  },
  solarPower: {
    1: { cost: 3500, name: 'Solar Rooftop Array', costDiscount: 0.3, greenScoreBonus: 10 },
    2: { cost: 9000, name: 'Utility-Scale Solar Farm', costDiscount: 0.6, greenScoreBonus: 25 },
  },
};

export const STORAGE_LIMITS_BY_LEVEL: Record<number, number> = {
  1: 500,
  2: 1200,
  3: 3000,
};

export const TRUCK_CAPACITY_BY_LEVEL: Record<number, number> = {
  1: 100,
  2: 250,
  3: 500,
};

export function getDefaultMissions(): Mission[] {
  return [
    {
      id: 'm_collect_100',
      title: 'Waste Gatherer',
      description: 'Collect 100 kg waste from surrounding locations',
      targetType: 'collect',
      targetValue: 100,
      currentValue: 0,
      rewardMoney: 1000,
      rewardXP: 50,
      rewardGreenScore: 5,
      completed: false,
      claimed: false,
    },
    {
      id: 'm_sort_20',
      title: 'Precision Sorter',
      description: 'Sort 20 waste items correctly in the mini-game',
      targetType: 'sort',
      targetValue: 20,
      currentValue: 0,
      rewardMoney: 800,
      rewardXP: 40,
      rewardGreenScore: 5,
      completed: false,
      claimed: false,
    },
    {
      id: 'm_recycle_50',
      title: 'Circular Pioneer',
      description: 'Recycle 50 kg of waste into finished goods',
      targetType: 'recycle',
      targetValue: 50,
      currentValue: 0,
      rewardMoney: 1500,
      rewardXP: 60,
      rewardGreenScore: 8,
      completed: false,
      claimed: false,
    },
    {
      id: 'm_sell_10',
      title: 'Eco Merchant',
      description: 'Sell 10 recycled products at the marketplace',
      targetType: 'sell',
      targetValue: 10,
      currentValue: 0,
      rewardMoney: 1200,
      rewardXP: 50,
      rewardGreenScore: 5,
      completed: false,
      claimed: false,
    },
    {
      id: 'm_greenscore_50',
      title: 'Sustainability Milestone',
      description: 'Reach a Green Score of 50 or higher',
      targetType: 'greenScore',
      targetValue: 50,
      currentValue: 0,
      rewardMoney: 2000,
      rewardXP: 100,
      rewardGreenScore: 10,
      completed: false,
      claimed: false,
    },
  ];
}

export function getDefaultAchievements(): Achievement[] {
  return [
    {
      id: 'ach_waste_warrior',
      title: '🏆 Waste Warrior',
      description: 'Collect 1,000 kg total waste from the community',
      icon: '🗑️',
      unlocked: false,
      category: 'collect',
      requirement: 1000,
    },
    {
      id: 'ach_master_recycler',
      title: '♻️ Master Recycler',
      description: 'Recycle 500 kg of materials in processing plants',
      icon: '🏭',
      unlocked: false,
      category: 'recycle',
      requirement: 500,
    },
    {
      id: 'ach_green_champion',
      title: '🌱 Green Champion',
      description: 'Achieve a stellar Green Score of 80 / 100',
      icon: '🌟',
      unlocked: false,
      category: 'greenScore',
      requirement: 80,
    },
    {
      id: 'ach_waste_tycoon',
      title: '💰 Waste Tycoon',
      description: 'Earn a total of ₹50,000 from product sales & operations',
      icon: '💎',
      unlocked: false,
      category: 'money',
      requirement: 50000,
    },
    {
      id: 'ach_circular_builder',
      title: '🏙️ Circular City Builder',
      description: 'Upgrade your settlement to Level 3 (City)',
      icon: '🌆',
      unlocked: false,
      category: 'level',
      requirement: 3,
    },
    {
      id: 'ach_green_future',
      title: '🌍 Green Future',
      description: 'Reach the pinnacle of sustainability: Level 5 (Green City)',
      icon: '🌿',
      unlocked: false,
      category: 'level',
      requirement: 5,
    },
  ];
}

export function createInitialGameState(userId: string): GameState {
  return {
    userId,
    money: 5000,
    xp: 0,
    level: 1,
    levelTitle: '🏡 Village',
    greenScore: 0,
    uncollectedWaste: {
      houses: { organic: 35, plastic: 25, paper: 20 },
      schools: { paper: 30, plastic: 20, organic: 15 },
      offices: { paper: 40, plastic: 15, ewaste: 10 },
      factories: { metal: 30, plastic: 25, ewaste: 15 },
      parks: { organic: 45, paper: 15 },
      construction: { construction: 50, metal: 20 },
    },
    collectedWaste: {
      organic: 0,
      plastic: 0,
      paper: 0,
      glass: 0,
      metal: 0,
      ewaste: 0,
      construction: 0,
    },
    plantWaste: {
      organic: 0,
      plastic: 0,
      paper: 0,
      glass: 0,
      metal: 0,
      ewaste: 0,
      construction: 0,
    },
    products: {
      compost: 0,
      biogas: 0,
      plasticGranules: 0,
      cardboard: 0,
      glassBottles: 0,
      metalIngots: 0,
      recoveredMetals: 0,
      paverBlocks: 0,
      aggregates: 0,
    },
    upgrades: {
      truckLevel: 1,
      sorterLevel: 1,
      recyclingLevel: 1,
      storageLevel: 1,
      solarPowerLevel: 0,
    },
    stats: {
      totalWasteCollected: 0,
      totalWasteRecycled: 0,
      totalProductsSold: 0,
      totalProfit: 0,
      totalCorrectSorts: 0,
      totalWrongSorts: 0,
      gameStartTime: new Date().toISOString(),
    },
    missions: getDefaultMissions(),
    achievements: getDefaultAchievements(),
    activeEvent: null,
    lastDailyReset: new Date().toISOString(),
    hasCompletedTutorial: false,
  };
}

export function calculateGreenScore(state: GameState): number {
  const recycled = state.stats.totalWasteRecycled;
  const collected = state.stats.totalWasteCollected || 1;
  const recycleRatio = Math.min(1, recycled / Math.max(recycled, collected));
  const recycleScore = recycleRatio * 50;

  const solarBonus = (state.upgrades.solarPowerLevel || 0) * 15;
  const productsSold = Math.min(20, state.stats.totalProductsSold * 2);

  const total = Math.min(100, Math.round(recycleScore + solarBonus + productsSold));
  return total;
}

export function checkLevelUp(state: GameState): void {
  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    const def = LEVEL_DEFINITIONS[i];
    if (state.xp >= def.minXP && state.stats.totalProfit >= def.minMoney && state.stats.totalWasteRecycled >= def.minRecycled) {
      if (state.level < def.level) {
        state.level = def.level;
        state.levelTitle = def.title;
      }
      break;
    }
  }
}

export function checkAchievements(state: GameState): void {
  state.achievements.forEach((ach) => {
    if (ach.unlocked) return;
    if (ach.category === 'collect' && state.stats.totalWasteCollected >= ach.requirement) {
      ach.unlocked = true;
    } else if (ach.category === 'recycle' && state.stats.totalWasteRecycled >= ach.requirement) {
      ach.unlocked = true;
    } else if (ach.category === 'greenScore' && state.greenScore >= ach.requirement) {
      ach.unlocked = true;
    } else if (ach.category === 'money' && state.stats.totalProfit >= ach.requirement) {
      ach.unlocked = true;
    } else if (ach.category === 'level' && state.level >= ach.requirement) {
      ach.unlocked = true;
    }
  });
}

export function saveLocalGameState(state: GameState): void {
  try {
    localStorage.setItem(`w2w_game_state_${state.userId}`, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save local game state:', err);
  }
}

export function loadLocalGameState(userId: string): GameState {
  try {
    const raw = localStorage.getItem(`w2w_game_state_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to load local game state:', err);
  }
  const newState = createInitialGameState(userId);
  saveLocalGameState(newState);
  return newState;
}

export const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  {
    userId: 'bot_1',
    name: 'Aarav Sharma (EcoChampion)',
    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 94,
    totalWasteRecycled: 4200,
    levelTitle: '🌍 Green City',
    level: 5,
    totalProfit: 125000,
  },
  {
    userId: 'bot_2',
    name: 'Priya Patel (BioEnergy)',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 88,
    totalWasteRecycled: 2850,
    levelTitle: '🌆 Smart City',
    level: 4,
    totalProfit: 78000,
  },
  {
    userId: 'bot_3',
    name: 'Vikram Mehta (ZeroWaste)',
    picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 76,
    totalWasteRecycled: 1650,
    levelTitle: '🏙️ City',
    level: 3,
    totalProfit: 42000,
  },
  {
    userId: 'bot_4',
    name: 'Ananya Roy (CircularLife)',
    picture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 62,
    totalWasteRecycled: 850,
    levelTitle: '🏘️ Town',
    level: 2,
    totalProfit: 19500,
  },
  {
    userId: 'bot_5',
    name: 'Rohan Gupta (CleanEarth)',
    picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    greenScore: 45,
    totalWasteRecycled: 420,
    levelTitle: '🏘️ Town',
    level: 2,
    totalProfit: 11000,
  },
];
