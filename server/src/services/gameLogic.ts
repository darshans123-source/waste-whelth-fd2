import { GameState, WasteType, ProductType, LocationId, RandomEvent } from '../types';
import {
  LEVEL_DEFINITIONS,
  PRODUCT_BASE_PRICES,
  UPGRADE_PRICES,
  STORAGE_LIMITS_BY_LEVEL,
  TRUCK_CAPACITY_BY_LEVEL,
} from './defaultState';

const RANDOM_EVENT_TEMPLATES = [
  {
    title: '🎉 Festival Season',
    description: 'City celebrations generate 50% more recyclable waste!',
    type: 'festival' as const,
    icon: '🎊',
    multiplierWasteGen: 1.5,
    durationSeconds: 120,
  },
  {
    title: '🌧️ Monsoon Downpour',
    description: 'Heavy rains slow down street collection and logistics by 20%.',
    type: 'rain' as const,
    icon: '🌧️',
    multiplierEfficiency: 0.8,
    durationSeconds: 90,
  },
  {
    title: '♻️ Circular Bonus Initiative',
    description: 'Government subsidies grant +30% XP and yield on all recycling!',
    type: 'bonus' as const,
    icon: '⭐',
    multiplierRecycleBonus: 1.3,
    durationSeconds: 120,
  },
  {
    title: '📈 Global Market Surge',
    description: 'High industrial demand increases finished product selling prices by 40%!',
    type: 'high_demand' as const,
    icon: '🚀',
    multiplierMarketPrice: 1.4,
    durationSeconds: 120,
  },
];

export class GameLogic {
  /**
   * Recalculates Green Score (0-100), Level tier, mission progresses and achievements
   */
  public static refreshGameState(state: GameState): GameState {
    this.checkAndReplenishLocations(state);
    this.checkEventExpiry(state);
    this.updateGreenScore(state);
    this.checkLevelProgress(state);
    this.checkAchievements(state);
    return state;
  }

  public static checkAndReplenishLocations(state: GameState): void {
    const locs: LocationId[] = ['houses', 'schools', 'offices', 'factories', 'parks', 'construction'];
    
    locs.forEach((loc) => {
      if (!state.uncollectedWaste[loc]) {
        state.uncollectedWaste[loc] = {};
      }
    });

    const defaultGen: Record<LocationId, Partial<Record<WasteType, number>>> = {
      houses: { organic: 30, plastic: 20, paper: 15 },
      schools: { paper: 25, plastic: 15, organic: 10 },
      offices: { paper: 35, plastic: 15, ewaste: 10 },
      factories: { metal: 25, plastic: 20, ewaste: 15 },
      parks: { organic: 40, paper: 10 },
      construction: { construction: 45, metal: 15 },
    };

    // If a location has depleted waste, replenish baseline
    locs.forEach((loc) => {
      const defs = defaultGen[loc];
      Object.entries(defs).forEach(([type, minQty]) => {
        const wt = type as WasteType;
        const current = state.uncollectedWaste[loc][wt] || 0;
        if (current < (minQty || 10)) {
          state.uncollectedWaste[loc][wt] = (current + (minQty || 15));
        }
      });
    });
  }

  public static checkEventExpiry(state: GameState): void {
    if (state.activeEvent) {
      const now = Date.now();
      const elapsed = (now - state.activeEvent.startTime) / 1000;
      if (elapsed > state.activeEvent.durationSeconds) {
        state.activeEvent = null;
      }
    }
  }

  public static triggerRandomEvent(state: GameState): RandomEvent | null {
    if (state.activeEvent) return state.activeEvent;
    
    // Pick random template
    const template = RANDOM_EVENT_TEMPLATES[Math.floor(Math.random() * RANDOM_EVENT_TEMPLATES.length)];
    const event: RandomEvent = {
      id: `evt_${Date.now()}`,
      ...template,
      startTime: Date.now(),
    };
    state.activeEvent = event;
    return event;
  }

