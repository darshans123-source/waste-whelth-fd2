import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameState, ScreenTab, WasteType, ProductType, LocationId } from '../types/game';
import { useAuth } from './AuthContext';
import { useSound } from './SoundContext';

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

    setGameState(newState);
  }, [gameState, playLevelUp, playAchievement, showToast]);

  const refreshGameState = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/game', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        handleStateUpdate(data.state);
      }
    } catch (err) {
      console.error('Failed to fetch game state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, handleStateUpdate]);

  useEffect(() => {
    if (token) {
      refreshGameState();
      // Periodically poll game state and random events every 20 seconds
      const timer = setInterval(() => {
        refreshGameState();
      }, 20000);
      return () => clearInterval(timer);
    } else {
      setGameState(null);
      setIsLoading(false);
    }
  }, [token, refreshGameState]);

  const collectWaste = async (options: { locationId?: LocationId; collectAll?: boolean }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Collection Notice', data.error || 'Could not collect waste', 'error');
        return;
      }

      playCollect();
      handleStateUpdate(data.state);
      showToast('Waste Collected', data.message, 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Collection failed', 'error');
    }
  };

  const submitSortResult = async (isCorrect: boolean) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCorrect }),
      });

      const data = await res.json();
      if (res.ok) {
        if (isCorrect) {
          playSortCorrect();
        } else {
          playSortWrong();
        }
        handleStateUpdate(data.state);
      }
    } catch (err) {
      console.error('Error submitting sort result:', err);
    }
  };

  const transportWaste = async (wasteType: WasteType, quantity: number) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/transport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wasteType, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Transport Notice', data.error || 'Transport failed', 'error');
        return;
      }

      playTransport();
      handleStateUpdate(data.state);
      showToast('Dispatched', data.message, 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Transport failed', 'error');
    }
  };

  const recycleWaste = async (wasteType: WasteType, quantity: number) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/recycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ wasteType, quantity }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Plant Notice', data.error || 'Recycling failed', 'error');
        return;
      }

      playRecycle();
      handleStateUpdate(data.state);
      showToast('Materials Converted', data.message, 'reward');
    } catch (err: any) {
      showToast('Error', err.message || 'Recycling failed', 'error');
    }
  };

  const sellProducts = async (options: { productType?: ProductType; quantity?: number; sellAll?: boolean }) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(options),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Market Notice', data.error || 'Sale failed', 'error');
        return;
      }

      playCoin();
      handleStateUpdate(data.state);
      showToast('Market Sale', data.message, 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Sale failed', 'error');
    }
  };

  const buyUpgrade = async (upgradeType: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ upgradeType }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Upgrade Notice', data.error || 'Upgrade failed', 'error');
        return;
      }

      playLevelUp();
      handleStateUpdate(data.state);
      showToast('Upgraded', data.message, 'reward');
    } catch (err: any) {
      showToast('Error', err.message || 'Upgrade failed', 'error');
    }
  };

  const claimMission = async (missionId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/mission/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ missionId }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast('Mission Notice', data.error || 'Could not claim reward', 'error');
        return;
      }

      playAchievement();
      handleStateUpdate(data.state);
      showToast('Reward Claimed', data.message, 'reward');
    } catch (err: any) {
      showToast('Error', err.message || 'Claim failed', 'error');
    }
  };

  const completeTutorial = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/tutorial/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        handleStateUpdate(data.state);
      }
    } catch (err) {
      console.error('Error completing tutorial:', err);
    }
  };

  const resetGame = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        handleStateUpdate(data.state);
        showToast('Game Reset', 'All game progress has been reset to starting conditions.', 'info');
      }
    } catch (err: any) {
      showToast('Error', err.message || 'Reset failed', 'error');
    }
  };

  const triggerRandomEvent = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/event/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.event) {
        handleStateUpdate(data.state);
        showToast(`⚡ ${data.event.title}`, data.event.description, 'info');
      }
    } catch (err) {
      console.error('Error triggering event:', err);
    }
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
