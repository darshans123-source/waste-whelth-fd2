import React from 'react';
import { Home, GraduationCap, Building2, Factory, Trees, HardHat, Trash2, AlertCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LocationId } from '../../types/game';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const CollectScreen: React.FC = () => {
  const { gameState, collectWaste } = useGame();

  if (!gameState) return null;

  const storageCap =
    gameState.upgrades.storageLevel === 3
      ? 3000
      : gameState.upgrades.storageLevel === 2
      ? 1200
      : 500;
  const currentWeight = Object.values(gameState.collectedWaste).reduce((a, b) => a + b, 0);
  const isStorageFull = currentWeight >= storageCap;

  const locations: {
    id: LocationId;
    name: string;
    icon: any;
    color: string;
    wasteTypes: { type: string; label: string; icon: string; color: string }[];
  }[] = [
    {
      id: 'houses',
      name: '🏠 Residential Houses',
      icon: Home,
      color: 'from-emerald-600 to-teal-500',
      wasteTypes: [
        { type: 'organic', label: 'Organic', icon: '🟢', color: 'text-emerald-400' },
        { type: 'plastic', label: 'Plastic', icon: '🔵', color: 'text-blue-400' },
        { type: 'paper', label: 'Paper', icon: '🟡', color: 'text-amber-400' },
      ],
    },
    {
      id: 'schools',
      name: '🏫 Schools & Colleges',
      icon: GraduationCap,
      color: 'from-sky-600 to-cyan-500',
      wasteTypes: [
        { type: 'paper', label: 'Paper', icon: '🟡', color: 'text-amber-400' },
        { type: 'plastic', label: 'Plastic', icon: '🔵', color: 'text-blue-400' },
        { type: 'organic', label: 'Organic', icon: '🟢', color: 'text-emerald-400' },
      ],
    },
    {
      id: 'offices',
      name: '🏢 Commercial Offices',
      icon: Building2,
      color: 'from-indigo-600 to-violet-500',
      wasteTypes: [
        { type: 'paper', label: 'Paper', icon: '🟡', color: 'text-amber-400' },
        { type: 'plastic', label: 'Plastic', icon: '🔵', color: 'text-blue-400' },
        { type: 'ewaste', label: 'E-waste', icon: '🔴', color: 'text-rose-400' },
      ],
    },
    {
      id: 'factories',
      name: '🏭 Industrial Factories',
      icon: Factory,
      color: 'from-amber-600 to-orange-500',
      wasteTypes: [
        { type: 'metal', label: 'Metal', icon: '⚫', color: 'text-slate-300' },
        { type: 'plastic', label: 'Plastic', icon: '🔵', color: 'text-blue-400' },
        { type: 'ewaste', label: 'E-waste', icon: '🔴', color: 'text-rose-400' },
      ],
    },
    {
      id: 'parks',
      name: '🌳 City Parks & Greenery',
      icon: Trees,
      color: 'from-green-600 to-emerald-500',
      wasteTypes: [
        { type: 'organic', label: 'Organic', icon: '🟢', color: 'text-emerald-400' },
        { type: 'paper', label: 'Paper', icon: '🟡', color: 'text-amber-400' },
      ],
    },
    {
      id: 'construction',
      name: '🏗️ Construction Sites',
      icon: HardHat,
      color: 'from-stone-600 to-amber-700',
      wasteTypes: [
        { type: 'construction', label: 'C&D Waste', icon: '🟤', color: 'text-amber-600' },
        { type: 'metal', label: 'Metal', icon: '⚫', color: 'text-slate-300' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗑️</span>
            <h2 className="text-2xl font-black text-white">Waste Collection Hub</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Dispatch city collection routes across neighborhoods, campuses, and industrial zones.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Storage capacity indicator */}
          <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Warehouse Capacity</span>
            <span className={`font-mono font-black text-sm ${isStorageFull ? 'text-rose-400' : 'text-eco-400'}`}>
              {currentWeight} / {storageCap} kg
            </span>
          </div>

          {/* Collect All Button */}
          <Button
            variant="gold"
            size="md"
            onClick={() => collectWaste({ collectAll: true })}
            disabled={isStorageFull}
            icon={<Trash2 className="w-4 h-4 text-slate-950" />}
          >
            COLLECT ALL SECTORS
          </Button>
        </div>
      </div>

      {isStorageFull && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>
            <strong>Storage Full!</strong> Your central warehouse is at maximum capacity. Transport materials to recycling plants or upgrade warehouse storage in the Upgrade Shop.
          </span>
        </div>
      )}

      {/* 6 Location Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => {
          const uncollected = gameState.uncollectedWaste[loc.id] || {};
          const totalAtLoc = Object.values(uncollected).reduce((a, b) => a + (b || 0), 0);

          return (
            <Card key={loc.id} className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-base text-white">{loc.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-eco-400 border border-slate-700">
                    {totalAtLoc} kg ready
                  </span>
                </div>

                <div className="space-y-2 py-2">
                  {loc.wasteTypes.map((wt) => {
                    const qty = uncollected[wt.type as keyof typeof uncollected] || 0;
                    return (
                      <div
                        key={wt.type}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-800/50 border border-slate-700/50"
                      >
                        <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <span>{wt.icon}</span> {wt.label}
                        </span>
                        <span className="font-mono font-bold text-slate-300">{qty} kg</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => collectWaste({ locationId: loc.id })}
                disabled={isStorageFull || totalAtLoc <= 0}
                icon={<Trash2 className="w-4 h-4" />}
              >
                {totalAtLoc > 0 ? `COLLECT FROM SECTOR` : 'All Cleaned! ✨'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
