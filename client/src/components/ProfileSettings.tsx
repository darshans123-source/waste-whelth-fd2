import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatWeight, formatNumber } from '../utils/formatters';
import {
  User,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  LogOut,
  RotateCcw,
  ShieldAlert,
  Trophy,
  Leaf,
  Award
} from 'lucide-react';

export const ProfileSettings: React.FC = () => {
  const {
    user,
    money,
    xp,
    greenScore,
    cityLevel,
    totalWasteRecycled,
    totalProfit,
    achievements,
    logout,
    resetGameProgress,
    soundEnabled,
    setSoundEnabled,
    musicEnabled,
    setMusicEnabled,
    darkMode,
    setDarkMode
  } = useGame();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Profile Info Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <img
          src={user?.picture || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + (user?.name || 'Player')}
          alt={user?.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-eco-500 shadow-2xl shrink-0"
        />
        <div className="space-y-1 overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-eco-500/20 text-eco-400 border border-eco-500/40">
            <span>Level {cityLevel} Manager</span>
            {user?.isDemo && <span className="bg-amber-400 text-slate-950 px-1.5 rounded text-[10px]">DEMO</span>}
          </div>
          <h2 className="text-2xl font-extrabold text-white truncate">{user?.name}</h2>
          <p className="text-xs text-slate-400 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Game Lifetime Statistics Grid */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Manager Stats Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Total Profit</div>
            <div className="text-lg font-extrabold text-amber-400">{formatCurrency(totalProfit)}</div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Total Recycled</div>
            <div className="text-lg font-extrabold text-eco-400">{formatWeight(totalWasteRecycled)}</div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Green Score</div>
            <div className="text-lg font-extrabold text-emerald-400">🌱 {greenScore}</div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-xs text-slate-400 font-bold">Badges</div>
            <div className="text-lg font-extrabold text-purple-400">🏆 {unlockedAchievements} / {achievements.length}</div>
          </div>
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          Application Preferences
        </h3>

        <div className="divide-y divide-slate-800/80">
          {/* Sound FX Toggle */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-eco-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
              <div>
                <div className="font-bold text-sm text-white">Game Sound Effects</div>
                <div className="text-xs text-slate-400">Synthesized Web Audio clicks and chimes</div>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${soundEnabled ? 'bg-eco-500' : 'bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${soundEnabled ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
              <div>
                <div className="font-bold text-sm text-white">Dark Theme Mode</div>
                <div className="text-xs text-slate-400">Toggle dark visual aesthetic</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-eco-500' : 'bg-slate-700'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${darkMode ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Account Actions & Danger Zone */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
          Account & Danger Zone
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={logout}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Game Progress</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-rose-500/40 text-center space-y-4 shadow-2xl">
            <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-white">Reset Game Progress?</h3>
            <p className="text-xs text-slate-300">
              Are you sure? All game progress, money, upgrades, and Green Score will be deleted permanently.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetGameProgress();
                }}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/30"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
