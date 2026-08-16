import React from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Volume2, VolumeX, Sun, Moon, User as UserIcon, HelpCircle } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    money,
    xp,
    greenScore,
    cityLevel,
    user,
    setActiveTab,
    soundEnabled,
    setSoundEnabled,
    darkMode,
    setDarkMode,
    setShowTutorial
  } = useGame();

  const cityNames: Record<number, { name: string; icon: string }> = {
    1: { name: 'Village', icon: '🏡' },
    2: { name: 'Town', icon: '🏘️' },
    3: { name: 'City', icon: '🏙️' },
    4: { name: 'Smart City', icon: '🌆' },
    5: { name: 'Green City', icon: '🌍' }
  };

  const currentCity = cityNames[cityLevel] || cityNames[1];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md">
      {/* Brand Title */}
      <div
        onClick={() => setActiveTab('home')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-9 h-9 rounded-xl bg-eco-500/20 border border-eco-500/40 flex items-center justify-center text-lg group-hover:scale-105 transition-transform">
          ♻️
        </div>
        <div className="hidden sm:block">
          <h1 className="font-extrabold text-base tracking-tight leading-none text-white">
            WASTE <span className="eco-gradient-text">TO WEALTH</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Circular Economy Sim</p>
        </div>
      </div>

      {/* Top Game Stats */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-bold">
        {/* Money Stat */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-amber-500/40 text-amber-400 shadow-sm">
          <span className="text-base">💰</span>
          <span className="text-amber-300 font-extrabold">{formatCurrency(money)}</span>
        </div>

        {/* XP Stat */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-purple-500/40 text-purple-300 shadow-sm">
          <span className="text-base">⭐</span>
          <span>{formatNumber(xp)} XP</span>
        </div>

        {/* Green Score Stat */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-eco-500/40 text-eco-400 shadow-sm">
          <span className="text-base">🌱</span>
          <span>Score {greenScore}</span>
        </div>

        {/* City Level Stat */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-300 shadow-sm">
          <span className="text-base">{currentCity.icon}</span>
          <span>{currentCity.name} — Lvl {cityLevel}</span>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setShowTutorial(true)}
          title="Tutorial / Guide"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-eco-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 p-1 pl-2 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
        >
          <img
            src={user?.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + (user?.name || 'Player')}
            alt={user?.name || 'Profile'}
            className="w-7 h-7 rounded-full object-cover border border-eco-400"
          />
        </button>
      </div>
    </header>
  );
};
