import React from 'react';
import { ArrowUpCircle, Truck, Boxes, Factory, Warehouse, Sun, Sparkles, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { UPGRADE_PRICES } from '../../services/gameStateEngine';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const UpgradeScreen: React.FC = () => {
  const { gameState, buyUpgrade } = useGame();

  if (!gameState) return null;

  const upgradesConfig = [
    {
      key: 'truck',
      title: 'Logistics Fleet & Trucks',
      icon: Truck,
      color: 'from-blue-600 to-indigo-600',
      currentLevel: gameState.upgrades.truckLevel,
      maxLevel: 3,
      levels: {
        1: { name: 'Basic Light Truck', benefit: 'Capacity: 100 kg payload' },
        2: { name: 'Medium Freight Truck', benefit: 'Capacity: 250 kg payload', cost: UPGRADE_PRICES.truck[2].cost },
        3: { name: 'Heavy-Duty Electric Hauler', benefit: 'Capacity: 500 kg payload', cost: UPGRADE_PRICES.truck[3].cost },
      },
    },
    {
      key: 'sorter',
      title: 'Segregation & Sorting Station',
      icon: Boxes,
      color: 'from-emerald-600 to-teal-600',
      currentLevel: gameState.upgrades.sorterLevel,
      maxLevel: 3,
      levels: {
        1: { name: 'Manual Hand Sorter', benefit: 'Base XP & standard scoring' },
        2: { name: 'Improved Optical Conveyor', benefit: '+25% XP bonus per correct sort', cost: UPGRADE_PRICES.sorter[2].cost },
        3: { name: 'Smart AI Robotic Sorter', benefit: '+60% XP bonus & accuracy booster', cost: UPGRADE_PRICES.sorter[3].cost },
      },
    },
    {
      key: 'recycling',
      title: 'Recycling Processing Plants',
      icon: Factory,
      color: 'from-amber-600 to-orange-600',
      currentLevel: gameState.upgrades.recyclingLevel,
      maxLevel: 3,
      levels: {
        1: { name: 'Basic Processing Units', benefit: '75% Product Conversion Yield' },
        2: { name: 'Improved Industrial Plants', benefit: '85% Product Conversion Yield', cost: UPGRADE_PRICES.recycling[2].cost },
        3: { name: 'Advanced High-Tech Facility', benefit: '95% Product Conversion Yield', cost: UPGRADE_PRICES.recycling[3].cost },
      },
    },
    {
      key: 'storage',
      title: 'Central Storage Warehouse',
      icon: Warehouse,
      color: 'from-purple-600 to-pink-600',
      currentLevel: gameState.upgrades.storageLevel,
      maxLevel: 3,
      levels: {
        1: { name: 'Small Shed', benefit: '500 kg maximum waste inventory' },
        2: { name: 'Medium Warehouse Hub', benefit: '1,200 kg maximum waste inventory', cost: UPGRADE_PRICES.storage[2].cost },
        3: { name: 'Mega Logistics Depot', benefit: '3,000 kg maximum waste inventory', cost: UPGRADE_PRICES.storage[3].cost },
      },
    },
    {
      key: 'solarPower',
      title: 'Clean Solar Power Grid',
      icon: Sun,
      color: 'from-yellow-500 to-amber-600',
      currentLevel: gameState.upgrades.solarPowerLevel,
      maxLevel: 2,
      levels: {
        0: { name: 'Grid Dependent', benefit: 'No discounts or clean energy bonus' },
        1: { name: 'Solar Rooftop Array', benefit: '-30% transport costs & +10 Green Score', cost: UPGRADE_PRICES.solarPower[1].cost },
        2: { name: 'Utility Solar & Battery Farm', benefit: '-60% transport costs & +25 Green Score', cost: UPGRADE_PRICES.solarPower[2].cost },
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⬆️</span>
            <h2 className="text-2xl font-black text-white">Upgrade Workshop & Infrastructure</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Invest your profits to expand logistical capacity, boost plant yields, and power your city with solar energy.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex flex-col items-end">
          <span className="text-[10px] font-bold text-amber-300 uppercase">Available Capital</span>
          <span className="font-mono font-black text-lg text-amber-400">
            ₹{gameState.money.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Upgrades Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {upgradesConfig.map((item) => {
          const Icon = item.icon;
          const isMaxed = item.currentLevel >= item.maxLevel;
          const nextLevelNum = item.currentLevel + 1;
          const currentConfig = (item.levels as any)[item.currentLevel];
          const nextConfig = (item.levels as any)[nextLevelNum];
          const cost = nextConfig?.cost || 0;
          const canAfford = gameState.money >= cost;

          return (
            <Card key={item.key} className="flex flex-col justify-between space-y-4" hoverEffect>
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-white">{item.title}</h3>
                      <span className="text-xs text-eco-400 font-bold">
                        Tier {item.currentLevel} / {item.maxLevel}
                      </span>
                    </div>
                  </div>

                  {isMaxed && (
                    <span className="px-2.5 py-1 rounded-xl text-xs font-black bg-eco-500/20 text-eco-300 border border-eco-500/40 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> MAX
                    </span>
                  )}
                </div>

                {/* Current vs Next Level Details */}
                <div className="space-y-2 py-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Current Tier:</div>
                    <div className="font-bold text-slate-200 mt-0.5">{currentConfig?.name}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{currentConfig?.benefit}</div>
                  </div>

                  {!isMaxed && nextConfig && (
                    <div className="p-3 rounded-xl bg-eco-950/30 border border-eco-500/30">
                      <div className="text-[10px] font-bold text-eco-400 uppercase">Next Upgrade:</div>
                      <div className="font-bold text-white mt-0.5">{nextConfig.name}</div>
                      <div className="text-eco-300 text-[11px] mt-0.5 font-semibold">{nextConfig.benefit}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <div>
                {!isMaxed ? (
                  <Button
                    variant={canAfford ? 'gold' : 'secondary'}
                    size="md"
                    className="w-full"
                    onClick={() => buyUpgrade(item.key)}
                    disabled={!canAfford}
                    icon={<Sparkles className="w-4 h-4" />}
                  >
                    {canAfford
                      ? `UPGRADE TO TIER ${nextLevelNum} (₹${cost.toLocaleString()})`
                      : `Requires ₹${cost.toLocaleString()}`}
                  </Button>
                ) : (
                  <div className="py-2.5 text-center text-xs font-bold text-eco-400 bg-eco-500/10 rounded-2xl border border-eco-500/20">
                    Fully Upgraded to Peak Performance ✨
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
