import React, { useState } from 'react';
import { Factory, Sparkles, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { WasteType } from '../../types/game';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const RecycleScreen: React.FC = () => {
  const { gameState, recycleWaste } = useGame();
  const [processingType, setProcessingType] = useState<WasteType | null>(null);

  if (!gameState) return null;

  const plantEfficiencyLevel = gameState.upgrades.recyclingLevel || 1;
  const yieldRatePct = plantEfficiencyLevel === 3 ? 95 : plantEfficiencyLevel === 2 ? 85 : 75;

  const plants: {
    type: WasteType;
    name: string;
    icon: string;
    color: string;
    inputName: string;
    outputs: { name: string; icon: string; ratio: string }[];
  }[] = [
    {
      type: 'organic',
      name: 'Biogas & Composting Facility',
      icon: '🌱',
      color: 'from-emerald-600 to-teal-600',
      inputName: 'Organic Waste',
      outputs: [
        { name: 'Compost', icon: '🌱', ratio: '60%' },
        { name: 'Biogas', icon: '🔥', ratio: '40%' },
      ],
    },
    {
      type: 'plastic',
      name: 'Polymer Granulation Plant',
      icon: '♻️',
      color: 'from-blue-600 to-cyan-600',
      inputName: 'Plastic Scrap',
      outputs: [{ name: 'Plastic Granules', icon: '♻️', ratio: '100%' }],
    },
    {
      type: 'paper',
      name: 'Paper Pulping & Mill',
      icon: '📦',
      color: 'from-amber-600 to-yellow-600',
      inputName: 'Paper & Card',
      outputs: [{ name: 'Cardboard', icon: '📦', ratio: '100%' }],
    },
    {
      type: 'glass',
      name: 'Glass Smelting & Molding',
      icon: '🍾',
      color: 'from-slate-600 to-zinc-600',
      inputName: 'Glass Cullet',
      outputs: [{ name: 'Glass Bottles', icon: '🍾', ratio: '100%' }],
    },
    {
      type: 'metal',
      name: 'Metal Smelting Foundry',
      icon: '🔩',
      color: 'from-zinc-700 to-slate-800',
      inputName: 'Metal Scrap',
      outputs: [{ name: 'Metal Ingots', icon: '🔩', ratio: '100%' }],
    },
    {
      type: 'ewaste',
      name: 'E-waste Refining Facility',
      icon: '⚙️',
      color: 'from-rose-600 to-red-700',
      inputName: 'E-waste PCB',
      outputs: [{ name: 'Recovered Precious Metals', icon: '⚙️', ratio: '100%' }],
    },
    {
      type: 'construction',
      name: 'C&D Debris Upcycling Unit',
      icon: '🧱',
      color: 'from-stone-600 to-amber-800',
      inputName: 'C&D Waste',
      outputs: [
        { name: 'Paver Blocks', icon: '🧱', ratio: '50%' },
        { name: 'Aggregates', icon: '🪨', ratio: '50%' },
      ],
    },
  ];

  const handleProcess = async (type: WasteType, qty: number) => {
    setProcessingType(type);
    await recycleWaste(type, qty);
    setTimeout(() => {
      setProcessingType(null);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-6xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <h2 className="text-2xl font-black text-white">Circular Recycling Plants</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Transform raw segregated waste materials into valuable high-demand finished products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Plant Tech Tier</span>
            <span className="font-mono font-black text-sm text-eco-400">
              Level {plantEfficiencyLevel} • {yieldRatePct}% Yield
            </span>
          </div>
        </div>
      </div>

      {/* 7 Industrial Plant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plants.map((plant) => {
          const availableAtPlant = gameState.plantWaste[plant.type] || 0;
          const isProcessing = processingType === plant.type;

          return (
            <Card key={plant.type} className="flex flex-col justify-between space-y-4" hoverEffect>
              <div>
                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{plant.icon}</span>
                    <div>
                      <h3 className="font-black text-base text-white">{plant.name}</h3>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Input: {plant.inputName}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-slate-800 text-teal-300 border border-slate-700">
                    {availableAtPlant} kg queued
                  </span>
                </div>

                {/* Conversion Equation Visual */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between my-3 text-xs">
                  <div className="text-center font-bold text-slate-300">
                    <div>{plant.inputName}</div>
                    <span className="text-slate-500 font-mono text-[10px]">100 kg</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <ArrowRight className="w-4 h-4 text-eco-400" />
                    <span className="text-[10px] font-mono text-eco-400 font-bold">{yieldRatePct}% Yield</span>
                  </div>

                  <div className="text-right">
                    {plant.outputs.map((out) => (
                      <div key={out.name} className="flex items-center justify-end gap-1 font-bold text-emerald-300">
                        <span>{out.icon}</span>
                        <span>{out.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => handleProcess(plant.type, Math.min(availableAtPlant, 50))}
                  disabled={availableAtPlant <= 0 || isProcessing}
                  icon={
                    isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )
                  }
                >
                  {availableAtPlant > 0
                    ? `PROCESS ${Math.min(availableAtPlant, 50)} KG`
                    : 'Awaiting Transport 🚛'}
                </Button>

                {availableAtPlant > 50 && (
                  <Button
                    variant="gold"
                    size="md"
                    onClick={() => handleProcess(plant.type, availableAtPlant)}
                    disabled={isProcessing}
                    icon={<Zap className="w-4 h-4 text-slate-950" />}
                  >
                    PROCESS ALL
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
