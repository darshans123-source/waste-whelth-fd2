import React, { useState } from 'react';
import { Truck, ArrowRight, Fuel, AlertCircle, ShieldCheck } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { WasteType } from '../../types/game';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

export const TransportScreen: React.FC = () => {
  const { gameState, transportWaste } = useGame();

  const [selectedType, setSelectedType] = useState<WasteType>('organic');
  const [transportQty, setTransportQty] = useState<number>(25);

  if (!gameState) return null;

  const truckCap =
    gameState.upgrades.truckLevel === 3
      ? 500
      : gameState.upgrades.truckLevel === 2
      ? 250
      : 100;

  const availableInWarehouse = gameState.collectedWaste[selectedType] || 0;

  // Operating cost calculation
  const discount =
    gameState.upgrades.solarPowerLevel === 2
      ? 0.6
      : gameState.upgrades.solarPowerLevel === 1
      ? 0.3
      : 0;
  const baseCost = Math.ceil(transportQty * 0.5);
  const cost = Math.max(1, Math.round(baseCost * (1 - discount)));

  const wasteTypesList: {
    type: WasteType;
    label: string;
    icon: string;
    destination: string;
  }[] = [
    { type: 'organic', label: 'Organic Waste', icon: '🟢', destination: 'Biogas & Compost Plant' },
    { type: 'plastic', label: 'Plastic Scrap', icon: '🔵', destination: 'Plastic Granulation Facility' },
    { type: 'paper', label: 'Paper & Card', icon: '🟡', destination: 'Paper Pulping Unit' },
    { type: 'glass', label: 'Glass Cullet', icon: '⚪', destination: 'Glass Smelting Plant' },
    { type: 'metal', label: 'Metal Scrap', icon: '⚫', destination: 'Metal Foundry' },
    { type: 'ewaste', label: 'E-waste Boards', icon: '🔴', destination: 'E-waste Refining Facility' },
    { type: 'construction', label: 'C&D Debris', icon: '🟤', destination: 'Aggregates & Pavers Plant' },
  ];

  const handleTransport = async () => {
    if (transportQty <= 0 || transportQty > availableInWarehouse) return;
    await transportWaste(selectedType, transportQty);
  };

  const handleSetMax = () => {
    const maxPossible = Math.min(availableInWarehouse, truckCap);
    setTransportQty(Math.max(1, maxPossible));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 md:pb-6 select-none max-w-5xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚛</span>
            <h2 className="text-2xl font-black text-white">Logistics & Fleet Transport</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Haul segregated waste from your city warehouse to specialized industrial processing plants.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Truck Fleet</span>
          <span className="font-mono font-black text-sm text-sky-400">
            Level {gameState.upgrades.truckLevel} • Max {truckCap} kg/trip
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Material Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider">
            1. Select Material in Warehouse
          </h3>
          <div className="space-y-2">
            {wasteTypesList.map((item) => {
              const inStock = gameState.collectedWaste[item.type] || 0;
              const isSelected = selectedType === item.type;

              return (
                <div
                  key={item.type}
                  onClick={() => {
                    setSelectedType(item.type);
                    setTransportQty(Math.min(inStock > 0 ? inStock : 25, truckCap));
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-eco-950/60 border-eco-400 text-white shadow-md'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-bold text-sm">{item.label}</div>
                      <div className="text-[11px] text-slate-400">→ {item.destination}</div>
                    </div>
                  </div>
                  <span className="font-mono font-black text-sm text-eco-400">{inStock} kg</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Dispatch Console */}
        <Card className="lg:col-span-2 space-y-6 flex flex-col justify-between" glow="eco">
          <div className="space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Truck className="w-5 h-5 text-eco-400" /> Dispatch Route Configuration
            </h3>

            {/* Route visualizer */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between">
              <div className="text-center">
                <span className="text-xs font-bold text-slate-400">ORIGIN</span>
                <div className="text-sm font-black text-white mt-1">Central Warehouse 📦</div>
                <div className="text-xs text-eco-400 font-mono font-bold mt-0.5">
                  Stock: {availableInWarehouse} kg
                </div>
              </div>

              <div className="flex flex-col items-center px-4">
                <ArrowRight className="w-6 h-6 text-eco-400 animate-pulse" />
                <span className="text-[10px] font-mono text-slate-400 mt-1">{transportQty} kg</span>
              </div>

              <div className="text-center">
                <span className="text-xs font-bold text-slate-400">DESTINATION</span>
                <div className="text-sm font-black text-white mt-1">
                  {wasteTypesList.find((w) => w.type === selectedType)?.destination} 🏭
                </div>
                <div className="text-xs text-teal-400 font-mono font-bold mt-0.5">
                  Plant Queue: {gameState.plantWaste[selectedType] || 0} kg
                </div>
              </div>
            </div>

            {/* Quantity Slider & Input */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Payload Quantity (kg):</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSetMax}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-eco-500/20 text-eco-300 border border-eco-500/30 hover:bg-eco-500/30"
                  >
                    MAX LOAD ({Math.min(availableInWarehouse, truckCap)} kg)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={Math.max(1, Math.min(availableInWarehouse || 1, truckCap))}
                  value={transportQty}
                  onChange={(e) => setTransportQty(parseInt(e.target.value, 10))}
                  disabled={availableInWarehouse <= 0}
                  className="w-full accent-eco-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="w-20 text-center font-mono font-black text-lg bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  {transportQty} kg
                </span>
              </div>
            </div>

            {/* Logistics Cost Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Fuel className="w-4 h-4 text-amber-400" />
                <span>Operating Fuel & Driver Fee:</span>
              </div>
              <div className="flex items-center gap-3">
                {discount > 0 && (
                  <span className="text-eco-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Solar -{Math.round(discount * 100)}%
                  </span>
                )}
                <span className="font-mono font-black text-sm text-amber-300">₹{cost}</span>
              </div>
            </div>

            {availableInWarehouse <= 0 && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>No {selectedType} in warehouse. Collect materials from city sectors first!</span>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            className="w-full py-4 text-base"
            onClick={handleTransport}
            disabled={availableInWarehouse <= 0 || gameState.money < cost || transportQty <= 0}
            icon={<Truck className="w-5 h-5" />}
          >
            DISPATCH LOGISTICS TRUCK (₹{cost})
          </Button>
        </Card>
      </div>
    </div>
  );
};
