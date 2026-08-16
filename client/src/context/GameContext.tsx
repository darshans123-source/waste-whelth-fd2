<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    if (!token) return;
    try {
      const res = await fetch('/api/game/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    if (!token) return;
    try {
      const res = await fetch('/api/game/sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    if (!token) return;
    try {
      const res = await fetch('/api/game/recycle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    if (!token) return;
    try {
      const res = await fetch('/api/game/sell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    if (!token) return;
    try {
      const res = await fetch('/api/game/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    if (!token) return;
    try {
      const res = await fetch('/api/game/reset', {
        method: 'POST',
<<<<<<< HEAD
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
=======
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      soundFx.playClick();
      addToast('Game progress reset to Level 1!', 'info');
      await refreshGameState();
    } catch (err: any) {
      addToast(err.message || 'Reset failed', 'error');
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
    }
  };

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
<<<<<<< HEAD
  if (!context) throw new Error('useGame must be used within a GameProvider');
=======
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
>>>>>>> e83a90db678c848c1a6f863b9ee1b60d5fd6378f
  return context;
};
