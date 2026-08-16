import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '../utils/audioEngine';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isDemo: boolean;
}

export interface WasteInventory {
  organic: number;
  plastic: number;
  paper: number;
  glass: number;
  metal: number;
  ewaste: number;
  construction: number;
}

export interface ProductInventory {
  compost: number;
  biogas: number;
  plastic_granules: number;
  cardboard: number;
  glass_bottles: number;
  metal_ingots: number;
  recovered_metals: number;
  paver_blocks: number;
  aggregates: number;
}

export interface Upgrades {
  truck: number;
  sorter: number;
  plant: number;
  storage: number;
  solar: number;
}

export interface Mission {
  id: string;
  title: string;
  target: number;
  current: number;
  rewardMoney: number;
  rewardXP: number;
  rewardGreen: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  rewardMoney: number;
  rewardXP: number;
  unlocked: boolean;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'bonus' | 'penalty';
  multiplier: number;
}

export interface NotificationToast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface GameContextType {
  user: User | null;
  token: string | null;
  googleConfigured: boolean;
  googleClientId: string | null;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showTutorial: boolean;
  setShowTutorial: (show: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (val: boolean) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  
  // Game Stats
  money: number;
  xp: number;
  greenScore: number;
  cityLevel: number;
  totalWasteCollected: number;
  totalWasteRecycled: number;
  totalProductsSold: number;
  totalProfit: number;
  
  wasteInventory: WasteInventory;
  productInventory: ProductInventory;
  upgrades: Upgrades;
  missions: Mission[];
  achievements: Achievement[];
  activeEvent: RandomEvent | null;
  toasts: NotificationToast[];

  // Actions
  loginWithDemo: () => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  collectWaste: (location: string) => Promise<any>;
  submitSortScore: (correctCount: number, wrongCount: number) => Promise<any>;
  recycleWaste: (wasteType: string, amount: number) => Promise<any>;
  sellProducts: (productKey?: string, amount?: number, sellAll?: boolean) => Promise<any>;
  buyUpgrade: (category: string) => Promise<any>;
  claimMissionReward: (missionId: string) => Promise<any>;
  resetGameProgress: () => Promise<void>;
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  refreshGameState: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('w2w_token'));
  const [googleConfigured, setGoogleConfigured] = useState<boolean>(false);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabledState] = useState<boolean>(true);
  const [darkMode, setDarkModeState] = useState<boolean>(true);

  // Game Stats
  const [money, setMoney] = useState<number>(5000);
  const [xp, setXp] = useState<number>(0);
  const [greenScore, setGreenScore] = useState<number>(0);
  const [cityLevel, setCityLevel] = useState<number>(1);
  const [totalWasteCollected, setTotalWasteCollected] = useState<number>(0);
  const [totalWasteRecycled, setTotalWasteRecycled] = useState<number>(0);
  const [totalProductsSold, setTotalProductsSold] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const [wasteInventory, setWasteInventory] = useState<WasteInventory>({
    organic: 0, plastic: 0, paper: 0, glass: 0, metal: 0, ewaste: 0, construction: 0
  });

  const [productInventory, setProductInventory] = useState<ProductInventory>({
    compost: 0, biogas: 0, plastic_granules: 0, cardboard: 0, glass_bottles: 0,
    metal_ingots: 0, recovered_metals: 0, paver_blocks: 0, aggregates: 0
  });

  const [upgrades, setUpgrades] = useState<Upgrades>({
    truck: 1, sorter: 1, plant: 1, storage: 1, solar: 0
  });

  const [missions, setMissions] = useState<Mission[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [activeEvent, setActiveEvent] = useState<RandomEvent | null>(null);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 4);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    soundFx.setSoundEnabled(val);
  };

  const setMusicEnabled = (val: boolean) => {
    setMusicEnabledState(val);
    soundFx.setMusicEnabled(val);
  };

  const setDarkMode = (val: boolean) => {
    setDarkModeState(val);
    if (val) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fetch OAuth configuration
  useEffect(() => {
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(data => {
        setGoogleConfigured(data.googleConfigured);
        setGoogleClientId(data.clientId);
      })
      .catch(() => {
        setGoogleConfigured(false);
      });
  }, []);

  // Fetch current user & game state if token exists
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid');
        return res.json();
      })
      .then(data => {
        setUser(data.user);
        return refreshGameState();
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const refreshGameState = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/game', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      
      setMoney(data.money);
      setXp(data.xp);
      setGreenScore(data.greenScore);
      setCityLevel(data.cityLevel);
      setTotalWasteCollected(data.totalWasteCollected);
      setTotalWasteRecycled(data.totalWasteRecycled);
      setTotalProductsSold(data.totalProductsSold);
      setTotalProfit(data.totalProfit);
      setWasteInventory(data.wasteInventory);
      setProductInventory(data.productInventory);
      setUpgrades(data.upgrades);
      setMissions(data.missions);
      setAchievements(data.achievements);
      setActiveEvent(data.activeEvent);
    } catch (err) {
      console.error('Failed to refresh game state:', err);
    }
  };

  const loginWithDemo = async () => {
    soundFx.playClick();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/demo', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Demo login failed');

      localStorage.setItem('w2w_token', data.token);
      setToken(data.token);
      setUser(data.user);

      // Show tutorial for first login
      const hasSeenTutorial = localStorage.getItem('w2w_seen_tutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }

      addToast('Welcome to Waste to Wealth (Demo Mode)! 🌱', 'success');
      await refreshGameState();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    soundFx.playClick();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');

      localStorage.setItem('w2w_token', data.token);
      setToken(data.token);
      setUser(data.user);

      const hasSeenTutorial = localStorage.getItem('w2w_seen_tutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }

      addToast(`Welcome back, ${data.user.name}! 🌱`, 'success');
      await refreshGameState();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    soundFx.playClick();
    localStorage.removeItem('w2w_token');
    setToken(null);
    setUser(null);
    setActiveTab('home');
    addToast('Logged out successfully', 'info');
  };

  const collectWaste = async (location: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ location })
      });
      const data = await res.json();
      if (!res.ok) {
        soundFx.playSortWrong();
        addToast(data.error || 'Collection failed', 'warning');
        return data;
      }

      soundFx.playCollectPop();
      setWasteInventory(data.wasteInventory);
      setXp(data.xp);
      setGreenScore(data.greenScore);
      setCityLevel(data.cityLevel);
      setMissions(data.missions);
      setAchievements(data.achievements);

      addToast(`Collected +${data.totalGenerated} kg waste! (+${data.xpGained} XP)`, 'success');
      return data;
    } catch (err: any) {
      addToast('Collection request failed', 'error');
    }
  };

  const submitSortScore = async (correctCount: number, wrongCount: number) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ correctCount, wrongCount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.xpGained > 0) soundFx.playSortCorrect();
      setXp(data.xp);
      setGreenScore(data.greenScore);
      setMissions(data.missions);
      setAchievements(data.achievements);

      return data;
    } catch (err: any) {
      addToast('Sort submission failed', 'error');
    }
  };

  const recycleWaste = async (wasteType: string, amount: number) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/recycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ wasteType, amount })
      });
      const data = await res.json();
      if (!res.ok) {
        soundFx.playSortWrong();
        addToast(data.error || 'Recycling failed', 'warning');
        return data;
      }

      soundFx.playRecycleMachine();
      setWasteInventory(data.wasteInventory);
      setProductInventory(data.productInventory);
      setXp(data.xp);
      setGreenScore(data.greenScore);
      setTotalWasteRecycled(data.totalWasteRecycled);
      setCityLevel(data.cityLevel);
      setMissions(data.missions);
      setAchievements(data.achievements);

      addToast(`Recycled ${data.amountRecycled} kg ${wasteType}! Created ${data.outputQty} ${data.outputProduct.replace('_', ' ')}`, 'success');
      return data;
    } catch (err: any) {
      addToast('Recycling failed', 'error');
    }
  };

  const sellProducts = async (productKey?: string, amount?: number, sellAll: boolean = false) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productKey, amount, sellAll })
      });
      const data = await res.json();
      if (!res.ok) {
        soundFx.playSortWrong();
        addToast(data.error || 'Sell failed', 'warning');
        return data;
      }

      soundFx.playCoin();
      setMoney(data.money);
      setTotalProfit(data.totalProfit);
      setProductInventory(data.productInventory);
      setXp(data.xp);
      setCityLevel(data.cityLevel);
      setMissions(data.missions);
      setAchievements(data.achievements);

      addToast(`Sold products for +₹${data.totalEarned.toLocaleString()}! 💰`, 'success');
      return data;
    } catch (err: any) {
      addToast('Sell request failed', 'error');
    }
  };

  const buyUpgrade = async (category: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category })
      });
      const data = await res.json();
      if (!res.ok) {
        soundFx.playSortWrong();
        addToast(data.error || 'Upgrade failed', 'warning');
        return data;
      }

      soundFx.playPowerUp();
      setMoney(data.money);
      setGreenScore(data.greenScore);
      setUpgrades(data.upgrades);
      setAchievements(data.achievements);

      addToast(`Upgraded ${category.toUpperCase()} to Level ${data.newLevel}! 🚀`, 'success');
      return data;
    } catch (err: any) {
      addToast('Upgrade request failed', 'error');
    }
  };

  const claimMissionReward = async (missionId: string) => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/claim-mission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ missionId })
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Claim failed', 'warning');
        return data;
      }

      soundFx.playAchievement();
      setMoney(data.money);
      setXp(data.xp);
      setGreenScore(data.greenScore);
      setMissions(data.missions);

      addToast(`Claimed reward: +₹${data.rewardMoney}, +${data.rewardXP} XP, +${data.rewardGreen} Green Score! 🎁`, 'success');
      return data;
    } catch (err: any) {
      addToast('Claim request failed', 'error');
    }
  };

  const resetGameProgress = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/game/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      soundFx.playClick();
      addToast('Game progress reset to Level 1!', 'info');
      await refreshGameState();
    } catch (err: any) {
      addToast(err.message || 'Reset failed', 'error');
    }
  };

  return (
    <GameContext.Provider value={{
      user,
      token,
      googleConfigured,
      googleClientId,
      loading,
      activeTab,
      setActiveTab,
      showTutorial,
      setShowTutorial,
      soundEnabled,
      setSoundEnabled,
      musicEnabled,
      setMusicEnabled,
      darkMode,
      setDarkMode,
      money,
      xp,
      greenScore,
      cityLevel,
      totalWasteCollected,
      totalWasteRecycled,
      totalProductsSold,
      totalProfit,
      wasteInventory,
      productInventory,
      upgrades,
      missions,
      achievements,
      activeEvent,
      toasts,
      loginWithDemo,
      loginWithGoogle,
      logout,
      collectWaste,
      submitSortScore,
      recycleWaste,
      sellProducts,
      buyUpgrade,
      claimMissionReward,
      resetGameProgress,
      addToast,
      refreshGameState
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
