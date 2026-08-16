import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatWeight } from '../utils/formatters';
import { Trash2, Home, GraduationCap, Building2, Factory, Trees, HardHat, Zap, HardDriveUpload } from 'lucide-react';

export const CollectionScreen: React.FC = () => {
  const { collectWaste, wasteInventory, upgrades } = useGame();
  const [loadingLoc, setLoadingLoc] = useState<string | null>(null);

  const maxStorage = upgrades.storage === 1 ? 500 : upgrades.storage === 2 ? 1500 : 4000;
  const currentTotalWaste = Object.values(wasteInventory).reduce((a, b) => a + b, 0);
  const storagePercentage = Math.min(100, Math.round((currentTotalWaste / maxStorage) * 100));

  const locations = [
    {
      id: 'houses',
      name: 'Houses',
      icon: Home,
      wasteTypes: ['🟢 Organic', '🔵 Plastic', '🟡 Paper'],
      yield: '35–45 kg',
      bgColor: 'border-emerald-500/30 bg-emerald-950/20'
    },
    {
      id: 'schools',
      name: 'Schools',
      icon: GraduationCap,
      wasteTypes: ['🟡 Paper', '🔵 Plastic', '🟢 Organic'],
      yield: '40–50 kg',
      bgColor: 'border-blue-500/30 bg-blue-950/20'
    },
    {
      id: 'offices',
      name: 'Offices',
      icon: Building2,
      wasteTypes: ['🟡 Paper', '🔵 Plastic', '🔴 E-waste'],
      yield: '45–55 kg',
      bgColor: 'border-purple-500/30 bg-purple-950/20'
    },
    {
      id: 'factories',
      name: 'Factories',
      icon: Factory,
      wasteTypes: ['⚫ Metal', '🔵 Plastic', '🔴 E-waste'],
      yield: '50–60 kg',
      bgColor: 'border-amber-500/30 bg-amber-950/20'
    },
    {
      id: 'parks',
      name: 'Parks',
      icon: Trees,
      wasteTypes: ['🟢 Organic', '🟡 Paper'],
      yield: '30–50 kg',
      bgColor: 'border-teal-500/30 bg-teal-950/20'
    },
    {
      id: 'construction',
      name: 'Construction Sites',
      icon: HardHat,
      wasteTypes: ['🟤 Construction Waste', '⚫ Metal'],
      yield: '50–70 kg',
      bgColor: 'border-stone-500/30 bg-stone-950/20'
    }
  ];

  const handleCollect = async (locId: string) => {
    setLoadingLoc(locId);
    await collectWaste(locId);
    setLoadingLoc(null);
  };

  const handleCollectAll = async () => {
    setLoadingLoc('all');
    for (const loc of locations) {
      await collectWaste(loc.id);
    }
    setLoadingLoc(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Storage Gauge */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-eco-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Trash2 className="w-4 h-4" />
            <span>Waste Collection Hub</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Gather Raw Municipal Waste</h2>
          <p className="text-slate-300 text-sm">
            Collect recyclable materials from neighborhood locations to supply your processing plants.
          </p>
        </div>

        {/* Capacity Progress Bar */}
        <div className="w-full md:w-72 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Storage Capacity</span>
            <span className={storagePercentage >= 90 ? 'text-rose-400 font-extrabold' : 'text-eco-400'}>
              {formatWeight(currentTotalWaste)} / {formatWeight(maxStorage)}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                storagePercentage >= 90
                  ? 'bg-rose-500'
                  : storagePercentage >= 70
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-eco-500 to-emerald-400'
              }`}
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-semibold">{storagePercentage}% Full</span>
            <button
              onClick={handleCollectAll}
              disabled={loadingLoc === 'all' || currentTotalWaste >= maxStorage}
              className="text-xs font-extrabold text-eco-400 hover:text-eco-300 flex items-center gap-1 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>COLLECT ALL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => {
          const Icon = loc.icon;
          const isFull = currentTotalWaste >= maxStorage;
          const isLoading = loadingLoc === loc.id;

          return (
            <div
              key={loc.id}
              className={`glass-card p-5 rounded-2xl border ${loc.bgColor} flex flex-col justify-between space-y-4 hover:border-eco-500/50 transition-all`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-eco-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{loc.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">Est. Yield: {loc.yield}</p>
                  </div>
                </div>
              </div>

              {/* Waste types tags */}
              <div className="flex flex-wrap gap-1.5">
                {loc.wasteTypes.map((wt, i) => (
                  <span key={i} className="bg-slate-900/90 text-slate-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-800">
                    {wt}
                  </span>
                ))}
              </div>

              {/* Collect Button */}
              <button
                onClick={() => handleCollect(loc.id)}
                disabled={isFull || isLoading}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  isFull
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-eco-500 to-emerald-600 hover:from-eco-400 hover:to-emerald-500 text-slate-950 shadow-eco-500/20 active:scale-98'
                }`}
              >
                {isLoading ? (
                  <span>Collecting...</span>
                ) : isFull ? (
                  <span>Storage Full</span>
                ) : (
                  <>
                    <HardDriveUpload className="w-4 h-4" />
                    <span>COLLECT WASTE</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
