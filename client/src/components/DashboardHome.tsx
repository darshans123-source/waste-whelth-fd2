import React from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency, formatWeight, formatNumber } from '../utils/formatters';
import { CityView } from './CityView';
import { Trash2, RefreshCw, ShoppingCart, DollarSign, Leaf, Zap, Award } from 'lucide-react';

export const DashboardHome: React.FC = () => {
  const {
    totalWasteCollected,
    totalWasteRecycled,
    totalProductsSold,
    totalProfit,
    greenScore,
    xp,
    cityLevel,
    wasteInventory,
    productInventory
  } = useGame();

  const totalWasteInHand = Object.values(wasteInventory).reduce((a, b) => a + b, 0);
  const totalProductsInHand = Object.values(productInventory).reduce((a, b) => a + b, 0);

  // Target XP for next city level
  const targetXpMap: Record<number, number> = { 1: 100, 2: 300, 3: 700, 4: 1500, 5: 3000 };
  const currentTargetXp = targetXpMap[cityLevel] || 3000;
  const xpPercent = Math.min(100, Math.round((xp / currentTargetXp) * 100));

  return (
    <div className="space-y-6">
      {/* Visual City Landscape */}
      <CityView />

      {/* Main Stats Grid */}
      <div>
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
          Empire Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Collected</span>
            </div>
            <div className="text-lg font-extrabold text-white">{formatWeight(totalWasteCollected)}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
              <span>Waste Recycled</span>
            </div>
            <div className="text-lg font-extrabold text-purple-300">{formatWeight(totalWasteRecycled)}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>Products Sold</span>
            </div>
            <div className="text-lg font-extrabold text-amber-300">{formatNumber(totalProductsSold)}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <DollarSign className="w-3.5 h-3.5 text-gold-400" />
              <span>Total Profit</span>
            </div>
            <div className="text-lg font-extrabold text-amber-400">{formatCurrency(totalProfit)}</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Leaf className="w-3.5 h-3.5 text-eco-400" />
              <span>Green Score</span>
            </div>
            <div className="text-lg font-extrabold text-eco-400">{greenScore} / 100</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>Current XP</span>
            </div>
            <div className="text-lg font-extrabold text-blue-300">{formatNumber(xp)}</div>
          </div>
        </div>
      </div>

      {/* Progress Bars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Green Progress */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-eco-400 flex items-center gap-1.5">
              <Leaf className="w-4 h-4" /> 🌱 Green Progress
            </span>
            <span className="text-white font-extrabold">{greenScore}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-eco-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${greenScore}%` }}
            />
          </div>
        </div>

        {/* City XP Advancement Progress */}
        <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-blue-400 flex items-center gap-1.5">
              <Award className="w-4 h-4" /> 🏙️ Level {cityLevel} Advancement XP
            </span>
            <span className="text-white font-extrabold">{xp} / {currentTargetXp} XP ({xpPercent}%)</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
