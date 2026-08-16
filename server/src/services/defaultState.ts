import { GameState, Mission, Achievement } from '../types';

export const LEVEL_DEFINITIONS = [
  { level: 1, title: '🏡 Village', minXP: 0, minMoney: 0, minRecycled: 0 },
  { level: 2, title: '🏘️ Town', minXP: 300, minMoney: 8000, minRecycled: 150 },
  { level: 3, title: '🏙️ City', minXP: 1000, minMoney: 20000, minRecycled: 500 },
  { level: 4, title: '🌆 Smart City', minXP: 2500, minMoney: 45000, minRecycled: 1200 },
  { level: 5, title: '🌍 Green City', minXP: 6000, minMoney: 100000, minRecycled: 3000 },
];

export const PRODUCT_BASE_PRICES: Record<string, number> = {
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

export const UPGRADE_PRICES = {
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
    
    // Initial uncollected available waste in neighborhoods
    uncollectedWaste: {
      houses: { organic: 35, plastic: 25, paper: 20 },
      schools: { paper: 30, plastic: 20, organic: 15 },
      offices: { paper: 40, plastic: 15, ewaste: 10 },
      factories: { metal: 30, plastic: 25, ewaste: 15 },
      parks: { organic: 45, paper: 15 },
      construction: { construction: 50, metal: 20 },
    },

    // Player inventory
    collectedWaste: {
      organic: 0,
      plastic: 0,
      paper: 0,
      glass: 0,
      metal: 0,
      ewaste: 0,
      construction: 0,
    },

    // Waste arrived at recycling plants ready for conversion
    plantWaste: {
      organic: 0,
      plastic: 0,
      paper: 0,
      glass: 0,
      metal: 0,
      ewaste: 0,
      construction: 0,
    },

    // Finished goods
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
