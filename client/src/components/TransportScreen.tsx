import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatWeight, formatCurrency } from '../utils/formatters';
import { Truck, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';

export const TransportScreen: React.FC = () => {
  const { wasteInventory, upgrades, money, addToast, setActiveTab } = useGame();
  
  const truckCapacity = upgrades.truck === 1 ? 100 : upgrades.truck === 2 ? 250 : 500;
  const [selectedWaste, setSelectedWaste] = useState<string>('plastic');
  const [quantity, setQuantity] = useState<number>(50);
  const [loading, setLoading] = useState(false);

  const availableTypes = [
    { key: 'organic', name: 'Organic Waste', emoji: '🟢', plant: 'Biogas Plant' },
    { key: 'plastic', name: 'Plastic Waste', emoji: '🔵', plant: 'Plastic Recycling Plant' },
    { key: 'paper', name: 'Paper & Cardboard', emoji: '🟡', plant: 'Paper Recycling Unit' },
    { key: 'glass', name: 'Glass Bottles', emoji: '⚪', plant: 'Glass Recycling Plant' },
    { key: 'metal', name: 'Metal Scrap', emoji: '⚫', plant: 'Metal Recycling Plant' },
    { key: 'ewaste', name: 'E-Waste', emoji: '🔴', plant: 'E-waste Facility' },
    { key: 'construction', name: 'C&D Debris', emoji: '🟤', plant: 'C&D Recycling Plant' }
  ];

  const currentAvailable = wasteInventory[selectedWaste as keyof typeof wasteInventory] || 0;
  const transportCost = Math.ceil(quantity * 0.5); // ₹0.5 per kg fuel cost

  const handleTransport = async () => {
    if (quantity > currentAvailable) {
      addToast(`Not enough ${selectedWaste} waste collected!`, 'warning');
      return;
    }
    if (quantity > truckCapacity) {
      addToast(`Exceeds truck capacity (${truckCapacity} kg). Upgrade truck in shop!`, 'warning');
      return;
    }
    if (money < transportCost) {
      addToast(`Not enough money for transport fuel (Requires ${formatCurrency(transportCost)})`, 'warning');
      return;
    }

    soundFx.playTruckTransport();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast(`🚛 Transported ${quantity} kg ${selectedWaste.toUpperCase()} to plant!`, 'success');
      setActiveTab('recycle');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Truck Info */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" />
            <span>Transport Logistics</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Dispatch Logistics Fleet</h2>
          <p className="text-slate-300 text-sm">
            Transport collected raw waste to specialized processing plants.
          </p>
        </div>

        {/* Truck Upgrade Status */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center text-2xl">
            🚛
          </div>
          <div>
            <div className="text-xs text-slate-400 font-bold">Truck Fleet (Level {upgrades.truck})</div>
            <div className="text-base font-extrabold text-white">
              Max Payload: <span className="text-blue-400">{truckCapacity} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Form Container */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white">Configure Shipment</h3>

        {/* Select Waste Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Select Waste Type & Destination
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableTypes.map((item) => {
              const qty = wasteInventory[item.key as keyof typeof wasteInventory] || 0;
              const isSelected = selectedWaste === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelectedWaste(item.key);
                    setQuantity(Math.min(qty, truckCapacity));
                  }}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-extrabold text-eco-400">{formatWeight(qty)} Available</span>
                  </div>
                  <div className="font-bold text-sm text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400 font-medium">→ {item.plant}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payload Quantity Slider */}
        <div className="space-y-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-slate-300">Payload Weight</span>
            <span className="text-blue-400 font-extrabold text-base">{quantity} kg</span>
          </div>
          <input
            type="range"
            min="10"
            max={Math.min(currentAvailable || 10, truckCapacity)}
            step="10"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-bold">
            <span>Min: 10 kg</span>
            <span>Current Available: {currentAvailable} kg</span>
            <span>Max Fleet Limit: {truckCapacity} kg</span>
          </div>
        </div>

        {/* Cost & Dispatch Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
            <span>Transport Fuel Cost:</span>
            <span className="text-amber-300 font-extrabold text-sm">{formatCurrency(transportCost)}</span>
          </div>

          <button
            onClick={handleTransport}
            disabled={loading || currentAvailable <= 0}
            className="w-full sm:w-auto py-3.5 px-8 rounded-full font-bold text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Driving Truck... 🚛</span>
            ) : (
              <>
                <Truck className="w-5 h-5" />
                <span>DISPATCH SHIPMENT 🚛</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
