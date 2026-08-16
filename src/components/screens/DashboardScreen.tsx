import React from 'react';
import {
  Trash2,
  Boxes,
  Truck,
  Factory,
  ShoppingBag,
  ArrowUpCircle,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CityVisualizer } from '../layout/CityVisualizer';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { GreenScoreMeter } from '../common/GreenScoreMeter';

export const DashboardScreen: React.FC = () => {
  const { gameState, setActiveTab, triggerRandomEvent } = useGame();

  if (!gameState) return null;

  const totalCollectedWeight = Object.values(gameState.collectedWaste).reduce((a, b) => a + b, 0);
  const totalPlantWeight = Object.values(gameState.plantWaste).reduce((a, b) => a + b, 0);
  const totalProductsCount = Object.values(gameState.products).reduce((a, b) => a + b, 0);

  const mainActions = [
    {
      id: 'collect' as const,
      title: 'Collect Waste',
      subtitle: 'Gather materials from 6 city sectors',
      icon: Trash2,
      color: 'from-emerald-600 to-teal-500',
      badge: 'Step 1',
    },
    {
      id: 'sort' as const,
      title: 'Sort Waste',
      subtitle: 'Play interactive 7-bin mini game',
      icon: Boxes,
      color: 'from-blue-600 to-cyan-500',
      badge: 'Step 2',
    },
    {
      id: 'transport' as const,
      title: 'Transport Logistics',
      subtitle: 'Dispatch truck fleet to plants',
      icon: Truck,
      color: 'from-indigo-600 to-violet-500',
      badge: 'Step 3',
    },
    {
      id: 'recycle' as const,
      title: 'Recycling Plants',
      subtitle: 'Convert raw waste to finished goods',
      icon: Factory,
      color: 'from-amber-600 to-orange-500',
      badge: 'Step 4',
    },
    {
      id: 'market' as const,
      title: 'Marketplace',
      subtitle: 'Sell products & earn revenue',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-green-600',
      badge: 'Step 5',
    },
    {
      id: 'upgrade' as const,
      title: 'Upgrade Shop',
      subtitle: 'Enhance trucks, plants & solar',
      icon: ArrowUpCircle,
      color: 'from-purple-600 to-pink-500',
      badge: 'Step 6',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* Visual City Progression Illustration */}
      <CityVisualizer gameState={gameState} onUpgradeClick={() => setActiveTab('upgrade')} />

      {/* Primary Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Total Collected */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Collected</span>
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">🗑️</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {gameState.stats.totalWasteCollected.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-eco-400 font-semibold">
            In Warehouse: {totalCollectedWeight} kg
          </div>
        </Card>

        {/* Waste Recycled */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Waste Recycled</span>
            <span className="p-1.5 rounded-xl bg-teal-500/20 text-teal-400">♻️</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {gameState.stats.totalWasteRecycled.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-teal-400 font-semibold">
            At Plants: {totalPlantWeight} kg
          </div>
        </Card>

        {/* Products Sold */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Products Sold</span>
            <span className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400">📦</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-white font-mono">
            {gameState.stats.totalProductsSold.toLocaleString()} <span className="text-sm font-normal text-slate-400">units</span>
          </div>
          <div className="mt-2 text-[11px] text-sky-400 font-semibold">
            Ready in Inventory: {totalProductsCount} units
          </div>
        </Card>

        {/* Total Profit */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Total Profit</span>
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">💰</span>
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-300 font-mono">
            ₹{gameState.stats.totalProfit.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Net Operations
          </div>
        </Card>
      </div>

      {/* Green Score & Circular Progression Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Circular Green Gauge Card */}
        <Card className="flex items-center justify-around gap-4" glow="eco">
          <GreenScoreMeter score={gameState.greenScore} size={120} strokeWidth={11} />
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-eco-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Sustainability Index
            </div>
            <h4 className="text-lg font-black text-white">Green Score Progress</h4>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              Boost your score by sorting with high accuracy, installing solar arrays, and keeping zero waste in landfills.
            </p>
            <button
              onClick={() => setActiveTab('greenscore')}
              className="mt-3 text-xs font-bold text-eco-400 hover:text-eco-300 underline underline-offset-4 flex items-center gap-1"
            >
              View Detailed Metrics →
            </button>
          </div>
        </Card>

        {/* Progress Bars Card */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-black text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400" /> City Sustainability Bars
            </h4>
            <button
              onClick={() => triggerRandomEvent()}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> Check Live Events
            </button>
          </div>

          <ProgressBar
            value={gameState.greenScore}
            max={100}
            label="🌱 Green City Health"
            color="eco"
          />

          <ProgressBar
            value={gameState.xp % 1000}
            max={1000}
            label="⭐ Experience (XP) to Milestone"
            color="gold"
          />

          <ProgressBar
            value={totalCollectedWeight}
            max={
              gameState.upgrades.storageLevel === 3
                ? 3000
                : gameState.upgrades.storageLevel === 2
                ? 1200
                : 500
            }
            label={`📦 Warehouse Capacity (${totalCollectedWeight} / ${
              gameState.upgrades.storageLevel === 3
                ? 3000
                : gameState.upgrades.storageLevel === 2
                ? 1200
                : 500
            } kg)`}
            color="sky"
          />
        </Card>
      </div>

      {/* Main Core Gameplay Matrix */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>⚙️</span> Circular Economy Core Loop
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Select an operation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {mainActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => setActiveTab(action.id)}
                className="glass-card glass-card-hover rounded-3xl p-5 border border-white/10 flex items-start gap-4 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-base text-white group-hover:text-eco-400 transition">
                      {action.title}
                    </h4>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      {action.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{action.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
