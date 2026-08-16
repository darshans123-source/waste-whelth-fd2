import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatWeight } from '../utils/formatters';
import { Factory, Cog, ArrowDown, Sparkles, Play } from 'lucide-react';

export const RecyclingScreen: React.FC = () => {
  const { wasteInventory, recycleWaste } = useGame();
  const [processingType, setProcessingType] = useState<string | null>(null);

  const plants = [
    {
      id: 'organic',
      name: 'Biogas & Compost Facility',
      inputName: 'Organic Waste',
      inputKey: 'organic',
      emoji: '🟢',
      output: 'Compost + Biogas',
      conversion: '50 kg → 40 kg Compost + 10 units Biogas',
      color: 'border-emerald-500/40 bg-emerald-950/20'
    },
    {
      id: 'plastic',
      name: 'Plastic Recycling Plant',
      inputName: 'Plastic Waste',
      inputKey: 'plastic',
      emoji: '🔵',
      output: 'Plastic Granules',
      conversion: '50 kg → 40 kg Plastic Granules',
      color: 'border-blue-500/40 bg-blue-950/20'
    },
    {
      id: 'paper',
      name: 'Paper & Cardboard Mill',
      inputName: 'Paper Waste',
      inputKey: 'paper',
      emoji: '🟡',
      output: 'Cardboard Sheets',
      conversion: '50 kg → 40 kg Cardboard',
      color: 'border-amber-500/40 bg-amber-950/20'
    },
    {
      id: 'glass',
      name: 'Glass Recycling Unit',
      inputName: 'Glass Waste',
      inputKey: 'glass',
      emoji: '⚪',
      output: 'Glass Bottles',
      conversion: '50 kg → 40 kg Glass Bottles',
      color: 'border-slate-300/40 bg-slate-800/20'
    },
    {
      id: 'metal',
      name: 'Metal Smelting Plant',
      inputName: 'Metal Scrap',
      inputKey: 'metal',
      emoji: '⚫',
      output: 'Metal Ingots',
      conversion: '50 kg → 40 kg Metal Ingots',
      color: 'border-slate-500/40 bg-slate-900/40'
    },
    {
      id: 'ewaste',
      name: 'E-waste Recovery Facility',
      inputName: 'E-Waste',
      inputKey: 'ewaste',
      emoji: '🔴',
      output: 'Recovered Precious Metals',
      conversion: '50 kg → 35 kg Recovered Metals',
      color: 'border-rose-500/40 bg-rose-950/20'
    },
    {
      id: 'construction',
      name: 'C&D Debris Processing Plant',
      inputName: 'Construction Waste',
      inputKey: 'construction',
      emoji: '🟤',
      output: 'Aggregates + Paver Blocks',
      conversion: '50 kg → 30 kg Aggregates + 15 Paver Blocks',
      color: 'border-stone-500/40 bg-stone-950/20'
    }
  ];

  const handleProcess = async (wasteType: string, qty: number) => {
    setProcessingType(wasteType);
    await recycleWaste(wasteType, qty);
    setProcessingType(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Factory className="w-4 h-4" />
            <span>Industrial Recycling Complex</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Process Raw Waste into Value</h2>
          <p className="text-slate-300 text-sm">
            Transform municipal waste into high-demand secondary eco-products.
          </p>
        </div>
      </div>

      {/* Plants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plants.map((plant) => {
          const availableQty = wasteInventory[plant.inputKey as keyof typeof wasteInventory] || 0;
          const isProcessing = processingType === plant.inputKey;
          const processBatchSize = Math.min(availableQty, 50);

          return (
            <div
              key={plant.id}
              className={`glass-card p-6 rounded-3xl border ${plant.color} flex flex-col justify-between space-y-4 shadow-xl hover:border-purple-500/50 transition-all`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{plant.emoji}</span>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{plant.name}</h3>
                      <span className="text-xs text-eco-400 font-bold">
                        Stock: {formatWeight(availableQty)}
                      </span>
                    </div>
                  </div>
                  {isProcessing && (
                    <Cog className="w-6 h-6 text-purple-400 animate-spin" />
                  )}
                </div>

                <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                  <div className="text-slate-400 font-semibold">Yield Ratio:</div>
                  <div className="text-purple-300 font-bold">{plant.conversion}</div>
                  <div className="text-slate-400 font-semibold pt-1">Output Product:</div>
                  <div className="text-white font-extrabold">{plant.output}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleProcess(plant.inputKey, 50)}
                  disabled={availableQty < 10 || isProcessing}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PROCESS BATCH (50 kg)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
