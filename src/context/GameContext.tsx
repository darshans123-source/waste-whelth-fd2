import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameState, ScreenTab, WasteType, ProductType, LocationId } from '../types/game';
import { useAuth } from './AuthContext';
import { useSound } from './SoundContext';
import {
  loadLocalGameState,
  saveLocalGameState,
  createInitialGameState,
  calculateGreenScore,
  checkLevelUp,
  checkAchievements,
  PRODUCT_BASE_PRICES,
  UPGRADE_PRICES,
  TRUCK_CAPACITY_BY_LEVEL,
} from '../services/gameStateEngine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'reward';
  title: string;
  message: string;
}

interface GameContextType {
  gameState: GameState | null;
  activeTab: ScreenTab;
  setActiveTab: (tab: ScreenTab) => void;
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'reward') => void;
  removeToast: (id: string) => void;

  // Game Actions
  collectWaste: (options: { locationId?: LocationId; collectAll?: boolean }) => Promise<void>;
  submitSortResult: (isCorrect: boolean) => Promise<void>;
  transportWaste: (wasteType: WasteType, quantity: number) => Promise<void>;
  recycleWaste: (wasteType: WasteType, quantity: number) => Promise<void>;
  sellProducts: (options: { productType?: ProductType; quantity?: number; sellAll?: boolean }) => Promise<void>;
  buyUpgrade: (upgradeType: string) => Promise<void>;
  claimMission: (missionId: string) => Promise<void>;
  completeTutorial: () => Promise<void>;
  resetGame: () => Promise<void>;
  triggerRandomEvent: () => Promise<void>;
  refreshGameState: () => Promise<void>;
}

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const {
    playClick,
    playCoin,
    playCollect,
    playSortCorrect,
    playSortWrong,
    playTransport,
    playRecycle,
    playLevelUp,
    playAchievement,
  } = useSound();

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<ScreenTab>('home');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const prevLevelRef = useRef<number>(1);
  const prevAchievementsCountRef = useRef<number>(0);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' | 'reward' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerCelebrationConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#16a34a', '#eab308', '#38bdf8'],
    });
  };

  const handleStateUpdate = useCallback((newState: GameState) => {
    saveLocalGameState(newState);

    // Check level up
    if (newState.level > prevLevelRef.current) {
      playLevelUp();
      triggerCelebrationConfetti();
      showToast('🎉 LEVEL UNLOCKED!', `Congratulations! You unlocked ${newState.levelTitle}`, 'reward');
    }
    prevLevelRef.current = newState.level;

    // Check new achievements
    const unlockedCount = newState.achievements.filter((a) => a.unlocked).length;
    if (unlockedCount > prevAchievementsCountRef.current) {
      playAchievement();
      triggerCelebrationConfetti();
      const newlyUnlocked = newState.achievements.find((a) => a.unlocked && !gameState?.achievements.find((ga) => ga.id === a.id && ga.unlocked));
      if (newlyUnlocked) {
        showToast('🏆 ACHIEVEMENT UNLOCKED!', `${newlyUnlocked.title}: ${newlyUnlocked.description}`, 'reward');
      }
    }
    prevAchievementsCountRef.current = unlockedCount;

    setGameState({ ...newState });
  }, [gameState, playLevelUp, playAchievement, showToast]);

  const refreshGameState = useCallback(async () => {
    if (!user && !token) {
      setGameState(null);
      setIsLoading(false);
      return;
    }

    const userId = user?.id || 'usr_demo_eco_warrior';

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          handleStateUpdate(data.state);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fallback to local state
      }
    }

    const localState = loadLocalGameState(userId);
    handleStateUpdate(localState);
    setIsLoading(false);
  }, [token, user, handleStateUpdate]);

  useEffect(() => {
    if (user || token) {
      refreshGameState();
      // Replenish neighborhood waste periodically every 45 seconds
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          const keys: LocationId[] = ['houses', 'schools', 'offices', 'factories', 'parks', 'construction'];
          keys.forEach((loc) => {
            const currentLoc = { ...(updated.uncollectedWaste[loc] || {}) };
            Object.keys(currentLoc).forEach((wType) => {
              currentLoc[wType as WasteType] = Math.min(60, (currentLoc[wType as WasteType] || 0) + Math.floor(Math.random() * 6 + 2));
            });
            updated.uncollectedWaste[loc] = currentLoc;
          });
          saveLocalGameState(updated);
          return updated;
        });
      }, 45000);
      return () => clearInterval(timer);
    } else {
      setGameState(null);
      setIsLoading(false);
    }
  }, [user, token, refreshGameState]);

  const collectWaste = async (options: { locationId?: LocationId; collectAll?: boolean }) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(options),
        });

        if (res.ok) {
          const data = await res.json();
          playCollect();
          handleStateUpdate(data.state);
          showToast('Waste Collected', data.message, 'success');
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    const maxTruck = TRUCK_CAPACITY_BY_LEVEL[state.upgrades.truckLevel] || 100;
    let totalCollectedThisBatch = 0;

    const locationsToCollect: LocationId[] = options.locationId ? [options.locationId] : (['houses', 'schools', 'offices', 'factories', 'parks', 'construction'] as LocationId[]);

    locationsToCollect.forEach((loc) => {
      const locWaste = state.uncollectedWaste[loc];
      if (!locWaste) return;
      (Object.keys(locWaste) as WasteType[]).forEach((wt) => {
        const amt = locWaste[wt] || 0;
        if (amt > 0 && totalCollectedThisBatch < maxTruck) {
          const take = Math.min(amt, maxTruck - totalCollectedThisBatch);
          locWaste[wt] = amt - take;
          state.collectedWaste[wt] = (state.collectedWaste[wt] || 0) + take;
          totalCollectedThisBatch += take;
        }
      });
    });

    if (totalCollectedThisBatch === 0) {
      showToast('Collection Notice', 'No uncollected waste currently available here or truck is full.', 'info');
      return;
    }

    state.stats.totalWasteCollected += totalCollectedThisBatch;
    state.xp += Math.round(totalCollectedThisBatch * 0.5);

    // Update missions
    state.missions.forEach((m) => {
      if (m.targetType === 'collect' && !m.completed) {
        m.currentValue += totalCollectedThisBatch;
        if (m.currentValue >= m.targetValue) m.completed = true;
      }
    });

    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);

    playCollect();
    handleStateUpdate(state);
    showToast('Waste Collected', `Collected ${totalCollectedThisBatch} kg of waste for segregation and transport.`, 'success');
  };

  const submitSortResult = async (isCorrect: boolean) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/sort', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isCorrect }),
        });

        if (res.ok) {
          const data = await res.json();
          if (isCorrect) playSortCorrect(); else playSortWrong();
          handleStateUpdate(data.state);
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    if (isCorrect) {
      playSortCorrect();
      state.stats.totalCorrectSorts += 1;
      state.money += 20;
      state.xp += 10;
      state.missions.forEach((m) => {
        if (m.targetType === 'sort' && !m.completed) {
          m.currentValue += 1;
          if (m.currentValue >= m.targetValue) m.completed = true;
        }
      });
    } else {
      playSortWrong();
      state.stats.totalWrongSorts += 1;
    }

    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);
    handleStateUpdate(state);
  };

  const transportWaste = async (wasteType: WasteType, quantity: number) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/transport', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wasteType, quantity }),
        });

        if (res.ok) {
          const data = await res.json();
          playTransport();
          handleStateUpdate(data.state);
          showToast('Dispatched', data.message, 'success');
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    const available = state.collectedWaste[wasteType] || 0;
    if (available < quantity || quantity <= 0) {
      showToast('Transport Notice', 'Not enough sorted waste available to dispatch.', 'error');
      return;
    }

    state.collectedWaste[wasteType] -= quantity;
    state.plantWaste[wasteType] = (state.plantWaste[wasteType] || 0) + quantity;
    state.xp += Math.round(quantity * 0.4);

    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);

    playTransport();
    handleStateUpdate(state);
    showToast('Dispatched', `Transported ${quantity} kg of ${wasteType} to recycling plants.`, 'success');
  };

  const recycleWaste = async (wasteType: WasteType, quantity: number) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/recycle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ wasteType, quantity }),
        });

        if (res.ok) {
          const data = await res.json();
          playRecycle();
          handleStateUpdate(data.state);
          showToast('Materials Converted', data.message, 'reward');
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    const available = state.plantWaste[wasteType] || 0;
    if (available < quantity || quantity <= 0) {
      showToast('Plant Notice', 'Not enough materials at the recycling plant to process.', 'error');
      return;
    }

    const yieldRate = UPGRADE_PRICES.recycling[state.upgrades.recyclingLevel]?.yieldRate || 0.75;
    const producedQty = Math.max(1, Math.round(quantity * yieldRate * 0.2));

    state.plantWaste[wasteType] -= quantity;

    // Convert waste to circular products
    if (wasteType === 'organic') {
      state.products.compost = (state.products.compost || 0) + producedQty;
      state.products.biogas = (state.products.biogas || 0) + Math.max(1, Math.round(producedQty * 0.5));
    } else if (wasteType === 'plastic') {
      state.products.plasticGranules = (state.products.plasticGranules || 0) + producedQty;
    } else if (wasteType === 'paper') {
      state.products.cardboard = (state.products.cardboard || 0) + producedQty;
    } else if (wasteType === 'glass') {
      state.products.glassBottles = (state.products.glassBottles || 0) + producedQty;
    } else if (wasteType === 'metal') {
      state.products.metalIngots = (state.products.metalIngots || 0) + producedQty;
    } else if (wasteType === 'ewaste') {
      state.products.recoveredMetals = (state.products.recoveredMetals || 0) + producedQty;
    } else if (wasteType === 'construction') {
      state.products.paverBlocks = (state.products.paverBlocks || 0) + producedQty;
      state.products.aggregates = (state.products.aggregates || 0) + producedQty;
    }

    state.stats.totalWasteRecycled += quantity;
    state.xp += Math.round(quantity * 0.8);

    // Update missions
    state.missions.forEach((m) => {
      if (m.targetType === 'recycle' && !m.completed) {
        m.currentValue += quantity;
        if (m.currentValue >= m.targetValue) m.completed = true;
      }
    });

    state.greenScore = calculateGreenScore(state);
    checkLevelUp(state);
    checkAchievements(state);

    playRecycle();
    handleStateUpdate(state);
    showToast('Materials Converted', `Successfully processed ${quantity} kg into circular economy products!`, 'reward');
  };

  const sellProducts = async (options: { productType?: ProductType; quantity?: number; sellAll?: boolean }) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/sell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(options),
        });

        if (res.ok) {
          const data = await res.json();
          playCoin();
          handleStateUpdate(data.state);
          showToast('Market Sale', data.message, 'success');
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    let totalEarned = 0;
    let totalItemsSold = 0;

    const productsToSell: ProductType[] = options.productType
      ? [options.productType]
      : (Object.keys(state.products) as ProductType[]);

    productsToSell.forEach((pType) => {
      const available = state.products[pType] || 0;
      const count = options.sellAll || !options.quantity ? available : Math.min(available, options.quantity);
      if (count > 0) {
        const unitPrice = PRODUCT_BASE_PRICES[pType] || 500;
        const revenue = count * unitPrice;
        state.products[pType] -= count;
        totalEarned += revenue;
        totalItemsSold += count;
      }
    });

    if (totalItemsSold === 0) {
      showToast('Market Notice', 'No products available in inventory to sell.', 'info');
      return;
    }

    state.money += totalEarned;
    state.stats.totalProfit += totalEarned;
    state.stats.totalProductsSold += totalItemsSold;
    state.xp += Math.round(totalItemsSold * 15);

    // Update missions
    state.missions.forEach((m) => {
      if (m.targetType === 'sell' && !m.completed) {
        m.currentValue += totalItemsSold;
        if (m.currentValue >= m.targetValue) m.completed = true;
      }
    });

    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);

    playCoin();
    handleStateUpdate(state);
    showToast('Market Sale', `Sold ${totalItemsSold} items for a total revenue of ₹${totalEarned.toLocaleString()}!`, 'success');
  };

  const buyUpgrade = async (upgradeType: string) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/upgrade', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ upgradeType }),
        });

        if (res.ok) {
          const data = await res.json();
          playLevelUp();
          handleStateUpdate(data.state);
          showToast('Upgraded', data.message, 'reward');
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    const currentLvl = (state.upgrades as any)[`${upgradeType}Level`] || 1;
    const nextLvl = currentLvl + 1;
    const upgradeTier = UPGRADE_PRICES[upgradeType]?.[nextLvl];

    if (!upgradeTier) {
      showToast('Upgrade Notice', 'This technology is already at maximum tier.', 'info');
      return;
    }

    if (state.money < upgradeTier.cost) {
      showToast('Upgrade Notice', `Insufficient capital. Need ₹${upgradeTier.cost.toLocaleString()}.`, 'error');
      return;
    }

    state.money -= upgradeTier.cost;
    (state.upgrades as any)[`${upgradeType}Level`] = nextLvl;
    state.xp += 150;

    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);

    playLevelUp();
    handleStateUpdate(state);
    showToast('Upgraded', `Successfully upgraded ${upgradeTier.name || upgradeType}!`, 'reward');
  };

  const claimMission = async (missionId: string) => {
    if (!gameState) return;

    if (token && !token.startsWith('local_')) {
      try {
        const res = await fetch('/api/game/mission/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ missionId }),
        });

        if (res.ok) {
          const data = await res.json();
          playAchievement();
          handleStateUpdate(data.state);
          showToast('Reward Claimed', data.message, 'reward');
          return;
        }
      } catch {}
    }

    // Local execution
    const state = { ...gameState };
    const mission = state.missions.find((m) => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    mission.claimed = true;
    state.money += mission.rewardMoney;
    state.xp += mission.rewardXP;

    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);

    playAchievement();
    handleStateUpdate(state);
    showToast('Reward Claimed', `Earned ₹${mission.rewardMoney.toLocaleString()} and +${mission.rewardXP} XP!`, 'reward');
  };

  const completeTutorial = async () => {
    if (!gameState) return;
    const state = { ...gameState, hasCompletedTutorial: true };
    handleStateUpdate(state);
  };

  const resetGame = async () => {
    const userId = user?.id || 'usr_demo_eco_warrior';
    const newState = createInitialGameState(userId);
    handleStateUpdate(newState);
    showToast('Game Reset', 'All game progress has been reset to starting conditions.', 'info');
  };

  const triggerRandomEvent = async () => {
    if (!gameState) return;
    const state = { ...gameState };
    const events = [
      {
        id: 'ev_cleanliness_drive',
        title: '🌱 Clean City Community Drive',
        description: 'Citizen volunteers organized a major clean-up drive! +50 kg recyclable materials added.',
        impact: () => {
          state.collectedWaste.plastic = (state.collectedWaste.plastic || 0) + 25;
          state.collectedWaste.paper = (state.collectedWaste.paper || 0) + 25;
        },
      },
      {
        id: 'ev_green_subsidy',
        title: '🏛️ Municipal Green Innovation Grant',
        description: 'City municipal council awarded you a sustainability grant of ₹2,500!',
        impact: () => {
          state.money += 2500;
        },
      },
      {
        id: 'ev_market_surge',
        title: '📈 Recycled Materials Market Boom',
        description: 'Demand for compost and cardboard surged! +100 XP gained.',
        impact: () => {
          state.xp += 100;
        },
      },
    ];

    const ev = events[Math.floor(Math.random() * events.length)];
    ev.impact();
    checkLevelUp(state);
    checkAchievements(state);
    state.greenScore = calculateGreenScore(state);
    handleStateUpdate(state);
    showToast(ev.title, ev.description, 'info');
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        activeTab,
        setActiveTab: (tab) => {
          playClick();
          setActiveTab(tab);
        },
        isLoading,
        toasts,
        showToast,
        removeToast,
        collectWaste,
        submitSortResult,
        transportWaste,
        recycleWaste,
        sellProducts,
        buyUpgrade,
        claimMission,
        completeTutorial,
        resetGame,
        triggerRandomEvent,
        refreshGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
