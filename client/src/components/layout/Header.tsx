import React from 'react';
import { Volume2, VolumeX, Music, Coins, Sparkles, Leaf, ShieldAlert } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../context/AuthContext';
import { useSound } from '../../context/SoundContext';

export const Header: React.FC = () => {
  const { gameState, setActiveTab } = useGame();
  const { user } = useAuth();
  const { soundEnabled, musicEnabled, toggleSound, toggleMusic } = useSound();

  if (!gameState) return null;

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-700/60 px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4 flex-wrap">
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-eco-600 to-emerald-400 flex items-center justify-center text-xl shadow-lg shadow-eco-500/20 group-hover:scale-105 transition-transform duration-200">
            ♻️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base md:text-lg font-black tracking-wider text-white">WASTE TO WEALTH</h1>
              {user?.isDemo && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                  <ShieldAlert className="w-2.5 h-2.5" /> Demo
                </span>
              )}
            </div>
            <p className="text-[11px] text-eco-400 font-semibold hidden sm:block">Turn Waste Into Wealth</p>
          </div>
        </div>

        {/* Live Game Stats Matrix */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          {/* Money Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 shadow-sm">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse-subtle" />
            <span className="font-extrabold text-sm md:text-base text-amber-300 font-mono">
              ₹{gameState.money.toLocaleString()}
            </span>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-xs md:text-sm text-sky-300 font-mono">
              {gameState.xp.toLocaleString()} XP
            </span>
          </div>

          {/* Green Score Badge */}
          <div
            onClick={() => setActiveTab('greenscore')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-eco-500/15 border border-eco-500/30 hover:border-eco-400 cursor-pointer shadow-sm transition"
          >
            <Leaf className="w-4 h-4 text-eco-400" />
            <span className="font-bold text-xs md:text-sm text-eco-300">
              Score <strong className="text-white">{gameState.greenScore}</strong>
            </span>
          </div>

          {/* Level / City Tier Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-sm">{gameState.levelTitle}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-700 text-[10px] font-bold text-slate-300">
              Lv. {gameState.level}
            </span>
          </div>
        </div>

        {/* Audio Toggles & Profile Quick Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-eco-500/20 border-eco-500/40 text-eco-300'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleMusic}
            title={musicEnabled ? 'Stop Music' : 'Play Ambient Music'}
            className={`p-2 rounded-xl border transition ${
              musicEnabled
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Profile Avatar */}
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-2 cursor-pointer group"
          >
            <img
              src={user?.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'}
              alt={user?.name || 'Player'}
              className="w-9 h-9 rounded-2xl border-2 border-eco-500/60 object-cover group-hover:border-eco-400 transition"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
