import React from 'react';
import { GameState } from '../../types/game';
import { LEVEL_DEFINITIONS } from '../../services/gameStateEngine';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CityVisualizerProps {
  gameState: GameState;
  onUpgradeClick?: () => void;
}

export const CityVisualizer: React.FC<CityVisualizerProps> = ({ gameState }) => {
  const currentTier = gameState.level;
  const nextDef = LEVEL_DEFINITIONS.find((d) => d.level === currentTier + 1);

  // Background and scenery themes based on level
  const tierThemes = {
    1: {
      name: '🏡 Village',
      desc: 'A humble settlement just starting its zero-waste transformation.',
      skyGradient: 'from-emerald-950/60 via-slate-900 to-slate-950',
      accentColor: 'text-eco-400',
    },
    2: {
      name: '🏘️ Town',
      desc: 'Rapidly segregating waste with organized community collection.',
      skyGradient: 'from-teal-950/60 via-slate-900 to-slate-950',
      accentColor: 'text-teal-400',
    },
    3: {
      name: '🏙️ City',
      desc: 'Thriving urban center with dedicated recycling processing plants.',
      skyGradient: 'from-cyan-950/60 via-slate-900 to-slate-950',
      accentColor: 'text-cyan-400',
    },
    4: {
      name: '🌆 Smart City',
      desc: 'AI-automated sorting facilities and solar-powered logistics fleet.',
      skyGradient: 'from-blue-950/60 via-slate-900 to-slate-950',
      accentColor: 'text-sky-400',
    },
    5: {
      name: '🌍 Green City',
      desc: 'World-class 100% Circular Economy metropolis powered by renewables!',
      skyGradient: 'from-emerald-900/60 via-teal-900/40 to-slate-950',
      accentColor: 'text-emerald-300',
    },
  };

  const theme = tierThemes[currentTier as keyof typeof tierThemes] || tierThemes[1];

  return (
    <div className="w-full rounded-3xl overflow-hidden glass-card border border-white/10 relative shadow-2xl select-none mb-6">
      {/* Cityscape Animation Container */}
      <div className={`relative h-44 md:h-56 w-full bg-gradient-to-b ${theme.skyGradient} p-4 md:p-6 overflow-hidden flex flex-col justify-between`}>
        {/* Floating clouds / celestial light */}
        <div className="absolute top-4 left-8 text-3xl opacity-30 animate-float">☁️</div>
        <div className="absolute top-8 right-16 text-2xl opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
          ☁️
        </div>
        <div className="absolute top-3 right-8 w-10 h-10 rounded-full bg-amber-400/20 blur-lg" />

        {/* Dynamic Landscape Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-28 flex items-end justify-between px-4 md:px-12 pointer-events-none">
          {/* Wind Turbines */}
          <div className="flex items-end gap-3 pb-2 opacity-80">
            <div className="flex flex-col items-center">
              <span className="text-2xl animate-spin-slow origin-center">⚙️</span>
              <div className="w-1 h-10 bg-slate-600 rounded-t" />
            </div>
            {currentTier >= 3 && (
              <div className="flex flex-col items-center scale-75">
                <span className="text-2xl animate-spin-slow origin-center" style={{ animationDuration: '6s' }}>
                  ⚙️
                </span>
                <div className="w-1 h-8 bg-slate-600 rounded-t" />
              </div>
            )}
          </div>

          {/* City Buildings / Nature */}
          <div className="flex items-end gap-2 md:gap-4 pb-1">
            {currentTier === 1 && (
              <>
                <span className="text-3xl">🌳</span>
                <span className="text-4xl">🏡</span>
                <span className="text-3xl">🌾</span>
                <span className="text-4xl">🏠</span>
                <span className="text-3xl">🌳</span>
              </>
            )}
            {currentTier === 2 && (
              <>
                <span className="text-3xl">🌳</span>
                <span className="text-4xl">🏘️</span>
                <span className="text-4xl">🏫</span>
                <span className="text-3xl">🏢</span>
                <span className="text-4xl">🏡</span>
              </>
            )}
            {currentTier === 3 && (
              <>
                <span className="text-4xl">🏭</span>
                <span className="text-5xl">🏙️</span>
                <span className="text-4xl">🏢</span>
                <span className="text-4xl">🌳</span>
                <span className="text-5xl">🏬</span>
              </>
            )}
            {currentTier === 4 && (
              <>
                <span className="text-4xl">⚡</span>
                <span className="text-5xl">🌆</span>
                <span className="text-5xl">🏢</span>
                <span className="text-4xl">🤖</span>
                <span className="text-5xl">🏙️</span>
              </>
            )}
            {currentTier === 5 && (
              <>
                <span className="text-4xl">🌿</span>
                <span className="text-5xl">🌍</span>
                <span className="text-5xl">🏙️</span>
                <span className="text-4xl">☀️</span>
                <span className="text-5xl">🌱</span>
              </>
            )}
          </div>

          {/* Solar Panels & Recycling Transport */}
          <div className="flex items-end gap-2 pb-2">
            {gameState.upgrades.solarPowerLevel > 0 && <span className="text-3xl">☀️</span>}
            <div className="animate-bounce-subtle">
              <span className="text-3xl">🚛</span>
            </div>
          </div>
        </div>

        {/* Road Base */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-slate-950 border-t border-slate-700/60" />

        {/* City Title Overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-xl bg-eco-500/20 text-eco-300 border border-eco-500/30">
                LEVEL {currentTier}
              </span>
              <h2 className="text-xl md:text-2xl font-black text-white">{theme.name}</h2>
            </div>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-md">{theme.desc}</p>
          </div>

          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-semibold">Clean Energy Status</span>
            <span className="text-sm font-bold text-eco-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {gameState.upgrades.solarPowerLevel > 0 ? 'Solar Powered ☀️' : 'Grid Dependent'}
            </span>
          </div>
        </div>
      </div>

      {/* Level Unlock Progress Footer */}
      {nextDef ? (
        <div className="p-3.5 md:p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-white">Next Evolution:</span>
            <span className="font-extrabold text-eco-400">{nextDef.title}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-slate-400">
            <div>
              XP:{' '}
              <strong className="text-sky-400">
                {gameState.xp}/{nextDef.minXP}
              </strong>
            </div>
            <div>
              Profit Target:{' '}
              <strong className="text-amber-400">
                ₹{gameState.stats.totalProfit.toLocaleString()}/₹{nextDef.minMoney.toLocaleString()}
              </strong>
            </div>
            <div>
              Recycled Target:{' '}
              <strong className="text-emerald-400">
                {gameState.stats.totalWasteRecycled}/{nextDef.minRecycled} kg
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 md:p-4 bg-eco-950/40 border-t border-eco-800/40 flex items-center justify-between text-xs text-eco-300">
          <span className="font-black flex items-center gap-1.5 text-sm text-emerald-400">
            🌟 Maximum Tier Achieved! You have built the ultimate Green City.
          </span>
        </div>
      )}
    </div>
  );
};
