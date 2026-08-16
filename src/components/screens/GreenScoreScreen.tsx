import React from 'react';
import { Leaf, Sun, CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GreenScoreMeter } from '../common/GreenScoreMeter';
import { Card } from '../common/Card';

export const GreenScoreScreen: React.FC = () => {
  const { gameState, setActiveTab } = useGame();

  if (!gameState) return null;

  const sortingTotal = gameState.stats.totalCorrectSorts + gameState.stats.totalWrongSorts;
  const sortingAccuracy = sortingTotal > 0 ? Math.round((gameState.stats.totalCorrectSorts / sortingTotal) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <h2 className="text-2xl font-black text-white">City Green Score & Eco Metrics</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Real-time environmental health calculation measuring clean energy, recycling ratio, and segregation accuracy.
          </p>
        </div>
      </div>

      {/* Main Gauge and Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="flex flex-col items-center justify-center p-8 text-center space-y-4" glow="eco">
          <GreenScoreMeter score={gameState.greenScore} size={160} strokeWidth={14} />
          <div>
            <h3 className="text-xl font-black text-white">Current Eco Rating</h3>
            <p className="text-xs text-slate-300 mt-1">
              Your city is operating at {gameState.greenScore}% of optimal circular potential.
            </p>
          </div>
        </Card>

        {/* Contributing Factors Breakdown */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-eco-400" /> Score Breakdown Factors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Solar Contribution */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                  <Sun className="w-4 h-4" /> Solar Power Grid
                </span>
                <span className="font-mono font-bold text-xs text-eco-400">
                  {gameState.upgrades.solarPowerLevel === 2
                    ? '+28 pts'
                    : gameState.upgrades.solarPowerLevel === 1
                    ? '+12 pts'
                    : '0 pts'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {gameState.upgrades.solarPowerLevel > 0
                  ? `Level ${gameState.upgrades.solarPowerLevel} active array installed`
                  : 'Install solar arrays in Upgrade Shop'}
              </p>
            </div>

            {/* Recycled Volume */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-bold text-xs text-teal-300">
                  <Leaf className="w-4 h-4" /> Recycled Conversion
                </span>
                <span className="font-mono font-bold text-xs text-eco-400">
                  +{Math.min(40, Math.floor(gameState.stats.totalWasteRecycled / 25))} pts
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {gameState.stats.totalWasteRecycled.toLocaleString()} kg total processed into products
              </p>
            </div>

            {/* Sorting Accuracy */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-bold text-xs text-sky-300">
                  <CheckCircle2 className="w-4 h-4" /> Sorting Precision
                </span>
                <span className="font-mono font-bold text-xs text-eco-400">
                  {sortingAccuracy}% ({gameState.stats.totalCorrectSorts} correct)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Play the Sort Mini-Game with zero mistakes for maximum score
              </p>
            </div>

            {/* Infrastructure Tier */}
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 font-bold text-xs text-purple-300">
                  <TrendingUp className="w-4 h-4" /> Infrastructure Upgrades
                </span>
                <span className="font-mono font-bold text-xs text-eco-400">
                  +
                  {Math.min(
                    12,
                    (gameState.upgrades.truckLevel +
                      gameState.upgrades.sorterLevel +
                      gameState.upgrades.recyclingLevel +
                      gameState.upgrades.storageLevel) *
                      2
                  )}{' '}
                  pts
                </span>
              </div>
              <p className="text-[11px] text-slate-400">High efficiency plants and smart fleet</p>
            </div>
          </div>

          {/* Actionable Tips */}
          <div className="p-4 rounded-2xl bg-eco-950/40 border border-eco-500/30 text-xs text-eco-200 mt-4">
            <h4 className="font-black text-white mb-1.5 flex items-center gap-1.5">
              <span>💡</span> How to Achieve 100 / 100 Green Score:
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Upgrade to Utility Solar Farm (+28 Green Score).</li>
              <li>Keep sorting accuracy above 95% in the sorting mini-game.</li>
              <li>Recycle at least 1,000 kg of accumulated materials in plants.</li>
              <li>Max out all facility upgrades in the Upgrade Shop.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
