import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatCurrency } from '../utils/formatters';
import { Zap, Truck, RefreshCw, Factory, Warehouse, Sun, CheckCircle, ShieldAlert } from 'lucide-react';

export const UpgradesScreen: React.FC = () => {
  const { upgrades, money, buyUpgrade } = useGame();
  const [upgradingCategory, setUpgradingCategory] = useState<string | null>(null);

  const upgradeTrees = [
    {
      category: 'truck',
      title: 'Truck Fleet',
      icon: Truck,
      emoji: '🚛',
      levels: {
        1: { name: 'Basic Truck', benefit: 'Capacity: 100 kg', price: 0 },
        2: { name: 'Medium Truck', benefit: 'Capacity: 250 kg', price: 2000 },
        3: { name: 'Large Eco-Fleet', benefit: 'Capacity: 500 kg', price: 6000 }
      }
    },
    {
      category: 'sorter',
      title: 'Sorting Tech',
      icon: RefreshCw,
      emoji: '♻️',
      levels: {
        1: { name: 'Manual Sorting', benefit: 'Standard sorting speed', price: 0 },
        2: { name: 'Improved Mechanical Sorter', benefit: '+20% Sorting Accuracy XP', price: 3000 },
        3: { name: 'Smart AI Auto-Sorter', benefit: '+50% Sorting XP & Green Bonus', price: 8000 }
      }
    },
    {
      category: 'plant',
      title: 'Recycling Machinery',
      icon: Factory,
      emoji: '🏭',
      levels: {
        1: { name: 'Basic Plants', benefit: 'Standard conversion ratio', price: 0 },
        2: { name: 'Improved Plant Efficiency', benefit: '+15% Output Yield', price: 5000 },
        3: { name: 'Advanced High-Tech Facility', benefit: '+35% Output Yield & Speed', price: 12000 }
      }
    },
    {
      category: 'storage',
      title: 'Storage Silos',
      icon: Warehouse,
      emoji: '📦',
      levels: {
        1: { name: 'Basic Silo', benefit: 'Max Storage: 500 kg', price: 0 },
        2: { name: 'Warehouse Expansion', benefit: 'Max Storage: 1,500 kg', price: 2500 },
        3: { name: 'Mega Eco Logistics Center', benefit: 'Max Storage: 4,000 kg', price: 7000 }
      }
    },
    {
      category: 'solar',
      title: 'Solar & Clean Power',
      icon: Sun,
      emoji: '☀️',
      levels: {
        0: { name: 'Fossil Grid', benefit: 'Standard Operating Costs', price: 0 },
        1: { name: 'Rooftop Solar Panels', benefit: '+15 Green Score, -20% Plant Costs', price: 4000 },
        2: { name: 'Industrial Solar Grid', benefit: '+35 Green Score, -40% Plant Costs', price: 10000 }
      }
    }
  ];

  const handleBuy = async (cat: string) => {
    setUpgradingCategory(cat);
    await buyUpgrade(cat);
    setUpgradingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>Tech Upgrade Shop</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Upgrade Infrastructure</h2>
          <p className="text-slate-300 text-sm">
            Invest profits into fleet capacity, automated sorters, and clean renewable energy.
          </p>
        </div>
      </div>

      {/* Upgrade Trees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upgradeTrees.map((tree) => {
          const Icon = tree.icon;
          const currentLevel = upgrades[tree.category as keyof typeof upgrades] || 0;
          const nextLevel = currentLevel + 1;

          const currentInfo = tree.levels[currentLevel as keyof typeof tree.levels] || tree.levels[0 as keyof typeof tree.levels];
          const nextInfo = tree.levels[nextLevel as keyof typeof tree.levels];
          const isMax = !nextInfo;
          const canAfford = nextInfo ? money >= nextInfo.price : false;
          const isUpgrading = upgradingCategory === tree.category;

          return (
            <div
              key={tree.category}
              className="glass-card p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-5 hover:border-rose-500/40 transition-all shadow-xl"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                      {tree.emoji}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{tree.title}</h3>
                      <span className="text-xs font-extrabold text-rose-400">
                        Current: Level {currentLevel}
                      </span>
                    </div>
                  </div>
                  {isMax && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-eco-500/20 text-eco-400 border border-eco-500/40">
                      MAX LEVEL
                    </span>
                  )}
                </div>

                {/* Current Active Benefit */}
                <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 mb-3 space-y-1 text-xs">
                  <div className="text-slate-400 font-semibold">Active Tech:</div>
                  <div className="text-white font-bold">{currentInfo.name}</div>
                  <div className="text-eco-400 font-bold">{currentInfo.benefit}</div>
                </div>

                {/* Next Level Preview */}
                {!isMax && nextInfo && (
                  <div className="bg-rose-950/20 p-3.5 rounded-2xl border border-rose-500/30 space-y-1 text-xs">
                    <div className="text-slate-400 font-semibold">Next Level {nextLevel} Upgrade:</div>
                    <div className="text-rose-300 font-bold">{nextInfo.name}</div>
                    <div className="text-slate-300 font-medium">{nextInfo.benefit}</div>
                    <div className="text-amber-300 font-extrabold text-sm pt-1">
                      Price: {formatCurrency(nextInfo.price)}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!isMax && nextInfo ? (
                <button
                  onClick={() => handleBuy(tree.category)}
                  disabled={!canAfford || isUpgrading}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                    canAfford
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/20 active:scale-98'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {isUpgrading ? 'Upgrading...' : canAfford ? `BUY UPGRADE (${formatCurrency(nextInfo.price)})` : 'Not Enough Money'}
                  </span>
                </button>
              ) : (
                <div className="py-3 text-center text-xs font-extrabold text-eco-400 flex items-center justify-center gap-1.5 bg-slate-900/80 rounded-2xl border border-eco-500/30">
                  <CheckCircle className="w-4 h-4" />
                  <span>FULLY UPGRADED</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