  public static updateGreenScore(state: GameState): void {
    // Factors:
    // 1. Recycled ratio (more recycled relative to game progression)
    // 2. Solar power levels (+10 for Lv 1, +25 for Lv 2)
    // 3. Sorting accuracy (correct sorts vs wrong sorts)
    // 4. Waste processing plant utilization

    let score = 0;

    // Solar contribution
    if (state.upgrades.solarPowerLevel === 1) score += 12;
    if (state.upgrades.solarPowerLevel >= 2) score += 28;

    // Recycled volume milestone contribution (up to 40 pts)
    const recycled = state.stats.totalWasteRecycled;
    const recycledScore = Math.min(40, Math.floor(recycled / 25));
    score += recycledScore;

    // Sorting accuracy contribution (up to 20 pts)
    const totalSorts = state.stats.totalCorrectSorts + state.stats.totalWrongSorts;
    if (totalSorts > 0) {
      const accuracy = state.stats.totalCorrectSorts / totalSorts;
      score += Math.floor(accuracy * 20);
    } else {
      score += 5; // starting grace
    }

    // Upgrades level contribution (up to 12 pts)
    const upgradeTotal = state.upgrades.truckLevel + state.upgrades.sorterLevel + state.upgrades.recyclingLevel + state.upgrades.storageLevel;
    score += Math.min(12, upgradeTotal * 2);

    state.greenScore = Math.max(0, Math.min(100, score));

    // Update mission for Green score
    this.updateMissionProgress(state, 'greenScore', state.greenScore);
  }

  public static checkLevelProgress(state: GameState): void {
    for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
      const def = LEVEL_DEFINITIONS[i];
      if (
        state.xp >= def.minXP &&
        state.stats.totalProfit >= def.minMoney &&
        state.stats.totalWasteRecycled >= def.minRecycled
      ) {
        if (state.level < def.level) {
          state.level = def.level;
          state.levelTitle = def.title;
        }
        break;
      }
    }
  }

  public static updateMissionProgress(
    state: GameState,
    targetType: 'collect' | 'sort' | 'recycle' | 'sell' | 'greenScore',
    amount: number,
    isAbsolute = false
  ): void {
    state.missions.forEach((m) => {
      if (m.targetType === targetType && !m.claimed) {
        if (isAbsolute) {
          m.currentValue = amount;
        } else {
          m.currentValue += amount;
        }
        if (m.currentValue >= m.targetValue) {
          m.completed = true;
          m.currentValue = m.targetValue;
        }
      }
    });
  }

  public static checkAchievements(state: GameState): void {
    state.achievements.forEach((ach) => {
      if (ach.unlocked) return;

      let qualify = false;
      if (ach.category === 'collect' && state.stats.totalWasteCollected >= ach.requirement) {
        qualify = true;
      } else if (ach.category === 'recycle' && state.stats.totalWasteRecycled >= ach.requirement) {
        qualify = true;
      } else if (ach.category === 'greenScore' && state.greenScore >= ach.requirement) {
        qualify = true;
      } else if (ach.category === 'money' && state.stats.totalProfit >= ach.requirement) {
        qualify = true;
      } else if (ach.category === 'level' && state.level >= ach.requirement) {
        qualify = true;
      }

      if (qualify) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        state.xp += 100;
        state.money += 1000;
      }
    });
  }

  public static getStorageCapacity(state: GameState): number {
    const level = state.upgrades.storageLevel || 1;
    return STORAGE_LIMITS_BY_LEVEL[level] || 500;
  }

  public static getCurrentCollectedWeight(state: GameState): number {
    return Object.values(state.collectedWaste).reduce((sum, v) => sum + (v || 0), 0);
  }

  public static getTruckCapacity(state: GameState): number {
    const level = state.upgrades.truckLevel || 1;
    return TRUCK_CAPACITY_BY_LEVEL[level] || 100;
  }
}
